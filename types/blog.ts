export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: string | null;
  categories: string[];
  
  // SEO fields included for completeness, though not always displayed
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  focusKeyword: string;

  publishedAt: string; // serialized date from JSON
  updatedAt: string;   // serialized date from JSON
  isPublished: boolean;
}