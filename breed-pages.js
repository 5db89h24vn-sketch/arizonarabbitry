/* Site Idea 226. The breed hubs read the current records, never a second catalog.
   Prices use now.js's same helper as the individual rabbit pages. Only changed
   lists are rebuilt; a clock tick does not replace the visitor's focused link. */
(function(){
  'use strict';
  var D=document, src=D.getElementById('breedData'), rules=window.ARNow;
  if(!src||!rules||typeof RABBITS==='undefined') return;
  var data; try{data=JSON.parse(src.textContent);}catch(e){return;}
  var es=(D.documentElement.lang||'').slice(0,2)==='es', words=data.words, previous='';
  function available(r){return r.status==='available'&&!r.reservedOn&&!r.wentHome&&!r.keptOn&&rules.priceOf(r)>0;}
  function locked(r){var t=Date.parse(r.opensAt||'');return Number.isFinite(t)&&t>Date.now();}
  function elem(tag,cls,text){var e=D.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
  function opening(r){
    return words.opens.replace('%s',new Intl.DateTimeFormat(es?'es-US':'en-US',{timeZone:'America/Phoenix',day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(r.opensAt)));
  }
  function card(r,future){
    var addr=rules.slug(r),ph=data.photos[addr],li=elem('li'),a=elem('a','rb'),pic=elem('picture'),copy=elem('span','breed-card-copy');
    li.setAttribute('data-breed-rabbit',addr);a.href='/'+(es?'conejos':'rabbits')+'/'+addr;
    var sizes='(min-width:700px) 220px, (max-width:350px) 140px, 46vw';
    if(ph.avif&&ph.avif.length){var source=elem('source');source.type='image/avif';source.srcset=ph.avif.join(', ');source.sizes=sizes;pic.appendChild(source);}
    var img=elem('img');img.src=ph.src;if(ph.jpg&&ph.jpg.length)img.srcset=ph.jpg.join(', ');img.sizes=sizes;img.width=1280;img.height=960;img.alt='';img.loading='lazy';img.decoding='async';pic.appendChild(img);
    copy.appendChild(elem('b','',r.name));copy.appendChild(elem('small','breed-price','$'+rules.priceOf(r)));
    copy.appendChild(elem('small','breed-kind',es&&/ cross$/.test(r.breed)?'Cruza de '+r.breed.slice(0,-6):r.breed));
    if(future)copy.appendChild(elem('span','breed-opening',opening(r)));
    a.appendChild(pic);a.appendChild(copy);li.appendChild(a);return li;
  }
  function paint(){
    var records=RABBITS.filter(function(r){return r&&(r.breed===data.breed||r.breed===data.breed+' cross')&&available(r)&&data.photos[rules.slug(r)];});
    var sig=JSON.stringify(records.map(function(r){return [rules.slug(r),r.name,r.breed,rules.priceOf(r),locked(r),r.opensAt];}));
    if(sig===previous)return;previous=sig;
    var focused=D.activeElement&&D.activeElement.closest('[data-breed-rabbit]'),focusedAddress=focused&&focused.getAttribute('data-breed-rabbit');
    [].forEach.call(D.querySelectorAll('[data-breed-kind]'),function(sec){
      var breed=sec.getAttribute('data-breed-kind'),rs=records.filter(function(r){return r.breed===breed;}),ready=rs.filter(function(r){return !locked(r);}),future=rs.filter(locked);
      sec.hidden=breed!==data.breed&&!rs.length;
      var prices=ready.map(rules.priceOf),summary=words.none;
      if(prices.length){var lo=Math.min.apply(null,prices),hi=Math.max.apply(null,prices);summary=words.count.replace('%d',ready.length)+' · $'+lo+(lo!==hi?words.to+'$'+hi:'');}
      sec.querySelector('[data-breed-summary]').textContent=summary;
      [[sec.querySelector('[data-breed-ready]'),ready,false],[sec.querySelector('[data-breed-future]'),future,true]].forEach(function(row){
        row[0].replaceChildren.apply(row[0],row[1].map(function(r){return card(r,row[2]);}));
      });
      sec.querySelector('[data-breed-upcoming]').hidden=!future.length;
    });
    if(focusedAddress){
      var target=D.querySelector('[data-breed-rabbit="'+focusedAddress+'"] a')||D.getElementById('available-h');
      if(target){if(target.tagName!=='A')target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
    }
  }
  paint();
  // Opening times and generic dated discounts update while the page stays open.
  // rabbits.js retains its own canonical launch/holiday boundary reloads.
  setInterval(paint,1000);window.addEventListener('pageshow',paint);
  D.addEventListener('visibilitychange',function(){if(!D.hidden)paint();});
})();
