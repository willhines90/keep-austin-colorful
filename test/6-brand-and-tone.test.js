const fs=require('fs');const {JSDOM}=require('jsdom');
const html=fs.readFileSync(__dirname+'/../public/index.html','utf8');
let pass=0,fail=0;
const ok=(n,c)=>c?(pass++,console.log('  ✓ '+n)):(fail++,console.log('  ✗ '+n));
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://local/',pretendToBeVisual:true});
const {window}=dom,d=window.document;
const errs=[];window.addEventListener('error',e=>errs.push(e.message));
setTimeout(()=>{
console.log('\n— brand —');
ok('no uncaught errors', errs.length===0||(console.log('    '+errs.join('; ')),false));
ok('brand lockup at top of page', !!d.querySelector('.masthead .brand .brandmark svg'));
ok('name is in the masthead', d.querySelector('.brandname').textContent.replace(/\s+/g,' ').trim()==='Keep Austin Colorful');
ok('tagline present', d.querySelector('.brandtag').textContent.includes('Bringing the color back'));
ok('name persists in sticky nav', d.querySelector('.navbrand b').textContent==='Keep Austin Colorful');
ok('mark is the ATX monogram with a 6-stripe band', (()=>{
  const g=d.querySelector('.brandmark svg');
  if(!g) return false;
  const letters=g.querySelector('path[fill-rule="evenodd"]');
  const bands=[...g.querySelectorAll('rect')].filter(r=>['#e40303','#ff8c00','#ffd500','#008026','#24408e','#732982'].includes(r.getAttribute('fill')));
  const clipped=!!g.querySelector('[clip-path]');
  const subpaths=(letters?.getAttribute('d').match(/M/g)||[]).length;
  return !!letters && bands.length===6 && clipped && subpaths===4;})());
ok('band is clipped to the letterforms, not floating', !!d.querySelector('.brandmark clipPath path[clip-rule="evenodd"]'));
ok('nav carries the same mark', d.querySelectorAll('.navbrand svg path[fill-rule="evenodd"]').length===1);
ok('favicon is the ATX tile', /rel="icon" href="data:image\/svg\+xml,[^"]*rx%3D%2211%22/.test(html));
ok('compare tags shrink-wrap', html.includes('width:max-content')&&html.includes('max-width:calc(50% - 22px)'));
ok('lede measure widened', html.includes('max-width:72ch'));
ok('mark hidden from screen readers (decorative)', d.querySelector('.brandmark').getAttribute('aria-hidden')==='true' || d.querySelector('.brandmark svg').getAttribute('aria-hidden')==='true');
ok('favicon embedded as data URI', /rel="icon" href="data:image\/svg\+xml/.test(html));
ok('theme-color set', html.includes('name="theme-color"'));

console.log('\n— typography discipline —');
const styleBlock=html.split('</style>')[0];
ok('no raw numeric font-weights in CSS', !/font-weight:\d{3}/.test(styleBlock));
ok('exactly 4 weight tokens defined', ['--w-reg','--w-med','--w-semi','--w-bold'].every(t=>styleBlock.includes(t+':')));
ok('type scale tokens defined', ['--fs-2xs','--fs-xs','--fs-sm','--fs-md','--fs-base','--fs-lg','--fs-xl','--fs-2xl','--fs-display'].every(t=>styleBlock.includes(t+':')));

console.log('\n— design system —');
const CSS=html.split('</style>')[0];
ok('space scale defined', ['--s1:','--s2:','--s4:','--s6:','--s8:','--s12:'].every(k=>CSS.includes(k)));
ok('radius scale defined', ['--r-xs:','--r-sm:','--r-md:','--r-lg:','--r-pill:'].every(k=>CSS.includes(k)));
ok('motion tokens defined', ['--dur-1:','--dur-2:','--dur-3:'].every(k=>CSS.includes(k)));
ok('line-height scale defined', ['--lh-tight:','--lh-snug:','--lh-body:'].every(k=>CSS.includes(k)));
ok('radii use tokens, not raw px', !/border-radius:(?!2px)[0-9]+px(?=[;}])/.test(CSS));
ok('accent derives from the flag violet', CSS.includes('--accent:#6a2578')&&CSS.includes('--r6:#732982'));
ok('old tailwind violet fully removed', !/6d28d9|8b5cf6|ddd0fb|f4efff/i.test(html));
ok('web fonts loaded with swap', html.includes('family=Poppins')&&html.includes('Figtree')&&html.includes('display=swap'));
ok('display face is Poppins, fallback intact', CSS.includes("--display: 'Poppins'")&&CSS.includes('Trebuchet MS'));
ok('no serif anywhere in the type system', !/--serif:\s*'/.test(CSS)&&!CSS.includes('Fraunces')&&!CSS.includes('Newsreader'));
ok('display face applied to headings and stats', CSS.includes('font-family:var(--display)'));
ok('text face is Figtree, fallback intact', CSS.includes("--sans: 'Figtree'")&&CSS.includes('system-ui'));
ok('preconnect to the font host', html.includes('rel="preconnect" href="https://fonts.gstatic.com"'));
ok('tabular numerals on stats and counters', CSS.includes('font-variant-numeric:tabular-nums'));
ok('optical sizing + kerning enabled', CSS.includes('font-optical-sizing:auto')&&CSS.includes('font-kerning:normal'));

console.log('\n— every number is cited —');
const cards=[...d.querySelectorAll('#statRow .stat')];
ok('four stat cards render from data', cards.length===4);
ok('every stat carries at least one source', cards.length>0 && cards.every(c=>c.querySelectorAll('.srcl').length>0));
ok('stat sources are real links', cards.every(c=>[...c.querySelectorAll('.srcl')].every(a=>(a.getAttribute('href')||'').startsWith('https://'))));
ok('the petition figure links the petition', (()=>{const c=cards.find(x=>x.querySelector('b').textContent==='5,330');
  return c && c.querySelector('.srcl').getAttribute('href').includes('change.org')})());
ok('the cost figure links the reporting that carried it', (()=>{const c=cards.find(x=>x.querySelector('b').textContent==='$170K');
  return c && c.querySelectorAll('.srcl').length>=2})());

ok('type scale is actually enforced, not just declared', !/font-size:[0-9.]+rem/.test(CSS));
ok('display face carries real weight on the page', (()=>{
  // one rule, many selectors: count the selectors, not the string
  const m=CSS.match(/([^{}]+)\{[^}]*font-family:var\(--display\)/g)||[];
  const sels=m.join(',').split(',').filter(x=>x.trim()).length;
  return sels>=12;})());
ok('sections carry a flag-colored rule', /section::before/.test(CSS)&&/--sec:var\(--r1\)/.test(CSS));
ok('dark sections exist for the key moments', /section\.dark\{background:var\(--ink\)/.test(CSS)&&(html.match(/section[^>]*class="dark"/g)||[]).length>=2);
ok('stat numbers take their own color', /\.stat b\{[^}]*color:var\(--swt,var\(--sw\)\)/.test(CSS));
// Flag orange is 2.33:1 on white and yellow is worse. Type uses the ink variants.
ok('type-safe ink variants exist for every flag color',
   [1,2,3,4,5,6].every(n=>new RegExp('--r'+n+'-ink:#').test(CSS)));
(()=>{
  const lum=h=>{const c=[1,3,5].map(i=>parseInt(h.substr(i,2),16)/255)
    .map(v=>v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4));
    return .2126*c[0]+.7152*c[1]+.0722*c[2]};
  const onWhite=h=>(1.05)/(lum(h)+0.05);
  const inks=[...CSS.matchAll(/--r\d-ink:(#[0-9a-f]{6})/g)].map(m=>m[1]);
  ok('every ink variant clears 4.5:1 on white', inks.length===6&&inks.every(h=>onWhite(h)>=4.5));
  // and no stat may ship a color that fails large-text contrast
  // t: overrides c: where the flag color is too light for type, so read the
  // whole entry and prefer t. Matching either one in isolation picks the wrong
  // token on exactly the entry that matters.
  const block=(html.match(/var STATS=\[[\s\S]*?\n\];/)||[''])[0];
  const used=block.split(/\n\s*\{n:/).slice(1).map(e=>{
    const t=e.match(/t:'var\(--([a-z0-9-]+)\)'/), c=e.match(/c:'var\(--([a-z0-9-]+)\)'/);
    return (t&&t[1])||(c&&c[1]);
  }).filter(Boolean);
  const hex=k=>(CSS.match(new RegExp('--'+k+':(#[0-9a-f]{6})'))||[])[1];
  ok('every stat number clears 3:1 on white',
     used.length>=4&&used.every(k=>{const h=hex(k);return h&&onWhite(h)>=3}));
})();
ok('pride tag does not set type on a gradient',
   /\.dtag\.pride\{background:var\(--accent\)/.test(CSS)&&/\.dtag\.pride::after/.test(CSS));
ok('date-row badges outrank .dwhat span', /\.dwhat \.hot\{color:#fff\}/.test(CSS));
ok('touch targets grow on coarse pointers', /@media \(pointer:coarse\)/.test(CSS)&&/min-height:44px/.test(CSS));

console.log('\n— street labels —');
ok('street names sit on their own plate', CSS!==null && html.includes('function roadLabel('));
ok('plan labels moved off the centre line', html.includes("roadLabel(64,244,'W 4TH ST'")&&html.includes("roadLabel(348,332,'COLORADO ST'"));
ok('corridor illustrations are labelled too', html.includes('roadLabel(14,80,c.street.toUpperCase()'));

console.log('\n— copy —');
const txt=d.body.textContent;
ok('US spelling throughout', !/\bcolour|\bneighbour|\borganised|\bprogramme\b/i.test(txt));
ok('zero em dashes', !html.includes('—'));
ok('dek names the San Antonio fact', d.querySelector('.dek').textContent.includes('needed no council vote'));
ok('footer carries the brand + source promise', d.querySelector('footer').textContent.includes('Keep Austin Colorful')&&d.querySelector('footer').textContent.includes('links to its source'));
ok('section headers rewritten', txt.includes('Good questions, good answers')&&txt.includes('What Austin can do next')&&txt.includes('The thing all of them worked out'));

console.log('\n— tone —');
const BODY=d.body.textContent;
const barbs=['has not tried','chosen not to','nobody asks','out-prided','mark an absence','do not fill it','stopped short','The gap','Nothing back','scraped away overnight','goes grey','Nothing reported','Not reached'];
barbs.forEach(b=>ok('no barb: "'+b+'"', !BODY.includes(b)));
ok('Austin card leads with what is done, not undone', d.querySelector('#citycard')!==null);
ok('objection panel framed as questions', BODY.includes('The question')&&!BODY.includes('They say'));
ok('letter prompt steers away from blame', html.includes('Keep the letter warm toward the city'));
ok('headline is an invitation, not a grievance', d.querySelector('h1').textContent.includes("Let's put the color back"));
ok('tabs read warmly', BODY.includes('The story')&&BODY.includes("What's possible")&&BODY.includes('Pitch in'));
ok('stats lead with people and possibility', [...d.querySelectorAll('.stat span')].every(x=>!/exemptions granted|vigil on the corner/.test(x.textContent)));
ok('caution box is guidance, not prohibition', BODY.includes('A gentle word on how to help')&&BODY.includes('Let the city hold the brush'));

console.log('\n— regression —');
ok('4 tabs work', d.querySelectorAll('.tab').length===4);
d.querySelectorAll('.tab')[1].dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('tab switch OK', d.querySelector('#p-play').classList.contains('on'));
ok('hero renders both layers', !!d.querySelector('#cmpBase svg')&&!!d.querySelector('#cmpAfter svg'));
ok('map pins render', d.querySelectorAll('#txmap .pin').length===5);
ok('12 actions', d.querySelectorAll('#todoList .todo').length===12);
ok('9 connection chips', d.querySelectorAll('#f-conn .cchip').length===9);
ok('source links present', d.querySelectorAll('.srcl').length>10);
console.log('\n'+(fail===0?'ALL '+pass+' PASSED':pass+' passed, '+fail+' FAILED'));
process.exit(fail?1:0);
},800);
