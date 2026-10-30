/* THE SITE'S OWN MAIL, TRIED ON WILLIAM ALONE (27 Oct 2026, Round 158; his list row 112, his key set that morning,
   "Key set" at about 10:05am).

   POST /api/mailtest, with his waitlist page's key in the Authorization header (Bearer, the ADMIN_KEY secret),
   sends two emails through Resend, both to hello@arizonarabbits.com and to nobody else:
     1. an enquiry as it will reach him once the forms are the site's own: a made-up buyer, Sam, (520) 555-0134,
        a Text button and a Call button, the subject he will triage from his phone's notification;
     2. the thank-you a buyer will get, in words for his veto: it says only what the site says, never that a rabbit
        is reserved or that anything is owed.
   Nothing in the request can change who it goes to or what it says: the body is not read at all. About one test a
   minute: the WAITLIST store keeps the last time, best effort (KV is not atomic, so two presses at the same instant
   can both go; the recipient is fixed, so the worst case is extra test emails to him). Each send carries an
   Idempotency-Key made from the test's minute, so a double press inside the same minute is the same email at Resend;
   a press in a later minute is a NEW test, with new emails. If the store does not answer, nothing is sent. The
   answer says what Resend said for each email: accepted with its id, refused with its words, or, when no answer came
   back, unknown: it may already have been accepted, so the page says to look in the Inbox before pressing again.
   (Codex's QC of 27 Oct, 11am: the first draft called an unanswered send "not reached", and claimed 24 hours of
   duplicate protection that a new minute's keys do not give.)

   The Resend key is a Cloudflare secret, read here as env.RESEND_API_KEY (the name his list gave) or env.RESEND_KEY
   (the name WAITLIST-SYSTEM.md gave first). It is never printed, logged or returned. A secret reaches this code with
   the deployment after it was saved, so the answer says plainly when it isn't there yet.

   GET /api/mailtest (with the same key) answers whether the key and the store are there, never the key itself. */

const TO = 'hello@arizonarabbits.com';
const FROM = 'Arizona Rabbits <hello@arizonarabbits.com>';
const RESEND = 'https://api.resend.com/emails';
const SPACING_MS = 60 * 1000;
const TZ = 'America/Phoenix';

function json(o, status) {
  return new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

/* the same comparison as the waitlist's: every byte looked at, whatever the answer */
function sameSecret(a, b) {
  const x = new TextEncoder().encode(String(a || ''));
  const y = new TextEncoder().encode(String(b || ''));
  if (!x.length || x.length !== y.length) return false;
  let d = 0;
  for (let i = 0; i < x.length; i++) d |= x[i] ^ y[i];
  return d === 0;
}

function isAdmin(request, env) {
  if (!env.ADMIN_KEY) return false;
  const h = request.headers.get('Authorization') || '';
  return h.startsWith('Bearer ') && sameSecret(h.slice(7).trim(), env.ADMIN_KEY);
}

function resendKey(env) { return String(env.RESEND_API_KEY || env.RESEND_KEY || '').trim(); }

/* Tucson's clock, for the code and the words: AZR-TEST-YYMMDD-HHMM */
function tucson(now) {
  const parts = {};
  new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date(now)).forEach(p => { parts[p.type] = p.value; });
  const hh = ('0' + (+parts.hour % 24)).slice(-2);
  const h12 = (+parts.hour % 12) || 12, ap = +parts.hour < 12 ? 'am' : 'pm';
  return { code: 'AZR-TEST-' + parts.year + parts.month + parts.day + '-' + hh + parts.minute, said: h12 + ':' + parts.minute + ap };
}

