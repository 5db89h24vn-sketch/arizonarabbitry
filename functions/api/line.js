/* THE LINE (Round 194 draft, 12 Nov 2026; rebased 13-14 Nov 2026 for Saffron and Odyssey's seven, his 11:20pm "figure out the
   reservation so that we have a working system for this new litter that we can rely on"). William, 5:12pm: "make sure that
   the digital queue is working as well for the reservation, so people know what position they are"; 5:19pm: the Cloudflare
   database "yes"; if the first does not pay the $50 deposit, the next gets the rabbit after "1 hr" (the site's own words
   already: "The hour starts with my call"); "make sure that the cloud flare account is set up properly so that we have the
   best foundation on the website".

   A place in line is one row in a D1 database bound to this Pages project as LINE. D1 runs every write on one primary, one
   write at a time, so two requests in the same second get two different places, in the order the database took them.
   (Workers KV, the waitlist's store, is the wrong tool: Cloudflare's own page says changes "may take up to 60 seconds or more
   to be visible in other global network locations" and that KV "is not ideal for applications where you need support for
   atomic operations".)

   VERSION 3 (14 Nov 2026, Codex's queue review of 06:43Z and 06:55Z, findings named in brackets):
   - A CODE THAT STAYS [QUEUE-MUTABLE-POSITION-IDENTITY]. A place moves (2nd becomes 1st when one ahead is passed); the code
     does not. One code per browser, the same in every line it holds (two taken together: one code, two places): four of the
     request code's 32 letters and digits that cannot be misread, drawn at random, never the token. The buyer's text, the
     buyer's screen and William's line page all show it, so an old text saying "2nd" still finds its own row.
   - THE SERVER KEEPS THE RULES [QUEUE-SERVER-ELIGIBILITY, QUEUE-UNBOUNDED-ADMIN-HISTORY]. A new place is given only for a
     rabbit on this deployment's own list, /line-open.json (written at each build from rabbits.js: the rabbits for sale and
     the moment each opens), and only from that moment, by the server's clock. A place already held can always be read.
   - ONE ANSWER PER BROWSER, AT ANY LENGTH OF LINE [QUEUE-CAP-IDEMPOTENCY-RACE]. A token that already holds a place gets that
     place back before anything else is looked at, full line or not; a new place is given by ONE statement that counts and
     inserts together (SQLite runs a statement as one, and D1 runs writes one at a time), so two at 299 make 300, not 301.
     The 300 counts the places still in line (waiting or paid): a place passed over gives its room back.
   - ONE READ [QUEUE-READ-SNAPSHOT]. The state, the place and "someone ahead has paid" come from one statement.
   - ERRORS ANSWER IN JSON [QUEUE-UNCUGHT-DB-FAILURE]. Every failure of the store says so (503, retry: true) without SQL,
     token or key; the page asks again with the same token and gets the one place, saved or not.
   - RESERVE OR BUY, SWITCHED [QUEUE-KIND-RETRY-SEMANTICS]. The same browser asking with the other kind keeps its place and
     the line keeps the latest kind while the place is waiting; every answer says the kind kept.
   - WILLIAM'S ACTIONS NAME THE STATE THEY CHANGE (hardening): {admin, id, from}; a place changed since his page last read it
     answers 409 with its state, never overwrites it. "Called" stamps the moment he called (his hour starts with his call);
     nothing ever happens by itself when the hour ends: he marks Paid or Passed [QUEUE-HOUR-MANUAL-ONLY].
   - The token travels in the body, never in an address (hardening); the body is read to 2,048 bytes at most and must be JSON.
   VERSION 3.1 (14 Nov 2026 ~1:10am Phoenix, Codex's static review ready-queue-v3-static-qc-20261114T075036Z, manifest
   9d4952d9...):
   - EVERY ACTIVE PLACE ON WILLIAM'S PAGE, WITH ITS PLACE [QUEUE-V3-ADMIN-ACTIVE-ROWS-HIDDEN, -PARTIAL-ROWS-POSITION]: his read
     returns every waiting and paid place, whatever its age, each with the place the server counts (the same count a buyer's
     answer gives), and the passed places of the last 60 days, newest first, 2,000 at most, in ONE statement (one snapshot);
     it says when either part was cut (activeTruncated, historyTruncated).
   - A CODE ALREADY HELD IS NEVER REFUSED FOR A DRAW IT DOES NOT USE [QUEUE-V3-REUSED-CODE-GATED-BY-UNUSED-DRAW]: the drawn code
     must be free only when the browser holds no code yet (still one statement).
   - CALLED NAMES THE CALL IT SAW [QUEUE-V3-CALLED-REPLAY-SEMANTICS]: {admin:"called", id, from:"waiting", calledFrom: the
     calledAt his page drew, or 0}. "Called again" from a page that saw the last call stamps a new one; a stale or replayed
     Called (another phone called since) answers 409 with the state and the calledAt there now. Still no automatic expiry.
   - A list that is missing, not JSON or not answering is no list (503 "no list"), never "store" [QUEUE-V3-MALFORMED-LIST-
     UNIT-CONTRACT-MISMATCH]; bound at 161150c2... (00:50) and kept.
   - RESERVE AND BUY SENT AT ONCE [QUEUE-V3-INITIAL-MIXED-KIND-INTERLEAVING], the contract: the first new place the database
     takes keeps its kind; every answer says the kind kept; the page compares it with the kind on its screen and asks again
     (twice at most) until they agree, so the browser's final choice is what the line keeps. The server does not guess intent
     from arrival order.
   - One code per BROWSER (a request reference), not proof of one person: a shared phone is one code; one person on two
     phones holds two [QUEUE-V3-BROWSER-CODE-NOT-PERSON-IDENTITY].

   WHAT IS KEPT, and only this: which rabbit, reserve or buy, the moment, the code, the state, the moment William called, and a
   random token the asking browser keeps so it can read its own place again. No name, phone number, email or IP address. The
   terms sheet says so in one sentence.

   WHAT THE PAGES ASK FOR (POST, Content-Type: application/json)
     {"rabbit":"poppyseed","kind":"reserve"|"buy","token":"<32 hex the browser made>"}        a place: the held one, or a new one
       -> {"ok":true,"rabbit":"poppyseed","place":2,"state":"waiting","kind":"reserve","code":"K7Q2","paidAhead":false,
           "at":1763168400123,"fresh":true}
       -> {"ok":false,"why":"not open","wait":<ms>} (403) before the moment; {"why":"not listed"} (403) a rabbit not on the
          list; {"why":"line full"} (429); {"why":"store","retry":true} (503); {"why":"no line store"} (503) with no binding
     {"look":true,"rabbit":...,"token":...}                                  the held place read again; never a new one
       -> the same answer, or {"ok":false,"why":"no place"} (404)
     {"dry":true,"rabbit":...,"kind":...,"token":...}     the release's live check: the table and the list answer, nothing
       -> {"ok":true,"dry":true,"listed":true|false}       is written
   WHAT WILLIAM'S PAGE ASKS FOR, with "Authorization: Bearer <ADMIN_KEY>" (the waitlist's key)
     GET  /api/line?all=1      -> {"ok":true,"now":<ms>,"rows":[{id,rabbit,kind,at,state,code,calledAt,place}],"open":{rabbit:opensAt},
                                   "activeTruncated":false,"historyTruncated":false,"historyDays":60,"historyMax":2000}
                                  (every waiting and paid place with its place; passed places of the last 60 days, 2,000 at most)
     POST {"admin":"paid"|"passed"|"waiting","id":12,"from":"waiting"}      a state, if it is still "from"
     POST {"admin":"called","id":12,"from":"waiting","calledFrom":0}       a call, if the last call is still "calledFrom" 
   A place passed shows no place to its buyer (state "passed"); a place paid says so to its buyer (state "paid"); places behind
   a paid one say paidAhead, so the page tells a newcomer the truth.

   THE TABLE (line-schema.sql, made once in the D1 console):
     CREATE TABLE IF NOT EXISTS line (id INTEGER PRIMARY KEY AUTOINCREMENT, rabbit TEXT NOT NULL,
       kind TEXT NOT NULL CHECK (kind IN ('reserve','buy')), at INTEGER NOT NULL, token TEXT NOT NULL, code TEXT NOT NULL,
       state TEXT NOT NULL DEFAULT 'waiting' CHECK (state IN ('waiting','paid','passed')), calledAt INTEGER,
       UNIQUE (rabbit, token));
     CREATE INDEX IF NOT EXISTS line_by_rabbit ON line (rabbit, id);
     CREATE INDEX IF NOT EXISTS line_by_token ON line (token);
     CREATE INDEX IF NOT EXISTS line_by_code ON line (code); */

