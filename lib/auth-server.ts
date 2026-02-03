import { cookies } from 'next/headers'
import jwt, { JwtPayload } from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-this'

export interface UserPayload extends JwtPayload {
  userId: string
  role: 'ADMIN' | 'EMPLOYEE'
  username: string
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) return null

  try {
    // Verify token and return payload
    const decoded = jwt.verify(token, SECRET_KEY) as UserPayload
    return decoded
  } catch (err) {
    return null
  }
}