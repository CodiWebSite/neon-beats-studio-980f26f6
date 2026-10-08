import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { id } = await req.json().catch(() => ({}))
    if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) return json({ error: 'invalid id' }, 400)

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: r, error } = await admin.from('contact_requests').select('*').eq('id', id).maybeSingle()
    if (error || !r) return json({ error: 'not found' }, 404)
    // Only notify for fresh submissions (prevents replaying old ids)
    if (Date.now() - new Date(r.created_at).getTime() > 10 * 60 * 1000) return json({ error: 'expired' }, 400)

    const s = (v: unknown) => (v == null || v === '' ? undefined : String(v).slice(0, 2000))
    const result = await sendTemplateEmail('booking-request-manager', 'manager@djfunkyevents.ro', {
      templateData: {
        name: s(r.name), email: s(r.email), phone: s(r.phone), eventType: s(r.event_type),
        eventDate: s(r.event_date), location: s(r.location), guests: s(r.guests),
        budget: s(r.budget), company: s(r.company), message: s(r.message),
      },
      idempotencyKey: `booking-request-manager-${id}`,
    })
    return json({ ok: true, result })
  } catch (e) {
    console.error('notify-booking-request failed', (e as Error).message)
    return json({ error: 'send failed' }, 500)
  }
})