/* the two emails; Sam and the number are made up (555 numbers are reserved for fiction) */
function enquiryMail(t) {
  const subject = '[Test] Sam, about Butterscotch, wants a text · ' + t.code;
  const btn = 'display:inline-block;padding:14px 22px;border-radius:999px;font:600 16px/1 -apple-system,Segoe UI,Roboto,sans-serif;text-decoration:none';
  const html = '<div style="font:16px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#241F1D;max-width:560px">' +
    '<p style="margin:0 0 14px;padding:10px 14px;background:#F3EDE3;border-radius:10px;font-size:14px">A test of the site\'s own mail, sent at ' + t.said + ' Tucson time from your waitlist page. Sam is made up; nobody wrote in.</p>' +
    '<h1 style="font-size:22px;margin:0 0 6px">Sam wants a text about Butterscotch</h1>' +
    '<p style="margin:0 0 16px;color:#57504A">The site says you usually reply the same day.</p>' +
    '<p style="margin:0 0 18px"><a href="sms:+15205550134" style="' + btn + ';background:#A0522D;color:#fff">Text Sam</a> &nbsp; ' +
    '<a href="tel:+15205550134" style="' + btn + ';background:#F3EDE3;color:#7C3E21">Call</a></p>' +
    '<table style="border-collapse:collapse;font-size:15px">' +
    '<tr><td style="padding:4px 14px 4px 0;color:#736A64">Name</td><td>Sam</td></tr>' +
    '<tr><td style="padding:4px 14px 4px 0;color:#736A64">Phone</td><td>(520) 555-0134</td></tr>' +
    '<tr><td style="padding:4px 14px 4px 0;color:#736A64">Asking about</td><td>Butterscotch</td></tr>' +
    '<tr><td style="padding:4px 14px 4px 0;color:#736A64">Their message</td><td>Is she still available?</td></tr>' +
    '</table>' +
    '<p style="margin:18px 0 0;font-size:14px;color:#736A64">Request ' + t.code + '</p></div>';
  const text = 'A test of the site\'s own mail, sent at ' + t.said + ' Tucson time from your waitlist page. Sam is made up; nobody wrote in.\n\n' +
    'Sam wants a text about Butterscotch. The site says you usually reply the same day.\n\n' +
    'Text Sam: sms:+15205550134\nCall: (520) 555-0134\n\nName: Sam\nPhone: (520) 555-0134\nAsking about: Butterscotch\nTheir message: Is she still available?\n\nRequest ' + t.code + '\n';
  return { subject, html, text };
}

function thanksMail(t) {
  const subject = '[Test] Thanks, Sam: I have your message about Butterscotch · ' + t.code;
  const html = '<div style="font:16px/1.55 -apple-system,Segoe UI,Roboto,sans-serif;color:#241F1D;max-width:560px">' +
    '<p style="margin:0 0 14px;padding:10px 14px;background:#F3EDE3;border-radius:10px;font-size:14px">A test: this is the thank-you a buyer would get, for your yes or your changes. Sam is made up.</p>' +
    '<p>Hi Sam,</p>' +
    '<p>Thanks for asking about Butterscotch. I have your message, and I\'ll text you at (520) 555-0134, usually the same day.</p>' +
    '<p>This doesn\'t reserve Butterscotch, and nothing is owed. When we talk, I\'ll tell you how reserving works.</p>' +
    '<p>Your request number is ' + t.code + '.</p>' +
    '<p style="margin-top:22px">William Pomeroy<br>Arizona Rabbits · Tucson<br><a href="tel:+15202702827" style="color:#7C3E21">(520) 270-2827</a><br><a href="mailto:hello@arizonarabbits.com" style="color:#7C3E21">hello@arizonarabbits.com</a><br><a href="https://arizonarabbits.com" style="color:#7C3E21">https://arizonarabbits.com</a></p></div>';
  const text = 'A test: this is the thank-you a buyer would get, for your yes or your changes. Sam is made up.\n\nHi Sam,\n\n' +
    'Thanks for asking about Butterscotch. I have your message, and I\'ll text you at (520) 555-0134, usually the same day.\n\n' +
    'This doesn\'t reserve Butterscotch, and nothing is owed. When we talk, I\'ll tell you how reserving works.\n\n' +
    'Your request number is ' + t.code + '.\n\nWilliam Pomeroy\nArizona Rabbits · Tucson\n(520) 270-2827\nhello@arizonarabbits.com\nhttps://arizonarabbits.com\n';
  return { subject, html, text };
}

