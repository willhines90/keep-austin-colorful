const fs=require('fs');const {JSDOM}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../public/index.html','utf8');
let pass=0,fail=0;
const ok=(n,c)=>c?(pass++,console.log('  ✓ '+n)):(fail++,console.log('  ✗ '+n));

const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://local/',pretendToBeVisual:true});
const {window}=dom,d=window.document;
const errs=[];window.addEventListener('error',e=>errs.push(e.message));

setTimeout(()=>{
console.log('\n— structure —');
ok('no uncaught errors', errs.length===0||(console.log('    '+errs.join('; ')),false));
ok('no leftover zero-size rects', [...d.querySelectorAll('rect')].filter(r=>r.getAttribute('width')==='0'||r.getAttribute('height')==='0').length===0);
ok('no opacity:0 placeholder rects', [...d.querySelectorAll('rect[opacity="0"]')].length===0);

console.log('\n— compare slider —');
const r=d.querySelector('#cmpRange'),after=d.querySelector('#cmpAfter'),div=d.querySelector('#cmpDiv');
ok('range + after-layer + divider present', !!r&&!!after&&!!div);
r.value=25; r.dispatchEvent(new window.Event('input',{bubbles:true}));
ok('clip follows the handle', after.style.clipPath==='inset(0 0 0 25%)');
ok('divider follows the handle', div.style.left==='25%');
r.value=90; r.dispatchEvent(new window.Event('input',{bubbles:true}));
ok('updates again at 90%', after.style.clipPath==='inset(0 0 0 90%)');
ok('slider is keyboard reachable', r.tagName==='INPUT'&&r.type==='range');
ok('slider has an accessible label', !!r.getAttribute('aria-label'));
// the legal point: crosswalk bars identical in both layers
const svgs=d.querySelectorAll('.cmp-stage svg');
const bars=s=>[...s.querySelectorAll('rect')].filter(x=>x.getAttribute('fill')===null&&x.parentElement.getAttribute('fill')==='#efece0').map(x=>x.getAttribute('x')+','+x.getAttribute('y')).sort().join('|');
ok('crosswalk bars identical before & after', bars(svgs[0])===bars(svgs[1])&&bars(svgs[0]).length>0);
const sw=s=>[...s.querySelectorAll('rect')].filter(x=>(x.getAttribute('fill')||'').includes('url(#rb')).length;
ok('only the AFTER layer has rainbow sidewalks', sw(svgs[0])===0&&sw(svgs[1])===8);

console.log('\n— tabs —');
const tabs=[...d.querySelectorAll('.tab')];
ok('4 tabs / 4 panels', tabs.length===4&&d.querySelectorAll('.panel').length===4);
ok('tabs wired to panels via aria-controls', tabs.every(t=>d.getElementById(t.getAttribute('aria-controls'))));
tabs[2].dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('click switches panel', d.querySelector('#p-write').classList.contains('on'));
tabs[0].dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
ok('arrow-key nav works', d.querySelector('#p-play').classList.contains('on'));
tabs[0].dispatchEvent(new window.KeyboardEvent('keydown',{key:'End',bubbles:true}));
ok('End jumps to last tab', d.querySelector('#p-act').classList.contains('on'));
tabs[0].dispatchEvent(new window.MouseEvent('click',{bubbles:true}));

console.log('\n— timeline —');
ok('8 entries rendered from data', d.querySelectorAll('#timeline .tli').length===8);
ok('key moments pre-expanded', d.querySelectorAll('#timeline .tli.key.open').length===5);
const t0=d.querySelector('#timeline .tli');
const was=t0.classList.contains('open');
t0.querySelector('.tlh').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('toggles on click', t0.classList.contains('open')!==was);

console.log('\n— map —');
const pins=[...d.querySelectorAll('#txmap .pin')];
ok('5 pins', pins.length===5);
ok('pins are keyboard focusable', pins.every(p=>p.getAttribute('tabindex')==='0'));
ok('pins have aria-labels', pins.every(p=>!!p.getAttribute('aria-label')));
ok('San Antonio selected by default', d.querySelector('#citycard').textContent.includes('San Antonio'));
pins.find(p=>p.dataset.id==='kerrville').dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
ok('Enter key selects a pin', d.querySelector('#citycard').textContent.includes('Kerrville'));
ok('exactly one selected', d.querySelectorAll('#txmap .pin.sel').length===1);

console.log('\n— playbook —');
ok('8 asks / 4 funds / 5 objections', d.querySelectorAll('#askList .ask').length===8&&d.querySelectorAll('#fundList .ask').length===4&&d.querySelectorAll('#objList .obj').length===5);
ok('asks expose checkbox role', d.querySelector('#askList .ask').getAttribute('role')==='checkbox');
ok('badge shows selected count', d.querySelector('#askBadge').textContent==='4');
ok('selbar mirrors the count', d.querySelector('#selCount').textContent.includes('4 asks'));
const a3=d.querySelectorAll('#askList .ask')[2];
a3.dispatchEvent(new window.KeyboardEvent('keydown',{key:' ',bubbles:true}));
ok('space toggles an ask', a3.classList.contains('on')&&a3.getAttribute('aria-checked')==='true');
ok('badge updates live', d.querySelector('#askBadge').textContent==='5');
ok('persisted', JSON.parse(window.localStorage.getItem('rcap-v2')).asks.furniture===true);
d.querySelector('#toWrite').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('selbar CTA jumps to Write', d.querySelector('#p-write').classList.contains('on'));

console.log('\n— tracker —');
d.querySelectorAll('.tab')[3].dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('8 todos', d.querySelectorAll('#todoList .todo').length===12);
ok('ring at 0%', d.querySelector('#ringPct').textContent==='0%');
d.querySelector('#todoList .todo .box').dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
ok('keyboard ticks a todo -> 13%', d.querySelector('#ringPct').textContent==='8%');
ok('ring geometry matches r=43', Math.abs(parseFloat(d.querySelector('#ringFg').getAttribute('stroke-dasharray'))-2*Math.PI*43)<0.2);
d.querySelector('#resetTrack').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('reset works', d.querySelector('#ringPct').textContent==='0%');

console.log('\n— letter —');
d.querySelectorAll('.tab')[2].dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
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
},3200);
},700);
