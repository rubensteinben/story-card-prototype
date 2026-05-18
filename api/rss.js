export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }
    });
    if (!response.ok) throw new Error('Upstream fetch failed: ' + response.status);
    const xml = await response.text();
    const titles = [];
    const re = /<item[\s\S]*?<title[^>]*>([\s\S]*?)<\/title>/g;
    let m;
    while ((m = re.exec(xml)) !== null) {
      const raw = m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').trim();
      if (raw) titles.push(raw);
    }
    res.json({ titles });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
