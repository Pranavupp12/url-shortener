import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MinifyLinks - Free URL Shortener',
    short_name: 'MinifyLinks',
    description: 'Simplify your links, amplify your reach. A powerful, free tool to shrink long links.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/logos/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logos/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logos/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}