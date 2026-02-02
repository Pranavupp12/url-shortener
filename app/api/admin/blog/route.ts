import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-this'

// Middleware helper to verify admin access
const isAuthenticated = (req: NextRequest) => {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  try {
    jwt.verify(token, SECRET_KEY)
    return true
  } catch {
    return false
  }
}

// 1. GET ALL POSTS (For Admin Dashboard List)
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Pagination Parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    // 2. Fetch Data and Total Count in Parallel
    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count()
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

// 2. CREATE NEW POST
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    
    // Basic validation
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json({ error: 'Missing required fields (Title, Slug, Content)' }, { status: 400 })
    }

    // Create the post in MongoDB
    const newPost = await prisma.blogPost.create({
      data: {
        title: body.title,
        // Ensure slug is URL-safe (lowercase, dashes only)
        slug: body.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-'),
        content: body.content,
        excerpt: body.excerpt || '',
        
        // Save Banner Image
        image: body.image || '', 

        categories: body.categories || [],

        // SEO Fields
        metaTitle: body.metaTitle || body.title,
        metaDescription: body.metaDescription || '',
        metaKeywords: body.metaKeywords || '',
        focusKeyword: body.focusKeyword || '',
        
        isPublished: body.isPublished || false,
        
        // Note: publishedAt defaults to now() automatically via Schema, 
        // but you can override it here if needed.
      }
    })

    return NextResponse.json(newPost)

  } catch (error: any) {
    // Handle Duplicate Slug Error (Prisma code P2002)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this URL slug already exists. Please change the slug.' }, 
        { status: 409 }
      )
    }
    
    console.error("Blog Create Error:", error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}