async function send(key, mail, idem) {
  let r;
  try {
    r = await fetch(RESEND, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json', 'Idempotency-Key': idem },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: TO, subject: mail.subject, html: mail.html, text: mail.text })
    });
  } catch (e) {
    return { ok: false, unknown: true, status: 0, why: 'No answer from Resend: it may already have accepted this one' };
  }
  let d = null;
  try { d = await r.json(); } catch (e) { d = null; }
  if (r.ok && d && d.id) return { ok: true, status: r.status, id: String(d.id) };
  /* accepted needs Resend's id. A 2xx without a readable id is not a refusal: Resend took the request (Codex's
     review of 28 Oct 2026); so is a 5xx, or any answer with no words in it, so "refused" is only a 4xx, in Resend's
     words when it gave any. Unknown means: look in the Inbox before a new test. */
  if (r.ok) return { ok: false, unknown: true, status: r.status, why: 'Resend answered ' + r.status + ' but its answer could not be read: it may already have accepted this one' };
  const words = d && (d.message || d.error || d.name);
  if (r.status >= 400 && r.status < 500) return { ok: false, status: r.status, why: String(words || ('HTTP ' + r.status)).slice(0, 300) };
  return { ok: false, unknown: true, status: r.status, why: 'Resend answered ' + r.status + (words ? ' (' + String(words).slice(0, 200) + ')' : '') + ': it may already have accepted this one' };
}

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!isAdmin(request, env)) return json({ ok: false, why: env.ADMIN_KEY ? 'wrong key' : 'no admin key set' }, env.ADMIN_KEY ? 401 : 503);
  return json({ ok: true, key: !!resendKey(env), store: !!env.WAITLIST, to: TO });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!isAdmin(request, env)) return json({ ok: false, why: env.ADMIN_KEY ? 'wrong key' : 'no admin key set' }, env.ADMIN_KEY ? 401 : 503);
  const key = resendKey(env);
  if (!key) return json({ ok: false, why: 'No RESEND_API_KEY secret reaches this deployment yet. A secret saved in Cloudflare arrives with the next deployment.' }, 503);
  const now = Date.now();
  const kv = env.WAITLIST;
  if (kv) {
    let last = 0;
    try {
      last = +(await kv.get('mailtest:last')) || 0;
      if (last && now - last < SPACING_MS) return json({ ok: false, why: 'One test a minute. Try again in ' + Math.ceil((SPACING_MS - (now - last)) / 1000) + ' seconds.' }, 429);
      await kv.put('mailtest:last', String(now), { expirationTtl: 3600 });
    } catch (e) {
      return json({ ok: false, why: 'The site\'s store did not answer, so nothing was sent. Try again in a minute.' }, 503);
    }
  }
  const t = tucson(now);
  const a = await send(key, enquiryMail(t), t.code + '-enquiry');
  const b = await send(key, thanksMail(t), t.code + '-thanks');
  /* accepted: Resend took it (an id); refused: Resend said no (a 4xx), in its words; unknown: no answer came
     back, or one that cannot be read, or a 5xx: the email may have gone, so the page says to look first */
  const accepted = [], refused = [], unknown = [];
  [['the enquiry', a], ['the thank-you', b]].forEach(([what, r]) => {
    if (r.ok) accepted.push({ what, id: r.id }); else if (r.unknown) unknown.push({ what, why: r.why }); else refused.push({ what, status: r.status, why: r.why }); });
  const all = accepted.length === 2;
  return json({ ok: all, code: t.code, to: TO, at: t.said, accepted, refused, unknown }, all ? 200 : 502);
}

export async function onRequest(context) {
  const m = context.request.method;
  if (m === 'GET') return onRequestGet(context);
  if (m === 'POST') return onRequestPost(context);
  return json({ ok: false, why: 'GET or POST' }, 405);
}
