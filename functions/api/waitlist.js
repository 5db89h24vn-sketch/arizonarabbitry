/* THE WAITLIST COUNTER (7 Sept 2026). William: "have an option to be alerted
   for an individual litter that's coming up, just in case somebody doesn't
   want to be alerted for every litter and they just want to be alerted for
   one. And then, for everyone that signs up, I want you to document how many
   people are pending that litter, so it shows other people live interest, as
   well as myself."

   The site is static files on Cloudflare Pages. This file is the one piece
   that is not: a Pages Function, run by Cloudflare at /api/waitlist, keeping
   its records in a Workers KV namespace bound to it as WAITLIST (the binding
   is made once in the Cloudflare dashboard; without it every answer here says
   so and the pages show no number). Nothing here sends email. The browser
   posts every signup to Formspree first, exactly as it always has, so
   William's inbox and his Outlook rules see each one; only when Formspree has
   accepted it does the browser tell this API, which records it and counts it.
   If this API is down, or not switched on yet, a signup still reaches the
   inbox and the page simply shows no number.

   WHAT THE PAGES ASK FOR
     GET  /api/waitlist?litter=L2026-08-27   -> {"litter":"L2026-08-27","count":4}
     POST /api/waitlist  {"email":"...","want":"all"|"L2026-08-27"}
                                            -> {"ok":true,"fresh":true,"count":5}
          with "dry":true it checks the address and answers without writing
          (the live check uses that, so a check never becomes a signup)
   WHAT WILLIAM'S PAGE ASKS FOR, with "Authorization: Bearer <ADMIN_KEY>",
   the key being a secret he set in the dashboard and nobody else has seen
     GET  /api/waitlist?list=1               -> every list with its addresses
     POST /api/waitlist {"import":["a@b.c", ...]}   adds addresses to the
          every-litter list (the people who signed up before this counter
          existed live in Formspree; he pastes them in once)

   WHAT IS STORED, one small record per person per list:
     all:<hash>            asked to hear about every litter
     l:<litter id>:<hash>  asked to hear about one litter only (a born litter's
                           article id, or P<key> for a litter he is planning)
     n:<litter id>, n:all  the number currently shown, with when it was counted
   The hash is SHA-256 of the lowercased address, so a person is counted once
   however many times they sign up, and the key names carry no address. The
   address sits in the value and in the key's metadata, which is what the
   admin list reads back so he can email the people on it.

   THE NUMBER on the page for a litter is everybody who will hear about it:
   the people who asked for that litter alone, plus everybody on the
   every-litter list, each person once. That is the true count of people
   waiting on it. Counting means listing keys, and the free plan allows a
   thousand list requests a day against a hundred thousand reads, so the
   number is cached (n:<litter id>) and recounted from the keys at most once
   per COUNT_TTL; a signup bumps the cached number at once, so the person who
   just joined sees themselves counted. A page view costs one read.

   WHY THE NUMBER IS SHOWN THE WAY IT IS (the page's side, index.html and
   litters.html): shown from one person up, never as a zero. A visible count
   of others changes what people choose (Salganik, Dodds and Watts 2006, the
   music-market experiment in Science), and the local, specific norm is the
   strongest form of it (Goldstein, Cialdini and Griskevicius 2008, the hotel
   towel study), which is why the number is per litter rather than a total.
   A count of nobody is negative proof and pushes the other way (Cialdini's
   Petrified Forest signs, 2006), so at zero the page says nothing. And it is
   always the real number: the UK competition authority made the booking
   sites rewrite their "X people are looking at this" lines in 2019 because
   they were not, and this site's rule is a fact or nothing. */

const COUNT_TTL = 15 * 60 * 1000;
/* a list's name: a born litter by its article id (L2026-08-27), or a litter
   William is planning by its key in PLANNED, rabbits.js (Pholland-lop) */
const LITTER_ID = /^(L\d{4}-\d{2}-\d{2}|P[a-z0-9-]{1,40})$/;
const MAX_EMAIL = 254;
const MAX_IMPORT = 500;

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

/* one address, one shape: trimmed, lowercased, and shaped like an address.
   Loose about what follows the @, strict about there being exactly one @
   with something either side and a dot after it, which a real address always
   has and a keyboard slip usually lacks. */
function cleanEmail(raw) {
  const e = String(raw || '').trim().toLowerCase();
  if (!e || e.length > MAX_EMAIL) return '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return '';
  return e;
}

