// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-this'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    // 1. Find the user
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // 2. Check Password
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // 3. Generate JWT Token (The "VIP Pass")
    const token = jwt.sign(
      { userId: user.id, role: user.role, username: user.username },
      SECRET_KEY,
      { expiresIn: '1d' } // Expires in 1 day
    )

    // 4. Set the Cookie
    const response = NextResponse.json({ success: true })
    
    response.cookies.set('admin_token', token, {
      httpOnly: true, // JavaScript cannot read this (Security)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })

    return response

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}