const fs=require('fs');const {JSDOM}=require('jsdom');
const B=require('./_boot');
/* The site is five pages sharing one script, so this suite boots three of them:
   the home page owns the hero, background owns the timeline and the map, and
   the action page owns the asks, the tracker and the letter builder. */
function page(f){
  const j=new JSDOM(B.inline(f),{runScripts:'dangerously',url:'https://local/'+(f==='index.html'?'':f),pretendToBeVisual:true});
  j.window.scrollTo=()=>{}; j.window.HTMLElement.prototype.scrollIntoView=function(){};
  return j;
}
let pass=0,fail=0;
const ok=(n,c)=>c?(pass++,console.log('  ✓ '+n)):(fail++,console.log('  ✗ '+n));

const home=page('index.html'), bg=page('background.html'), dom=page('act.html');
const HOME=home.window.document, BG=bg.window.document;
const {window}=dom,d=window.document;
const html=B.allHtml();
const errs=[];window.addEventListener('error',e=>errs.push(e.message));

setTimeout(()=>{
console.log('\n— structure —');
ok('no uncaught errors', errs.length===0||(console.log('    '+errs.join('; ')),false));
ok('no leftover zero-size rects', [...d.querySelectorAll('rect')].filter(r=>r.getAttribute('width')==='0'||r.getAttribute('height')==='0').length===0);
ok('no opacity:0 placeholder rects', [...d.querySelectorAll('rect[opacity="0"]')].length===0);

console.log('\n— compare slider —');
const r=HOME.querySelector('#cmpRange'),after=HOME.querySelector('#cmpAfter'),div=HOME.querySelector('#cmpDiv');
ok('range + after-layer + divider present', !!r&&!!after&&!!div);
r.value=25; r.dispatchEvent(new home.window.Event('input',{bubbles:true}));
ok('clip follows the handle', after.style.clipPath==='inset(0 0 0 25%)');
ok('divider follows the handle', div.style.left==='25%');
r.value=90; r.dispatchEvent(new home.window.Event('input',{bubbles:true}));
ok('updates again at 90%', after.style.clipPath==='inset(0 0 0 90%)');
ok('slider is keyboard reachable', r.tagName==='INPUT'&&r.type==='range');
ok('slider has an accessible label', !!r.getAttribute('aria-label'));
// the legal point: crosswalk bars identical in both layers
const svgs=HOME.querySelectorAll('.cmp-stage svg');
const bars=s=>[...s.querySelectorAll('rect')].filter(x=>x.getAttribute('fill')===null&&x.parentElement.getAttribute('fill')==='#efece0').map(x=>x.getAttribute('x')+','+x.getAttribute('y')).sort().join('|');
ok('crosswalk bars identical before & after', bars(svgs[0])===bars(svgs[1])&&bars(svgs[0]).length>0);
const sw=s=>[...s.querySelectorAll('rect')].filter(x=>(x.getAttribute('fill')||'').includes('url(#rb')).length;
ok('only the AFTER layer has rainbow sidewalks', sw(svgs[0])===0&&sw(svgs[1])===8);

console.log('\n— navigation —');
/* The tab strip used to sit a third of the way down the page. It is a real
   top nav across real pages now, so what matters is that every page carries
   the same one, that it says where you are, and that no tabs survive. */
const NAVS=B.PAGES.map(f=>{
  const j=new JSDOM(B.read(f),{url:'https://local/'});
  return {f, links:[...j.window.document.querySelectorAll('.mainnav a:not(.ghlink)')]};
});
ok('every page carries the nav', NAVS.every(n=>n.links.length===6));
ok('every page offers the same destinations',
   new Set(NAVS.map(n=>n.links.map(a=>a.getAttribute('href')).join('|'))).size===1);
ok('each page marks its own nav item current',
   NAVS.every(n=>n.links.filter(a=>a.getAttribute('aria-current')==='page').length===1));
ok('the nav is a landmark', NAVS.every(n=>n.links[0].closest('nav[aria-label]')));
ok('no tab machinery survives anywhere', !html.includes('role="tab"')&&!html.includes('class="tab"'));
ok('old deep links still resolve', /PAGE_FOR=\{/.test(B.read('site.js'))&&/location\.replace/.test(B.read('site.js')));

console.log('\n— timeline —');
ok('8 entries rendered from data', BG.querySelectorAll('#timeline .tli').length===8);
ok('key moments pre-expanded', BG.querySelectorAll('#timeline .tli.key.open').length===5);
const t0=BG.querySelector('#timeline .tli');
const was=t0.classList.contains('open');
t0.querySelector('.tlh').dispatchEvent(new bg.window.MouseEvent('click',{bubbles:true}));
ok('toggles on click', t0.classList.contains('open')!==was);

console.log('\n— map —');
const pins=[...BG.querySelectorAll('#txmap .pin')];
ok('5 pins', pins.length===5);
ok('pins are keyboard focusable', pins.every(p=>p.getAttribute('tabindex')==='0'));
ok('pins have aria-labels', pins.every(p=>!!p.getAttribute('aria-label')));
ok('San Antonio selected by default', BG.querySelector('#citycard').textContent.includes('San Antonio'));
pins.find(p=>p.dataset.id==='kerrville').dispatchEvent(new bg.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
ok('Enter key selects a pin', BG.querySelector('#citycard').textContent.includes('Kerrville'));
ok('exactly one selected', BG.querySelectorAll('#txmap .pin.sel').length===1);

console.log('\n— playbook —');
ok('8 asks on the action page', d.querySelectorAll('#askList .ask').length===8);
ok('5 objections on background', BG.querySelectorAll('#objList .obj').length===5);
// funding moved next to the asks it pays for, on the letter page
ok('4 funding routes sit with the letter', d.querySelectorAll('#fundList .ask').length===4);
ok('asks expose checkbox role', d.querySelector('#askList .ask').getAttribute('role')==='checkbox');
// #askBadge lived on the tab label and went with the tabs; the selbar is the
// only place the count needs to appear now.
ok('selbar shows the selected count', d.querySelector('#selCount').textContent.includes('4 asks'));
const a3=d.querySelectorAll('#askList .ask')[2];
a3.dispatchEvent(new window.KeyboardEvent('keydown',{key:' ',bubbles:true}));
ok('space toggles an ask', a3.classList.contains('on')&&a3.getAttribute('aria-checked')==='true');
ok('count updates live', d.querySelector('#selCount').textContent.includes('5 asks'));
ok('persisted', JSON.parse(window.localStorage.getItem('rcap-v2')).asks.furniture===true);
ok('selbar CTA points at the letter on this page', !!d.querySelector('#toWrite')&&!!d.querySelector('#letter'));

console.log('\n— tracker, on the Ways to help page —');
const help=page('help.html'), HELP=help.window.document;
ok('12 todos', HELP.querySelectorAll('#todoList .todo').length===12);
ok('ring at 0%', HELP.querySelector('#ringPct').textContent==='0%');
HELP.querySelector('#todoList .todo .box').dispatchEvent(new help.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
ok('keyboard ticks a todo -> 8%', HELP.querySelector('#ringPct').textContent==='8%');
ok('ring geometry matches r=43', Math.abs(parseFloat(HELP.querySelector('#ringFg').getAttribute('stroke-dasharray'))-2*Math.PI*43)<0.2);
HELP.querySelector('#resetTrack').dispatchEvent(new help.window.MouseEvent('click',{bubbles:true}));
ok('reset works', HELP.querySelector('#ringPct').textContent==='0%');
ok('the calendar came with it', HELP.querySelectorAll('#dateList .date').length>=8);

console.log('\n— letter —');
d.querySelector('#f-name').value='Sam Rivera';
d.querySelector('#f-addr').value='100 Example St, Austin TX 78701';
d.querySelector('#f-story').value='I walk past that corner every morning.';
ok('word count hidden initially', d.querySelector('#wordCount').style.display==='none');
d.querySelector('#gen').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
setTimeout(()=>{
  const out=d.querySelector('#letterOut').textContent;
  ok('fallback letter produced', out.length>400);
  ok('uses entered name', out.includes('Sam Rivera'));
  ok('includes personal story', out.includes('walk past that corner'));
  ok('cites San Antonio', out.includes('San Antonio'));
  ok('reflects selected asks', out.toLowerCase().includes('cultural heritage district'));
  ok('signs off correctly', out.trim().endsWith('100 Example St, Austin TX 78701'));
  ok('word count now shown', d.querySelector('#wordCount').style.display==='block'&&/\d+ words/.test(d.querySelector('#wordCount').textContent));
  console.log('\n'+(fail===0?'ALL '+pass+' PASSED':pass+' passed, '+fail+' FAILED'));
  process.exit(fail?1:0);
},6000);  // was 3200; failed roughly one run in twenty under load
},1600);  // was 700, same reason
