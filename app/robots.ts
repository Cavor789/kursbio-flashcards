export default function robots() {
  const host = 'https://kursbio-flashcards.vercel.app';
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${host}/sitemap.xml` };
}
