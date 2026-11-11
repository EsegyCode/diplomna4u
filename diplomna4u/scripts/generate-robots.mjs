import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const siteUrl = (process.env.PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '') || 'http://localhost:4321';
const content = `User-agent: *
Allow: /
Disallow: /api/

# AI search and assistant crawlers: ALLOWED. Switch off training-only bots below with one edit.
# Training-only bots (can be disabled by the owner with one edit):
User-agent: GPTBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: Bytespider
Allow: /

User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: Applebot
Allow: /
User-agent: Amazonbot
Allow: /
User-agent: meta-externalagent
Allow: /
User-agent: Bingbot
Allow: /
User-agent: Googlebot
Allow: /

Sitemap: ${siteUrl}/sitemap-index.xml
`;
fs.writeFileSync(path.join(root, 'public', 'robots.txt'), content);
console.log('generated robots.txt');