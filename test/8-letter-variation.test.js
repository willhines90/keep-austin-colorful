/* The template path must not produce form letters. Council offices log
   identical submissions as a single contact, so variation is the point. */
const fs=require('fs');const {JSDOM}=require('jsdom');
const html=require('./_boot').inline('act.html');   // the page this suite is about
let pass=0,fail=0;
const ok=(n,c)=>c?(pass++,console.log('  ✓ '+n)):(fail++,console.log('  ✗ '+n));

const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://local/',pretendToBeVisual:true});
const w=dom.window, d=w.document;
w.matchMedia=()=>({matches:true,addListener(){},removeListener(){}});  // instant reveal
const copied=[]; w.navigator.clipboard={writeText:t=>{copied.push(t);return Promise.resolve()}};
w.eval([...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].pop()[1]);

const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function gen(o){
  o=o||{};
  d.querySelector('#f-name').value=o.name||'Ana Reyes';
  d.querySelector('#f-addr').value=o.addr||'12 Oak St';
  d.querySelector('#f-dist').value=o.dist||'9';
  d.querySelector('#f-tone').value=o.tone||'Measured and civic';
  d.querySelector('#f-story').value=o.story||'';
  [...d.querySelectorAll('#f-conn .cchip')].forEach((c,i)=>{
    const on=(o.conns||[0]).includes(i);
    if(c.classList.contains('on')!==on) c.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
  });
  d.querySelector('#gen').dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
  await wait(600);                                   // clears the 420ms fallback delay
  return d.querySelector('#letterOut').textContent;
}

(async()=>{
try{
  console.log('\n— variation —');
  const a=await gen({name:'Ana Reyes'});
  const again=await gen({name:'Ana Reyes'});
  ok('same inputs give the same letter', a===again);

  const b=await gen({name:'Sam Cole', addr:'88 Elm Ave', dist:'5'});
  const c=await gen({name:'Jo Kim', addr:'4 Pine Rd', dist:'3'});
  ok('different writers get different letters', new Set([a,b,c]).size===3);

  const warm=await gen({name:'Ana Reyes', tone:'Personal and warm'});
  ok('tone changes the wording', warm!==a);

  console.log('\n— inputs shape the text —');
  const biz=await gen({conns:[2]});
  ok('the business-owner chip contributes a line', /run a business near that corner/.test(biz));
  const vigil=await gen({conns:[7]});
  ok('the vigil chip contributes a different line', /gathering on the corner in July/.test(vigil) && vigil!==biz);
  const story=await gen({story:'The first time I crossed it I had been in Texas three weeks.'});
  ok('their own sentence is carried through', story.includes('had been in Texas three weeks'));

  console.log('\n— no form-letter tells —');
  ok('asks read as prose, not "(1) ... (2) ..."', !/\(1\)/.test(a) && !/\(2\)/.test(a));
  ok('asks appear as real sentences', /treat the sidewalks at Fourth and Colorado/.test(a));
  ok('no unfilled placeholders', !/\[YOUR/.test(a));
  ok('sensible length', a.split(/\s+/).length>180 && a.split(/\s+/).length<430);
  ok('signs off with name and address', a.trim().endsWith('12 Oak St'));

  console.log('\n— editing —');
  const out=d.querySelector('#letterOut');
  ok('output is editable', out.getAttribute('contenteditable')==='true');
  ok('the nudge to personalise is shown', d.querySelector('#editNote').hidden===false);
  out.textContent=a+'\n\nP.S. I walk this corner daily.';
  copied.length=0;
  d.querySelector('#copyBtn').dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
  await wait(60);
  ok('copy takes the edited text, not the original', copied[0] && copied[0].includes('P.S. I walk this corner daily'));

  console.log('\n— regenerate —');
  const before=d.querySelector('#letterOut').textContent;
  d.querySelector('#regen').dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
  await wait(600);
  ok('rewrite produces something new', d.querySelector('#letterOut').textContent!==before);

  console.log('\n'+(fail===0?'ALL '+pass+' PASSED':pass+' passed, '+fail+' FAILED'));
  process.exit(fail?1:0);
}catch(e){ console.log('THREW:', e && e.message); process.exit(1) }
})();
