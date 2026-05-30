// Rate limiting store (in-memory - resets on function cold start)
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 30; // max 30 AI requests per minute per IP
  
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  
  if(now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }
  
  record.count++;
  rateLimitMap.set(ip, record);
  
  return record.count > maxRequests;
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic origin check - only allow from our domain
  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';
  const allowedDomains = ['adapt-app', 'adapt-wine', 'localhost', 'vercel.app'];
  const isAllowed = allowedDomains.some(d => origin.includes(d) || referer.includes(d));
  
  if(!isAllowed && origin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if(isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests — please slow down' });
  }

  // API key check
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Anthropic API error:', err);
    res.status(500).json({ error: 'Failed to reach AI service' });
  }
}
