import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://skyboundmartialarts.online';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/student/', '/instructor/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