const KINDS = ['reserve', 'buy'], STATES = ['waiting', 'paid', 'passed'], ACTIONS = ['called', 'paid', 'passed', 'waiting'];
const ACTIVE_MAX = 300, BODY_MAX = 2048, HIST_DAYS = 60, HIST_MAX = 2000, ACTIVE_CAP = 10000, CODE_TRIES = 4;
const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   /* the request code's 32: no I, O, 0 or 1 */

function json(data, status) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}
function sameSecret(a, b) { if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
function isAdmin(request, env) { if (!env.ADMIN_KEY) return false; const h = request.headers.get('Authorization') || ''; return h.startsWith('Bearer ') && sameSecret(h.slice(7).trim(), env.ADMIN_KEY); }
const okRabbit = r => typeof r === 'string' && /^[a-z][a-z0-9-]{1,60}$/.test(r);
const okToken = t => typeof t === 'string' && /^[0-9a-f]{32}$/.test(t);
function newCode() { const a = new Uint8Array(4); crypto.getRandomValues(a); let s = ''; for (let i = 0; i < 4; i++) s += CODE_ABC[a[i] & 31]; return s; }

/* the body: JSON only, 2,048 bytes at most, read no further than that */
async function readBody(request) {
  if (!/^application\/json\b/i.test(request.headers.get('Content-Type') || '')) return null;
  if (+(request.headers.get('Content-Length') || 0) > BODY_MAX || !request.body) return null;
  const rd = request.body.getReader(), parts = []; let n = 0;
  for (;;) {
    const { done, value } = await rd.read(); if (done) break;
    n += value.byteLength; if (n > BODY_MAX) { try { await rd.cancel(); } catch (e) {} return null; }
    parts.push(value);
  }
  const all = new Uint8Array(n); let o = 0; for (const p of parts) { all.set(p, o); o += p.byteLength; }
  try { const b = JSON.parse(new TextDecoder().decode(all)); return b && typeof b === 'object' && !Array.isArray(b) ? b : null; } catch (e) { return null; }
}

/* THE LIST: this deployment's rabbits for sale and the moment each opens (null: open now). Written by the build from
   rabbits.js into /line-open.json, the same deployment as this code, so it is read once per isolate. Unreadable: no new
   place is given (a held one can still be read). */
let OPEN = null;
async function openList(env, request) {
  if (OPEN) return OPEN;
  if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') return null;
  let j = null;
  try {   /* not there, not JSON or not answering: no list (nothing cached, so the next request reads it again) */
    const r = await env.ASSETS.fetch(new Request(new URL('/line-open.json', request.url).toString()));
    if (!r || !r.ok) return null;
    j = await r.json();
  } catch (e) { return null; }
  if (!j || typeof j !== 'object' || !j.rabbits || typeof j.rabbits !== 'object' || Array.isArray(j.rabbits)) return null;
  const m = new Map();
  for (const k of Object.keys(j.rabbits)) {
    const v = j.rabbits[k]; if (!okRabbit(k) || !v || typeof v !== 'object') continue;
    if (v.opensAt === null) { m.set(k, 0); continue; }
    const t = typeof v.opensAt === 'string' ? Date.parse(v.opensAt) : NaN; if (!isNaN(t)) m.set(k, t);
  }
  OPEN = m; return m;
}

/* ONE READ: the held place, its state, its code and whether a place ahead is paid, from one statement */
const READ = "SELECT me.id, me.at, me.state, me.kind, me.code, " +
  "(SELECT COUNT(*) FROM line o WHERE o.rabbit = me.rabbit AND o.id < me.id AND o.state IN ('waiting','paid')) AS ahead, " +
  "(SELECT COUNT(*) FROM line o WHERE o.rabbit = me.rabbit AND o.id < me.id AND o.state = 'paid') AS paid " +
  "FROM line me WHERE me.rabbit = ?1 AND me.token = ?2";
async function placeOf(db, rabbit, token) {
  const me = await db.prepare(READ).bind(rabbit, token).first();
  if (!me) return null;
  return { place: me.state === 'passed' ? null : (me.ahead || 0) + 1, state: me.state, kind: me.kind, code: me.code, at: me.at, paidAhead: me.state === 'waiting' && me.paid > 0 };
}
/* ONE STATEMENT: a new place, only while the line has room, with the browser's code (its own if it holds one elsewhere,
   else a new one no other browser holds) */
const ADD = "INSERT INTO line (rabbit, kind, at, token, code) " +
  "SELECT ?1, ?2, ?3, ?4, COALESCE((SELECT code FROM line WHERE token = ?4 LIMIT 1), ?5) " +
  "WHERE (SELECT COUNT(*) FROM line WHERE rabbit = ?1 AND state IN ('waiting','paid')) < ?6 " +
  "AND (EXISTS (SELECT 1 FROM line WHERE token = ?4) OR NOT EXISTS (SELECT 1 FROM line WHERE code = ?5 AND token <> ?4)) " +
  "ON CONFLICT(rabbit, token) DO NOTHING";

/* WILLIAM'S READ, ONE STATEMENT: every active place with the server's place (the count placeOf gives), and the passed places of
   the last 60 days, newest first, one over each limit so a cut is seen */
const ALL = "SELECT * FROM (SELECT id, rabbit, kind, at, state, code, calledAt, " +
  "ROW_NUMBER() OVER (PARTITION BY rabbit ORDER BY id) AS place, 0 AS hist FROM line WHERE state IN ('waiting','paid') ORDER BY id LIMIT ?3) " +
  "UNION ALL SELECT * FROM (SELECT id, rabbit, kind, at, state, code, calledAt, NULL AS place, 1 AS hist FROM line " +
  "WHERE state = 'passed' AND at > ?1 ORDER BY id DESC LIMIT ?2) ORDER BY rabbit, id";
function storeOf(env) { const db0 = env.LINE; if (!db0) return null; return db0.withSession ? db0.withSession('first-primary') : db0; }
const FAIL = () => json({ ok: false, why: 'store', retry: true }, 503);   /* no SQL, token or key in it */

export async function onRequestGet({ request, env }) {
  const db = storeOf(env); if (!db) return json({ ok: false, why: 'no line store' }, 503);
  const u = new URL(request.url);
  if (u.searchParams.get('all') !== '1') return json({ ok: false, why: 'POST' }, 405);
  if (!isAdmin(request, env)) return json({ ok: false, why: env.ADMIN_KEY ? 'wrong key' : 'no admin key set' }, env.ADMIN_KEY ? 401 : 503);
  try {
    const now = Date.now();
    const { results } = await db.prepare(ALL).bind(now - HIST_DAYS * 864e5, HIST_MAX + 1, ACTIVE_CAP + 1).all();
    const all = results || [], act = all.filter(r => r.hist === 0), his = all.filter(r => r.hist === 1);
    const activeTruncated = act.length > ACTIVE_CAP, historyTruncated = his.length > HIST_MAX;
    const keepA = new Set(act.slice().sort((x, y) => x.id - y.id).slice(0, ACTIVE_CAP).map(r => r.id));   /* the oldest active kept */
    const keepH = new Set(his.sort((x, y) => y.id - x.id).slice(0, HIST_MAX).map(r => r.id));   /* the newest history kept */
    const rows = all.filter(r => (r.hist === 0 ? keepA : keepH).has(r.id)).map(r => ({ id: r.id, rabbit: r.rabbit, kind: r.kind, at: r.at, state: r.state, code: r.code, calledAt: r.calledAt, place: r.hist === 0 ? r.place : null }));
    let open = Object.create(null); const m = await openList(env, request); if (m) m.forEach((t, k) => { open[k] = t || null; }); else open = null;
    return json({ ok: true, now, rows, open, activeTruncated, historyTruncated, historyDays: HIST_DAYS, historyMax: HIST_MAX });
  } catch (e) { return FAIL(); }
}

export async function onRequestPost({ request, env }) {
  const db = storeOf(env); if (!db) return json({ ok: false, why: 'no line store' }, 503);
  let b; try { b = await readBody(request); } catch (e) { b = null; }
  if (!b) return json({ ok: false, why: 'bad body' }, 400);
  try {
    if (b.admin !== undefined) {
      if (!isAdmin(request, env)) return json({ ok: false, why: env.ADMIN_KEY ? 'wrong key' : 'no admin key set' }, env.ADMIN_KEY ? 401 : 503);
      if (!ACTIONS.includes(b.admin) || !Number.isSafeInteger(b.id) || b.id < 1 || !STATES.includes(b.from)) return json({ ok: false, why: 'admin, id and from' }, 400);
      const cf = b.calledFrom === null ? 0 : b.calledFrom;
      if (b.admin === 'called' && !(Number.isSafeInteger(cf) && cf >= 0)) return json({ ok: false, why: 'calledFrom' }, 400);
      const r = b.admin === 'called'   /* the call he saw is still the last one: a new call; else 409 (stale or replayed) */
        ? await db.prepare("UPDATE line SET calledAt = ?1 WHERE id = ?2 AND state = 'waiting' AND ?3 = 'waiting' AND IFNULL(calledAt, 0) = ?4").bind(Date.now(), b.id, b.from, cf).run()
        : await db.prepare('UPDATE line SET state = ?1 WHERE id = ?2 AND state = ?3').bind(b.admin, b.id, b.from).run();
      if (r.meta && r.meta.changes === 1) return json({ ok: true, changed: 1 });
      const now = await db.prepare('SELECT state, calledAt FROM line WHERE id = ?1').bind(b.id).first();
      return json({ ok: false, why: now ? 'changed' : 'no such place', state: now ? now.state : null, calledAt: now ? now.calledAt : null }, now ? 409 : 404);
    }
    const { rabbit, kind, token } = b;
    if (b.look === true) {
      if (!okRabbit(rabbit) || !okToken(token)) return json({ ok: false, why: 'rabbit and token' }, 400);
      const p = await placeOf(db, rabbit, token);
      return p ? json(Object.assign({ ok: true, rabbit }, p)) : json({ ok: false, why: 'no place' }, 404);
    }
    if (!okRabbit(rabbit) || !KINDS.includes(kind) || !okToken(token)) return json({ ok: false, why: 'rabbit, kind and token' }, 400);
    if (b.dry === true) {   /* the live check: the table and the list answer, nothing is written */
      await db.prepare('SELECT COUNT(*) AS n FROM line WHERE rabbit = ?1').bind(rabbit).first();
      const m = await openList(env, request);
      return m ? json({ ok: true, dry: true, listed: m.has(rabbit) }) : json({ ok: false, why: 'no list' }, 503);
    }
    /* a place already held comes back first, whatever the line's length or the rabbit's state now */
    let p = await placeOf(db, rabbit, token);
    if (p) {
      if (p.state === 'waiting' && p.kind !== kind) {
        await db.prepare("UPDATE line SET kind = ?3 WHERE rabbit = ?1 AND token = ?2 AND state = 'waiting'").bind(rabbit, token, kind).run();
        p = await placeOf(db, rabbit, token) || p;
      }
      return json(Object.assign({ ok: true, rabbit, fresh: false }, p));
    }
    /* a new place: only a rabbit on the list, only from its moment */
    const m = await openList(env, request);
    if (!m) return json({ ok: false, why: 'no list', retry: true }, 503);
    if (!m.has(rabbit)) return json({ ok: false, why: 'not listed' }, 403);
    const opens = m.get(rabbit), now = Date.now();
    if (opens && now < opens) return json({ ok: false, why: 'not open', wait: opens - now }, 403);
    for (let i = 0; i < CODE_TRIES; i++) {
      const ins = await db.prepare(ADD).bind(rabbit, kind, now, token, newCode(), ACTIVE_MAX).run();
      p = await placeOf(db, rabbit, token);
      if (p) return json(Object.assign({ ok: true, rabbit, fresh: !!(ins.meta && ins.meta.changes) }, p));
      const n = await db.prepare("SELECT COUNT(*) AS n FROM line WHERE rabbit = ?1 AND state IN ('waiting','paid')").bind(rabbit).first();
      if (n && n.n >= ACTIVE_MAX) return json({ ok: false, why: 'line full' }, 429);
      /* else the drawn code was another browser's: draw again */
    }
    return json({ ok: false, why: 'try again', retry: true }, 503);
  } catch (e) { return FAIL(); }
}

export async function onRequest() { return json({ ok: false, why: 'GET or POST' }, 405); }
