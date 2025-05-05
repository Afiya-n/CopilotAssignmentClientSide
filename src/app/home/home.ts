export interface ArticlesProps {
  title: string;
  Subtitle: string;
  hero: string;
  articleId: string;
  categoryId: string;
  categoryName: string;
  authorId: string;
  articleType: string;
  tags: string[];
  published: string;
  author: {
    authorId: string;
    authorImage: string;
    authorName: string;
    authorDescription: string;
  };
  description: string;
}

