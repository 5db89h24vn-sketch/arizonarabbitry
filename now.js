/* now.js: what is true right now, on the pages that are written when the site is built (27 Nov 2026).

   A rabbit's own page (/rabbits/<name>, /conejos/<name>) and Which rabbit are written when the site is built.
   The front page reads rabbits.js as it opens, and rabbits.js is where a price changes by the clock (a launch
   hour, a holiday price) and where a reservation lands first. So the two could disagree: on 27 Nov 2026 six
   rabbits were $30 less on their listing than on their own page, and two reserved rabbits were still "for sale"
   on Which rabbit (the owner's list, row 315). He approved "One price everywhere" that morning (Site Ideas 219):
   "Every page reads the price and the status through the same rule the listing uses, timed prices included."

   This script is that rule for the built pages. It runs after /rabbits.js (both with defer), so it reads each
   record as the listing reads it, the clock already applied, and corrects what the page says:
     on a rabbit's own page   the state (Available, Reserved, Went home), the price, the struck price, the reason,
                              the main link, and the price and availability in the data search engines read;
     on Which rabbit          who is for sale in each kind, each price, the counts and the price ranges: in the
                              lists, in the table and in the answer under the three questions.
   The page as written stays the fallback: with no records, or for a rabbit this file does not know, nothing
   changes. A rabbit listed since the page was built is not added to Which rabbit here; that takes a build.
   Words are English or Spanish by the page's own language. */
