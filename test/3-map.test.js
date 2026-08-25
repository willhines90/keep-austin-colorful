const fs=require('fs');const {JSDOM}=require('jsdom');
const html=require('./_boot').inline('background.html');   // the page this suite is about
let pass=0,fail=0;
const ok=(n,c)=>c?(pass++,console.log('  ✓ '+n)):(fail++,console.log('  ✗ '+n));
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://local/',pretendToBeVisual:true});
const {window}=dom,d=window.document;
const errs=[];window.addEventListener('error',e=>errs.push(e.message));
setTimeout(()=>{
console.log('\n— map geometry —');
ok('no uncaught errors', errs.length===0||(console.log('    '+errs.join('; ')),false));
const path=d.querySelector('.txland').getAttribute('d');
ok('high-fidelity outline (78 points)', (path.match(/L/g)||[]).length===77);
ok('viewBox matches projection', d.querySelector('#txmap').getAttribute('viewBox')==='0 0 100 94.4');
// point-in-polygon: every pin must sit on land
const pts=path.replace(/^M|Z$/g,'').split('L').map(s=>s.split(',').map(Number));
const inside=(p,poly)=>{let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const[xi,yi]=poly[i],[xj,yj]=poly[j];
  if(((yi>p[1])!==(yj>p[1]))&&(p[0]<(xj-xi)*(p[1]-yi)/(yj-yi)+xi))c=!c}return c};
const pins=[...d.querySelectorAll('#txmap .pin')];
const dots=pins.map(p=>{const c=p.querySelector('.dot');return [+c.getAttribute('cx'),+c.getAttribute('cy')]});
ok('all 5 pins land inside Texas', pins.length===5 && dots.every(pt=>inside(pt,pts)));

console.log('\n— labels —');
const plates=pins.map(p=>{const r=p.querySelector('.labbg');
  return {x:+r.getAttribute('x'),y:+r.getAttribute('y'),w:+r.getAttribute('width'),h:+r.getAttribute('height'),id:p.dataset.id}});
let overlaps=[];
for(let i=0;i<plates.length;i++)for(let j=i+1;j<plates.length;j++){
  const a=plates[i],b=plates[j];
  if(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y) overlaps.push(a.id+'/'+b.id);
}
ok('no label plates overlap', overlaps.length===0||(console.log('    '+overlaps.join(', ')),false));
ok('every pin has a leader line', pins.every(p=>p.querySelector('.leader')));
ok('labels carry city + status', pins.every(p=>p.querySelectorAll('text').length===2));
const inBounds=plates.every(p=>p.x>=-2&&p.x+p.w<=102&&p.y>=-2&&p.y+p.h<=96.4);
ok('labels stay within the viewBox', inBounds);

console.log('\n— pin focus state —');
ok('pins suppress the default focus box', html.includes('.pin:focus,.pin:focus-visible{outline:none}'));
ok('pins have a bespoke keyboard indicator', html.includes('.pin:focus-visible .labbg')&&html.includes('.pin:focus-visible .halo'));
ok('map text cannot be selection-highlighted', html.includes('#txmap,#txmap *{user-select:none'));
ok('no tap-highlight flash on touch', html.includes('-webkit-tap-highlight-color:transparent'));
ok('halo is a ring, not a filled disc', (()=>{const h=d.querySelector('#txmap .pin .halo');
  return h.getAttribute('stroke')&&(!h.getAttribute('fill')||h.getAttribute('fill')==='none')})());
ok('white ring always sits outside the dot', (()=>{
  const css=html.split('</style>')[0];
  const pairs=[[2.3,3.0],[2.6,3.3],[3.05,3.75]];
  return pairs.every(([d0,r0])=>r0>d0) && css.includes('.pin.sel .ring2{r:3.75');})());

console.log('\n— corridor illustrations —');
ok('San Antonio card renders a corridor', !!d.querySelector('#citycard .corridor svg'));
const saRain=[...d.querySelectorAll('#citycard .corridor rect')].filter(r=>['#e40303','#008026','#732982'].includes(r.getAttribute('fill'))).length;
ok('San Antonio corridor has rainbow sidewalks', saRain>20);
ok('caption describes the treatment', d.querySelector('#citycard .cap').textContent.includes('Rainbow sidewalks'));
for(const [id,expect] of [['austin','A mural'],['dallas','Rainbow steps'],['elpaso','Pride-wrapped'],['kerrville','Nothing put back']]){
  d.querySelector(`#txmap .pin[data-id="${id}"]`).dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
  ok(id+' corridor renders + captions correctly', d.querySelector('#citycard .cap').textContent.includes(expect) && !!d.querySelector('#citycard .corridor svg'));
}
d.querySelector('#txmap .pin[data-id="austin"]').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
const austinRain=[...d.querySelectorAll('#citycard .corridor rect')].filter(r=>r.getAttribute('fill')==='#008026').length;
ok('Austin corridor sidewalks are NOT rainbow', austinRain<=2);

console.log('\n— table view —');
ok('table has 5 rows', d.querySelectorAll('#cmpTable tbody tr').length===5);
ok('map shown, table hidden initially', d.querySelector('#mapView').hidden===false&&d.querySelector('#tableView').hidden===true);
d.querySelector('.vt[data-view="table"]').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('toggle swaps to table', d.querySelector('#tableView').hidden===false&&d.querySelector('#mapView').hidden===true);
const names=()=>[...d.querySelectorAll('#cmpTable tbody .cty')].map(x=>x.textContent.trim());
d.querySelector('th[data-sort="name"]').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
const asc=names();
ok('sorts A→Z', asc.join()===asc.slice().sort().join());
d.querySelector('th[data-sort="name"]').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('re-click reverses', names().join()===asc.slice().reverse().join());
ok('sort indicator shown', !!d.querySelector('th[data-sort="name"].desc'));
d.querySelector('#cmpTable tbody tr').dispatchEvent(new window.MouseEvent('click',{bubbles:true}));
ok('clicking a row selects that city', d.querySelectorAll('#txmap .pin.sel').length===1);
ok('selected row highlighted', d.querySelectorAll('#cmpTable tbody tr.hi').length===1);
ok('map and table stay in sync', d.querySelector('#cmpTable tbody tr.hi').dataset.id===d.querySelector('#txmap .pin.sel').dataset.id);

console.log('\n— regression —');
// This page owns the timeline, the map and the objections. The regression to
// guard against is the map quietly taking the rest of the page down with it.
ok('nav survived the render', d.querySelectorAll('.mainnav a:not(.ghlink)').length===6);
ok('timeline intact', d.querySelectorAll('#timeline .tli').length===8);
ok('objections intact', d.querySelectorAll('#objList .obj').length===5);
ok('funding no longer stranded here', !d.querySelector('#fundList'));
ok('nothing from the action page leaked in', !d.querySelector('#letterOut')&&!d.querySelector('#todoList'));
console.log('\n'+(fail===0?'ALL '+pass+' PASSED':pass+' passed, '+fail+' FAILED'));
process.exit(fail?1:0);
},800);
