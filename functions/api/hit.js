/* THE PRIVATE COUNTER (14 Sept 2026). William: "a little private counter for
   activity on our website ... start logging stuff that people press and how
   far they scroll ... a daily report ... seamless and doesn't protrude in the
   user's experience."

   WHAT IS COUNTED, and only this: one record per page visit, sent once when
   the page is left, holding
     p    which page (home, litters, news, terms, share)
     d    phone or desktop (pointer:coarse), nothing finer
     ref  where the visit came from, as a word: instagram, facebook, tiktok,
          google, direct, share, site (another page here), other (never the URL)
     s    how far the page was scrolled, 25 / 50 / 75 / 100
     ev   which of the site's own controls were tapped, as short names
          (text, call, email, see-rabbits, listing, ask, waitlist, form,
          instagram, tiktok, facebook, news, litters, litter-open, ...),
          each at most once per visit
   AND, FROM ROUND 192b (9 Nov 2026), MORE OF THE SAME VISIT: when buttons are
   tapped after that record has gone (the page left the screen, came back, and
   something was tapped), the page sends their names alone, {more:1, p, ev,
   had}: the page, the new names, and the names it had already sent. It is
   kept as its own small key beside the day's visits, adds its taps to the
   day's taps, and never adds a visit (cleanMore and addMore, below). Sent on
   the day of the tap: a page left open past midnight adds its later taps to
   the new day.
   WHAT IS NOT: no cookie, no ID, no IP address, no user agent string, no
   fingerprint, no per-person history. The record has no field that could
   identify anyone, so two visits by one person are two visits. The terms
   sheet says so in one sentence. A browser that asks not to be tracked is
   not counted at all, whichever way it asks: Global Privacy Control
   (Sec-GPC: 1) or Do Not Track (DNT: 1). The terms say so; until 25 Oct 2026
   (Round 138, the privacy lines checked against what the site does, his list
   row 6) only the first was honoured, here and in count.js, so a browser
   sending Do Not Track alone was counted. optouttest.js holds both halves.

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
const REFS = new Set(['instagram', 'facebook', 'tiktok', 'google', 'direct', 'share', 'site', 'other']);   /* share: arrived from a /r/<name> link (2 Oct 2026); site: a move from another page of this site (4 Oct 2026) */
const DEVS = new Set(['phone', 'desktop']);
const SCROLLS = new Set([0, 25, 50, 75, 100]);
const EVENT = /^[a-z][a-z0-9-]{0,23}$/;
const MAX_EVENTS = 24;
/* ROUND 192 (9 Nov 2026; William: "how long they were on the website for"; "I just wanna be able to differentiate real
   human visits from bot visits"). Two more fields from the page, and one label made here:
     t    seconds on screen, as one of seven steps (0, 3, 10, 30, 60, 180, 600: at least that many), never the figure
     h    1 when a real touch, click, key or wheel reached the page, else 0
     k    made here from the request and then the request's words are thrown away: b, the browser says it is a bot, a
          preview or a monitor, or Cloudflare vouches it is a known one; d, it came from a hosting company's network,
          where programs live and people rarely browse (Apple's Private Relay and the phone carriers are not on that
          list). The browser's name for itself and its network are never stored.
   A visit's kind is worked out when a day is summed (kindOf): people, a real input and at least three seconds on screen;
   automated, it says so, or it came from a hosting network with no input; can't tell, the rest (opened and left); old,
   sent by the counter as it was before this round. No kind is a claim about a person: it is about a page view. */
const TIMES = new Set([0, 3, 10, 30, 60, 180, 600]);
/* u, how new the visit is, from one date the browser keeps on its own device (count.js): d the first today, w this week,
   m this month, n ever; '' already counted today; x the browser keeps nothing. Never a number or a name: unique visitors
   are counted by adding these up, with nothing that could follow anyone. */
