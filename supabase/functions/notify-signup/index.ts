import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  try {
    const payload = await req.json()
    const record = payload.record
    const email = record?.email || 'unknown'
    const createdAt = new Date(record?.created_at || Date.now()).toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      return new Response('Missing RESEND_API_KEY', { status: 500 })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'benrubenstein@me.com',
        subject: `New signup: ${email}`,
        html: `
          <p>A new user just signed up for <strong>News Builder</strong>.</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Time:</strong> ${createdAt} ET</p>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: res.ok ? 200 : 500,
    })
  } catch (err) {
    return new Response(String(err), { status: 500 })
  }
})
