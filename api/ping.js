export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    // Simple ping to keep Supabase awake
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles?limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    res.status(200).json({ ok: true, status: response.status, time: new Date().toISOString() });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
