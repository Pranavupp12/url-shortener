import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'Blog Post Image'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
 
export default async function Image({ params }: { params: { slug: string } }) {
  // You can even fetch the post title here using prisma if you want
  // or just format the slug for now to keep it fast
  const title = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: '#2563eb', // Brand Blue
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 30, marginBottom: 20, opacity: 0.8 }}>MinifyLinks Blog</div>
        <div style={{ fontWeight: 'bold' }}>{title}</div>
      </div>
    ),
    { ...size }
  )
}