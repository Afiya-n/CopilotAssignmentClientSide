"use client";

import React, { useState, useEffect, useMemo } from "react";
import styles from "./page.module.css";
import { ArticlesProps } from "./home";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticlesProps[]>([]);
  const [filters, setFilters] = useState({
    category: "",
    tag: "",
    author: "",
    articleType: "",
  });
  const [pulling, setPulling] = useState(false);
  const [startY, setStartY] = useState(0);
  const [allArticles, setAllArticles] = useState<ArticlesProps[]>([]);

  useEffect(() => {
  const loadAllArticles = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/articles");
      const data = await response.json();
      if (data.status === 1) {
        setAllArticles(data.data.articles);
        setArticles(data.data.articles); // Initialize articles as well
      }
    } catch (err) {
      console.error("Error loading full articles:", err);
    }
  };

  loadAllArticles();
}, []);

  const fetchArticles = async () => {
    const queryParams = new URLSearchParams();
    if (filters.author) queryParams.append("author", filters.author);
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.articleType)
      queryParams.append("articleType", filters.articleType);
    if (filters.tag) queryParams.append("tag", filters.tag);

    try {
      const url = queryParams.toString()
        ? `http://localhost:3000/api/articles?${queryParams.toString()}`
        : `http://localhost:3000/api/articles`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 1) {
        console.error("Error fetching articles");
      } else {
        // setArticles(data.data.articles);
        const sorted = data.data.articles.sort(
          (a: any, b: any) =>
            new Date(b.published).getTime() - new Date(a.published).getTime()
        );
        setArticles(sorted);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [filters]); // Refetch articles whenever filters change

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: "",
      tag: "",
      author: "",
      articleType: "",
    });
  };

  const handleCardClick = (articleId: string) => {
    router.push(`/details/${articleId}`);
  };

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    console.log("Is mobile:", isMobile);
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
        console.log("Touch start at:", e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      console.log("Touch move - currentY:", currentY, "startY:", startY);
      if (currentY - startY > 70 && window.scrollY === 0) {
        setPulling(true);
      }
    };

    const handleTouchEnd = () => {
      console.log("Touch end. Pulling:", pulling);
      if (pulling) {
        console.log("Refreshing...");
        handleResetFilters();
        setPulling(false);
        console.log("Refreshedddd");
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pulling, startY]);

  const { categoryOptions, articleTypeOptions, authorOptions } = useMemo(() => {
    const categories = new Set<string>();
    const articleTypes = new Set<string>();
    const authors = new Set<string>();

    allArticles.forEach((article) => {
      categories.add(article.categoryName);
      articleTypes.add(article.articleType);
      authors.add(article.author.authorName);
    });

    return {
      categoryOptions: Array.from(categories),
      articleTypeOptions: Array.from(articleTypes),
      authorOptions: Array.from(authors),
    };
  }, [allArticles]);

  const tagOptions = useMemo(() => {
    const allTags = allArticles.flatMap((article) => article.tags || []);
    return Array.from(new Set(allTags));
  }, [allArticles]);

  return (
    <div className={styles.page}>
      {/* Header with filters */}
      <header className={styles.header}>
        <div className={styles.dropdown}>
          <label>Author:</label>
          <select
            value={filters.author}
            onChange={(e) => handleFilterChange("author", e.target.value)}
          >
            <option value="">All</option>
            {authorOptions.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.dropdown}>
          <label>Category:</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="">All</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.dropdown}>
          <label>Article type:</label>

          <select
            value={filters.articleType}
            onChange={(e) => handleFilterChange("articleType", e.target.value)}
          >
            <option value="">All</option>
            {articleTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.dropdown}>
          <label>Tag:</label>

          <select
            value={filters.tag}
            onChange={(e) => handleFilterChange("tag", e.target.value)}
          >
            <option value="">All</option>
            {tagOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <button className={styles.refreshButton} onClick={handleResetFilters}>
          Refresh
        </button>
      </header>

      {/* Articles list */}
      <main className={styles.articles}>
        {articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          articles.map((article) => (
            <div
              key={article.articleId}
              className={styles.articleCard}
              onClick={() => handleCardClick(article.articleId)}
            >
              <Image
                src={article.hero}
                alt={article.title}
                className={styles.articleImage}
                width={100}
                height={100}
              />
              <div className={styles.articleContent}>
                <h2>{article.title}</h2>
                <p>{article.Subtitle}</p>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
