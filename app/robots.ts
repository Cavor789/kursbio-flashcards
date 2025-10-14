export default function robots() {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kursbio.ru';
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE}/cards/sitemap.xml`,
  };
}
