/* THE PRIVATE COUNTER (14 Sept 2026). William: "a little private counter for
   activity on our website ... start logging stuff that people press and how
   far they scroll ... a daily report ... seamless and doesn't protrude in the
   user's experience."

   WHAT IS COUNTED, and only this: one record per page visit, sent once when
   the page is left, holding
     p    which page (home, litters, news, terms, share)
     d    phone or desktop (pointer:coarse), nothing finer
     ref  where the visit came from, as a word: instagram, facebook, tiktok,
          google, direct, other (never the URL)
     s    how far the page was scrolled, 25 / 50 / 75 / 100
     ev   which of the site's own controls were tapped, as short names
          (text, call, email, see-rabbits, listing, ask, waitlist, form,
          instagram, tiktok, facebook, news, litters, litter-open, ...),
          each at most once per visit
   WHAT IS NOT: no cookie, no ID, no IP address, no user agent string, no
   fingerprint, no per-person history. The record has no field that could
   identify anyone, so two visits by one person are two visits. The terms
   sheet says so in one sentence. A browser sending Global Privacy Control
   is not counted at all.

   STORAGE: the same Workers KV namespace the waitlist counter uses (bound as
   WAITLIST), one key per visit  v:<day>:<random>  that expires after 45 days.
   A key per visit rather than a running total because KV has no atomic
   increment: two visits ending in the same second would overwrite each
   other's count. The free plan allows 1,000 KV writes a day; past that a
   visit is dropped silently (the site never waits on this).

   THE REPORT: GET /api/hit?day=YYYY-MM-DD lists that day's keys and sums
   them. A finished day is summed once and kept as  vd:<day>  so the morning
   report is one read. Totals only; nothing in the answer is about a person.
   The day boundary is Tucson's (UTC-7, no daylight saving).

   Without the binding: POST answers 204 and stores nothing; GET says
   "not switched on", the same words the waitlist counter uses. */

const TTL = 45 * 24 * 3600;
const PAGES = new Set(['home', 'litters', 'news', 'terms', 'share']);
const REFS = new Set(['instagram', 'facebook', 'tiktok', 'google', 'direct', 'other']);
const DEVS = new Set(['phone', 'desktop']);
const SCROLLS = new Set([0, 25, 50, 75, 100]);
const EVENT = /^[a-z][a-z0-9-]{0,23}$/;
const MAX_EVENTS = 24;

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

/* today's date in Tucson: Arizona keeps MST all year, UTC-7 */
function tucsonDay(ms) {
  return new Date(ms - 7 * 3600 * 1000).toISOString().slice(0, 10);
}

function cleanVisit(body) {
  if (!body || typeof body !== 'object') return null;
  const p = PAGES.has(body.p) ? body.p : null;
  if (!p) return null;
  const d = DEVS.has(body.d) ? body.d : 'phone';
  const ref = REFS.has(body.ref) ? body.ref : 'other';
  const s = SCROLLS.has(body.s) ? body.s : 0;
  const ev = [];
  if (Array.isArray(body.ev)) {
    for (const e of body.ev) {
      if (typeof e === 'string' && EVENT.test(e) && !ev.includes(e)) ev.push(e);
      if (ev.length >= MAX_EVENTS) break;
    }
  }
  return { p, d, ref, s, ev };
}

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

function emptyTotals(day) {
  return { day, visits: 0, pages: {}, devices: {}, refs: {}, scroll: {}, taps: {} };
}

/* the visit's record rides in the key's metadata, so summing a day is one
   list per thousand visits and no reads */
function addVisit(t, v) {
  t.visits += 1;
  t.pages[v.p] = (t.pages[v.p] || 0) + 1;
  t.devices[v.d] = (t.devices[v.d] || 0) + 1;
  t.refs[v.ref] = (t.refs[v.ref] || 0) + 1;
  const sc = t.scroll[v.p] || (t.scroll[v.p] = { 25: 0, 50: 0, 75: 0, 100: 0 });
  for (const b of [25, 50, 75, 100]) if (v.s >= b) sc[b] += 1;
  for (const e of v.ev) t.taps[e] = (t.taps[e] || 0) + 1;
}

async function totalsFor(kv, day) {
  const done = day < tucsonDay(Date.now());
  if (done) {
    const kept = await kv.get('vd:' + day, { type: 'json' });
    if (kept && typeof kept.visits === 'number') return kept;
  }
  const t = emptyTotals(day);
  const keys = await listAll(kv, 'v:' + day + ':');
  for (const k of keys) {
    const v = k.metadata && cleanVisit(k.metadata);
    if (v) addVisit(t, v);
  }
  t.countedAt = new Date().toISOString();
  if (done) await kv.put('vd:' + day, JSON.stringify(t), { expirationTtl: 400 * 24 * 3600 });
  return t;
}

export async function onRequestPost(context) {
  const kv = context.env.WAITLIST;
  if (!kv) return new Response(null, { status: 204 });
  if (context.request.headers.get('Sec-GPC') === '1') return new Response(null, { status: 204 });
  let body = null;
  try {
    const text = await context.request.text();
    if (text.length > 2000) return new Response(null, { status: 204 });
    body = JSON.parse(text);
  } catch (e) { return new Response(null, { status: 204 }); }
  const v = cleanVisit(body);
  if (!v) return new Response(null, { status: 204 });
  const day = tucsonDay(Date.now());
  const key = 'v:' + day + ':' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  try {
    /* the value is a single byte; the record lives in the metadata (1 KB cap) */
    await kv.put(key, '1', { expirationTtl: TTL, metadata: v });
  } catch (e) { /* over the daily write allowance, or KV down: dropped, silently */ }
  return new Response(null, { status: 204 });
}

export async function onRequestGet(context) {
  const kv = context.env.WAITLIST;
  if (!kv) return json({ ok: true, why: 'not switched on' });
  const url = new URL(context.request.url);
  const day = url.searchParams.get('day') || tucsonDay(Date.now() - 24 * 3600 * 1000);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return json({ ok: false, why: 'day must be YYYY-MM-DD' }, 400);
  const totals = await totalsFor(kv, day);
  return json({ ok: true, ...totals });
}