async function hashOf(email) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function keyFor(want, hash) {
  return want === 'all' ? 'all:' + hash : 'l:' + want + ':' + hash;
}

function hashPart(name) {
  return name.slice(name.lastIndexOf(':') + 1);
}

/* every key under a prefix, following the cursor; the metadata carries the
   address, so a list is the whole record without a read per key */
async function listAll(kv, prefix) {
  const out = [];
  let cursor;
  for (let guard = 0; guard < 50; guard++) {
    const page = await kv.list({ prefix, cursor, limit: 1000 });
    for (const k of page.keys) out.push(k);
    if (page.list_complete || !page.cursor) break;
    cursor = page.cursor;
  }
  return out;
}

/* the true number: for a litter, its own people and the every-litter people,
   each once (two list requests); for the every-litter list, its keys */
async function countFromKeys(kv, litter) {
  const all = await listAll(kv, 'all:');
  if (litter === 'all') return all.length;
  const own = await listAll(kv, 'l:' + litter + ':');
  const seen = new Set();
  for (const k of own) seen.add(hashPart(k.name));
  for (const k of all) seen.add(hashPart(k.name));
  return seen.size;
}

async function readCount(kv, litter) {
  const rec = await kv.get('n:' + litter, { type: 'json' });
  return rec && typeof rec.n === 'number' && typeof rec.at === 'number' ? rec : null;
}

async function writeCount(kv, litter, n, now) {
  await kv.put('n:' + litter, JSON.stringify({ n, at: now }));
  return n;
}

/* the number to show: the cached one while it is fresh, otherwise a recount */
async function currentCount(kv, litter, now) {
  const rec = await readCount(kv, litter);
  if (rec && now - rec.at < COUNT_TTL && now >= rec.at) return rec.n;
  const n = await countFromKeys(kv, litter);
  await writeCount(kv, litter, n, now);
  return n;
}

/* the litters that currently carry a number, from the cache keys; when
   somebody joins the every-litter list they join every one of these */
async function countedLitters(kv) {
  const keys = await listAll(kv, 'n:');
  return keys.map(k => k.name.slice(2)).filter(id => LITTER_ID.test(id));
}

/* record one person on one list. Returns whether they were new and the
   count that now shows for what they asked about. With bump=false (an
   import) only the record is written; the caller recounts everything once
   at the end instead of per address.
   THE ORDER MATTERS: every number is read BEFORE the record is written. A
   number read after it would already include the new key whenever the cache
   had expired and the read fell through to a recount, and adding one to
   that counted the person twice (the first run of waitlistfntest.mjs
   caught exactly that). */
async function record(kv, want, email, source, now, bump) {
  const hash = await hashOf(email);
  const key = keyFor(want, hash);
  const when = new Date(now).toISOString().slice(0, 10);
  if (await kv.get(key)) return { fresh: false, count: bump === false ? null : await currentCount(kv, want, now) };
  if (bump === false) {
    await kv.put(key, JSON.stringify({ email, when, source }), { metadata: { e: email, w: when } });
    return { fresh: true, count: null };
  }
  const bumps = [];   /* [litter, number before] for every number this person joins */
  if (want === 'all') {
    bumps.push(['all', await currentCount(kv, 'all', now)]);
    for (const id of await countedLitters(kv)) {
      if (await kv.get(keyFor(id, hash))) continue;   /* already waiting on it by name */
      bumps.push([id, await currentCount(kv, id, now)]);
    }
  } else {
    const n = await currentCount(kv, want, now);
    if (!(await kv.get(keyFor('all', hash)))) bumps.push([want, n]);   /* else counted already through every-litter */
    else bumps.push([want, n - 1]);   /* no change: written back as n */
  }
  await kv.put(key, JSON.stringify({ email, when, source }), { metadata: { e: email, w: when } });
  let shown = null;
  for (const [id, before] of bumps) {
    const n = await writeCount(kv, id, before + 1, now);
    if (id === want) shown = n;
  }
  return { fresh: true, count: shown };
}

/* every number recounted from the keys: the every-litter list and each
   litter that has people of its own or a number on show */
