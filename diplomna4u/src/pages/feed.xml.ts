import { getCollection } from 'astro:content';
import { site } from '@/data/site';

export async function GET() {
  const posts = (await getCollection('blog')).filter((p: any) => !p.data.draft).sort((a: any, b: any) => +new Date(b.data.date) - +new Date(a.data.date));
  const items = posts.map((p: any) => `    <item>
      <title>${escape(p.data.title)}</title>
      <link>${site.domain}/blog/${p.id}/</link>
      <guid>${site.domain}/blog/${p.id}/</guid>
      <description>${escape(p.data.description)}</description>
      <pubDate>${new Date(p.data.date).toUTCString()}</pubDate>
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(site.brandUk)}</title>
    <link>${site.domain}</link>
    <description>${escape(site.description || site.tagline)}</description>
    <language>uk</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}

function escape(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
