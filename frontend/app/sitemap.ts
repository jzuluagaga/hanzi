import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://hanzi.app', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://hanzi.app/login', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: 'https://hanzi.app/register', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: 'https://hanzi.app/terminos', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: 'https://hanzi.app/privacidad', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ]
}
