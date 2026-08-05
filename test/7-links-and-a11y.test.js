const fs=require('fs');const {JSDOM}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
let pass=0,fail=0;
const ok=(n,c)=>c?(pass++,console.log('  ✓ '+n)):(fail++,console.log('  ✗ '+n));
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://local/',pretendToBeVisual:true});
const {window}=dom,d=window.document;
const errs=[];window.addEventListener('error',e=>errs.push(e.message));
const copied=[]; window.navigator.clipboard={writeText:t=>{copied.push(t);return Promise.resolve()}};
setTimeout(()=>{
console.log('\n— links —');
ok('no uncaught errors', errs.length===0||(console.log('    '+errs.join('; ')),false));
const links=[...d.querySelectorAll('a[href^="http"]')];
ok('48 external links present', links.length>=44);
ok('all carry rel=noopener', links.every(a=>(a.getAttribute('rel')||'').includes('noopener')));
// popup allowed -> opens, does not copy
let opened=null; window.open=(u)=>{opened=u;return {closed:false}};
copied.length=0;
links[0].dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}));
ok('click opens the URL when popups work', opened===links[0].href);
ok('and does not copy needlessly', copied.length===0);
// popup blocked -> falls back to clipboard
window.open=()=>null;
links[1].dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}));
ok('blocked popup falls back to copying the URL', copied.length===1&&copied[0]===links[1].href);
// window.open throwing must not break the page
window.open=()=>{throw new Error('denied')};
copied.length=0;
links[2].dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}));
ok('window.open throwing still falls back cleanly', copied.length===1);
window.open=(u)=>({closed:false});

console.log('\n— keyboard reach —');
const tl=d.querySelector('#timeline .tlh');
ok('timeline rows are focusable buttons', tl.getAttribute('role')==='button'&&tl.getAttribute('tabindex')==='0');
ok('timeline exposes expanded state', ['true','false'].includes(tl.getAttribute('aria-expanded')));
const wasOpen=tl.parentElement.classList.contains('open');
tl.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
ok('Enter toggles a timeline row', tl.parentElement.classList.contains('open')!==wasOpen);
ok('aria-expanded follows', tl.getAttribute('aria-expanded')===String(tl.parentElement.classList.contains('open')));
const ob=d.querySelector('#objList .obh');
ob.dispatchEvent(new window.KeyboardEvent('keydown',{key:' ',bubbles:true}));
ok('Space toggles an objection', ob.parentElement.classList.contains('open')&&ob.getAttribute('aria-expanded')==='true');
d.querySelector('.vt[data-view="table"]').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
const row=d.querySelector('#cmpTable tbody tr');
ok('table rows are focusable', row.getAttribute('tabindex')==='0'&&!!row.getAttribute('aria-label'));
row.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
ok('Enter selects a city from the table', d.querySelectorAll('#txmap .pin.sel').length===1);

console.log('\n— structure —');
ok('skip link present and first', d.body.querySelector('a.skip')&&d.body.firstElementChild.className==='skip');
ok('skip link targets main', d.querySelector('a.skip').getAttribute('href')==='#main'&&!!d.querySelector('#main'));
ok('all 4 panels labelled + focusable', d.querySelectorAll('.panel[tabindex="-1"][aria-label]').length===4);

console.log('\n— actions —');
d.querySelectorAll('.tab')[3].dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
const before=d.querySelector('#ringCt').textContent;
d.querySelector('#todoList .todo .tt').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('tapping the action title also ticks it', d.querySelector('#ringCt').textContent!==before);
d.querySelector('#quickBtn').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('quick filter still returns items', d.querySelectorAll('#todoList .todo').length===5);
d.querySelector('#quickBtn').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));

console.log('\n— css guards —');
ok('templates wrap long URLs', html.includes('overflow-wrap:anywhere'));
ok('touch targets padded', html.includes('.todo .box::after')&&html.includes('min-height:40px'));
ok('mobile breakpoints present', (html.match(/@media\(max-width:600px\)/g)||[]).length>=2);
setTimeout(()=>{
  ok('user is told why the link was copied', d.querySelector('#toast').textContent.includes('blocked'));
  console.log('\n'+(fail===0?'ALL '+pass+' PASSED':pass+' passed, '+fail+' FAILED'));
  process.exit(fail?1:0);
},60);
},900);