async function recountAll(kv, now) {
  const all = (await listAll(kv, 'all:')).map(k => ({ email: k.metadata && k.metadata.e || '', when: k.metadata && k.metadata.w || '' }));
  const litters = {};
  for (const k of await listAll(kv, 'l:')) {
    const id = k.name.slice(2, k.name.lastIndexOf(':'));
    (litters[id] = litters[id] || []).push({ email: k.metadata && k.metadata.e || '', when: k.metadata && k.metadata.w || '' });
  }
  const counts = { all: all.length };
  for (const id of Object.keys(litters).concat(await countedLitters(kv))) {
    if (counts[id] !== undefined) continue;
    counts[id] = await countFromKeys(kv, id);
    await writeCount(kv, id, counts[id], now);
  }
  await writeCount(kv, 'all', all.length, now);
  return { all, litters, counts };
}

/* constant-time comparison for the admin key, so a wrong guess does not
   leak how wrong it was through timing */
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

function wantOf(raw) {
  const w = String(raw || 'all').trim();
  if (w === 'all' || LITTER_ID.test(w)) return w;
  return '';
}

async function readBody(request) {
  const ct = (request.headers.get('Content-Type') || '').toLowerCase();
  try {
    if (ct.includes('application/json')) return await request.json();
    const fd = await request.formData();
    const o = {};
    for (const [k, v] of fd.entries()) o[k] = typeof v === 'string' ? v : '';
    return o;
  } catch (e) {
    return null;
  }
}

/* ── the count ─────────────────────────────────────────────────────────── */
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const kv = env.WAITLIST;
  const now = Date.now();
  if (url.searchParams.get('list') !== null) {
    if (!isAdmin(request, env)) return json({ ok: false, why: env.ADMIN_KEY ? 'wrong key' : 'no admin key set' }, env.ADMIN_KEY ? 401 : 503);
    if (!kv) return json({ ok: false, why: 'not switched on: no WAITLIST binding' }, 503);
    const r = await recountAll(kv, now);
    return json({ ok: true, all: r.all, litters: r.litters, counts: r.counts, at: new Date(now).toISOString() });
  }
  const litter = wantOf(url.searchParams.get('litter'));
  if (!litter) return json({ ok: false, why: 'litter must be all, L<YYYY-MM-DD> or P<key>' }, 400);
  if (!kv) return json({ ok: true, litter, count: null, why: 'not switched on' });
  return json({ ok: true, litter, count: await currentCount(kv, litter, now) });
}

/* ── a signup, or an import ────────────────────────────────────────────── */
export async function onRequestPost(context) {
  const { request, env } = context;
  const kv = env.WAITLIST;
  const now = Date.now();
  const body = await readBody(request);
  if (!body) return json({ ok: false, why: 'unreadable body' }, 400);
  /* the honeypot both forms carry; a filled one is not a person */
  if (body._gotcha) return json({ ok: true, fresh: false, count: null });
  if (Array.isArray(body.import)) {
    if (!isAdmin(request, env)) return json({ ok: false, why: env.ADMIN_KEY ? 'wrong key' : 'no admin key set' }, env.ADMIN_KEY ? 401 : 503);
    if (!kv) return json({ ok: false, why: 'not switched on: no WAITLIST binding' }, 503);
    const want = wantOf(body.want) || 'all';
    let added = 0, already = 0, skipped = 0;
    for (const raw of body.import.slice(0, MAX_IMPORT)) {
      const e = cleanEmail(raw);
      if (!e) { skipped++; continue; }
      const r = await record(kv, want, e, 'import', now, false);
      if (r.fresh) added++; else already++;
    }
    const r = await recountAll(kv, now);
    return json({ ok: true, want, added, already, skipped, counts: r.counts });
  }
  const email = cleanEmail(body.email);
  if (!email) return json({ ok: false, why: 'that is not an email address' }, 400);
  const want = wantOf(body.want);
  if (!want) return json({ ok: false, why: 'want must be all, L<YYYY-MM-DD> or P<key>' }, 400);
  if (body.dry === true || body.dry === 'true') return json({ ok: true, dry: true, want, on: !!kv });
  if (!kv) return json({ ok: true, fresh: null, count: null, why: 'not switched on' });
  const r = await record(kv, want, email, 'site', now);
  return json({ ok: true, want, fresh: r.fresh, count: r.count });
}

export async function onRequest(context) {
  const m = context.request.method;
  if (m === 'GET') return onRequestGet(context);
  if (m === 'POST') return onRequestPost(context);
  return json({ ok: false, why: 'GET or POST' }, 405);
}
