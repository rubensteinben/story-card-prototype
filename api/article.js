export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }
    });
    const html = await response.text();
    const get = (prop) =>
      html.match(new RegExp(`<meta[^>]+property="${prop}"[^>]+content="([^"]+)"`))?.[1] ||
      html.match(new RegExp(`<meta[^>]+content="([^"]+)"[^>]+property="${prop}"`))?.[1] ||
      null;
    res.json({
      title: get('og:title'),
      description: get('og:description'),
      image: get('og:image'),
    });
  } catch (e) {
    res.status(500).json({ error: e.message, cause: e.cause?.message ?? String(e.cause ?? '') });
  }
}
