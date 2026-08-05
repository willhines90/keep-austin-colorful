const fs=require('fs');const {JSDOM}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
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
console.log('\n— live inference —');
let cap=null;
let dom=boot(()=>({askClaude:p=>{cap=p;return Promise.resolve(FAKE)}}));
let d=dom.window.document;
d.querySelector('#f-name').value='Sam Rivera';
d.querySelector('#f-story').value='I walk past it every morning.';
d.querySelector('#gen').dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
await new Promise(r=>setTimeout(r,3000));
ok('askClaude called', cap!==null);
ok('prompt carries the district-designation finding', /Pride Cultural Heritage District in 2025/.test(cap));
ok('prompt carries writer + story', cap.includes('Sam Rivera')&&cap.includes('walk past it every morning'));
ok('prompt HTML-free', !/<[a-z]/i.test(cap));
ok('model text rendered verbatim', d.querySelector('#letterOut').textContent.startsWith('Dear Mayor Watson'));
ok('actions revealed', d.querySelector('#letterActions').style.display==='flex');

console.log('\n— failure modes —');
for(const [label,impl,name] of [
  ['rejects',()=>Promise.reject(new Error('network down')),'Ana Reyes'],
  ['returns junk',()=>Promise.resolve({weird:1}),'Jo Kim'],
  ['returns empty string',()=>Promise.resolve('   '),'Pat Cole'],
  ['returns a number',()=>Promise.resolve(42),'Lee Diaz'],
]){
  dom=boot(()=>({askClaude:impl})); d=dom.window.document;
  d.querySelector('#f-name').value=name;
  d.querySelector('#gen').dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
  await new Promise(r=>setTimeout(r,2800));
  const t=d.querySelector('#letterOut').textContent;
  ok(label+' -> clean template fallback', t.includes(name)&&!/\[object|undefined|network down|NaN/.test(t)&&d.querySelector('#gen').disabled===false);
}
dom=boot(()=>({askClaude:()=>Promise.resolve({text:FAKE})}));
d=dom.window.document;
d.querySelector('#gen').dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
await new Promise(r=>setTimeout(r,2800));
ok('unwraps {text:...}', d.querySelector('#letterOut').textContent.startsWith('Dear Mayor'));

dom=boot(()=>({askClaude:()=>new Promise(()=>{})})); d=dom.window.document;
d.querySelector('#gen').dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
await new Promise(r=>setTimeout(r,900));
ok('hang -> spinner + disabled button', d.querySelector('#gen').innerHTML.includes('spin')&&d.querySelector('#gen').disabled);

console.log('\n— matchMedia absent (embedded webview) —');
ok('no matchMedia crash: letters still generate', (()=>{
  const dm=new JSDOM(html,{runScripts:'outside-only',url:'https://local/'});
  delete dm.window.matchMedia;
  try{ dm.window.eval(SCRIPT); }catch(e){ return false }
  const doc=dm.window.document;
  doc.querySelector('#f-name').value='Kit Ray';
  doc.querySelector('#gen').dispatchEvent(new dm.window.MouseEvent('click',{bubbles:true}));
  return true;
})());

console.log('\n— persistence —');
dom=boot(null); d=dom.window.document;
d.querySelectorAll('#todoList .todo .box')[0].dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
d.querySelectorAll('#todoList .todo .box')[3].dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
const saved=dom.window.localStorage.getItem('rcap-v2');
const d2=new JSDOM(html,{runScripts:'outside-only',url:'https://local/',pretendToBeVisual:true});
d2.window.localStorage.setItem('rcap-v2',saved); d2.window.eval(SCRIPT);
ok('ticks survive reload', d2.window.document.querySelector('#ringCt').textContent==='2 of 12');
ok('ring redraws from storage', d2.window.document.querySelector('#ringPct').textContent==='17%');
const d3=new JSDOM(html,{runScripts:'outside-only',url:'https://local/',pretendToBeVisual:true});
d3.window.localStorage.setItem('rcap-v2','{{{not json');
let threw=false; try{d3.window.eval(SCRIPT)}catch(e){threw=true}
ok('corrupt localStorage does not brick the page', !threw && d3.window.document.querySelectorAll('#todoList .todo').length===12);

console.log('\n— ics —');
const dm=boot(null);
const dl=[]; dm.window.URL.createObjectURL=b=>{dl.push(b);return 'blob:x'};
dm.window.URL.revokeObjectURL=()=>{};
dm.window.document.querySelector('[data-ics="budget"]').dispatchEvent(new dm.window.MouseEvent('click',{bubbles:true}));
ok('budget .ics generated', dl.length===1);
console.log('\n'+(fail===0?'ALL '+pass+' PASSED':pass+' passed, '+fail+' FAILED'));
process.exit(fail?1:0);
})();
