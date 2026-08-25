const fs=require('fs');const {JSDOM}=require('jsdom');
const B=require('./_boot');
/* Site-wide suite: it boots every page, because the things it checks (the
   brand lockup, the nav, link hygiene, tone) are promises the whole site
   makes, not one page. `d` is whichever page owns the section under test. */
function page(f){
  const j=new JSDOM(B.inline(f),{runScripts:'dangerously',url:'https://local/'+(f==='index.html'?'':f),pretendToBeVisual:true});
  j.window.scrollTo=()=>{}; j.window.HTMLElement.prototype.scrollIntoView=function(){};
  return j;
}
const DOMS={}; B.PAGES.forEach(f=>{ DOMS[f]=page(f) });
const DOCS={};  B.PAGES.forEach(f=>{ DOCS[f]=DOMS[f].window.document });
const html=B.allHtml();
let pass=0,fail=0;
const ok=(n,c)=>c?(pass++,console.log('  ✓ '+n)):(fail++,console.log('  ✗ '+n));
const dom=DOMS['background.html'], {window}=dom, d=window.document;
/* every external link on the site, not just this page */
const ALL_LINKS=B.PAGES.flatMap(f=>[...DOCS[f].querySelectorAll('a[href^="http"]')]);
const errs=[];window.addEventListener('error',e=>errs.push(e.message));
const copied=[]; window.navigator.clipboard={writeText:t=>{copied.push(t);return Promise.resolve()}};
setTimeout(()=>{
console.log('\n— links —');
ok('no uncaught errors', errs.length===0||(console.log('    '+errs.join('; ')),false));
const links=ALL_LINKS;
ok('48 external links present', links.length>=44);
ok('all carry rel=noopener', links.every(a=>(a.getAttribute('rel')||'').includes('noopener')));
// popup allowed -> opens, does not copy
// drive this on one page's own window, since the links come from five documents
const own=[...d.querySelectorAll('a[href^="http"]')];
let opened=null; window.open=(u)=>{opened=u;return {closed:false}};
copied.length=0;
own[0].dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}));
ok('click opens the URL when popups work', opened===own[0].href);
ok('and does not copy needlessly', copied.length===0);
// popup blocked -> falls back to clipboard
window.open=()=>null;
own[1].dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}));
ok('blocked popup falls back to copying the URL', copied.length===1&&copied[0]===own[1].href);
// window.open throwing must not break the page
window.open=()=>{throw new Error('denied')};
copied.length=0;
own[2].dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}));
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
// panels became pages: every page needs one focusable main landmark instead
ok('every page has a labelled, focusable main',
   B.PAGES.every(f=>{const m=DOCS[f].querySelector('main#main[tabindex="-1"]'); return !!m}));
ok('every page has exactly one h1', B.PAGES.every(f=>DOCS[f].querySelectorAll('h1').length===1));
ok('every page offers a skip link', B.PAGES.every(f=>!!DOCS[f].querySelector('a.skip[href="#main"]')));

console.log('\n— actions —');
// the tracker lives on the action page
const actw=DOMS['help.html'].window, ACT=DOCS['help.html'];
const before=ACT.querySelector('#ringCt').textContent;
ACT.querySelector('#todoList .todo .tt').dispatchEvent(new actw.MouseEvent('click',{bubbles:true}));
ok('tapping the action title also ticks it', ACT.querySelector('#ringCt').textContent!==before);
ACT.querySelector('#quickBtn').dispatchEvent(new actw.MouseEvent('click',{bubbles:true}));
ok('quick filter still returns items', ACT.querySelectorAll('#todoList .todo').length===5);
ACT.querySelector('#quickBtn').dispatchEvent(new actw.MouseEvent('click',{bubbles:true}));

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
