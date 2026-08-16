// Weekly parent email report
// Uses Resend API for email delivery
// Set RESEND_API_KEY in Vercel environment variables

export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({error:"Method not allowed"});

  const {parentEmail, parentName, children} = req.body;
  if(!parentEmail || !children?.length) return res.status(400).json({error:"Missing data"});

  const apiKey = process.env.RESEND_API_KEY;
  if(!apiKey) return res.status(500).json({error:"Email service not configured"});

  // Build report HTML
  const weekAgo = new Date(Date.now() - 7*24*60*60*1000);
  
  const childReports = children.map(child => {
    const weekSessions = (child.sessionHistory||[]).filter(s => new Date(s.date) > weekAgo);
    const weekXP = weekSessions.reduce((sum,s) => sum + (s.xp||0), 0);
    const weekQs = weekSessions.reduce((sum,s) => sum + (s.total||0), 0);
    const weekCorrect = weekSessions.reduce((sum,s) => sum + (s.correct||0), 0);
    const acc = weekQs > 0 ? Math.round((weekCorrect/weekQs)*100) : 0;
    
    return `
      <div style="background:#F8FAFC;border-radius:16px;padding:20px;margin-bottom:16px;border:1px solid #E2E8F0">
        <h3 style="margin:0 0 12px;color:#0F172A;font-size:18px">${child.avatar?"":""}  ${child.name}</h3>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:6px 0;color:#64748B;font-size:14px">📚 Sessions this week</td>
            <td style="padding:6px 0;font-weight:700;text-align:right;color:#0F172A">${weekSessions.length}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748B;font-size:14px">❓ Questions answered</td>
            <td style="padding:6px 0;font-weight:700;text-align:right;color:#0F172A">${weekQs}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748B;font-size:14px">⭐ XP earned</td>
            <td style="padding:6px 0;font-weight:700;text-align:right;color:#4338CA">+${weekXP}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748B;font-size:14px">🔥 Day streak</td>
            <td style="padding:6px 0;font-weight:700;text-align:right;color:#D97706">${child.streak||0} days</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748B;font-size:14px">🏅 Total badges</td>
            <td style="padding:6px 0;font-weight:700;text-align:right;color:#0F172A">${(child.badges||[]).length}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748B;font-size:14px">🎯 Tricky questions conquered</td>
            <td style="padding:6px 0;font-weight:700;text-align:right;color:#BE185D">${child.trickyFixedCount||0}</td>
          </tr>
        </table>
        ${(child.trickyQs||[]).length > 0 ? `<p style="color:#64748B;font-size:13px;margin-top:8px">💡 ADAPT is automatically working on ${(child.trickyQs||[]).length} question${(child.trickyQs||[]).length===1?'':'s'} ${child.name} found tricky — they'll be practised until mastered.</p>` : ''}
        ${weekSessions.length === 0 ? '<p style="color:#EF4444;font-size:13px;margin-top:8px">⚠️ No sessions this week — try to encourage daily learning!</p>' : ''}
      </div>
    `;
  }).join('');

  const totalWeekXP = children.reduce((sum, c) => {
    const ws = (c.sessionHistory||[]).filter(s => new Date(s.date) > weekAgo);
    return sum + ws.reduce((s2,s) => s2+(s.xp||0), 0);
  }, 0);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>ADAPT Weekly Report</title></head>
    <body style="font-family:'Nunito',Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#F5F3FF">
      <div style="background:linear-gradient(135deg,#4338CA,#7C3AED);border-radius:20px;padding:28px 24px;margin-bottom:20px;text-align:center">
        <h1 style="color:#fff;margin:0 0 8px;font-size:26px">📚 ADAPT Weekly Report</h1>
        <p style="color:rgba(255,255,255,0.8);margin:0;font-size:14px">Week ending ${new Date().toLocaleDateString('en-GB')}</p>
      </div>
      <div style="background:#fff;border-radius:20px;padding:20px;margin-bottom:16px">
        <p style="color:#0F172A;font-size:15px;margin:0 0 4px">Hi ${parentName||"there"}! 👋</p>
        <p style="color:#64748B;font-size:14px;margin:0">Here's how your ${children.length === 1 ? "child" : "children"} got on this week. Total family XP earned: <strong style="color:#4338CA">+${totalWeekXP} XP</strong></p>
      </div>
      ${childReports}
      <div style="text-align:center;padding:20px">
        <a href="https://adapth.vercel.app" style="background:linear-gradient(135deg,#4338CA,#7C3AED);color:#fff;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px">View Full Dashboard →</a>
      </div>
      <p style="text-align:center;color:#94A3B8;font-size:11px">ADAPT Learning · You're receiving this because you enabled weekly reports.</p>
    </body>
    </html>
  `;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {"Authorization":`Bearer ${apiKey}`,"Content-Type":"application/json"},
      body: JSON.stringify({
        from: "ADAPT Learning <reports@adapth.vercel.app>",
        to: [parentEmail],
        subject: `📚 Weekly Learning Report — ${new Date().toLocaleDateString('en-GB')}`,
        html
      })
    });
    const data = await r.json();
    if(r.ok) return res.json({success:true, id:data.id});
    return res.status(500).json({error:data.message||"Email failed"});
  } catch(e) {
    return res.status(500).json({error:e.message});
  }
}
