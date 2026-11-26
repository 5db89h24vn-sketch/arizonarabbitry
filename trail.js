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
    try{ sessionStorage.setItem(RET,JSON.stringify({url:hop.from,y:hop.y||0,st:hop.st||null,t:Date.now()})); }catch(e){}
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
    var y=r.y|0, go=function(){
      if(r.st&&typeof W.azTrailRestore==='function'){ try{ W.azTrailRestore(r.st,r); }catch(e){} }
      if(y>0){ try{ W.scrollTo({top:y,left:0,behavior:'instant'}); }catch(e){ W.scrollTo(0,y); } }
    };
    if(D.readyState==='complete') setTimeout(go,60); else W.addEventListener('load',function(){ setTimeout(go,80); });
  }

  /* a tap that changes pages: remember this place */
  function push(u,a){
    var st=settle(), info={}, to=norm(u.pathname);
    try{ if(typeof W.azTrailFrom==='function') info=W.azTrailFrom(a)||{}; }catch(e){}
    while(st.length&&st[st.length-1].p&&st[st.length-1].fp===CUR) st.pop();   /* an earlier tap here that went nowhere */
    st.push({from:location.href, fp:CUR, to:to, th:u.hash||'', key:keyOf(location.pathname), name:info.name||'', y:Math.round(W.scrollY||0),
             st:info.state||null, t:Date.now(), p:1,
             m:(a&&a.closest&&a.closest('header,nav,footer,.mnav,.subnav,.topbar,.foot,.corner,#dock,#cornerSheet'))?1:0});
    write(st);
    try{ sessionStorage.setItem(LEFT,JSON.stringify({url:location.href,y:Math.round(W.scrollY||0),st:info.state||null,t:Date.now()})); }catch(e){}
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

  W.azTrail={ here:here, label:label, words:words, back:back, hide:hide, icon:ICON,
    leave:function(t){ var a=(t&&t.href!==undefined)?t:null, u=null; if(a) u=pageUrl(a); else { try{ u=new URL(String(t),location.href); if(u.origin!==location.origin||norm(u.pathname)===CUR) u=null; }catch(e){ u=null; } } if(u) push(u,a); },
    on:function(fn){ if(typeof fn==='function') subs.push(fn); } };

  function init(persisted){ CUR=norm(location.pathname); arrive(); restore(persisted); build(); paint(); tell(); }
  if(D.readyState==='loading') D.addEventListener('DOMContentLoaded',function(){ init(false); }); else init(false);
  W.addEventListener('pageshow',function(e){ if(e&&e.persisted) init(true); });
})();
