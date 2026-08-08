const fs=require('fs');const {JSDOM}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../public/index.html','utf8');
let pass=0,fail=0;
const ok=(n,c)=>c?(pass++,console.log('  ✓ '+n)):(fail++,console.log('  ✗ '+n));
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://local/',pretendToBeVisual:true});
const {window}=dom,d=window.document;
const copied=[]; window.navigator.clipboard={writeText:t=>{copied.push(t);return Promise.resolve()}};
setTimeout(()=>{
console.log('\n— action list —');
ok('12 actions in 3 categories', d.querySelectorAll('#todoList .todo').length===12 && d.querySelectorAll('.catrow').length===3);
ok('each shows time + impact', d.querySelectorAll('#todoList .tm').length===24);
ok('category counters render', [...d.querySelectorAll('.catn')].every(c=>/^\d+\/\d+$/.test(c.textContent)));
ok('8 copyable templates', d.querySelectorAll('#todoList [data-tpl]').length===8);
ok('2 jump-to-letter-builder buttons', d.querySelectorAll('#todoList [data-go]').length===2);
ok('templates hidden until asked', [...d.querySelectorAll('.tplbox')].every(p=>p.hidden));

console.log('\n— templates —');
const tb=d.querySelector('[data-tpl="t6"]');
tb.dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('clicking reveals the testimony', d.querySelector('#tp-t6').hidden===false);
ok('and copies it', copied.length===1 && copied[0].includes('Mayor, Council Members'));
ok('testimony is speakable length', copied[0].split(/\s+/).length>120 && copied[0].split(/\s+/).length<320);
ok('testimony carries the San Antonio numbers', /170,000/.test(copied[0]) && /Pride Cultural Heritage District/.test(copied[0]));
tb.dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('clicking again collapses', d.querySelector('#tp-t6').hidden===true);
d.querySelector('[data-tpl="t11"]').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('records request template intact', copied[copied.length-1].includes('Chapter 552'));
ok('no template contains an em dash', [...d.querySelectorAll('.tplbox')].every(p=>!p.textContent.includes('—')));

console.log('\n— jump + filter —');
d.querySelector('[data-go="write"]').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('jump button switches to the letter tab', d.querySelector('#p-write').classList.contains('on'));
d.querySelectorAll('.tab')[3].dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
d.querySelector('#quickBtn').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
const shown=[...d.querySelectorAll('#todoList .todo')].length;
ok('quick filter narrows the list', shown===5);
ok('filter button reflects state', d.querySelector('#quickBtn').classList.contains('on'));
d.querySelector('#quickBtn').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('filter clears', d.querySelectorAll('#todoList .todo').length===12);

console.log('\n— progress —');
ok('ring counts 12', d.querySelector('#ringCt').textContent==='0 of 12');
d.querySelector('#todoList .todo .box').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('ticking updates ring', d.querySelector('#ringCt').textContent==='1 of 12');
ok('category counter updates too', d.querySelector('.catn').textContent==='1/5');
ok('survives a filter toggle', (()=>{d.querySelector('#quickBtn').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
  const keep=d.querySelector('#ringCt').textContent==='1 of 12';
  d.querySelector('#quickBtn').dispatchEvent(new window.MouseEvent('click',{bubbles:true})); return keep})());

console.log('\n— dead code —');
ok('old standalone PIR section removed', !html.includes('copyPIR'));
ok('phone script section still present', html.includes('30-second phone script'));
console.log('\n'+(fail===0?'ALL '+pass+' PASSED':pass+' passed, '+fail+' FAILED'));
process.exit(fail?1:0);
},800);
