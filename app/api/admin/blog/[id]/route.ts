import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-this'

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

// 1. UPDATE POST
// Notice the type change: params is Promise<{ id: string }>
export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } 
) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // --- THE FIX: AWAIT PARAMS HERE ---
    const { id } = await params
    // ----------------------------------

    const body = await req.json()
    const updatedPost = await prisma.blogPost.update({
      where: { id }, // Use the awaited id
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        image: body.image,
        categories: body.categories, // Ensure categories are included
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        metaKeywords: body.metaKeywords,
        focusKeyword: body.focusKeyword,
        isPublished: body.isPublished,
      }
    })
    return NextResponse.json(updatedPost)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

// 2. DELETE POST
export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // --- THE FIX: AWAIT PARAMS HERE TOO ---
    const { id } = await params
    // --------------------------------------

    await prisma.blogPost.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}