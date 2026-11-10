/* THE PRIVATE COUNTER, the page's half (14 Sept 2026). See functions/api/hit.js
   for what is stored and why. This file does three things and nothing else:
   remembers which of the site's own controls were tapped on this page, how far
   it was scrolled, and sends ONE small record when the page is left (from Round
   192b, also the names of buttons tapped after that record has gone: more(), below). No
   cookie, no ID, nothing read from the device beyond "is this a touch screen"
   and whether the browser asks not to be tracked. It never delays anything: the record goes out with sendBeacon after the
   reader has already moved on. Loaded with defer at the end of every page. */
(function(){
  'use strict';
  /* an automated browser is not a visitor (4 Oct 2026: a test run of the site
     sent its own visits here; navigator.webdriver is how such a browser says
     what it is, and no person's browser sets it) */
  /* A BROWSER THAT ASKS NOT TO BE TRACKED IS NOT COUNTED, whichever way it asks
     (25 Oct 2026, Round 138, his list row 6: the terms promise it, and only
     Global Privacy Control was heard here; Do Not Track is the other way, an
     older setting some browsers still send). functions/api/hit.js drops both
     again on arrival; optouttest.js holds the two halves. */
  if(!window.navigator || navigator.globalPrivacyControl || navigator.doNotTrack==='1' || window.doNotTrack==='1' || navigator.webdriver) return;
  if(location.protocol!=='https:' && location.hostname!=='localhost') return;
  /* HIS OWN DEVICES ARE NOT VISITORS (Round 192, 9 Nov 2026; William: "I just wanna be able to differentiate real human
     visits from bot visits"). His own visits, and Claude's checks of the live site in his browser, were counted with
     everybody else's. Opening the site once with ?me=1 marks that browser as his: one word kept on that device, nothing
     sent anywhere; ?me=0 takes it off. A marked browser sends no record. No visitor's browser is ever marked. */
  try{
    var q=location.search||'';
    if(/[?&]me=1(&|$)/.test(q)) localStorage.setItem('arMe','1');
    else if(/[?&]me=0(&|$)/.test(q)) localStorage.removeItem('arMe');
    if(localStorage.getItem('arMe')==='1') return;
  }catch(e){}
  /* A VISITOR COUNTED ONCE (Round 192; William, 9 Nov, 2:07pm: "Is there anyway we can track unique visitors?"). The
     browser remembers one thing, the day it was last counted: a date kept on the device and never sent. The record says
     only how new this visit is, in letters: d, the first today; w, the first this week (Monday to Sunday); m, the first
     this month; n, the first ever from this browser; none when it was already counted today; x when the browser keeps
     nothing, so it cannot say. No number and no name of any kind is made, so there is nothing to follow anyone by. The
     days are Tucson's, as the count's own. A browser that asks not to be tracked, and his own, never get this far. */
  var fresh='x';
  try{
    var dayNow=new Date(Date.now()-7*3600*1000).toISOString().slice(0,10), was=localStorage.getItem('arSeen')||'';
    var monday=function(s){ var t=new Date(s+'T00:00:00Z'); t.setUTCDate(t.getUTCDate()-((t.getUTCDay()+6)%7)); return t.toISOString().slice(0,10); };
    if(!/^\d{4}-\d{2}-\d{2}$/.test(was)) fresh='nmwd';
    else if(was===dayNow) fresh='';
    else fresh=(was.slice(0,7)!==dayNow.slice(0,7)?'m':'')+(monday(was)!==monday(dayNow)?'w':'')+'d';
    localStorage.setItem('arSeen',dayNow);
  }catch(e){ fresh='x'; }

  var path=location.pathname.toLowerCase();
  /* both forms of each address (2 Oct 2026, the fifth outside pass): Cloudflare
     serves the pages at /litters, /updates and /terms, and answers the .html
     forms with a redirect there, so a counter that knew only the .html forms
     never counted a visit to the three pages */
  var page = /^\/r\//.test(path) ? 'share'
           : /^\/litters(\.html)?$/.test(path) ? 'litters'
           : /^\/updates(\.html)?$/.test(path) ? 'news'
           : /^\/terms(\.html)?$/.test(path) ? 'terms'
           : (path==='/'||/^\/index(\.html)?$/.test(path)) ? 'home' : '';
  if(!page) return;

  var ref='direct';
  try{
    var r=document.referrer? new URL(document.referrer).hostname.toLowerCase() : '';
    if(!r) ref='direct';
    /* a shared rabbit's link, /r/<name>, forwards to the front page: its
       arrival is a share, not a move inside the site (2 Oct 2026) */
    /* moving inside the site is 'site' (4 Oct 2026: it was '' and the line
       below turned it into 'other', so every move between the pages counted
       as a visit from somewhere unknown) */
    else if(r===location.hostname) ref=/^\/r\//.test(new URL(document.referrer).pathname)?'share':'site';
    else if(/instagram\.com$/.test(r)) ref='instagram';
    else if(/facebook\.com$|fb\.com$|messenger\.com$/.test(r)) ref='facebook';
    else if(/tiktok\.com$/.test(r)) ref='tiktok';
    else if(/google\./.test(r)) ref='google';
    else ref='other';
  }catch(e){ ref='other'; }
  if(ref==='') ref='other';

  var dev = (window.matchMedia && matchMedia('(pointer:coarse)').matches) ? 'phone' : 'desktop';
  var taps=[], sent=false, maxScroll=0, told=0;   /* told: how many of the taps the record already carried (Round 192b) */

  function tap(name){ if(name && taps.indexOf(name)<0 && taps.length<24) taps.push(name); }

  /* which control was it: named by what it does, never by who pressed it */
  function nameOf(el){
    var a=el.closest && el.closest('a,button,summary'); if(!a) return '';
    var href=(a.getAttribute('href')||'').toLowerCase();
    if(href.indexOf('sms:')===0) return 'text';
    if(href.indexOf('tel:')===0) return 'call';
    if(href.indexOf('mailto:')===0) return 'email';
    if(/ig\.me\/m\//.test(href)) return 'instagram';   /* a message to him on Instagram (24 Sept 2026), from the listing's steps or the contact rows */
    /* the card is a div since 2 Oct 2026: its overlay link opens the listing,
       and its Ask line is a link of its own */
    if(a.classList.contains('bunny')||a.classList.contains('bunny-link')) return 'listing';
    /* the litters coming soon (Round 190) and the listing's Buy, unnamed until Round 192 */
    if(a.classList.contains('lsh-open')) return 'litter-card';
    if(a.classList.contains('lsh-bell')||a.classList.contains('lsh-go')) return 'alerts';
    if(a.classList.contains('lsh-chip')) return 'shelf-filter';
    if(a.classList.contains('lsh-p')) return 'parent';
    if(a.id==='viewerBuy') return 'buy';
    if(a.classList.contains('bunny-cta')) return 'ask';
    if(a.classList.contains('hero-go')) return 'see-rabbits';
    if(a.classList.contains('parent')) return 'parent';
    if(a.classList.contains('stage-lit')) return 'litter-mark';
    if(a.classList.contains('tile')) return 'litter-open';
    if(a.classList.contains('alert-btn')) return 'waitlist-litter';
    if(a.closest('.social')){
      if(/instagram/.test(href)) return 'instagram';
      if(/tiktok/.test(href)) return 'tiktok';
      if(/facebook/.test(href)) return 'facebook';
    }
    if(a.closest('.viewer') && a.tagName==='A' && /btn/.test(a.className)) return 'ask';
    if(/updates(\.html)?(#|$)/.test(href)) return 'news';
    if(/litters(\.html)?(#|$)/.test(href)) return 'litters';
    if(/terms(\.html)?(#|$)/.test(href)) return 'terms';
    if(/#available/.test(href)) return 'see-rabbits';
    if(/#waitlist/.test(href)) return 'to-waitlist';
    if(/#faq/.test(href)) return 'faq';
    if(a.tagName==='SUMMARY') return 'faq';
    if(a.classList.contains('cite')||a.classList.contains('xlink')) return 'source';
    return '';
  }
  document.addEventListener('click',function(ev){
    var t=ev.target; if(!t||!t.closest) return;
    tap(nameOf(t));
  },true);
  document.addEventListener('submit',function(ev){
    var f=ev.target; if(!f||!f.classList) return;
    if(f.id==='wlform') tap('waitlist');
    else if(f.id==='lead') tap('form');
    else if(f.classList.contains('alert-form')) tap('waitlist-litter');
    else if(f.id==='alertForm') tap('waitlist');   /* the shelf's alerts: the waitlist's own form, opened over the page */
  },true);

  var ticking=false;
  function measure(){
    ticking=false;
    var h=Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)||1;
    var seen=(window.scrollY||window.pageYOffset||0)+window.innerHeight;
    var pct=Math.round(100*seen/h);
    if(pct>maxScroll) maxScroll=pct;
  }
  window.addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(measure); } },{passive:true});
  measure();

  function bucket(p){ return p>=98?100:p>=75?75:p>=50?50:p>=25?25:0; }
  /* HOW LONG IT WAS ON SCREEN, AND WHETHER ANYONE TOUCHED IT (Round 192). The seconds the page was really showing (a tab
     left in the background does not count), kept as one of seven steps and never the figure; and one yes or no: did a
     real touch, click, key or wheel reach the page (isTrusted: an event a script makes up is not one). Nothing here says
     who: the same two facts are true of anybody who stayed a minute and tapped. */
  var clock=function(){ return (window.performance&&performance.now)?performance.now():Date.now(); };
  var shown=0, since=(document.visibilityState==='hidden')?0:clock(), human=0;
  function settle(){ if(since){ shown+=clock()-since; since=0; } }
  function step(ms){ var s=ms/1000; return s>=600?600:s>=180?180:s>=60?60:s>=30?30:s>=10?10:s>=3?3:0; }
  ['pointerdown','touchstart','keydown','wheel'].forEach(function(type){
    document.addEventListener(type,function(ev){ if(ev&&ev.isTrusted) human=1; },{capture:true,passive:true}); });
  function post(body){
    try{
      if(navigator.sendBeacon){ navigator.sendBeacon('/api/hit', new Blob([body],{type:'text/plain'})); return; }
    }catch(e){}
    try{ fetch('/api/hit',{method:'POST',body:body,keepalive:true,headers:{'Content-Type':'text/plain'}}); }catch(e){}
  }
  /* A VISIT'S LATER TAPS (Round 192b, 9 Nov 2026). The record goes once, the first time the page leaves the screen. On a
     phone that is often before the visit is over: the screen locks, another app is opened, and the person comes back and
     taps Send by text. Until this round nothing more was sent, so that tap was never counted (found from a text request
     of 8 Nov that the day's count did not show). Now, each later time the page leaves the screen with buttons tapped
     since, it sends those taps alone: "more":1, the new names, and the names already sent ("had"), so the server can tell
     a visit's first contact tap from its second. No visit, page, scroll or time is sent again, and nothing about who. */
  function more(){
    if(taps.length<=told) return;
    var body=JSON.stringify({p:page, more:1, ev:taps.slice(told), had:taps.slice(0,told), h:human});
    told=taps.length; post(body);
  }
  function send(){
    if(sent){ more(); return; }
    sent=true; settle(); told=taps.length;
    post(JSON.stringify({p:page, d:dev, ref:ref, s:bucket(maxScroll), ev:taps, t:step(shown), h:human, u:fresh}));
  }
  document.addEventListener('visibilitychange',function(){ if(document.visibilityState==='hidden') send(); else if(!since&&!sent) since=clock(); });   /* a page opened in a background tab starts its clock when it is first shown (Round 192) */
  window.addEventListener('pagehide',send);
  /* back from the bfcache is a new visit */
  window.addEventListener('pageshow',function(e){ if(e.persisted){ sent=false; taps=[]; told=0; maxScroll=0; shown=0; since=clock(); human=0; measure(); } });
})();
