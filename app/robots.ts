import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/commande-confirmee', '/api/'],
      },
    ],
    sitemap: 'https://traiteur-compere.be/sitemap.xml',
  };
}
