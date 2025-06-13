"use client";

import { ArticlesProps } from "@/app/home/home";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./details.module.css";
import { extractYouTubeId } from "../../helper/helper";
import noProfile from "../../assets/no_profile.png";

export default function ArticleDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [article, setArticle] = useState<ArticlesProps>();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticlesProps[]>([]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params; // Unwrap the params Promise
      setId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/articles?articleId=${id}`
        );
        const data = await response.json();

        if (data.status === 1) {
          const foundArticle = data.data.articles.find(
            (a: any) => a.articleId === id
          );
          setArticle(foundArticle);
          console.log("found articl");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };
    fetchArticle();
  }, [id]);

  // if (!article) {
  //   return <p>Loading...</p>;
  // }

  const fetchRelatedArticles = async (tag: string) => {
    try {
      console.log("1)");
      const response = await fetch("http://localhost:3000/api/articles");
      const data = await response.json();
      if (data.status === 1) {
        const filtered = data.data.articles.filter(
          (a: ArticlesProps) => a.articleId !== id && a.tags.includes(tag)
        );

        setRelatedArticles(filtered);

      }
    } catch (error) {
      console.error("Error fetching related articles:", error);
    }
  };
  useEffect(() => {
    if (article && article.tags.length > 0) {
      fetchRelatedArticles(article.tags[0]);
    }
  }, [article]);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  useEffect(() => {
    if (isMobile) {
      console.log("Mobile view detected (isMobile = true)");
    }
  }, [isMobile]);

  const isYouTube = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const isMp4 = (url: string) => url.endsWith(".mp4");

  return (
    article && (
      <div className={isLoaded ? styles.fadeIn : ""}>
        <div className={styles.articleDetailsContainer}>
           <button
            className={styles.backButton}
            onClick={() => router.back()}
          >
            ← Back
          </button>
          <h1>{article.title}</h1>
          <div className={styles.articleImageBox}>
            <Image
              src={article.hero}
              alt={article.title}
              className={styles.articleImage}
              width={200}
              height={200}
            />
          </div>

          <div
            className={styles.aythorBox}
          >
            <p className={styles.AuthorText}>
              Author: {article.author?.authorName}
            </p>

            (
              <div className={styles.authorHoverBox}>
                <Image
                  src={
                    article.author?.authorImage?.trim()
                      ? article.author.authorImage
                      : noProfile
                  }
                  alt={article.author?.authorName || "Author"}
                  width={100}
                  height={100}
                  style={{ borderRadius: "50%" }}
                />
                <p>
                  {article.author?.authorDescription ||
                    "No description available."}
                </p>
              </div>
            )
          </div>

          <p>{article.Subtitle}</p>

          {article.articleType === "Text" ? (
            isMobile ? (
              <iframe
                className={styles.webViewFrame}
                srcDoc={article.description}
                style={{ width: "100%", height: "300px", border: "none" }}
                title="Mobile WebView"
              />
            ) : (
              <div
                className={styles.descriptionFormatter}
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            )
          ) : article.articleType === "Video" ? (
            isYouTube(article.description) ? (
              <div className={styles.videoWrapper}>
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(
                    article.description
                  )}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : isMp4(article.description) ? (
              <video controls width="100%">
                <source src={article.description} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>Unsupported video format.</p>
            )
          ) : (
            <p>Unsupported article type or format.</p>
          )}

          <p className={styles.tags}>
            <strong>Tags: </strong>
            {article.tags.map((tag, index) => (
              <span
                key={index}
                onClick={() => {
                  setSelectedTag(tag);
                  fetchRelatedArticles(tag);
                }}
              >
                {tag}
              </span>
            ))}
          </p>

          {/* Related articles list */}
          {selectedTag && (
            <div className={styles.relatedArticles}>
              <h3>Related articles with tag: {selectedTag}</h3>
              <ul>
                {relatedArticles.map((ra) => (
                  <li key={ra.articleId}>{ra.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  );
}
