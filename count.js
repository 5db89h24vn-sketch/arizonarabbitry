/* THE PRIVATE COUNTER, the page's half (14 Sept 2026). See functions/api/hit.js
   for what is stored and why. This file does three things and nothing else:
   remembers which of the site's own controls were tapped on this page, how far
   it was scrolled, and sends ONE small record when the page is left. No
   cookie, no ID, nothing read from the device beyond "is this a touch screen".
   It never delays anything: the record goes out with sendBeacon after the
   reader has already moved on. Loaded with defer at the end of every page. */
(function(){
  'use strict';
  if(!window.navigator || navigator.globalPrivacyControl) return;
  if(location.protocol!=='https:' && location.hostname!=='localhost') return;

  var path=location.pathname.toLowerCase();
  var page = /^\/r\//.test(path) ? 'share'
           : /litters\.html$/.test(path) ? 'litters'
           : /updates\.html$/.test(path) ? 'news'
           : /terms\.html$/.test(path) ? 'terms'
           : (path==='/'||/index\.html$/.test(path)) ? 'home' : '';
  if(!page) return;

  var ref='direct';
  try{
    var r=document.referrer? new URL(document.referrer).hostname.toLowerCase() : '';
    if(!r) ref='direct';
    else if(r===location.hostname) ref='';                 /* moving inside the site */
    else if(/instagram\.com$/.test(r)) ref='instagram';
    else if(/facebook\.com$|fb\.com$|messenger\.com$/.test(r)) ref='facebook';
    else if(/tiktok\.com$/.test(r)) ref='tiktok';
    else if(/google\./.test(r)) ref='google';
    else ref='other';
  }catch(e){ ref='other'; }
  if(ref==='') ref='other';

  var dev = (window.matchMedia && matchMedia('(pointer:coarse)').matches) ? 'phone' : 'desktop';
  var taps=[], sent=false, maxScroll=0;

  function tap(name){ if(name && taps.indexOf(name)<0 && taps.length<24) taps.push(name); }

  /* which control was it: named by what it does, never by who pressed it */
  function nameOf(el){
    var a=el.closest && el.closest('a,button,summary'); if(!a) return '';
    var href=(a.getAttribute('href')||'').toLowerCase();
    if(href.indexOf('sms:')===0) return 'text';
    if(href.indexOf('tel:')===0) return 'call';
    if(href.indexOf('mailto:')===0) return 'email';
    if(/ig\.me\/m\//.test(href)) return 'instagram';   /* a message to him on Instagram (24 Sept 2026), from the listing's steps or the contact rows */
    if(a.classList.contains('bunny')) return 'listing';
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
    if(/updates\.html/.test(href)) return 'news';
    if(/litters\.html/.test(href)) return 'litters';
    if(/terms\.html/.test(href)) return 'terms';
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
  function send(){
    if(sent) return; sent=true;
    var body=JSON.stringify({p:page, d:dev, ref:ref, s:bucket(maxScroll), ev:taps});
    try{
      if(navigator.sendBeacon){ navigator.sendBeacon('/api/hit', new Blob([body],{type:'text/plain'})); return; }
    }catch(e){}
    try{ fetch('/api/hit',{method:'POST',body:body,keepalive:true,headers:{'Content-Type':'text/plain'}}); }catch(e){}
  }
  document.addEventListener('visibilitychange',function(){ if(document.visibilityState==='hidden') send(); });
  window.addEventListener('pagehide',send);
  /* back from the bfcache is a new visit */
  window.addEventListener('pageshow',function(e){ if(e.persisted){ sent=false; taps=[]; maxScroll=0; measure(); } });
})();
