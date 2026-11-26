/* THE WAY BACK, ACROSS PAGES (26 Nov 2026).
   Owner, 26 Nov 2026, 5:36am: "I don't want [visitors] getting teleported to half of the website and then have to go through a
   bunch of menus just to get back ... there needs to be a little warning telling them where they're gonna go."
   One return control on every page. When a tap changes pages, the place left is remembered for this tab only (sessionStorage:
   nothing is sent anywhere and nothing outlives the tab), and the page arrived at shows the round return arrow with
   "Back to <where you were>", which goes back to exactly that place. The menus go where they say and leave no floating control;
   the header's own link still returns exactly. The home page draws its own controls (the listing's round arrow and the page's
   pill) from azTrail.here(); every other page gets its controls here. */
(function(){
  'use strict';
  if(window.azTrail) return;
  var D=document, H=D.documentElement, W=window, KEY='azTrail', RET='azReturn', LEFT='azLeft', MAXAGE=6*3600*1000;
  var ES=(H.lang||'').slice(0,2)==='es';
  var ICON='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 14 4.5 9.5 9 5"/><path d="M4.5 9.5h9.75a5.25 5.25 0 0 1 0 10.5H11"/></svg>';
  /* one name per page, the site's own words (English, Spanish) */
  var NAMES={'/':['the rabbits','los conejos'],'/litters':['Litters','Camadas'],'/updates':['News','Noticias'],'/terms':['the terms','las condiciones'],
             '/changes':['Site changes','Cambios en el sitio'],'/delivery':['Delivery','Entrega'],'/which-rabbit':['Which rabbit','Qué conejo']};
  function norm(p){ p=String(p||'/').replace(/\/index\.html$/,'/').replace(/\.html$/,''); if(p.length>1) p=p.replace(/\/+$/,''); return p||'/'; }
  function keyOf(p){ p=norm(p); return p==='/es'?'/':p.replace(/^\/es-/,'/'); }
  function read(){ try{ var a=JSON.parse(sessionStorage.getItem(KEY)||'[]'); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function write(a){ try{ if(a.length) sessionStorage.setItem(KEY,JSON.stringify(a.slice(-8))); else sessionStorage.removeItem(KEY); }catch(e){} }
  var CUR=norm(location.pathname), dirty=false, subs=[], backTimer=0;
  function tell(){ for(var i=0;i<subs.length;i++){ try{ subs[i](); }catch(e){} } try{ D.dispatchEvent(new CustomEvent('aztrail')); }catch(e){} }

  /* The stack, tidied for this page: hops that are over (expired, or leading somewhere this page is not) come off the top.
     A hop written by a tap on THIS page whose page change has not happened yet (p) is left where it is. */
  function settle(){
    var st=read(), now=Date.now(), n=st.length, i;
    for(i=st.length-1;i>=0;i--){ if(now-(st[i].t||0)>MAXAGE){ st.splice(0,i+1); break; } }
    while(st.length){ var t=st[st.length-1]; if(t.to===CUR||(t.p&&t.fp===CUR)) break; st.pop(); }
    if(st.length!==n) write(st);
    return st;
  }
  function idx(st){ var i=st.length-1; while(i>=0&&st[i].p&&st[i].fp===CUR) i--; return (i>=0&&st[i].to===CUR&&!st[i].p)?i:-1; }
  /* the hop that brought the visitor to this page, or null */
  function here(){ var st=settle(), i=idx(st); return i<0?null:st[i]; }
  function label(h){ if(!h) return ''; if(h.name) return h.name; var n=NAMES[h.key]; return n?n[ES?1:0]:(ES?'donde estaba':'where you were'); }
  function words(h){ return (ES?'Volver a ':'Back to ')+label(h); }

  function arrive(){
    var st=settle(), t=st[st.length-1];
    if(t&&t.p&&t.to===CUR){
      delete t.p;
      var ref='', same=false; try{ var r=new URL(D.referrer); same=(r.origin===location.origin); ref=norm(r.pathname); }catch(e){}
      var nav=(W.performance&&performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};
      t.d=(same&&ref===t.fp&&(nav.type||'navigate')==='navigate')?1:0;   /* the page left is the entry right behind this one */
      write(st);
    }
  }
  /* a step inside this page (an anchor, a listing): the entry right behind is no longer the page left */
  function mark(){ if(dirty) return; dirty=true; var st=settle(), i=idx(st); if(i>=0&&!st[i].x){ st[i].x=1; write(st); } }
  W.addEventListener('hashchange',mark); W.addEventListener('popstate',mark);

  function homeHref(){ return ES?'/es':'/'; }
  function back(){
    var st=settle(), i=idx(st), hop=i<0?null:st[i];
    st.length=i<0?st.length:i; if(i>=0) write(st);
    var ok=false; try{ ok=!!hop&&new URL(hop.from,location.href).origin===location.origin; }catch(e){}
    if(!ok){ location.href=homeHref(); return; }   /* nothing to go back to: the rabbits */
    try{ sessionStorage.setItem(RET,JSON.stringify({url:hop.from,y:hop.y||0,st:hop.st||null,ai:hop.ai||'',at:hop.at|0,t:Date.now()})); }catch(e){}
    if(hop.d&&!hop.x&&!dirty&&history.length>1){
      var was=CUR; try{ history.back(); }catch(e){ location.href=hop.from; return; }
      clearTimeout(backTimer);
      backTimer=setTimeout(function(){ if(D.visibilityState!=='hidden'&&norm(location.pathname)===was) location.href=hop.from; },1200);   /* the step back never came */
    } else location.href=hop.from;
  }
  W.addEventListener('pagehide',function(){ clearTimeout(backTimer); });
  function hide(){ var st=settle(), i=idx(st); if(i>=0){ st[i].h=1; write(st); } paint(); tell(); }

  /* back on the page left by a fresh load (not the browser's own kept copy): put the visitor where they were */
  function restore(persisted){
    var r=null, l=null; try{ r=JSON.parse(sessionStorage.getItem(RET)||'null'); sessionStorage.removeItem(RET); l=JSON.parse(sessionStorage.getItem(LEFT)||'null'); }catch(e){}
    if(persisted) return;
    if(r&&Date.now()-(r.t||0)>20000) r=null;
    if(!r&&l){   /* the browser's own Back, to a page it did not keep: the same care */
      var nav=(W.performance&&performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};
      if(nav.type==='back_forward'&&l.url===location.href&&Date.now()-(l.t||0)<MAXAGE) r=l;
    }
    if(!r) return;
    var a; try{ a=new URL(r.url,location.href); }catch(e){ return; }
    if(norm(a.pathname)!==CUR) return;
    /* (26 Nov 2026) THE SAME PLACE, NOT THE SAME FIGURE. A page that comes back by a fresh load is not laid out yet as it was left: its open
       answers are shut, its pictures unmeasured, and the browser's own slow scroll back is still under way, so one jump to the old scroll
       figure landed a screen or two off. The place is now the thing that was tapped (the nearest part of the page with a name) put back
       where it sat on the screen, and it is checked again as the page settles, until the reader touches the page themselves. */
    var y=r.y|0, done=false, mine=false, stop=function(){ mine=true; };
    var place=function(){
      var el=r.ai?D.getElementById(r.ai):null, want=null;
      if(el&&el.getClientRects().length) want=Math.round((W.scrollY||0)+el.getBoundingClientRect().top-(r.at|0));
      else if(y>0) want=y;
      if(want===null||want<0||Math.abs((W.scrollY||0)-want)<3) return;
      try{ W.scrollTo({top:want,left:0,behavior:'instant'}); }catch(e){ W.scrollTo(0,want); }
    };
    var go=function(){
      if(!done){ done=true;
        if(r.st&&typeof W.azTrailRestore==='function'){ try{ W.azTrailRestore(r.st,r); }catch(e){} }
        ['touchstart','wheel','keydown','mousedown'].forEach(function(k){ W.addEventListener(k,stop,{passive:true,capture:true,once:true}); });
        [360,900,1700].forEach(function(ms){ setTimeout(function(){ if(!mine) place(); },ms); });
      }
      place();
    };
    if(D.readyState==='complete') setTimeout(go,60); else W.addEventListener('load',function(){ setTimeout(go,80); });
  }

  function anchorOf(a){   /* the nearest named part of the page around the tap, and where it sat on the screen; none for a menu or a layer held over the page */
    var e=(a&&a.closest)?a.closest('[id]'):null, n;
    if(!e||e===D.body||e===H) return null;
    for(n=e;n&&n!==D.body;n=n.parentElement){ try{ if(/fixed|sticky/.test(getComputedStyle(n).position)) return null; }catch(x){ return null; } }
    return {ai:e.id, at:Math.round(e.getBoundingClientRect().top)};
  }
  /* a tap that changes pages: remember this place */
  function push(u,a){
    var st=settle(), info={}, to=norm(u.pathname);
    try{ if(typeof W.azTrailFrom==='function') info=W.azTrailFrom(a)||{}; }catch(e){}
    while(st.length&&st[st.length-1].p&&st[st.length-1].fp===CUR) st.pop();   /* an earlier tap here that went nowhere */
    var an=(info.state&&info.state.hash)?null:anchorOf(a);   /* a listing keeps its own place (azTrailRestore) */
    st.push({from:location.href, fp:CUR, to:to, th:u.hash||'', key:keyOf(location.pathname), name:info.name||'', y:Math.round(W.scrollY||0),
             st:info.state||null, ai:an?an.ai:'', at:an?an.at:0, t:Date.now(), p:1,
             m:(a&&a.closest&&a.closest('header,nav,footer,.mnav,.subnav,.topbar,.foot,.corner,#dock,#cornerSheet'))?1:0});
    write(st);
    try{ sessionStorage.setItem(LEFT,JSON.stringify({url:location.href,y:Math.round(W.scrollY||0),st:info.state||null,ai:an?an.ai:'',at:an?an.at:0,t:Date.now()})); }catch(e){}
  }
  function pageUrl(a){
    var u; try{ u=new URL(a.href,location.href); }catch(e){ return null; }
    if(u.origin!==location.origin||norm(u.pathname)===CUR) return null;
    if(/\.(?:pdf|mp4|mov|jpe?g|png|webp|avif|svg|ico|vtt|json|xml|txt|js|css)$/i.test(u.pathname)) return null;   /* a file, not a page */
    if(/^\/(?:r|api|admin|photos|videos|pedigrees|img)\//.test(u.pathname)) return null;
    return u;
  }
  W.addEventListener('click',function(ev){
    if(ev.defaultPrevented||ev.button||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey) return;
    var a=ev.target&&ev.target.closest&&ev.target.closest('a[href]'); if(!a) return;
    if((a.target&&a.target!=='_self')||a.hasAttribute('download')) return;
    if(a.hasAttribute('data-lang-switch')||a.hasAttribute('hreflang')) return;   /* the same page in the other language */
    if(a.hasAttribute('data-az-back')||(a.closest&&a.closest('.az-back,#backPill'))) return;   /* the way back itself */
    var u=pageUrl(a); if(u) push(u,a);
  },false);

  /* every page but the home page: the header's link and the pinned pill */
  var HOME=!!(D.getElementById('viewer')&&D.getElementById('backPill')), built=false, pill=null, pillGo=null, pillT=null, hb=null, hbT=null, hbHref='', hbSeen=true;
  function css(){
    var s=D.createElement('style'); s.id='az-trail-css';
    s.textContent=
'.az-ic{flex:none;display:inline-grid;place-items:center;width:34px;height:34px;box-sizing:border-box;border-radius:50%;border:1px solid var(--line,#E3DACC);background:var(--paper,#FBF8F3);color:var(--ink,#241F1D);box-shadow:0 1px 2px rgba(36,31,29,.1);transition:border-color .15s,color .15s,transform .12s ease-out}'+
'.az-ic svg{display:block;width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2.1;stroke-linecap:round;stroke-linejoin:round}'+
'a.back.az-hback{display:inline-flex;align-items:center;gap:10px;min-height:44px;color:var(--ink,#241F1D);font-weight:600;font-size:15px;line-height:1.2;text-decoration:none}'+
'a.back.az-hback:hover{text-decoration:none}'+
'@media(hover:hover){a.back.az-hback:hover .az-ic,.az-back-go:hover .az-ic{border-color:var(--brick,#A0522D);color:var(--brick,#A0522D)}}'+
'a.back.az-hback:active .az-ic,.az-back-go:active .az-ic{transform:scale(.94)}'+
'a.back.az-hback:focus-visible{outline:2px solid var(--brick-dk,#7C3E21);outline-offset:3px;border-radius:999px}'+
'.az-back{position:fixed;z-index:92;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));display:flex;align-items:center;height:50px;max-width:calc(100vw - 24px);box-sizing:border-box;border-radius:999px;color:var(--ink,#241F1D);background:var(--paper,#FBF8F3);border:1px solid var(--line,#E3DACC);box-shadow:0 0 0 .5px rgba(36,31,29,.1),0 8px 22px rgba(36,31,29,.18),0 1px 3px rgba(36,31,29,.1);opacity:0;transform:translateY(10px);transition:opacity .2s,transform .26s cubic-bezier(.2,.9,.25,1.1)}'+
'.az-back.on{opacity:1;transform:none}.az-back[hidden]{display:none}'+
'.az-back-go{display:flex;align-items:center;gap:10px;min-width:0;height:100%;padding:0 4px 0 7px;color:inherit;text-decoration:none;font-weight:600;font-size:15px;line-height:1.2}'+
'.az-back-t{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.az-back-x{flex:none;width:40px;height:40px;margin:0 4px 0 0;padding:0;border:0;border-radius:50%;background:none;color:var(--ink-soft,#57504A);font-size:19px;line-height:1;cursor:pointer}'+
'.az-back-go:focus-visible,.az-back-x:focus-visible{outline:2px solid var(--brick-dk,#7C3E21);outline-offset:-2px;border-radius:999px}'+
'@media(prefers-reduced-motion:reduce){.az-back{transition:opacity .2s linear;transform:none}}'+
'@media print{.az-back{display:none!important}}';
    (D.head||H).appendChild(s);
  }
  function build(){
    if(built||HOME) return; built=true; css();
    hb=D.querySelector('header a.back')||D.querySelector('a.back');
    if(hb){
      hbHref=hb.getAttribute('href')||homeHref();
      hb.innerHTML='<span class="az-ic" aria-hidden="true">'+ICON+'</span><span class="az-hb-t"></span>'; hb.classList.add('az-hback'); hbT=hb.querySelector('.az-hb-t');
      hb.addEventListener('click',function(ev){ if(ev.defaultPrevented||ev.button||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey) return; if(here()){ ev.preventDefault(); back(); } });
    }
    pill=D.createElement('div'); pill.className='az-back'; pill.id='azBack'; pill.hidden=true;
    pill.innerHTML='<a class="az-back-go" href="#" data-az-back><span class="az-ic" aria-hidden="true">'+ICON+'</span><span class="az-back-t"></span></a><button type="button" class="az-back-x" aria-label="'+(ES?'Ocultar':'Hide')+'">×</button>';
    D.body.appendChild(pill); pillGo=pill.querySelector('.az-back-go'); pillT=pill.querySelector('.az-back-t');
    pillGo.addEventListener('click',function(ev){ if(ev.button||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey) return; ev.preventDefault(); back(); });
    pill.querySelector('.az-back-x').addEventListener('click',function(){ hide(); });
    if(hb&&W.IntersectionObserver){ new IntersectionObserver(function(es){ hbSeen=es[es.length-1].isIntersecting; show(); },{threshold:0.6}).observe(hb); } else hbSeen=false;
  }
  function show(){
    if(!pill) return; var h=here(), on=!!(h&&!h.m&&!h.h&&!hbSeen);
    if(on){ if(pill.hidden){ pill.hidden=false; pill.classList.remove('on'); (W.requestAnimationFrame||setTimeout)(function(){ (W.requestAnimationFrame||setTimeout)(function(){ if(!pill.hidden) pill.classList.add('on'); }); }); } }
    else { pill.classList.remove('on'); pill.hidden=true; }
  }
  function paint(){
    if(HOME||!built) return;
    var h=here(), w=h?words(h):'';
    if(hb){ hbT.textContent=h?w:(ES?'Volver a los conejos':'Back to the rabbits'); hb.setAttribute('href',h?h.from:hbHref); if(h) hb.setAttribute('data-az-back',''); else hb.removeAttribute('data-az-back'); }
    if(pill){ pillT.textContent=w; pillGo.setAttribute('href',h?h.from:'#'); show(); }
  }

  /* ── EVERY TAP SAYS WHERE IT GOES (26 Nov 2026, the second release of the same request). The owner, 26 Nov 2026, 5:36am: "there needs
     to be a little warning telling them where they're gonna go. Just make sure it's when it needs to be". So a link that opens ANOTHER
     PAGE of this site carries one small mark, the way-back arrow turned to face forward, and names the page in words wherever the link's
     own words do not already name it and it ends its sentence or stands alone. A link that opens something right here keeps its plain
     chevron: the home page says which ones through azStaysHere(a). Menus, footers and the language switch are lists of pages already
     and are left alone; a link out to another site keeps its own corner arrow (data-leaves). Nothing here asks a question before a
     tap: a dialog on every link is read less each time it appears (Nielsen Norman Group, "Confirmation Dialogs", 2018). ── */
  var PAGES={'/litters':['Litters page','página de camadas'],'/updates':['News page','página de noticias'],'/terms':['Terms page','página de condiciones'],
             '/changes':['Site changes page','página de cambios'],'/delivery':['Delivery page','página de entrega'],'/which-rabbit':['Which rabbit page','página Qué conejo']};
  var SAID={'/litters':/\blitters\b|\bcamadas\b/i,'/updates':/\bnews\b|\bnoticias\b/i,'/terms':/\bterms\b|\bcondiciones\b/i,'/changes':/site changes|cambios en el sitio/i,
            '/delivery':/delivery page|página de entrega/i,'/which-rabbit':/which rabbit|qué conejo/i};
  var GOSEL='a.litterlink,a.chip,a.stamp-link,a.stage-lit,a.lsh-end,a.litrow-main,a.corner-page,.doors a,.faq-more a,.privacy a';
  var goT=0, goObs=null;
  function goCss(){
    if(D.getElementById('az-go-css')) return;
    var M="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M15 14l4.5-4.5L15 5'/%3E%3Cpath d='M19.5 9.5H9.75a5.25 5.25 0 0 0 0 10.5H13'/%3E%3C/svg%3E\")";
    var s=D.createElement('style'); s.id='az-go-css';
    s.textContent=
'a[data-goes] .az-kw{white-space:nowrap}'+
'a[data-goes] .az-kw::after{content:"";display:inline-block;width:.9em;height:.9em;margin-left:.3em;vertical-align:-.1em;background:currentColor;opacity:.8;-webkit-mask:'+M+' center/contain no-repeat;mask:'+M+' center/contain no-repeat}'+
'a[data-goes] .chev.az-gochev{width:15px!important;height:15px!important;border:0!important;border-radius:0!important;transform:none!important;background:currentColor;opacity:.72;-webkit-mask:'+M+' center/contain no-repeat;mask:'+M+' center/contain no-repeat}'+
'a[data-goes] .az-to{margin-left:.42em;font-size:.86em;font-weight:500;letter-spacing:.005em;color:var(--ink-soft,#57504A);white-space:nowrap}'+
'a.chip[data-goes] .az-to{margin-left:0}'+
'.az-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}'+
'@media print{a[data-goes] .az-kw::after,a[data-goes] .az-to{display:none}}';
    (D.head||H).appendChild(s);
  }
  function goOwn(n){ return n.nodeType===1&&typeof n.className==='string'&&/(?:^|\s)(?:az-to|az-sr|sr-only)(?:\s|$)/.test(n.className); }
  function goText(n){ var t='', c=n.firstChild; for(;c;c=c.nextSibling){ if(c.nodeType===3) t+=c.nodeValue; else if(c.nodeType===1&&!goOwn(c)) t+=goText(c); } return t; }
  function goLast(n){ var c=n.lastChild, r; for(;c;c=c.previousSibling){ if(c.nodeType===3){ if(/\S/.test(c.nodeValue)) return c; } else if(c.nodeType===1&&!goOwn(c)&&typeof c.className==='string'){ r=goLast(c); if(r) return r; } } return null; }
  function goWrap(a){   /* the mark rides on the last word, so it can never start a line alone (the same hold the outside arrow has, .kw) */
    var t=goLast(a); if(!t) return false;
    if(t.parentNode.className==='az-kw') return true;
    var m=/^([\s\S]*\s)?(\S+)(\s*)$/.exec(t.nodeValue); if(!m) return false;
    var k=D.createElement('span'), p=t.parentNode; k.className='az-kw'; k.textContent=m[2];
    t.nodeValue=m[1]||''; p.insertBefore(k,t.nextSibling); if(m[3]) p.insertBefore(D.createTextNode(m[3]),k.nextSibling);
    return true;
  }
  function goStrip(a){
    var l=a.querySelectorAll('.az-kw'), i, k, p;
    for(i=0;i<l.length;i++){ k=l[i]; p=k.parentNode; p.replaceChild(D.createTextNode(k.textContent),k); if(p.normalize) p.normalize(); }
    l=a.querySelectorAll('.az-to,.az-sr'); for(i=0;i<l.length;i++) l[i].parentNode.removeChild(l[i]);
    l=a.querySelectorAll('.az-gochev'); for(i=0;i<l.length;i++) l[i].classList.remove('az-gochev');
    a.removeAttribute('data-goes');
  }
  function goMid(a){   /* words only where the link ends its sentence or stands alone; inside a sentence the mark alone */
    var n=a.nextSibling; while(n&&n.nodeType===3&&!/\S/.test(n.nodeValue)) n=n.nextSibling;
    if(!n) return false; if(n.nodeType!==3) return /^(?:A|B|I|EM|STRONG|SPAN|SMALL|TIME|ABBR|CITE)$/.test(n.tagName);   /* a row with a block under it stands alone */
    return !/^\s*[.!?…]/.test(n.nodeValue);
  }
  function goTwin(a,key){   /* a second link to the same page in the same sentence does not say the page twice */
    var c=a.parentNode&&a.parentNode.firstChild, u;
    for(;c&&c!==a;c=c.nextSibling){ if(c.nodeType===1&&c.tagName==='A'){ u=pageUrl(c); if(u&&keyOf(u.pathname)===key) return true; } }
    return false;
  }
  function goOne(a){
    var u=null, stay=false, as=a.getAttribute('data-goes-as')||'';
    if(as!=='off'&&!a.hasAttribute('data-lang-switch')&&!a.hasAttribute('hreflang')&&!(a.target&&a.target!=='_self')&&!a.hasAttribute('data-az-back')) u=pageUrl(a);
    if(u){ try{ stay=typeof W.azStaysHere==='function'&&!!W.azStaysHere(a); }catch(e){} }
    var key=(u&&!stay)?keyOf(u.pathname):'', nm=key?PAGES[key]:null;
    if(!nm){ if(a.hasAttribute('data-goes')) goStrip(a); return; }
    var page=nm[ES?1:0], chev=a.querySelector('.chev'), chip=typeof a.className==='string'&&/(?:^|\s)chip(?:\s|$)/.test(a.className), txt=goText(a);
    var said=/\bpage\b|página/i.test(txt)||SAID[key].test(txt);
    var words=!said&&as!=='mark'&&(chev?(chip&&!a.closest('.vbornline')):(!goMid(a)&&!goTwin(a,key)));
    var sig=key+(chev?'|c':'|t')+(words?'|w':'');
    if(a.getAttribute('data-goes')===sig&&(chev?/(?:^|\s)az-gochev(?:\s|$)/.test(chev.className):!!a.querySelector('.az-kw'))&&(!words||a.querySelector('.az-to'))) return;
    goStrip(a);
    var x=D.createElement('span'), lab=a.getAttribute('aria-label');
    if(chev){
      chev.classList.add('az-gochev');
      if(words){ x.className='az-to'; x.textContent=page; chev.parentNode.insertBefore(x,chev); }
      else if(!lab){ x.className='az-sr'; x.textContent=(ES?' (abre la ':' (opens the ')+page+')'; a.appendChild(x); }
    } else {
      if(!goWrap(a)) return;
      if(words){ x.className='az-to'; x.innerHTML='<span class="az-sr">'+(ES?', abre la ':', opens the ')+'</span>'; x.appendChild(D.createTextNode(page)); }
      else { x.className='az-sr'; x.textContent=(ES?' (abre la ':' (opens the ')+page+')'; }
      var k=a.querySelector('.az-kw'), at=k;   /* the words sit right after the marked word, on its line; a date or a bold keeps only its own words */
      while(at.parentNode!==a&&/^(?:TIME|B|STRONG|EM|I)$/.test(at.parentNode.tagName)) at=at.parentNode;
      at.parentNode.insertBefore(x,at.nextSibling);
    }
    a.setAttribute('data-goes',sig);
  }
  function goAll(){ var l, i; goT=0; if(!HOME) return; try{ l=D.querySelectorAll(GOSEL); }catch(e){ return; } for(i=0;i<l.length;i++){ try{ goOne(l[i]); }catch(e){} } }
  function goSoon(){ if(!goT) goT=setTimeout(goAll,90); }
  function goInit(){
    if(goObs||!HOME||!D.body) return;
    goCss(); goAll(); goObs=true;
    if(!W.MutationObserver) return;
    goObs=new MutationObserver(function(rs){
      for(var i=0;i<rs.length;i++){ var r=rs[i], t=r.target, n, j;
        if(t&&t.nodeType===1&&t.closest&&t.closest('a[href]')){ goSoon(); return; }
        for(j=0;j<r.addedNodes.length;j++){ n=r.addedNodes[j]; if(n.nodeType===1&&(n.tagName==='A'||(n.querySelector&&n.querySelector('a[href]')))){ goSoon(); return; } }
      }
    });
    goObs.observe(D.body,{childList:true,subtree:true});
  }

  W.azTrail={ here:here, label:label, words:words, back:back, hide:hide, icon:ICON, cue:goAll,
    leave:function(t){ var a=(t&&t.href!==undefined)?t:null, u=null; if(a) u=pageUrl(a); else { try{ u=new URL(String(t),location.href); if(u.origin!==location.origin||norm(u.pathname)===CUR) u=null; }catch(e){ u=null; } } if(u) push(u,a); },
    on:function(fn){ if(typeof fn==='function') subs.push(fn); } };

  /* THE LANDING GLOW, ON EVERY PAGE BUT THE HOME PAGE (26 Nov 2026).
     Owner, 26 Nov 2026, 11:45am: "whatever they are supposed to look at it automatically is highlighted and then disappears once they get
     the idea ... give the entire website a breath of fresh air with this method and have it be consistent and cohesive throughout".
     The home page lights its own landings (index.html: landOn, vLandOn, .land-glow). This is the same glow for the other pages: a page
     opened at a place (terms at its privacy part, the news at the availability log) or a link along the page lights the heading it
     landed on, once the page has come to rest, and lets it fade (2.5 s). A whole view opened by its address (one litter's card, the
     list of litters) is not a place within a page and lights nothing. Less motion asked for: the tint, with no rise or fade. */
  function glowInit(){
    if(D.getElementById('viewer')||D.getElementById('land-glow-css')) return;
    var st=D.createElement('style'); st.id='land-glow-css';
    st.textContent='.land-glow{animation:landglow 2.5s ease-in-out}.land-r{border-radius:10px}'+
      '@keyframes landglow{18%,56%{box-shadow:inset 0 0 0 999px color-mix(in srgb,var(--brick,#A0522D) 11%,transparent),0 0 0 5px color-mix(in srgb,var(--brick,#A0522D) 15%,transparent),0 0 24px 6px color-mix(in srgb,var(--brick,#A0522D) 16%,transparent)}}'+
      '@media (prefers-reduced-motion:reduce){.land-glow{animation:none;box-shadow:inset 0 0 0 999px color-mix(in srgb,var(--brick,#A0522D) 11%,transparent),0 0 0 5px color-mix(in srgb,var(--brick,#A0522D) 15%,transparent)}}';
    (D.head||H).appendChild(st);
    function still(cb){ var last=null, same=0, n=0; (function tick(){ var y=W.scrollY||0; if(y===last){ if(++same>=6){ cb(); return; } } else { same=0; last=y; } if(++n>120){ cb(); return; } W.requestAnimationFrame(tick); })(); }
    function glow(el){ var calm=W.matchMedia&&W.matchMedia('(prefers-reduced-motion: reduce)').matches; el.classList.remove('land-glow'); void el.offsetWidth;
      el.classList.toggle('land-r',(parseFloat(W.getComputedStyle(el).borderTopLeftRadius)||0)<2); el.classList.add('land-glow');
      W.clearTimeout(el.__lg); el.__lg=W.setTimeout(function(){ el.classList.remove('land-glow','land-r'); },calm?1800:2600); }
    function land(h){ var t=null; try{ t=D.getElementById(decodeURIComponent(String(h).slice(1))); }catch(e){}
      if(!t||(t.matches&&t.matches('.litter,.browse,main,body'))) return;
      still(function(){ var el=t.tagName==='DETAILS'?t.querySelector('summary'):(/^H[1-6]$/.test(t.tagName)?t:(t.querySelector('h1,h2,h3,h4,summary')||t));
        if(!el||!el.getClientRects().length) return; var r=el.getBoundingClientRect(); if(r.bottom<0||r.top>W.innerHeight||r.height>220) return; glow(el); }); }
    function ok(h){ return !!h&&h.length>1&&h!=='#top'&&h!=='#page-top'; }
    if(ok(location.hash)){ if(D.readyState==='complete') W.setTimeout(function(){ land(location.hash); },350); else W.addEventListener('load',function(){ W.setTimeout(function(){ land(location.hash); },350); }); }
    W.addEventListener('hashchange',function(){ if(ok(location.hash)) W.setTimeout(function(){ land(location.hash); },80); });
    D.addEventListener('click',function(ev){ if(ev.defaultPrevented||ev.button||ev.metaKey||ev.ctrlKey||ev.shiftKey||ev.altKey) return;
      var a=ev.target.closest&&ev.target.closest('a[href]'); if(!a) return; var u; try{ u=new URL(a.href,location.href); }catch(e){ return; }
      if(u.origin!==location.origin||norm(u.pathname)!==CUR||!ok(u.hash)||u.hash!==location.hash) return;   /* the same place tapped again: no hashchange comes */
      W.setTimeout(function(){ land(u.hash); },80); });
  }
  function init(persisted){ CUR=norm(location.pathname); arrive(); restore(persisted); build(); paint(); tell(); goInit(); if(!persisted) glowInit(); }
  if(D.readyState==='loading') D.addEventListener('DOMContentLoaded',function(){ init(false); }); else init(false);
  W.addEventListener('pageshow',function(e){ if(e&&e.persisted) init(true); });
})();
