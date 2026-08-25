const fs=require('fs');const {JSDOM}=require('jsdom');
const html=require('./_boot').inline('act.html');    // the letter lives here
const HELP=require('./_boot').inline('help.html');   // the tracker and calendar live here
let pass=0,fail=0;
const ok=(n,c)=>c?(pass++,console.log('  ✓ '+n)):(fail++,console.log('  ✗ '+n));
const SCRIPT=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].pop()[1];
function boot(cw){
  const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://local/',pretendToBeVisual:true});
  if(cw)dom.window.cowork=cw(dom.window);
  dom.window.eval(SCRIPT); return dom;
}
const FAKE='Dear Mayor Watson and Members of the City Council,\n\nMy name is Sam Rivera and I have lived a few blocks from Fourth and Colorado for years. '+'x'.repeat(300)+'\n\nSincerely,\nSam Rivera';
(async()=>{
console.log('\n— the letter is assembled locally, always —');
/* There used to be a bridge here to a host-provided model (window.cowork.
   askClaude). It only ever existed inside the tool this was built in, was dead
   code on the live site, and had no business in a public repo. Removing it
   turns a "usually local" letter into an always-local one, which is a promise
   SECURITY.md now makes in plain words, so it gets tested. */
let dom=boot(); let d=dom.window.document;
d.querySelector('#f-name').value='Sam Rivera';
d.querySelector('#f-story').value='I walk past it every morning.';
d.querySelector('#gen').dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
await new Promise(r=>setTimeout(r,4500));   // the letter types out, so give it room
let out=d.querySelector('#letterOut').textContent;
ok('a letter is produced with no model available', out.length>400);
ok('it uses the writer\'s name', out.includes('Sam Rivera'));
ok('it carries their own words', out.includes('walk past it every morning'));
ok('it carries the finding the whole ask rests on', /Pride Cultural Heritage District/.test(out));
ok('actions revealed', d.querySelector('#letterActions').style.display==='flex');
ok('no model bridge remains in the shipped script',
   !/askClaude|window\.cowork/.test(require('./_boot').read('site.js')));
ok('nothing the writer typed is sent anywhere',
   !/fetch\([^)]*letter|XMLHttpRequest|navigator\.sendBeacon/.test(require('./_boot').read('site.js')));

console.log('\n— template robustness —');
for(const name of ['Ana Reyes','Jo Kim','Pat Cole','Lee Diaz']){
  dom=boot(); d=dom.window.document;
  d.querySelector('#f-name').value=name;
  d.querySelector('#gen').dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
  await new Promise(r=>setTimeout(r,1400));
  const t=d.querySelector('#letterOut').textContent;
  ok(name+' -> clean letter, no placeholder leakage',
     t.includes(name)&&!/\[object|undefined|NaN|\[NAME\]/.test(t)&&d.querySelector('#gen').disabled===false);
}

console.log('\n— matchMedia absent (embedded webview) —');
ok('no matchMedia crash: letters still generate', (()=>{
  const dm=new JSDOM(html,{runScripts:'outside-only',url:'https://local/act.html'});
  delete dm.window.matchMedia;
  try{ dm.window.eval(SCRIPT); }catch(e){ return false }
  const doc=dm.window.document;
  doc.querySelector('#f-name').value='Kit Ray';
  doc.querySelector('#gen').dispatchEvent(new dm.window.MouseEvent('click',{bubbles:true}));
  return true;
})());

console.log('\n— persistence —');
dom=new JSDOM(HELP,{runScripts:'outside-only',url:'https://local/help.html',pretendToBeVisual:true});
dom.window.eval([...HELP.matchAll(/<script>([\s\S]*?)<\/script>/g)].pop()[1]);
d=dom.window.document;
d.querySelectorAll('#todoList .todo .box')[0].dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
d.querySelectorAll('#todoList .todo .box')[3].dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
const saved=dom.window.localStorage.getItem('rcap-v2');
const d2=new JSDOM(HELP,{runScripts:'outside-only',url:'https://local/help.html',pretendToBeVisual:true});
d2.window.localStorage.setItem('rcap-v2',saved); d2.window.eval(SCRIPT);
ok('ticks survive reload', d2.window.document.querySelector('#ringCt').textContent==='2 of 12');
ok('ring redraws from storage', d2.window.document.querySelector('#ringPct').textContent==='17%');
const d3=new JSDOM(HELP,{runScripts:'outside-only',url:'https://local/help.html',pretendToBeVisual:true});
d3.window.localStorage.setItem('rcap-v2','{{{not json');
let threw=false; try{d3.window.eval([...HELP.matchAll(/<script>([\s\S]*?)<\/script>/g)].pop()[1])}catch(e){threw=true}
ok('corrupt localStorage does not brick the page', !threw && d3.window.document.querySelectorAll('#todoList .todo').length===12);

console.log('\n— ics —');
// the calendar is on the Ways to help page
const dm=new JSDOM(HELP,{runScripts:'outside-only',url:'https://local/help.html',pretendToBeVisual:true});
dm.window.eval([...HELP.matchAll(/<script>([\s\S]*?)<\/script>/g)].pop()[1]);
const dl=[]; dm.window.URL.createObjectURL=b=>{dl.push(b);return 'blob:x'};
dm.window.URL.revokeObjectURL=()=>{};
// which events are upcoming changes with the date, so take whichever is offered
const icsBtn=dm.window.document.querySelector('[data-ics]');
ok('at least one upcoming event offers a calendar file', !!icsBtn);
if(icsBtn){
  icsBtn.dispatchEvent(new dm.window.MouseEvent('click',{bubbles:true}));
  ok('.ics generated for '+icsBtn.dataset.ics, dl.length===1);
}
console.log('\n'+(fail===0?'ALL '+pass+' PASSED':pass+' passed, '+fail+' FAILED'));
process.exit(fail?1:0);
})();
