import { NextResponse } from "next/server";
import { articlesData } from "./articlesData";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Extract query parameters
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const author = searchParams.get("author");
  const articleType = searchParams.get("articleType");

  
  const filteredArticles = articlesData.data.articles.filter((article) => {
    return (
      (!category || article.categoryName === category) &&
      (!tag || article.tags.includes(tag)) &&
      (!author || article.author.authorName === author) &&
      (!articleType || article.articleType === articleType)
    );
  });

 
  return NextResponse.json({
    status: 1,
    message: "success",
    data: { articles: filteredArticles },
  });
}