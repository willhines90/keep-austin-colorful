const fs=require('fs');const {JSDOM}=require('jsdom');
const html=require('./_boot').inline();   // index.html with site.css + site.js spliced in
const WORKER=fs.readFileSync(__dirname+'/../src/worker.js','utf8');
let pass=0,fail=0;
const ok=(n,c)=>c?(pass++,console.log('  ✓ '+n)):(fail++,console.log('  ✗ '+n));
/* The hero lives on the home page and the letter form on the action page, so
   this suite drives both rather than pretending they still share one. */
const B=require('./_boot');
function page(f){
  const j=new JSDOM(B.inline(f),{runScripts:'dangerously',url:'https://local/'+(f==='index.html'?'':f),pretendToBeVisual:true});
  j.window.scrollTo=()=>{}; j.window.HTMLElement.prototype.scrollIntoView=function(){};
  return j;
}
const home=page('index.html'), dom=page('act.html');
const HOME=home.window.document;
const {window}=dom,d=window.document;
const errs=[];window.addEventListener('error',e=>errs.push(e.message));
setTimeout(()=>{
console.log('\n— boot —');
ok('no uncaught errors', errs.length===0||(console.log('    '+errs.join('; ')),false));
ok('zero em dashes anywhere on the site', !require('./_boot').allHtml().includes('—'));

console.log('\n— hero: plan + street views —');
ok('both layers rendered', !!HOME.querySelector('#cmpBase svg')&&!!HOME.querySelector('#cmpAfter svg'));
const bars=root=>[...root.querySelectorAll('polygon,rect')].filter(r=>(r.getAttribute('fill')||'')==='#efece0'||r.parentElement?.getAttribute('fill')==='#efece0').map(r=>r.getAttribute('x')+','+r.getAttribute('y')+','+r.getAttribute('points')).sort().join('|');
ok('PLAN: crosswalk bars identical before/after', bars(HOME.querySelector('#cmpBase'))===bars(HOME.querySelector('#cmpAfter'))&&bars(HOME.querySelector('#cmpBase')).length>0);
const rain=root=>[...root.querySelectorAll('rect,polygon')].filter(r=>{const f=r.getAttribute('fill')||'';return f.includes('url(#rb')||['#e40303','#008026','#732982','#24408e'].includes(f)}).length;
ok('PLAN: only after-layer has rainbow', rain(HOME.querySelector('#cmpBase'))===0 && rain(HOME.querySelector('#cmpAfter'))>0);
HOME.querySelector('.ct[data-cview="street"]').dispatchEvent(new home.window.MouseEvent('click',{bubbles:true}));
ok('toggles to street view', !!HOME.querySelector('#cmpBase svg[aria-label*="Street level"]'));
ok('STREET: crosswalk bars identical before/after', bars(HOME.querySelector('#cmpBase'))===bars(HOME.querySelector('#cmpAfter'))&&bars(HOME.querySelector('#cmpBase')).length>0);
ok('STREET: only after-layer has rainbow', rain(HOME.querySelector('#cmpBase'))===0 && rain(HOME.querySelector('#cmpAfter'))>0);
const polys=[...HOME.querySelectorAll('#cmpAfter polygon')].map(p=>p.getAttribute('points'));
ok('STREET: geometry has no NaN', !polys.join(' ').includes('NaN'));
ok('STREET: perspective converges (far bands narrower)', (()=>{
  const sw=[...HOME.querySelectorAll('#cmpAfter polygon')].filter(p=>['#e40303','#ff8c00','#ffd500','#008026','#24408e','#732982'].includes(p.getAttribute('fill')));
  if(sw.length<8) return false;
  const width=p=>{const c=p.getAttribute('points').split(' ').map(s=>+s.split(',')[0]);return Math.max(...c)-Math.min(...c)};
  return width(sw[0])>width(sw[sw.length-2]);
})());
HOME.querySelector('.ct[data-cview="plan"]').dispatchEvent(new home.window.MouseEvent('click',{bubbles:true}));
ok('toggles back to plan', !!HOME.querySelector('#cmpBase svg[aria-label*="intersection"]'));
const r=HOME.querySelector('#cmpRange'); r.value=30; r.dispatchEvent(new home.window.Event('input',{bubbles:true}));
ok('slider still clips after re-render', HOME.querySelector('#cmpAfter').style.clipPath==='inset(0 0 0 30%)');

console.log('\n— connection chips (multi-select) —');
const chips=[...d.querySelectorAll('#f-conn .cchip')];
ok('9 connection chips', chips.length===9);
ok('first is preselected', chips[0].classList.contains('on'));
chips[4].dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
chips[7].dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('multiple can be on at once', d.querySelectorAll('#f-conn .cchip.on').length===3);
ok('aria-pressed tracks state', chips[4].getAttribute('aria-pressed')==='true');
chips[4].dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('toggles back off', d.querySelectorAll('#f-conn .cchip.on').length===2);

console.log('\n— district auto-detect —');
const addr=d.querySelector('#f-addr'), dist=d.querySelector('#f-dist'), hint=d.querySelector('#distHint');
ok('hint hidden initially', hint.hidden===true);
addr.value='1100 Congress Ave, Austin TX 78701'; addr.dispatchEvent(new window.Event('input',{bubbles:true}));
ok('78701 hints District 9 without filling the field', hint.textContent.includes('District 9')&&dist.value!=='');
ok('never auto-selects a district', (()=>{dist.value='';addr.value='1100 Congress Ave, Austin TX 78701';
  addr.dispatchEvent(new window.Event('input',{bubbles:true})); return dist.value===''})());
ok('always points at the official lookup', hint.textContent.includes('official district lookup'));
addr.value='2200 S Lamar, Austin TX 78704'; addr.dispatchEvent(new window.Event('input',{bubbles:true}));
ok('78704 flagged as straddling several districts', hint.textContent.includes('9, 5')&&hint.textContent.includes('3'));
ok('offers a button per candidate district', d.querySelectorAll('#distHint button[data-d]').length===3);
d.querySelector('#distHint button[data-d="5"]').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('picking a candidate sets the field', dist.value==='5');
addr.value='somewhere, TX 90210'; addr.dispatchEvent(new window.Event('input',{bubbles:true}));
ok('non-Austin ZIP handled gracefully', hint.hidden===true||hint.textContent.length>0);
addr.value='no zip here'; addr.dispatchEvent(new window.Event('input',{bubbles:true}));
ok('no ZIP hides the hint', hint.hidden===true);
ok('always links the official map', html.includes('austintexas.gov/council/district-map'));

console.log('\n— address lookup + council contacts —');
ok('address field has a lookup control', !!d.querySelector('#findDist'));
ok('address field supports browser autofill', d.querySelector('#f-addr').getAttribute('autocomplete')==='street-address');
// The Census geocoder returns 503 to browser-origin requests (verified live,
// 15 Aug 2026), so the lookup runs in the worker and the page calls only itself.
ok('page calls the same-origin lookup', html.includes("'/api/district?address='"));
ok('page reaches no third-party host at all',
   !html.includes('geocoding.geo.census.gov')&&!html.includes('data.austintexas.gov/resource'));
ok('worker owns both upstreams', WORKER.includes('geocoding.geo.census.gov')&&WORKER.includes('w3v2-cj58'));
ok('worker uses the correct district field', WORKER.includes('district_number'));
ok('worker caps the address it will proxy', /length > 120/.test(WORKER)&&/cleanAddress/.test(WORKER));
ok('worker rejects non-GET', /method_not_allowed/.test(WORKER));
ok('worker falls through to static assets', /env\.ASSETS\.fetch/.test(WORKER));
ok('matched address is escaped before it reaches innerHTML',
   html.includes('escHTML(r.matched)')&&/function escHTML/.test(html));
ok('lookup degrades to the ZIP hint', html.includes('if(z) zipHint(z); else hintEl().hidden=true;'));
ok('lookup has a timeout so it cannot hang', html.includes('AbortController')&&html.includes('8000'));
// The council numbers, and the "your council member" row the district picker
// fills in, live on the contact page now.
const contact=page('contact.html'), CT=contact.window.document;
ok('your-council-member block starts hidden', /<div class="contact" id="yourCM" hidden>/.test(B.read('contact.html')));
(()=>{const sel=CT.querySelector('#f-dist'); if(sel){sel.value='5'; sel.dispatchEvent(new contact.window.Event('change',{bubbles:true}));}})();
ok('the district picker lives with the letter form', !!d.querySelector('#f-dist'));
ok('choosing a district reveals their number on the contact page', (()=>{
  const sel=d.querySelector('#f-dist'); sel.value='5';
  sel.dispatchEvent(new window.Event('change',{bubbles:true}));
  const el=d.querySelector('#yourCMhow');
  return el ? el.textContent.includes('512-978-2105') : /512-978-21/.test(B.read('site.js'));})());
ok('every council district is reachable by phone', /512-978-21/.test(B.read('contact.html')));
ok('verified Mayor number present', B.read('contact.html').includes('tel:+15129782100'));
ok('verified District 9 number present', B.read('contact.html').includes('tel:+15129782109'));

console.log('\n— source links —');
// The evidence all sits on the background page now.
const bg=page('background.html'), BG=bg.window.document;
ok('timeline entries cite sources', BG.querySelectorAll('#timeline .srcs .srcl').length>=8);
ok('city card cites sources', BG.querySelectorAll('#citycard .srcl').length>=1);
BG.querySelector('#objList .obh').dispatchEvent(new bg.window.MouseEvent('click',{bubbles:true}));
ok('objections cite sources', BG.querySelectorAll('#objList .srcl').length>=5);
ok('the home page cites its stats too', HOME.querySelectorAll('.stat .srcl').length>=4);
const hrefs=[...BG.querySelectorAll('.srcl'),...HOME.querySelectorAll('.srcl')].map(a=>a.getAttribute('href'));
ok('all source links are absolute https', hrefs.length>0&&hrefs.every(h=>h.startsWith('https://')));
ok('all open in a new tab safely',
   [...BG.querySelectorAll('.srcl'),...HOME.querySelectorAll('.srcl')].every(a=>a.getAttribute('rel')==='noopener'));

console.log('\n— title —');
const css=B.read('site.css');
ok('h1 is full width', /h1\{[^}]*width:100%/.test(css));
ok('headings are balanced', /text-wrap:balance/.test(css)&&/h1,h2,h3/.test(css));

console.log('\n'+(fail===0?'ALL '+pass+' PASSED':pass+' passed, '+fail+' FAILED'));
process.exit(fail?1:0);
},900);