const FRESH = new Set(['', 'd', 'wd', 'md', 'mwd', 'nmwd', 'x']);
const CONTACT = new Set(['ask', 'buy', 'text', 'call', 'email', 'form', 'waitlist', 'waitlist-litter']);
const SAYS_BOT = /bot\b|bot[\/;) ]|crawl|spider|slurp|preview|monitor|headless|lighthouse|pingdom|uptime|scrape|python|curl\/|wget|go-http|okhttp|java\/|httpclient|axios|node-fetch|facebookexternalhit|whatsapp|telegram|discord|slack|embedly|inspectiontool|gptbot|claudebot|anthropic|perplexity|bytespider|amazonbot|applebot|yandex|baidu|duckduck|semrush|ahrefs|mj12|dotbot|petal/i;
const HOSTING = /amazon|aws\b|google cloud|google llc|microsoft|azure|digitalocean|ovh|hetzner|linode|akamai connected cloud|vultr|choopa|oracle|alibaba|tencent|contabo|scaleway|leaseweb|m247|datacamp|hostinger|godaddy|ionos|rackspace|colocrossing|psychz|quadranet|servermania|hostwinds/i;

function labelOf(request) {
  const ua = request.headers.get('User-Agent') || '';
  const cf = request.cf || {};
  if (SAYS_BOT.test(ua) || cf.verifiedBotCategory || (cf.botManagement && cf.botManagement.verifiedBot)) return 'b';
  if (HOSTING.test(String(cf.asOrganization || ''))) return 'd';
  return '';
}

function kindOf(v) {
  if (v.k === 'b') return 'auto';
  if (v.t === undefined) return 'old';
  if (v.h === 1 && v.t >= 3) return 'people';
  return v.k === 'd' ? 'auto' : 'unknown';
}

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

function cleanVisit(body, stored) {
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
  const v = { p, d, ref, s, ev };
  if (TIMES.has(body.t)) { v.t = body.t; v.h = body.h === 1 ? 1 : 0; v.u = FRESH.has(body.u) ? body.u : 'x'; }
  /* the label is this function's own: read back from the store, never taken from a browser */
  if (stored && (body.k === 'b' || body.k === 'd')) v.k = body.k;
  return v;
}

/* MORE OF THE SAME VISIT (Round 192b, 9 Nov 2026): the taps made after the visit's record had gone (count.js: the page
   left the screen, came back, and a button was tapped). Kept as its own small record beside the visits of its day:
   {m:1, p, ev, ho, hc, h}: the new taps, and two yes-or-no marks made here from the names the page says it had already
   sent ("had"): ho, a rabbit had been opened; hc, a contact tap had been made. It adds its taps to the day's taps. For a
   person's visit it counts that visit once among those that opened a rabbit, or made a contact tap, if the record
   before it had not. It never adds a visit, a page, a device, a source, a scroll, a time or a new visitor. */
function cleanMore(body, stored) {
  if (!body || typeof body !== 'object') return null;
  if (!(stored ? body.m === 1 : body.more === 1)) return null;
  const p = PAGES.has(body.p) ? body.p : null;
  if (!p) return null;
  const names = (a) => { const out = []; if (Array.isArray(a)) for (const e of a) { if (typeof e === 'string' && EVENT.test(e) && !out.includes(e)) out.push(e); if (out.length >= MAX_EVENTS) break; } return out; };
  const had = stored ? [] : names(body.had);
  const ev = names(body.ev).filter((e) => !had.includes(e));
  if (!ev.length) return null;
  const v = { m: 1, p, ev, h: body.h === 1 ? 1 : 0,
    ho: (stored ? body.ho === 1 : had.includes('listing')) ? 1 : 0,
    hc: (stored ? body.hc === 1 : had.some((e) => CONTACT.has(e))) ? 1 : 0 };
  if (stored && (body.k === 'b' || body.k === 'd')) v.k = body.k;
  return v;
}

