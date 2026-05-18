export default async function handler(req, res) {
  const { url } = req.query;
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
    // Extract title + link pairs from each <item>
    const items = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let itemMatch;
    while ((itemMatch = itemRe.exec(xml)) !== null) {
      const block = itemMatch[1];
      const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/);
      const linkMatch = block.match(/<link[^>]*>([\s\S]*?)<\/link>/) ||
                        block.match(/<link\s+href="([^"]+)"/);
      const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').trim() : '';
      const link = linkMatch ? linkMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').trim() : '';
      if (title) items.push({ title, link });
    }
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
