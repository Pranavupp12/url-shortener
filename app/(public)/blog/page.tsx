import { prisma } from '@/lib/prisma'
import { BlogCard } from '@/components/blog-page/BlogCard'
import { FeaturedBlogCard } from '@/components/blog-page/FeaturedBlogCard'
import { BlogSidebar } from '@/components/blog-page/BlogSidebar'
import { BlogPagination } from '@/components/blog-page/BlogPagination' // Import new component
import type { Metadata } from 'next'
import { BlogPost } from '@/types/blog' 
import { Prisma } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Blogs',
  description: 'Latest news, tips, and insights about URL shortening and digital marketing.',
}

export const revalidate = 3600; 
const PAGE_SIZE = 10;

interface BlogPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string; // Add page param
  }>
}

export default async function BlogListPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const searchTerm = (params.search || '').trim();
  const categoryFilter = params.category || 'All';
  
  // Parse Page Number (Default to 1)
  const currentPage = Number(params.page) || 1;

  // --- STEP 1: Categories (for Sidebar) ---
  const categoryData = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { categories: true }
  });
  const allCategoriesRaw = categoryData.flatMap(p => p.categories || []);
  const uniqueCategories = ["All", ...Array.from(new Set(allCategoriesRaw))];

  // --- STEP 2: Smart Matching ---
  let matchingCategories: string[] = [];
  if (searchTerm) {
    matchingCategories = uniqueCategories.filter(cat => 
      cat.toLowerCase().includes(searchTerm.toLowerCase()) && cat !== 'All'
    );
  }

  // --- STEP 3: Build Query ---
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

  // --- STEP 4: Fetch Data & Count (Parallel) ---
  const [rawPosts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where: whereClause,
      orderBy: { publishedAt: 'desc' },
      take: PAGE_SIZE,                     // Limit: 10
      skip: (currentPage - 1) * PAGE_SIZE, // Offset: (Page-1) * 10
      select: {
        id: true, title: true, slug: true, excerpt: true, 
        image: true, categories: true, publishedAt: true, 
        updatedAt: true, isPublished: true,
      }
    }),
    prisma.blogPost.count({ where: whereClause }) // Get total matching posts
  ]);

  // Transform Data
  const posts: BlogPost[] = rawPosts.map(post => ({
    ...post,
    content: "", 
    metaTitle: "", metaDescription: "", metaKeywords: "", focusKeyword: "",
    publishedAt: post.publishedAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // --- Layout Logic ---
  // Only show "Featured" layout if we are on Page 1 AND not searching
  // If user goes to Page 2, we just show a grid of 10.
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
  return 'Browse Our Insights';
  };

  return (
    <div className="min-h-screen bg-white pt-20 px-6 ">
      
      <div className="sm:mb-10 text-center max-w-2xl mx-auto">
         <span className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Read Our Blogs
          </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-4">
          {getHeadingText()}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-10 sm:pb-20 flex flex-col lg:flex-row gap-12">
        <BlogSidebar categories={uniqueCategories} />

        <div className="flex-1 space-y-10">
          
          {/* Featured Post (Only Page 1) */}
          {featuredPost && (
            <FeaturedBlogCard post={featuredPost} />
          )}

          {/* Grid Area */}
          {regularPosts.length > 0 ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularPosts.map((post,index) => (
                    <BlogCard key={post.id} post={post} priority={index < 2} />
                ))}
                </div>
                
                {/* --- Pagination Controls --- */}
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