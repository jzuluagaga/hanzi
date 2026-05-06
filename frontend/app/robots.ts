import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/register', '/forgot-password', '/terminos', '/privacidad'],
        disallow: ['/app/', '/admin/'],
      },
    ],
    sitemap: 'https://hanzi.app/sitemap.xml',
  }
}
