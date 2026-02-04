import { prisma } from '@/lib/prisma'
import { BlogCard } from '@/components/blog-page/BlogCard'
import { FeaturedBlogCard } from '@/components/blog-page/FeaturedBlogCard'
import { BlogSidebar } from '@/components/blog-page/BlogSidebar'
import { BlogPagination } from '@/components/blog-page/BlogPagination' 
import type { Metadata } from 'next'
import { BlogPost } from '@/types/blog' 
import { Prisma } from '@prisma/client'
import { unstable_cache } from 'next/cache' // <--- IMPORT THIS

export const metadata: Metadata = {
  title: 'Blogs',
  description: 'Latest news, tips, and insights about URL shortening and digital marketing.',
}

const PAGE_SIZE = 10;

// --- CACHED FUNCTION 1: Fetch Categories ---
const getCachedCategories = unstable_cache(
  async () => {
    const categoryData = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { categories: true }
    });
    return categoryData.flatMap(p => p.categories || []);
  },
  ['blog-categories-list'], // Cache Key
  { revalidate: 3600, tags: ['categories'] } // Revalidate every hour
);

// --- CACHED FUNCTION 2: Fetch Posts ---
// We pass all filter params here so the cache creates unique entries for each search/page combination
const getCachedPostsData = unstable_cache(
  async (searchTerm: string, categoryFilter: string, page: number, matchingCategories: string[]) => {
    
    // 1. Reconstruct Query Logic
    const whereClause: Prisma.BlogPostWhereInput = {
      isPublished: true,
      AND: [
        categoryFilter !== 'All' ? { categories: { has: categoryFilter } } : {},
        searchTerm ? {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { excerpt: { contains: searchTerm, mode: 'insensitive' } },
            matchingCategories.length > 0 ? { categories: { hasSome: matchingCategories } } : {}
          ]
        } : {}
      ]
    };

    // 2. Fetch Data
    const [rawPosts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where: whereClause,
        orderBy: { publishedAt: 'desc' },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        select: {
          id: true, title: true, slug: true, excerpt: true, 
          image: true, categories: true, publishedAt: true, 
          updatedAt: true, isPublished: true,
        }
      }),
      prisma.blogPost.count({ where: whereClause })
    ]);

    // 3. Transform Data INSIDE cache (Dates -> Strings)
    // This is crucial because cache only stores JSON
    const posts: BlogPost[] = rawPosts.map(post => ({
      ...post,
      content: "", 
      metaTitle: "", metaDescription: "", metaKeywords: "", focusKeyword: "",
      publishedAt: post.publishedAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return { posts, totalCount };
  },
  ['blog-posts-grid'], // Base Cache Key
  { revalidate:3600,tags: ['blog-posts'] } // Revalidate every hour
  
);

interface BlogPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string; 
  }>
}

export default async function BlogListPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const searchTerm = (params.search || '').trim();
  const categoryFilter = params.category || 'All';
  const currentPage = Number(params.page) || 1;

  // --- STEP 1: Get Categories (Cached) ---
  const allCategoriesRaw = await getCachedCategories();
  // FIX: Clean the data before creating the Set
  const cleanedCategories = allCategoriesRaw
    .map(cat => cat.trim())       // 1. Remove invisible spaces (" Tech " -> "Tech")
    .filter(cat => cat.length > 0); // 2. Remove empty strings if any

  // 3. Create the Set from the CLEANED list
  const uniqueCategories = ["All", ...Array.from(new Set(cleanedCategories))];

  // --- STEP 2: Smart Matching (Client-side logic, fast) ---
  let matchingCategories: string[] = [];
  if (searchTerm) {
    matchingCategories = uniqueCategories.filter(cat => 
      cat.toLowerCase().includes(searchTerm.toLowerCase()) && cat !== 'All'
    );
  }

  // --- STEP 3: Fetch Posts (Cached) ---
  const { posts, totalCount } = await getCachedPostsData(searchTerm, categoryFilter, currentPage, matchingCategories);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // --- Layout Logic ---
  const isFiltering = !!searchTerm || categoryFilter !== 'All';
  const showFeaturedLayout = !isFiltering && currentPage === 1;

  let featuredPost = null;
  let regularPosts = posts;

  if (showFeaturedLayout && posts.length > 0) {
     featuredPost = posts[0];
     regularPosts = posts.slice(1);
  }

  const getHeadingText = () => {
    if (searchTerm) return `Results for "${searchTerm}"`;
    if (categoryFilter && categoryFilter !== 'All') return `${categoryFilter}`;
    
    // UPDATE: Return JSX with the span applied to "Insights"
    return (
      <>
        Browse Our{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-700">
          Insights
        </span>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white pt-20 px-6">
      <div className="sm:mb-10 text-center max-w-2xl mx-auto">
         <span className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Read Our Blogs
          </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight mb-4">
          {getHeadingText()}
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-10 sm:pb-20 flex flex-col lg:flex-row gap-12">
        <BlogSidebar categories={uniqueCategories} />

        <div className="flex-1 space-y-10">
          {featuredPost && (
            <FeaturedBlogCard post={featuredPost} />
          )}

          {regularPosts.length > 0 ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularPosts.map((post,index) => (
                    <BlogCard key={post.id} post={post} priority={index < 2} />
                ))}
                </div>
                <BlogPagination currentPage={currentPage} totalPages={totalPages} />
            </>
          ) : (
            <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
              <h3 className="text-xl font-medium text-gray-600">No articles found.</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or category.</p>
              <button className="mt-4 text-blue-600 hover:underline text-sm font-medium">
                 <a href="/blog">Clear all filters</a>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}