function addMore(t, v) {
  t.more = (t.more || 0) + 1;
  for (const e of v.ev) t.taps[e] = (t.taps[e] || 0) + 1;
  /* a person's: a real input, and not a browser that calls itself a bot (a tap after coming back is past three seconds) */
  if (v.h === 1 && v.k !== 'b') {
    if (v.ev.includes('listing') && !v.ho) t.people.opened += 1;
    if (v.ev.some((e) => CONTACT.has(e)) && !v.hc) t.people.contact += 1;
  }
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
  return { day, visits: 0, pages: {}, devices: {}, refs: {}, scroll: {}, taps: {},
    kinds: { people: 0, auto: 0, unknown: 0, old: 0 }, time: {}, fresh: { day: 0, week: 0, month: 0, ever: 0, unknown: 0 },
    people: { scroll: { 25: 0, 50: 0, 75: 0, 100: 0 }, opened: 0, contact: 0, refs: {}, devices: {}, time: {}, fresh: { day: 0, week: 0, month: 0, ever: 0, unknown: 0 } } };
}

function addFresh(f, u) {
  if (u === undefined) return;
  if (u === 'x') { f.unknown += 1; return; }
  if (u.includes('d')) f.day += 1;
  if (u.includes('w')) f.week += 1;
  if (u.includes('m')) f.month += 1;
  if (u.includes('n')) f.ever += 1;
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
  const kind = kindOf(v);
  t.kinds[kind] += 1;
  if (v.t !== undefined) t.time[v.t] = (t.time[v.t] || 0) + 1;
  addFresh(t.fresh, v.u);
  if (kind === 'people') {
    const q = t.people;
    for (const b of [25, 50, 75, 100]) if (v.s >= b) q.scroll[b] += 1;
    if (v.ev.includes('listing')) q.opened += 1;
    if (v.ev.some((e) => CONTACT.has(e))) q.contact += 1;
    q.refs[v.ref] = (q.refs[v.ref] || 0) + 1;
    q.devices[v.d] = (q.devices[v.d] || 0) + 1;
    q.time[v.t] = (q.time[v.t] || 0) + 1;
    addFresh(q.fresh, v.u);
  }
}

async function totalsFor(kv, day) {
  const done = day < tucsonDay(Date.now());
  if (done) {
    const kept = await kv.get('vd2:' + day, { type: 'json' });
    if (kept && typeof kept.visits === 'number') return kept;
  }
  const t = emptyTotals(day);
  const keys = await listAll(kv, 'v:' + day + ':');
  for (const k of keys) {
    if (k.metadata && k.metadata.m === 1) { const x = cleanMore(k.metadata, true); if (x) addMore(t, x); continue; }
    const v = k.metadata && cleanVisit(k.metadata, true);
    if (v) addVisit(t, v);
  }
  /* a day summed before Round 192 and whose visits have since expired (45 days) is still on record under its old name:
     its totals stand, every visit of it "old" */
  if (done && t.visits === 0) {
    const was = await kv.get('vd:' + day, { type: 'json' });
    if (was && typeof was.visits === 'number' && was.visits > 0) {
      const o = Object.assign(emptyTotals(day), was);
      o.kinds = { people: 0, auto: 0, unknown: 0, old: was.visits };
      return o;
    }
  }
  t.countedAt = new Date().toISOString();
  if (done) await kv.put('vd2:' + day, JSON.stringify(t), { expirationTtl: 400 * 24 * 3600 });
  return t;
}

/* Sec-GPC: 1 (Global Privacy Control) or DNT: 1 (Do Not Track), the two ways
   a browser asks; a header's name is matched in any case, its value exactly */
function asksNotToBeTracked(h) {
  return (h.get('Sec-GPC') || '').trim() === '1' || (h.get('DNT') || '').trim() === '1';
}

export async function onRequestPost(context) {
  const kv = context.env.WAITLIST;
  if (!kv) return new Response(null, { status: 204 });
  if (asksNotToBeTracked(context.request.headers)) return new Response(null, { status: 204 });
  let body = null;
  try {
    const text = await context.request.text();
    if (text.length > 2000) return new Response(null, { status: 204 });
    body = JSON.parse(text);
  } catch (e) { return new Response(null, { status: 204 }); }
  const v = (body && body.more === 1) ? cleanMore(body, false) : cleanVisit(body, false);
  if (!v) return new Response(null, { status: 204 });
  const label = labelOf(context.request);
  if (label) v.k = label;
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
