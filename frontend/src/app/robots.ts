import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/dashboard',
      ],
      disallow: [
        '/auth/signin',
        '/auth/register',
        '/auth/registerpro',
      ],
    },
    sitemap: 'https://acme.com/sitemap.xml',
    crawlDelay: 10,
  }
}