(function(){
  'use strict';
  var D=document, R=(typeof RABBITS!=='undefined'&&Array.isArray(RABBITS))?RABBITS:null;
  if(!R) return;
  var ES=(D.documentElement.getAttribute('lang')||'').slice(0,2)==='es', NB=' ';
  function slug(r){ return (r&&r.addr)||String(r&&r.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''); }
  var BY={}; R.forEach(function(r){ if(r&&r.name) BY[slug(r)]=r; });

  /* the listing's own rules (index.html: todayISO, dealOver, priceOf, hasDeal), kept as they are there */
  function todayISO(){
    try{ var t=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Phoenix',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); if(/^\d{4}-\d{2}-\d{2}$/.test(t)) return t; }catch(e){}
    return new Date(Date.now()-7*3600000).toISOString().slice(0,10);   /* Arizona keeps one offset all year */
  }
  function dealOver(r){ var u=String(r.dealEnds||'').trim(); return !!u && todayISO()>=u; }
  function priceOf(r){ var was=+r.wasPrice||0, now=+r.price||0; return (dealOver(r)&&was>now)?was:now; }
  function hasDeal(r){ var was=+r.wasPrice||0, now=+r.price||0; return was>now && r.status==='available' && !dealOver(r); }

  var MON=ES?['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function day(iso){ var p=String(iso||'').split('-'); return p.length===3?((+p[2])+NB+MON[+p[1]-1]+NB+p[0]):''; }
  function span(cls,text){ var s=D.createElement('span'); s.className=cls; s.textContent=text; return s; }

  /* ---- a rabbit's own page ---- */
  function rabbitPage(){
    var m=/^\/(rabbits|conejos)\/([a-z0-9-]+?)(?:\.html)?\/?$/.exec(location.pathname); if(!m) return;
    var r=BY[m[2]]; if(!r) return;
    var st=D.querySelector('main p.state'), badge=st&&st.querySelector('.badge'); if(!st||!badge) return;
    var s=String(r.status||''), want=(s==='available')?'open':(s==='reserved')?'hold':(s==='adopted'||s==='kept')?'gone':'';
    if(!want) return;
    var had=/\bopen\b/.test(badge.className)?'open':/\bhold\b/.test(badge.className)?'hold':'gone';
    var go=D.querySelector('main a.go'), sub=D.querySelector('main p.go-sub'), chev='<i class="chev" aria-hidden="true"></i>';
    function esc(t){ return String(t).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
    if(want==='open'){
      var oldDeal=st.querySelector('.deal'), keepEs=(ES&&oldDeal&&had==='open')?oldDeal.textContent:'';
      var note=String(ES?(r.dealNoteEs||''):(r.dealNote||'')).trim().replace(/[.!]+$/,'');
      if(ES&&!note&&!r.dealNoteEs) note=keepEs;        /* a reason written at build time stays; one set by the clock brings its own Spanish */
      st.textContent='';
      st.appendChild(span('badge open',ES?'Disponible':'Available'));
      st.appendChild(span('price','$'+priceOf(r)));
      if(hasDeal(r)){ st.appendChild(span('was','$'+(+r.wasPrice))); if(note) st.appendChild(span('deal',note)); }
      if(had!=='open'&&go){
        go.setAttribute('href',(ES?'/es.html':'/')+'#r-'+m[2]);
        go.innerHTML=esc(ES?'Ver su anuncio para reservar':'See '+r.name+'’s listing to reserve or buy')+chev;
        if(sub) sub.textContent=ES?'Fotos y video, el pago en partes y la entrega gratis en'+NB+'Arizona.':'Photos and video, payment plans and free delivery in'+NB+'Arizona.';
      }
    } else if(want!==had||want==='hold'){
      var text=(want==='hold')?(ES?'Reservado':'Reserved')
              :(s==='kept')?(ES?'Se queda aquí':'Stays here')
              :(r.wentHome?(ES?'Se fue a casa el ':'Went home ')+day(r.wentHome):'');
      if(!text) return;
      st.textContent=''; st.appendChild(span('badge '+want,text));
      if(had==='open'&&go){
        go.setAttribute('href',(ES?'/es.html':'/')+'#available');
        go.innerHTML=esc(ES?'Ver los conejos disponibles':'See the rabbits available now')+chev;
        if(sub) sub.textContent=ES?'Su anuncio sigue en el sitio como'+NB+'registro.':r.name+'’s listing stays on the site as a'+NB+'record.';
      }
    }
    /* the same in the data search engines read */
    [].forEach.call(D.querySelectorAll('script[type="application/ld+json"]'),function(el){
      try{ var j=JSON.parse(el.textContent); if(!j||j['@type']!=='Product'||!j.offers) return;
        if(want==='open') j.offers.price=String(priceOf(r));
        j.offers.availability='https://schema.org/'+(want==='open'?'InStock':'SoldOut');
        el.textContent=JSON.stringify(j);
      }catch(e){}
    });
  }

  /* ---- Which rabbit ---- */
  function which(){
    var ready=D.getElementById('ready'), fit=D.getElementById('fit'); if(!ready||!fit) return;
    var K={};
    [].forEach.call(ready.querySelectorAll('section.kind'),function(sec){
      var kind=String(sec.id||'').replace(/^ready-/,''), prices=[], known=false;
      [].slice.call(sec.querySelectorAll('ul.rbs')).forEach(function(ul){
        [].slice.call(ul.querySelectorAll('a.rb')).forEach(function(a){
          var mm=/\/(?:rabbits|conejos)\/([a-z0-9-]+)/.exec(a.getAttribute('href')||''), r=mm&&BY[mm[1]];
          if(!r){ var t=/\$(\d+)/.exec(a.textContent||''); if(t) prices.push(+t[1]); return; }     /* not in the records: counted as written */
          known=true;
          if(r.status!=='available'){ var li=a.closest('li'); if(li&&li.parentNode) li.parentNode.removeChild(li); return; }
          var sm=a.querySelector('small'); if(sm) sm.textContent='$'+priceOf(r);
          prices.push(priceOf(r));
        });
        if(!ul.querySelector('li')){ var h=ul.previousElementSibling; if(h&&h.tagName==='H4'&&h.parentNode) h.parentNode.removeChild(h); if(ul.parentNode) ul.parentNode.removeChild(ul); }
      });
      if(known) K[kind]={n:prices.length, lo:prices.length?Math.min.apply(null,prices):0, hi:prices.length?Math.max.apply(null,prices):0};
    });
    function words(k){
      var v=K[k]; if(!v) return null;
      if(!v.n) return {count:'0', range:ES?'Ninguno':'None', both:ES?'Ninguno a la venta por ahora':'None for sale right now', none:true};
      var rng=(v.lo===v.hi)?('$'+v.lo):('$'+v.lo+(ES?' a':' to')+NB+'$'+v.hi);
      return {count:String(v.n), range:rng, both:v.n+(ES?' a la venta ahora, ':' for sale now, ')+rng};
    }
    function fill(root){
      [].forEach.call(root.querySelectorAll('[data-now]'),function(el){
        var w=words(el.getAttribute('data-kind')); if(!w) return;
        var what=el.getAttribute('data-now');
        el.textContent=(what==='count')?w.count:(what==='range')?w.range:w.both;
        if(what==='count'&&w.none){ var b=el.closest('a.btn'); if(b) b.hidden=true; }
      });
    }
    fill(D);
    var out=D.getElementById('fitAns');
    if(out) fit.addEventListener('change',function(){ fill(out); });   /* the page redraws its answer on a change; this runs after it */
  }

  try{ rabbitPage(); }catch(e){}
  try{ which(); }catch(e){}
})();
