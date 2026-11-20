/* /api/month (Round 233, 20 Nov 2026, Claude; Site Idea 205): the calendar file the front page's "Its first month" card opens.
   The plan (fmPlan) is the same bytes as the page's; the file (fmICS) follows RFC 5545. Stateless: no storage binding is used. */
/* GET /api/month?n=<name>&b=<born YYYY-MM-DD>&h=<came home YYYY-MM-DDTHH:MM, Arizona>&l=<en|es>: the file the card's button opens.
   Stateless: nothing is stored, logged or counted here; the request carries a rabbit's name and two dates, nothing about the person. */
export async function onRequestGet(context){
  const q = new URL(context.request.url).searchParams;
  const n = (q.get('n') || '').trim(), es = q.get('l') === 'es';
  if (!/^[\p{L}][\p{L}\p{M}'’ .-]{0,39}$/u.test(n)) return bad('name');
  const items = fmPlan({ name: n, dob: q.get('b') || '', home: q.get('h') || '', es });
  if (!items) return bad('date');
  const slug = n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'rabbit';
  return new Response(fmICS(items, es, slug, Date.now()), { status: 200, headers: {
    'content-type': 'text/calendar; charset=utf-8', 'content-disposition': 'attachment; filename="' + slug + '-first-month.ics"',
    'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
}
function bad(w){ return new Response('Not a calendar request (' + w + ').\n', { status: 400, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } }); }
/* (Round 233) THE FIRST MONTH'S PLAN (Site Idea 205): one function, the same bytes in the front page's script and in /api/month, so
   what the card shows is what the calendar file holds. o: {name, dob 'YYYY-MM-DD', home 'YYYY-MM-DDTHH:MM' (Arizona's clock: no
   daylight saving, UTC-7 all year), now (ms; default the clock), es}. Returns three entries, each "on" while it is still ahead, or
   null for a day or time that is not real. The words are the site's own: the guarantee (FAQ and terms), the vets (FAQ, "Which vet
   should I use?"), the food ("What comes home"), the number (contact). */
function fmPlan(o){
  var H=3600000, AZ=7*H, M15=900000;
  var m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(o&&o.home||''), b=/^(\d{4})-(\d{2})-(\d{2})$/.exec(o&&o.dob||'');
  if(!m||!b) return null;
  var home=Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5])+AZ, born=Date.UTC(+b[1],+b[2]-1,+b[3]);
  var hw=new Date(home-AZ), bw=new Date(born);
  if(isNaN(home)||isNaN(born)||hw.getUTCDate()!==+m[3]||hw.getUTCHours()!==+m[4]||bw.getUTCDate()!==+b[3]||born>home) return null;
  var es=!!o.es, name=String(o.name||''), now=(o.now==null?Date.now():+o.now), NB='\u00a0';
  var MON=es?['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DOW=es?['dom','lun','mar','mié','jue','vie','sáb']:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function w(t){ return new Date(t-AZ); }   /* a Date whose UTC fields read Arizona's clock */
  function hm(t){ var d=w(t), h=d.getUTCHours(), mi=d.getUTCMinutes(); return (h%12||12)+':'+(mi<10?'0':'')+mi+(es?NB+(h<12?'a.'+NB+'m.':'p.'+NB+'m.'):NB+(h<12?'AM':'PM')); }
  function dy(t){ var d=w(t); return DOW[d.getUTCDay()]+NB+d.getUTCDate()+NB+MON[d.getUTCMonth()]; }
  function la(t){ return (w(t).getUTCHours()%12||12)===1?'la ':'las '; }   /* Spanish: "la 1:00", "las 4:00" */
  function at(t,dd,h){ var d=w(t); return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()+dd,h,0)+AZ; }
  var up=Math.ceil(now/60000)*60000, SIGN='William, Arizona Rabbits: (520) 270-2827 · arizonarabbits.com'+(es?'/es':''), out=[];
  /* 1. the vet check: from the next morning at 9 (or now, if later) to the end of the 72 hours */
  var by=home+72*H, s1=Math.max(at(home,1,9),up);
  out.push({k:'vet', on:s1<by, day:by, start:s1, end:by, alarms:['PT0M','END-PT3H'],
    t:es?('Veterinario antes de '+la(by)+hm(by)):('Vet check by '+hm(by)),
    s:es?('El plazo de 72 horas de mi garantía se cierra el '+dy(by)+'.'):('The 72-hour window in my guarantee closes '+dy(by)+'.'),
    g:es?'veterinario':'vet check',
    sum:es?('Veterinario de '+name+', antes del '+dy(by)+' a '+la(by)+hm(by)):(name+'’s vet check, by '+dy(by)+' at '+hm(by)),
    desc:es?('El plazo de 72 horas de mi garantía: si una visita al veterinario dentro de las 72 horas después de llevarse su conejo muestra un problema que empezó conmigo, le devuelvo todo y recibo el conejo de vuelta.\n\nSanta Cruz Veterinary Clinic atiende conejos y tiene citas como a cuatro meses: 5408 S 12th Ave, (520) 889-9643. Si no tienen lugar para usted, el Arizona Exotic Animal Hospital, en Grant Road, pide que llame por cualquier cosa en los dos días siguientes: (520) 305-0055.\n\n'+SIGN)
            :('The 72-hour window in my guarantee: if a vet visit within 72 hours of taking your rabbit home shows a problem that started with me, I’ll refund everything and take the rabbit back.\n\nSanta Cruz Veterinary Clinic sees rabbits and is booked about four months out: 5408 S 12th Ave, (520) 889-9643. If they can’t fit you in, Arizona Exotic Animal Hospital on Grant Road asks you to call for anything within two days: (520) 305-0055.\n\n'+SIGN)});
  /* 2. the food: a week before the two weeks run out, at 9 (or the next 9 o'clock still ahead), so there is time to mix the new in */
  var gone=at(home,14,0), s2=at(home,7,9);
  if(s2<up){ s2=at(up,0,9); if(s2<up) s2=at(up,1,9); }
  out.push({k:'food', on:s2<gone, day:s2, start:s2, end:s2+M15, alarms:['PT0M'],
    t:es?('Comprar la comida de '+name):('Buy '+name+'’s food'),
    s:es?('Las dos semanas que le di se acaban el '+dy(gone)+'. ¿Va a cambiarla? Mezcle la nueva poco a poco.'):('The two weeks I sent run out on '+dy(gone)+'. Changing food? Mix the new in slowly.'),
    g:es?'comida':'food',
    sum:es?('Comprar la comida de '+name+': las dos semanas se acaban el '+dy(gone)):('Buy '+name+'’s food: the two weeks run out '+dy(gone)),
    desc:es?('Las dos semanas de su comida actual que le di se acaban el '+dy(gone)+'. Cambiarles la comida de golpe les cae mal al estómago: si la cambia, mezcle la nueva poco a poco.\n\n'+SIGN)
            :('The two weeks of its current food I sent run out on '+dy(gone)+'. Changing their food suddenly upsets their stomach, so if you change it, mix the new in slowly.\n\n'+SIGN)});
  /* 3. the birthday, every year, from the day it was born */
  var nw=w(now), today=Date.UTC(nw.getUTCFullYear(),nw.getUTCMonth(),nw.getUTCDate()), next=Date.UTC(nw.getUTCFullYear(),bw.getUTCMonth(),bw.getUTCDate());
  if(next<today) next=Date.UTC(nw.getUTCFullYear()+1,bw.getUTCMonth(),bw.getUTCDate());
  var bornTxt=bw.getUTCDate()+NB+MON[bw.getUTCMonth()]+NB+bw.getUTCFullYear();
  out.push({k:'bday', on:true, allDay:true, day:next+AZ, dob:b[1]+b[2]+b[3],
    t:es?('El cumpleaños de '+name):(name+'’s birthday'),
    s:es?('Cada año. Nació el '+bornTxt+'.'):('Every year. Born '+bornTxt+'.'),
    g:es?'cumpleaños':'birthday',
    sum:es?('Cumpleaños de '+name):(name+'’s birthday'),
    desc:es?('Nació el '+bornTxt+' en Arizona Rabbits, en Tucson.\n\n'+SIGN):('Born '+bornTxt+' at Arizona Rabbits in Tucson.\n\n'+SIGN)});
  return out;
}
/* (Round 233) the calendar file (RFC 5545): CRLF lines folded at 75 octets, text escaped, times in UTC, the birthday a yearly all-day
   event, each reminder with its alarms. Only the entries still ahead go in. */
function fmZ(t){ return new Date(t).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''); }
function fmTx(s){ return String(s).replace(/\\/g,'\\\\').replace(/;/g,'\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n'); }
function fmFold(line){ var out='', cur='', n=0;
  for (var i=0;i<line.length;){ var c=line.codePointAt(i), ch=String.fromCodePoint(c), b=c<0x80?1:c<0x800?2:c<0x10000?3:4;
    if(n+b>75){ out+=cur+'\r\n '; cur=''; n=1; } cur+=ch; n+=b; i+=ch.length; }
  return out+cur; }
function fmICS(items, es, slug, stamp){
  var L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Arizona Rabbits//First month//'+(es?'ES':'EN'),'CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Arizona Rabbits'];
  items.forEach(function(it){ if(!it.on) return;
    L.push('BEGIN:VEVENT','UID:'+slug+'-'+it.k+'-'+(it.allDay?it.dob:fmZ(it.start))+'@arizonarabbits.com','DTSTAMP:'+fmZ(stamp));
    if(it.allDay){ var d=new Date(Date.UTC(+it.dob.slice(0,4),+it.dob.slice(4,6)-1,+it.dob.slice(6,8)+1));
      L.push('DTSTART;VALUE=DATE:'+it.dob,'DTEND;VALUE=DATE:'+d.toISOString().slice(0,10).replace(/-/g,''),'RRULE:FREQ=YEARLY','TRANSP:TRANSPARENT'); }
    else L.push('DTSTART:'+fmZ(it.start),'DTEND:'+fmZ(it.end));
    L.push('SUMMARY:'+fmTx(it.sum),'DESCRIPTION:'+fmTx(it.desc));
    (it.alarms||[]).forEach(function(a){ L.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+fmTx(it.sum),(a.indexOf('END')===0?'TRIGGER;RELATED=END:'+a.slice(3):'TRIGGER:'+a),'END:VALARM'); });
    L.push('END:VEVENT'); });
  L.push('END:VCALENDAR');
  return L.map(fmFold).join('\r\n')+'\r\n'; }
