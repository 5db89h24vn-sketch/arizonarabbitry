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
  /* Shared read-only rules for record-derived breed hubs (Site Idea 226). */
  window.ARNow=Object.freeze({priceOf:priceOf,hasDeal:hasDeal,slug:slug});

  var MON=ES?['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function day(iso){ var p=String(iso||'').split('-'); return p.length===3?((+p[2])+NB+MON[+p[1]-1]+NB+p[0]):''; }
  function span(cls,text){ var s=D.createElement('span'); s.className=cls; s.textContent=text; return s; }
  /* (27 Nov 2026, Site Ideas 220) A dated sale with a name says here what it says under the price on its listing:
     the name and the last day, the day before dealEnds ("Thanksgiving price, through Sunday 29 Nov"). The last
     three words of any reason stay together, so no word hangs alone on a second line. */
  var DAYN=ES?['domingo','lunes','martes','miércoles','jueves','viernes','sábado']:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      MESL=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  function saleWords(r){
    var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(r.dealEnds||'').trim()), nm=String(ES?(r.dealNameEs||''):(r.dealName||'')).trim();
    if(!m||!nm||r.dealStays||!hasDeal(r)) return '';
    var d=new Date(+m[1],+m[2]-1,+m[3]-1,12);
    return ES?(nm+', hasta el '+DAYN[d.getDay()]+' '+d.getDate()+' de '+MESL[d.getMonth()]):(nm+', through '+DAYN[d.getDay()]+' '+d.getDate()+' '+MON[d.getMonth()]);
  }
  function tie3(s){ return String(s).replace(/ (\S+) (\S+)$/,NB+'$1'+NB+'$2'); }

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
      var sale=saleWords(r); if(sale) note=sale;
      st.textContent='';
      st.appendChild(span('badge open',ES?'Disponible':'Available'));
      st.appendChild(span('price','$'+priceOf(r)));
      if(hasDeal(r)){ st.appendChild(span('was','$'+(+r.wasPrice))); if(note){ var dn=span('deal',tie3(note)); try{ dn.style.textWrap='balance'; }catch(e){} st.appendChild(dn); } }
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


  /* ---- (27 Nov 2026, Site Ideas 228 and 227, approved that morning) a rabbit's own page: its photos, the two buttons, and,
     for a rabbit that went home, who is still here. Written from the record when the page opens, like the state above. */
  var CSS='.thumbs{display:flex;gap:8px;margin:10px 0 0;overflow-x:auto;scrollbar-width:none}.thumbs::-webkit-scrollbar{display:none}'+
    '.thumb{position:relative;flex:none;width:64px;height:64px;padding:0;border:2px solid transparent;border-radius:10px;overflow:hidden;background:var(--paper-2);cursor:pointer}'+
    '.thumb img{display:block;width:100%;height:100%;object-fit:cover}.thumb.on{border-color:var(--brick)}'+
    '.thumb.clip i{position:absolute;inset:0;margin:auto;width:24px;height:24px;border-radius:50%;background:rgba(24,20,18,.72)}'+
    '.thumb.clip i::after{content:"";position:absolute;left:9px;top:6px;border-left:9px solid #fff;border-top:6px solid transparent;border-bottom:6px solid transparent}'+
    '.thumb:focus-visible{outline:2px solid var(--brick-dk);outline-offset:2px}'+
    '.photo video{display:block;width:100%;height:100%;object-fit:cover;background:#000}'+
    '.go2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:22px 0 0}.go2 .go{margin:0;font-size:16.5px;white-space:nowrap}.go2 .go.buy{background:var(--brick-tint);color:var(--brick-dk);box-shadow:none}'+
    '.go2.one{grid-template-columns:1fr}'+
    '.still{margin:22px 0 0}.still h2{text-wrap:balance;margin:0 0 10px;font-family:var(--serif);font-weight:500;font-size:22px;line-height:1.2}'+
    '.still ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}'+
    '.still a{display:flex;align-items:center;gap:10px;min-height:56px;padding:6px 10px 6px 6px;border:1px solid var(--line);border-radius:999px;background:var(--card);color:var(--ink);text-decoration:none}'+
    '.still img{flex:none;width:44px;height:44px;border-radius:50%;object-fit:cover;background:var(--paper-2)}.still b{display:block;font-size:15px;font-weight:600}.still small{display:block;font-size:13.5px;color:var(--ink-soft)}';
  function css(){ if(D.getElementById('nowCss')) return; var st=D.createElement('style'); st.id='nowCss'; st.textContent=CSS; D.head.appendChild(st); }
  function real(p){ return !!p&&!/coming-soon/.test(String(p)); }
  function abs(p){ return '/'+String(p).replace(/^\//,''); }
  function escA(t){ return String(t).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function pageExtras(){
    var m=/^\/(rabbits|conejos)\/([a-z0-9-]+?)(?:\.html)?\/?$/.exec(location.pathname); if(!m) return;
    var r=BY[m[2]]; if(!r) return; var main=D.querySelector('main'); if(!main) return; css();
    var HOME=ES?'/es.html':'/', a=slug(r);
    /* 228: the photos as small squares */
    var fig=main.querySelector('figure.photo'), shots=(r.photos||[]).filter(function(p){ return p&&(p.video?real(p.poster):real(p.src)); });
    if(fig&&shots.length>1&&!main.querySelector('.thumbs')){
      var orig=fig.innerHTML, row=D.createElement('div'); row.className='thumbs'; row.setAttribute('role','group'); row.setAttribute('aria-label',ES?'Fotos y video':'Photos and video');
      var k=0; shots.forEach(function(p,i){ var b=D.createElement('button'); b.type='button'; b.className='thumb'+(p.video?' clip':'')+(i===0?' on':'');
        if(!p.video) k++; b.setAttribute('aria-label',p.video?(ES?'Video':'Clip'):((ES?'Foto ':'Photo ')+k)); b.setAttribute('aria-pressed',i===0?'true':'false');
        b.innerHTML='<img src="'+escA(abs(p.video?p.poster:p.src))+'" alt="" loading="lazy" decoding="async" width="64" height="64">'+(p.video?'<i aria-hidden="true"></i>':'');
        b.addEventListener('click',function(){ [].forEach.call(row.children,function(x){ x.classList.toggle('on',x===b); x.setAttribute('aria-pressed',x===b?'true':'false'); });
          if(i===0){ fig.innerHTML=orig; return; }
          fig.innerHTML=p.video?('<video src="'+escA(abs(p.video))+'" poster="'+escA(abs(p.poster))+'" controls playsinline autoplay muted></video>')
                               :('<img src="'+escA(abs(p.src))+'" alt="'+escA(r.name)+'">'); });
        row.appendChild(b); });
      fig.insertAdjacentElement('afterend',row);
    }
    /* 228: the two buttons, and a row to the full listing */
    var opens=r.opensAt&&Date.parse(r.opensAt)>Date.now();
    var go=main.querySelector('a.go');
    if(r.status==='available'&&!opens&&go&&!main.querySelector('.go2')){
      var p=priceOf(r), box=D.createElement('div'), chev='<i class="chev" aria-hidden="true"></i>';
      box.className='go2'+(p<=50?' one':'');
      box.innerHTML=(p>50?'<a class="go" href="'+HOME+'#r-'+escA(a)+'~reserve">'+(ES?'Reservar':'Reserve')+' · $50</a>':'')+
                    '<a class="go buy" href="'+HOME+'#r-'+escA(a)+'~buy">'+(ES?'Comprar':'Buy')+' · $'+p+'</a>';
      go.parentNode.replaceChild(box,go);
      var rows=main.querySelector('ul.rows');
      if(rows){ var li=D.createElement('li'); li.innerHTML='<a href="'+HOME+'#r-'+escA(a)+'"><span><b>'+(ES?'El anuncio completo':'The full listing')+'</b><small>'+(ES?'Todas las fotos y el video, el historial de precios, los pagos':'Every photo and the clip, the price history, payment plans')+'</small></span>'+chev+'</a>'; rows.insertBefore(li,rows.firstChild); }
    }
    /* 227: who is still here */
    if(r.status==='adopted'&&!main.querySelector('.still')){
      var avail=R.filter(function(x){ return x&&x.status==='available'&&x!==r&&!(x.opensAt&&Date.parse(x.opensAt)>Date.now()); });
      var mates=avail.filter(function(x){ return x.dob&&x.dob===r.dob&&x.mother===r.mother; }), head;
      if(mates.length) head=ES?('Siguen aquí, de la camada de '+r.name):('Still here from '+r.name+'’s litter');
      else { var fam=/^Holland Lop/i.test(String(r.breed||''))?/^Holland Lop/i:/^Netherland Dwarf/i; mates=avail.filter(function(x){ return fam.test(String(x.breed||'')); }).slice(0,6); head=ES?('A la venta, como '+r.name):('For sale now, like '+r.name); }
      if(mates.length){ var sec=D.createElement('section'); sec.className='still';
        sec.innerHTML='<h2>'+escA(tie3(head))+'</h2><ul>'+mates.map(function(x){ var ph=real(x.photo)?'<img src="'+escA(abs(x.photo))+'" alt="" loading="lazy" width="44" height="44">':'';
          return '<li><a href="/'+(ES?'conejos':'rabbits')+'/'+escA(slug(x))+'">'+ph+'<span><b>'+escA(x.name)+'</b><small>$'+priceOf(x)+'</small></span></a></li>'; }).join('')+'</ul>';
        var st=main.querySelector('p.state'); if(st) st.insertAdjacentElement('afterend',sec); }
    }
  }
  try{ rabbitPage(); }catch(e){}
  try{ pageExtras(); }catch(e){}
  try{ which(); }catch(e){}
})();
