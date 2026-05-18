function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'");
}

export default async function handler(req, res) {
  const { url, domain } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow',
    });
    if (!response.ok) throw new Error('Upstream fetch failed: ' + response.status);
    const xml = await response.text();
    const items = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let itemMatch;
    while ((itemMatch = itemRe.exec(xml)) !== null) {
      const block = itemMatch[1];
      const extract = (tag) => {
        const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
        return m ? decodeEntities(m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').trim()) : '';
      };
      const title = extract('title');
      const link = extract('link') || (block.match(/<link\s+href="([^"]+)"/) || [])[1] || '';
      const itemDomain = extract('News:Domain') || extract('domain') || '';
      // Filter by domain if requested
      if (domain && itemDomain && !itemDomain.toLowerCase().includes(domain.toLowerCase())) continue;
      if (title) items.push({ title, link, domain: itemDomain });
    }
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
