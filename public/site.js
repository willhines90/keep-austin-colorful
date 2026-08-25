/* Keep Austin Colorful - shared behavior.
   Loaded by every page. Every render function checks for its mount point
   and returns quietly if the current page does not have one, so the same
   file can serve the home page, the background page and the contact page
   without knowing which one it is on. */

(function(){
"use strict";
/* If anything below throws, reveal every panel instead of leaving the reader
   looking at one tab and a lot of empty containers. */
window.addEventListener('error',function(){ document.documentElement.classList.add('js-failed') });

/* ════════ analytics ════════
   Nothing loads unless an ID is filled in below. Leave them empty and the site
   makes no third-party requests at all, which is the default.

   After changing either value run `npm run build:meta`: the Content-Security
   -Policy is generated, and it only opens up the origins an enabled provider
   actually needs.

   Note that Vercel Analytics is deliberately absent. It posts to
   /_vercel/insights, an endpoint that exists only on Vercel's edge, so on any
   other host it fails silently. */
/* Set these once the domain is live. The alias keeps a personal inbox off a
   public page and can be forwarded or shut off without touching the site. */
var VERIFIED='25 August 2026';
var CONTACT={
  /* IMPORTANT: leave these empty until the aliases actually exist and you have
     sent yourself a test message. A published address that bounces is worse
     than no address, because a reporter on deadline will not try twice.
     Until then the site routes people to GitHub, which does work. */
  email:'',                                // e.g. 'hello@keepaustincolorful.org'
  formUrl:'',                              // e.g. a Tally or Formspree link
  press:'',                                // e.g. 'press@keepaustincolorful.org'
  github:'https://github.com/willhines90/keep-austin-colorful'
};

var ANALYTICS={
  ga4:'',            // 'G-XXXXXXXXXX' from Google Analytics. Unused; Cloudflare is the chosen provider.
  cfToken:'',        // ← THE ONE TO FILL IN. Token from Cloudflare Web Analytics (cookieless, no banner).
  cfAuto:true,       // edge injection: Cloudflare adds the beacon itself, no token in the repo.
                     // Requires the hostname to be proxied through Cloudflare, which the apex now
                     // is. The CSP below has to allow static.cloudflareinsights.com or the browser
                     // drops the injected script and the dashboard stays empty with no error.
  respectDNT:true    // skip analytics for visitors who ask not to be tracked
};

function dnt(){
  try{ return ANALYTICS.respectDNT &&
    (navigator.doNotTrack==='1'||window.doNotTrack==='1'||navigator.msDoNotTrack==='1'); }
  catch(e){ return false }
}
function loadAnalytics(){
  if(dnt()) return;
  if(ANALYTICS.ga4){
    var g=document.createElement('script');
    g.async=true; g.src='https://www.googletagmanager.com/gtag/js?id='+ANALYTICS.ga4;
    document.head.appendChild(g);
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments)};
    gtag('js',new Date());
    gtag('config',ANALYTICS.ga4,{anonymize_ip:true});
  }
  if(ANALYTICS.cfToken){
    var c=document.createElement('script');
    c.defer=true; c.src='https://static.cloudflareinsights.com/beacon.min.js';
    c.setAttribute('data-cf-beacon','{"token":"'+ANALYTICS.cfToken+'"}');
    document.head.appendChild(c);
  }
}

/* Pageviews say very little here. What matters is whether people finish
   something, so the few moments that represent real progress are counted. */
function track(name,detail){
  if(dnt()) return;
  try{ if(window.gtag) window.gtag('event',name,detail||{}) }catch(e){}
}

/* ════════ sources ════════ */
var SRC={
 tribune:['Texas Tribune','https://www.texastribune.org/2026/06/29/texas-rainbow-crosswalk-alternatives-austin-mural-el-paso-dallas/'],
 sareport:['San Antonio Report','https://sanantonioreport.org/san-antonio-installs-pride-district-sidewalk-art-after-crosswalk-removal/'],
 tpr:['TPR','https://www.tpr.org/government-politics/2026-03-29/san-antonio-officially-dedicates-rainbow-sidewalks-in-pride-cultural-heritage-district'],
 kens5:['KENS5','https://www.kens5.com/article/news/local/san-antonio-texas-satx-rainbow-sidewalks-pride-cultural-hertiage-district-crosswalk-removal-lgbt-community-ribbon-cutting-ceremony-march-2026/273-cc2b0ddb-0dfb-4584-9595-3fdacb183bf5'],
 kut:['KUT','https://www.kut.org/transportation/2026-07-22/austin-tx-lgbtq-vigil-rainbow-crosswalks-4th-street'],
 axios:['Axios Austin','https://www.axios.com/local/austin/2026/06/23/austin-painted-crosswalks-removal-abbott'],
 kvue:['KVUE','https://www.kvue.com/article/news/local/austin-texas-fourth-colorado-streets-rainbow-crosswalk-removed/269-0218c935-2ca7-47b4-8199-8c0fbdf2df00'],
 calendar:['City of Austin calendar','https://services.austintexas.gov/edims/document.cfm?id=462100'],
 sixsquare:['Six Square','https://sixsquareatx.org/'],
 petition:['Change.org petition','https://www.change.org/p/city-of-austin-texas-approve-the-rainbow-crosswalks-in-austin-tx'],
 pride:['Austin Pride','https://austinpride.org/pride2026/'],
 chronicle:['Austin Chronicle','https://www.austinchronicle.com/category-qmmunity/marking-queer-history-on-austins-fourth-street/']
};
function srcLinks(keys){
  if(!keys||!keys.length) return '';
  return '<div class="srcs">'+keys.map(function(k){
    var s=SRC[k]; if(!s) return '';
    return '<a class="srcl" href="'+s[1]+'" target="_blank" rel="noopener">'+s[0]+' ↗</a>';
  }).join('')+'</div>';
}

/* ════════ data ════════ */
var TIMELINE=[
 {d:'2018–2021',k:0,s:['tribune'],t:'Texas cities paint rainbow crosswalks',
  b:"San Antonio's goes in at North Main and West Evergreen in 2018, funded and maintained by residents and nearby businesses rather than the city. Austin's arrives at West 4th and Colorado in 2021, in the heart of the city's LGBTQ+ district."},
 {d:'Oct 2025',k:1,s:['tribune','petition'],t:'Abbott orders TxDOT to withhold road funding',
  b:'The order targets roadway art that might “advance political agendas,” following a similar Federal Highway Administration directive. Cities can apply for exemptions. More than five thousand people signed a petition asking Austin to try. TxDOT denies every application to keep a rainbow crosswalk, and never answers whether it granted an exemption to any roadway art at all.'},
 {d:'Nov 2025',k:0,s:['sareport'],t:'San Antonio argues its crosswalk is safer, and loses anyway',
  b:'Assistant City Manager John Peterek writes to TxDOT that the intersection is safer than comparable nearby intersections, and safer than before the paint went down. “Nevertheless, the City will respect TxDOT\'s decision.” The safety rationale is never actually contested on the data.'},
 {d:'Jan 2026',k:1,s:['sareport','tpr'],t:'San Antonio scrubs its crosswalk, and starts on the sidewalks',
  b:'The crosswalk comes up on 12 January. Public Works begins sidewalk art the same month. Two council members object publicly to spending $170,000 of Public Works money on “individual viewpoints.” They lose the argument. Pieces of the old crosswalk are preserved for future art.'},
 {d:'Mar 2026',k:1,s:['tpr','kens5'],t:'The rainbow returns to San Antonio, legally',
  b:"Rainbow sidewalks are dedicated along Main Avenue from Laurel to Park, six colors plus the Progress flag's trans and QPOC stripes. Crucially, no council vote was required: the corridor's Pride Cultural Heritage District designation, adopted in 2025 and the first of its kind in Texas, gave staff the authority to act. A lawsuit against the city fails."},
 {d:'20 Jun 2026',k:0,s:['tribune'],t:'Austin paints a mural on 4th Street',
  b:'Residents paint hearts onto a new mural between Colorado and Lavaca. Mayor Watson: “We\'re going to do more to show our love and our respect and our appreciation for all of our people, and we\'re going to do it in a way that\'s clearly Austin.”'},
 {d:'20–21 Jul 2026',k:1,s:['kut','kvue'],t:'The crosswalk comes up at 4th and Colorado',
  b:'The paint comes up under the state order, along with the “Black Artists Matter” lettering on East 11th and crosswalks honoring the Guadalupe River in Kerrville. The next evening about seventy-five neighbors gather on the corner, which is where this project began.'},
 {d:'Aug 2026',k:1,s:['chronicle','calendar'],t:'The marker goes up',
  b:'On 21 August the city unveiled an LGBTQIA+ historical marker at the intersection, under the Bettie Naylor street sign. It was three years of work by the LGBTQ+ Quality of Life Commission, approved by council back in 2023, and it was never a reaction to the crosswalk. It names Austin queer history plainly, back to the Gay Liberation Front chapter founded here in 1970. Separately, a task force weighed sidewalk paint and held off for now, citing light rail construction that may reach the street within 18 to 24 months. That is a sequencing question, and a solvable one. Two of the three things this block could have are now in place. The sidewalk is the one still open.'}
];

/* x/y are projected from real coordinates onto the 100 × 94.4 map viewBox.
   lp = label placement: [dx, dy, anchor] so labels never collide. */
var CITIES=[
 {id:'austin',name:'Austin',s:['kut','axios','kvue'],x:67.38,y:55.81,lp:[8.4,1.1,'start'],status:'gap',rank:2,
  short:'Open opportunity',street:'W 4th St at Colorado',sidewalk:'grey',feature:'mural',
  replaced:'A community mural, and a historical marker',payer:'Neighbors, so far',vote:'no',voteTxt:'Not needed',
  what:'The rainbow crosswalk at West 4th &amp; Colorado came up on 20–21 July 2026 under the state order. The city responded quickly: residents painted a community mural on 4th Street in June, and on 21 August the city unveiled an LGBTQIA+ historical marker that the LGBTQ+ Quality of Life Commission had spent three years bringing to life. The next step, a sidewalk treatment, sits entirely with the city.',
  rows:[['Where','West 4th &amp; Colorado'],['Already done','A community mural in June; a historical marker on 21 August'],['Available next','A sidewalk treatment, on San Antonio\'s model'],['Also available','Cultural heritage district designation'],['Authority needed','All of it sits with the city']]},
 {id:'sanantonio',name:'San Antonio',s:['tpr','sareport','kens5'],x:61.81,y:63.16,lp:[-8.4,4.6,'end'],status:'win',rank:1,
  short:'Rainbow sidewalks',street:'N Main Ave, Laurel to Park',sidewalk:'rainbow',feature:'none',
  replaced:'Two blocks of rainbow sidewalk',payer:'City funds, ~$170,000',vote:'no',voteTxt:'Not needed',
  what:'Forced to scrub its 2018 crosswalk in January, the city had Public Works paint rainbow sidewalks along Main Avenue from Laurel to Park, in six colors plus the Progress flag\'s trans and QPOC stripes. Dedicated in late March 2026.',
  rows:[['Where','N Main Ave, Laurel to Park'],['What replaced it','Two blocks of rainbow sidewalk'],['Cost','~$170,000, city funded'],['Unlocked by','Pride Cultural Heritage District, 2025, the first in Texas'],['Council vote needed','No. The designation gave staff authority'],['Challenged?','Yes. A lawsuit failed.']]},
 {id:'dallas',name:'Dallas',s:['tribune'],x:74.40,y:33.94,lp:[-8.4,1.1,'end'],status:'win',rank:1,
  short:'Rainbow steps',street:'Oak Lawn library steps',sidewalk:'grey',feature:'steps',
  replaced:'Rainbow stairs, plus 18 bike racks',payer:'Private donations',vote:'no',voteTxt:'Not needed',
  what:'In Oak Lawn, the Methodist church steps were painted rainbow days after Abbott\'s directive. The Oak Lawn Branch Library steps followed in June 2026, painted by city staff, paid for by community donations, exactly how the original crosswalks were funded.',
  rows:[['Where','Oak Lawn library and church steps'],['What replaced it','Rainbow stairs, plus 18 rainbow bike racks'],['Cost to taxpayers','None, private donations'],['Installed by','City staff'],['Also','Cedar Springs Merchants Association funded the racks']]},
 {id:'elpaso',name:'El Paso',s:['tribune'],x:2.82,y:42.80,lp:[8.4,1.1,'start'],status:'win',rank:1,
  short:'Pride lamp posts',street:'Downtown El Paso',sidewalk:'grey',feature:'lamps',
  replaced:'Pride-wrapped street lamps',payer:'City / community',vote:'no',voteTxt:'Not needed',
  what:'Street lamps wrapped in Pride flags, keeping color in the same space the crosswalk occupied. Organizers at the Borderland Rainbow Center are pushing for rainbow bike racks next.',
  rows:[['What replaced it','Pride-wrapped street lamps'],['Jurisdiction','Lamp posts, city property rather than roadway'],['Next ask','Rainbow bike racks'],['Why it matters','Nothing in the order reaches above the road surface']]},
 {id:'kerrville',name:'Kerrville',s:['tribune'],x:57.01,y:57.73,lp:[-8.4,-4.2,'end'],status:'none',rank:3,
  short:'No replacement yet',street:'Guadalupe River crossings',sidewalk:'grey',feature:'none',
  replaced:'Still to come',payer:'Open',vote:'na',voteTxt:'Not yet raised',
  what:'Crosswalks honoring the Guadalupe River came up under the same order, a reminder that this reached well beyond Pride art. Kerrville is on this map because color tends to come back wherever somebody makes the case for it, and nobody has yet.',
  rows:[['What was removed','Guadalupe River crosswalks'],['What could replace it','Any of the routes on this page'],['Why it\'s here','A reminder that someone has to raise it']]}
];

var ASKS=[
 {id:'sidewalk',on:true,ttl:'Rainbow sidewalk treatment at 4th &amp; Colorado',
  desc:'The San Antonio model, applied directly. Interim paint now, with a written commitment to build it into the streetscape rebuilt after light rail.',
  chips:[['City sidewalk, outside the order','ok'],['Precedent: San Antonio','ok'],['~$170K there','']]},
 {id:'district',on:true,ttl:'Designate West 4th an LGBTQ+ Cultural Heritage District',
  desc:'The structural ask, and the one most likely to outlast any single council. San Antonio\'s designation is why its sidewalk art needed no council vote. Austin already has Six Square as a template.',
  chips:[['City land-use authority','ok'],['Precedent: San Antonio 2025, Six Square','ok'],['Survives light rail','ok']]},
 {id:'furniture',on:false,ttl:'Rainbow bike racks, benches, bollards and planters',
  desc:'Cheap, fast, and entirely city property. Dallas installed 18 rainbow-wrapped bike racks through a merchants association; El Paso wants the same.',
  chips:[['Street furniture, outside the order','ok'],['Precedent: Dallas','ok'],['Low cost','']]},
 {id:'steps',on:false,ttl:'Rainbow steps on nearby public buildings',
  desc:'Dallas painted its Oak Lawn library steps using city staff and donated money. Stairs are structure, not roadway.',
  chips:[['Building fabric','ok'],['Precedent: Dallas','ok']]},
 {id:'lamps',on:false,ttl:'Pride-wrapped lamp posts and banners on the block',
  desc:'El Paso\'s approach. Reversible, seasonal if it has to be, and nothing in the directive reaches above the road surface.',
  chips:[['Lamp posts, city property','ok'],['Precedent: El Paso','ok']]},
 {id:'light',on:false,ttl:'Rainbow lighting across the intersection at night',
  desc:'Light is not paint and changes no road surface. No Texas city has tested this yet, so treat it as a creative ask rather than a settled one.',
  chips:[['Untested in Texas','un'],['No surface alteration','ok']]},
 {id:'marker',on:true,ttl:'Do for East 11th what was just done for 4th Street',
  desc:'The 4th Street marker went up on 21 August, three years of work by the LGBTQ+ Quality of Life Commission and a genuinely lovely morning. The Black Artists Matter lettering on East 11th came up under the same order and has had nothing like it. Six Square and the organizations on the east side lead that work and should be the ones setting the ask. What this corner can usefully do is say, loudly, that whatever they ask for should get the same care and the same council attention 4th Street just got.',
  chips:[['Precedent set on 4th St','ok'],['Costs almost nothing','']]},
 {id:'commission',on:true,ttl:'Design it with the community, not for it',
  desc:'San Antonio developed its design with the city\'s LGBTQ+ advisory board. Austin should route this through the LGBTQ+ Quality of Life Advisory Commission and the Austin LGBT Chamber.',
  chips:[['Precedent: San Antonio','ok'],['No cost','']]}
];

var FUNDS=[
 {id:'budget',on:true,ttl:'Put it in the FY2027 budget, 12–14 August',
  desc:'The only moment this year when money gets allocated. A council member can bring a budget amendment; residents can speak to it.',
  chips:[['Ten days away','un']]},
 {id:'resolution',on:true,ttl:'Pass a resolution directing staff to scope and cost it',
  desc:'Costs nothing, commits no money, and creates a paper trail with a deadline. The usual first step when council wants to move without spending.',
  chips:[['No money required','ok']]},
 {id:'donations',on:true,ttl:'Accept community donations, as Dallas did',
  desc:'This one defuses the loudest objection. Austin\'s crosswalk and San Antonio\'s were community-funded to begin with; taxpayers only ever paid to remove them.',
  chips:[['Precedent: Dallas','ok'],['Neutralises the cost argument','ok']]},
 {id:'arts',on:false,ttl:'Route it through Art in Public Places or cultural arts funding',
  desc:'Treat it as a public art commission rather than a transport project and it draws on a different pot, with its own selection process.',
  chips:[['Existing program','ok']]}
];

var OBJS=[
 {q:'Taxpayer money shouldn\'t fund viewpoints',s:['sareport'],
  a:'This was the objection in San Antonio, from two council members, and it didn\'t carry. The reply is factual: both cities\' rainbow crosswalks were funded and maintained by residents and businesses, not the city. Public money entered the story only when the state forced a removal. Taxpayers paid to rip up a functioning intersection. And if cost is genuinely the issue, Dallas showed the way: community donations, city staff, no taxpayer line item. Offer that and see whether the objection survives.'},
 {q:'Light rail will tear the street up in 18 months',s:['tribune','tpr'],
  a:'This is Austin\'s stated reason for stopping short, and it argues for sequencing, not for nothing. Ask for two things at once: an interim treatment now on the blocks outside the construction footprint (San Antonio\'s runs two full blocks), and a written commitment that the rainbow is designed into the rebuilt streetscape. A cultural heritage district designation costs no concrete at all and cannot be dug up.'},
 {q:'We\'ll lose road funding if we do this',s:['tpr','kens5'],
  a:'The directive, and the federal order behind it, govern roadway art. Sidewalks, steps, bike racks and lamp posts are not roadway. San Antonio has had rainbow sidewalks since March, in plain sight, with a ribbon-cutting, and has not lost road funding. A lawsuit against the city over them failed. The legal question isn\'t hypothetical any more; it has been answered by somebody else, at their expense.'},
 {q:'It was a safety decision, not a political one',s:['sareport','tribune'],
  a:'San Antonio\'s own assistant city manager wrote to TxDOT that the intersection was safer with the paint than without it, and safer than comparable nearby intersections. TxDOT denied the exemption anyway, and declined to say whether it had granted an exemption for any roadway art at all. If safety were the criterion, the data went the other way.'},
 {q:'We already did a mural and a marker',s:['tribune','chronicle'],
  a:'Both are genuinely good, and worth being clear about: the marker was three years of work by the LGBTQ+ Quality of Life Commission, approved by council in 2023, and would have happened whatever the state did. It is not a consolation prize and nobody should treat it as one. The ask is to build on them rather than stop there. San Antonio paired its commemoration with something permanent, city-maintained and underfoot where people actually walk, and wrapped it in a district designation that carries forward automatically. Austin has every tool it needs to do the same, and a council that has already said it wants to do more.'}
];

var PIR='To the City of Austin Public Information Office,\n\n'+
 'Under the Texas Public Information Act, Chapter 552 of the Government Code, I request copies of the following records:\n\n'+
 '1. The City of Austin\'s application to the Texas Department of Transportation for an exemption permitting the rainbow crosswalk at West 4th Street and Colorado Street to remain, together with all attachments.\n\n'+
 '2. All correspondence between the City of Austin and TxDOT regarding that application and its denial, including the denial itself.\n\n'+
 '3. Records of the Public Spaces Task Force relating to replacement treatments at West 4th and Colorado, including any legal analysis or staff memoranda addressing whether sidewalk art falls outside the state directive, and any cost estimates prepared.\n\n'+
 '4. Any staff analysis of the interaction between a sidewalk art installation at that intersection and planned light rail construction.\n\n'+
 'I would prefer to receive these records electronically. If any portion is withheld, please identify the exemption claimed. If fulfilling this request will exceed $40 in charges, please contact me with an estimate before proceeding.\n\n'+
 'Thank you,\n[YOUR NAME]\n[EMAIL]\n[ADDRESS]';

var TODOS=[
 {id:'t1',cat:'Do it now',min:5,impact:'high',t:'Write and send your letter',
  d:'Tab 3 drafts one in your voice in about thirty seconds. Letters carrying a real name and street address are weighted more heavily than anonymous submissions.',
  links:[['Council email form','https://www.austintexas.gov/email/all-council-members']],
  tplName:'Skip to the letter builder',tpl:null,go:'write'},
 {id:'t2',cat:'Do it now',min:2,impact:'high',t:'Call District 9',
  d:'CM Zo Qadri\'s office, on 512-978-2109. The corner sits in this district, so it is the most relevant call on the list. Thirty seconds, and staff log it by position rather than by eloquence.',
  links:[['Call 512-978-2109','tel:+15129782109'],['Email District 9','https://www.austintexas.gov/email/1426']],tplName:'Copy the phone script',
  tpl:'Hi, I am a constituent in District [#]. I am calling to ask Council Member Qadri to support a rainbow sidewalk treatment at 4th and Colorado, the way San Antonio did on North Main, and to back an LGBTQ+ cultural heritage district designation for that corridor.\n\nSidewalks are not covered by the state order, so this is something the city can lawfully do. Could you log my support? Thank you.'},
 {id:'t3',cat:'Do it now',min:2,impact:'medium',t:'Call the Mayor\'s office',
  d:'Watson has said publicly that the city will "do more". Give him a constituent asking for something specific enough to act on.',
  links:[['Call 512-978-2100','tel:+15129782100'],['Email the Mayor','https://www.austintexas.gov/email/14286']],tplName:'Copy the phone script',
  tpl:'Hi, I am an Austin resident calling about the rainbow crosswalk removed from 4th and Colorado.\n\nI was glad to see the historical marker go up on 21 August. I would like the next step to be a rainbow sidewalk treatment on San Antonio\'s model, plus a cultural heritage district designation for West 4th. Could you log my support? Thank you.'},
 {id:'t4',cat:'Do it now',min:2,impact:'medium',t:'Post it publicly',
  d:'Tag the council members. Public pressure is what got Austin to apply for an exemption in the first place, after more than five thousand people signed.',
  links:[],tplName:'Copy a post',
  tpl:'Austin scraped the rainbow crosswalk at 4th & Colorado in July.\n\nSan Antonio was forced to remove theirs too. They painted the SIDEWALKS instead, two blocks of North Main, about $170k, fully legal, and it needed no council vote because the corridor is a Pride Cultural Heritage District.\n\nThe state order covers roadways. Sidewalks are city property. Austin can do this.\n\n@austintexasgov @MayorAdler #KeepAustinColorful'},
 {id:'t5',cat:'Do it now',min:1,impact:'high',t:'Send this to three people',
  d:'Campaigns are arithmetic. Five thousand signatures moved this city once already, and the budget window closes in days.',
  links:[],tplName:'Copy a message',
  tpl:'Austin lost its rainbow crosswalk at 4th & Colorado last month. San Antonio found a legal way to keep theirs by painting the sidewalks instead, and Austin could do the same.\n\nThe city adopts its budget 12 to 14 August, which is the window to get it funded. Takes five minutes to send a letter: [PASTE LINK]'},

 {id:'t6',cat:'This week',min:60,impact:'highest',t:'Speak at the budget meetings, 12 to 14 August',
  d:'The single highest-leverage item on this list. It is the only week of the year when money is allocated, and public comment is taken. Sign up in advance.',
  links:[['How to sign up','https://www.austintexas.gov/department/public-participation-council-meetings'],['Agenda','https://www.austintexas.gov/council/meetings']],
  tplName:'Copy a one-minute testimony',
  tpl:'Mayor, Council Members. My name is [NAME] and I live in District [#].\n\nI am asking you to fund a rainbow sidewalk treatment at 4th and Colorado in this budget.\n\nWhen San Antonio was forced to remove its crosswalk, it painted the sidewalks along North Main instead. About $170,000. Dedicated in March. Still there. No road funding lost, and a lawsuit against the city failed. It required no council vote, because that corridor had already been designated a Pride Cultural Heritage District.\n\nAustin gave us a mural in June and a historical marker on 21 August, and I am glad of both. I am asking you to build on them with something permanent and underfoot.\n\nI am asking for two things: money in this budget for an interim sidewalk treatment, and a cultural heritage district designation for West 4th so the next council cannot quietly drop it. If light rail is the concern, that is an argument for sequencing the work, not for skipping it.\n\nSan Antonio showed this can be done well. Austin is better placed than most to do it, and I hope you will. Thank you.'},
 {id:'t7',cat:'This week',min:10,impact:'high',t:'Submit written testimony',
  d:'If you cannot make the meeting in person, written comment still enters the record and still gets counted. Lower effort, most of the benefit.',
  links:[['Public participation','https://www.austintexas.gov/department/public-participation-council-meetings']],
  tplName:'Copy the letter builder output',tpl:null,go:'write'},
 {id:'t8',cat:'This week',min:15,impact:'high',t:'Ask a business on the block to sign on',
  d:'San Antonio\'s original crosswalk was funded by nearby businesses, and Dallas\'s bike racks came through a merchants association. A letter from the businesses at 4th and Colorado carries weight that residents cannot supply.',
  links:[['Austin LGBT Chamber','https://www.austinlgbtchamber.com']],tplName:'Copy an email to a business',
  tpl:'Subject: A quick ask about the corner outside your door\n\nHi,\n\nI am a neighbor writing about the rainbow crosswalk the state made the city remove at 4th and Colorado last month.\n\nThere is a lawful way to get the color back. San Antonio painted the sidewalks instead of the road, because the state order only reaches the roadway. Dallas did its version with private donations and city labor. Both routes are open to Austin.\n\nWould your business be willing to add its name to a letter to the City Council asking for a sidewalk treatment at that corner, and for the West 4th corridor to be designated an LGBTQ+ cultural heritage district? A signature is all it takes, and businesses on the block are the voices council listens to hardest on streetscape questions.\n\nHappy to send the draft letter over.\n\nThank you,\n[YOUR NAME]'},

 {id:'t9',cat:'Go deeper',min:20,impact:'highest',t:'Recruit a council sponsor',
  d:'Nothing reaches the agenda without a member willing to carry it. This is the step that turns a pile of letters into an actual item, and it is the least crowded part of the process.',
  links:[['Find your member','https://www.austintexas.gov/council/district-map']],
  tplName:'Copy a note to a council office',
  tpl:'Subject: Sponsoring a rainbow sidewalk item for 4th and Colorado\n\nDear Council Member [NAME],\n\nI am a constituent in District [#]. I am writing to ask whether you would consider sponsoring an item directing staff to scope and cost a rainbow sidewalk treatment at 4th and Colorado, and to begin the process of designating the West 4th corridor an LGBTQ+ cultural heritage district.\n\nThe precedent is close at hand. San Antonio, facing the same TxDOT directive, painted the sidewalks along North Main instead of the roadway. The installation cost roughly $170,000, was dedicated in March 2026, survived a legal challenge, and cost the city no road funding. It did not require a council vote, because the corridor already held Pride Cultural Heritage District status.\n\nA resolution directing staff to scope the work commits no money and creates a record with a deadline. Community donations are on the table if cost is the obstacle, as they were in Dallas.\n\nI would welcome the chance to discuss it with your office.\n\n[YOUR NAME]\n[ADDRESS]'},
 {id:'t10',cat:'Go deeper',min:60,impact:'high',t:'Take it to the LGBTQ+ Quality of Life Commission',
  d:'Smaller room, far shorter speaking queue, and its recommendations travel up to council through the Joint Inclusion Committee. Often the faster route in.',
  links:[['Boards & Commissions','https://www.austintexas.gov/content/boards-and-commissions-information-center']],tplName:null,tpl:null},
 {id:'t11',cat:'Go deeper',min:10,impact:'medium',t:'File a records request',
  d:'Ask for the exemption application, TxDOT\'s denial, and the task force\'s analysis. Understanding the real constraints makes your ask sharper and shows staff you have done the homework. Ten business days to respond, and you need give no reason for asking.',
  links:[],tplName:'Copy the records request',tpl:PIR},
 {id:'t12',cat:'Go deeper',min:20,impact:'medium',t:'Go and read the marker, then say thank you',
  d:'It went up on 21 August at 4th and Colorado, under the Bettie Naylor sign. Go and read it; it names Austin queer history back to the Gay Liberation Front chapter founded here in 1970. Then send one line of thanks to the LGBTQ+ Quality of Life Commission, who spent three years on it. Offices hear complaints far more often than thanks, and it is the cheapest goodwill available before you ask for the next thing.',
  links:[['The Chronicle\'s piece on the marker','https://www.austinchronicle.com/category-qmmunity/marking-queer-history-on-austins-fourth-street/']],tplName:null,tpl:null}
];

/* ════════ state ════════ */
var KEY='rcap-v2';
var S={asks:{},funds:{},done:{}};
ASKS.forEach(function(a){S.asks[a.id]=a.on});
FUNDS.forEach(function(f){S.funds[f.id]=f.on});
try{var raw=localStorage.getItem(KEY); if(raw){var p=JSON.parse(raw);
  if(p.asks)S.asks=Object.assign(S.asks,p.asks);
  if(p.funds)S.funds=Object.assign(S.funds,p.funds);
  if(p.done)S.done=p.done;}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

/* ════════ helpers ════════ */
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
/* Bind an event only if the element is on this page. One script now serves
   five pages, so "that element is not here" is the normal case, not a bug. */
function on(sel,ev,fn,opts){ var e=(typeof sel==='string')?$(sel):sel; if(e) e.addEventListener(ev,fn,opts); return e }
function el(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e}
var toastT;
function toast(m){var t=$('#toast'); t.textContent=m; t.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(function(){t.classList.remove('on')},2300)}
function copy(text,msg){
  function ok(){toast(msg||'Copied')}
  function fb(){var ta=el('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select();
    try{document.execCommand('copy');ok()}catch(e){toast('Press Cmd/Ctrl+C to copy')} document.body.removeChild(ta);}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(ok,fb)}else fb();
}
function download(name,text,mime){
  var b=new Blob([text],{type:mime||'text/plain;charset=utf-8'});
  var u=URL.createObjectURL(b), a=el('a'); a.href=u; a.download=name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){URL.revokeObjectURL(u)},1500);
}
function strip(h){var d=el('div',null,h); return d.textContent||''}
function reduceMotion(){
  try{ return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) }
  catch(e){ return false }
}

/* ════════ external links: open, or fall back to copying ════════
   The artifact renders in a sandboxed view that may block window.open,
   which makes every link look dead. Try to open, and if we are blocked,
   put the URL on the clipboard so the link is never a dead end. */
document.addEventListener('click',function(e){
  var a=e.target && e.target.closest && e.target.closest('a[href^="http"]');
  if(!a) return;
  e.preventDefault();
  var w=null;
  try{ w=window.open(a.href,'_blank','noopener'); }catch(err){}
  if(!w || w.closed || typeof w.closed==='undefined'){
    copy(a.href,'Your browser blocked the popup, so the link is copied instead');
  }
});

/* ════════ pages ════════
   This used to be a tab strip sitting a third of the way down one very long
   page, so you had to scroll past the argument to discover there was more of
   it. It is four real pages now, and "activate" means "go there".

   Links shared before the split (#case, #play, #write, #act) still work: they
   redirect once, on load, rather than landing people on a page with no tabs. */
var PAGE_FOR={
  'case' :'/background.html',
  'play' :'/act.html#asks',
  'write':'/act.html#letter',
  'act'  :'/act.html'
};
function activate(name){
  var to=PAGE_FOR[name]; if(!to) return;
  var toPath=to.split('#')[0], frag=to.split('#')[1];
  var here=location.pathname.replace(/\/index\.html$/,'/') || '/';
  if(here===toPath){
    var el=frag && document.getElementById(frag);
    if(el){
      el.scrollIntoView({behavior:reduceMotion()?'auto':'smooth', block:'start'});
      var h=el.querySelector('h1,h2'); if(h){ h.setAttribute('tabindex','-1'); h.focus({preventScroll:true}) }
      return;
    }
    window.scrollTo({top:0,behavior:reduceMotion()?'auto':'smooth'});
    return;
  }
  location.href=to;
}
(function(){
  var h=(location.hash||'').replace(/^#\/?/,'').split('?')[0];
  if(PAGE_FOR[h] && /(^\/$|\/index\.html$)/.test(location.pathname)) location.replace(PAGE_FOR[h]);
})();
var toWriteBtn=$('#toWrite');
if(toWriteBtn) toWriteBtn.addEventListener('click',function(){activate('write')});

/* ════════ hero illustrations ════════ */
var PRIDE=['#e40303','#ff8c00','#ffd500','#008026','#24408e','#732982'];

/* Plan view: the intersection from above. */
function planSVG(rainbow){
  var s='<svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="'+
    (rainbow?'The intersection with rainbow sidewalks':'The intersection today, in grey')+'">';
  if(rainbow){
    s+='<defs><pattern id="rbH" patternUnits="userSpaceOnUse" width="72" height="26">';
    PRIDE.forEach(function(c,i){s+='<rect width="12" height="26" x="'+(i*12)+'" fill="'+c+'"/>'});
    s+='</pattern><pattern id="rbV" patternUnits="userSpaceOnUse" width="26" height="72">';
    PRIDE.forEach(function(c,i){s+='<rect width="26" height="12" y="'+(i*12)+'" fill="'+c+'"/>'});
    s+='</pattern></defs>';
  }
  s+='<rect width="640" height="400" fill="#3b3b44"/>';
  s+='<g fill="#d9d4c8"><rect x="0" y="0" width="238" height="128"/><rect x="402" y="0" width="238" height="128"/>'+
     '<rect x="0" y="292" width="238" height="108"/><rect x="402" y="292" width="238" height="108"/></g>';
  s+='<g fill="#c9c3b5">'+
     '<rect x="24" y="22" width="66" height="44" rx="3"/><rect x="112" y="22" width="52" height="44" rx="3"/>'+
     '<rect x="440" y="22" width="72" height="52" rx="3"/><rect x="540" y="30" width="62" height="44" rx="3"/>'+
     '<rect x="30" y="318" width="58" height="46" rx="3"/><rect x="120" y="318" width="70" height="46" rx="3"/>'+
     '<rect x="436" y="316" width="66" height="50" rx="3"/><rect x="530" y="322" width="70" height="44" rx="3"/></g>';
  var fillH=rainbow?'url(#rbH)':'#b9b3a6', fillV=rainbow?'url(#rbV)':'#b9b3a6';
  s+='<g><rect x="0" y="128" width="260" height="26" fill="'+fillH+'"/><rect x="380" y="128" width="260" height="26" fill="'+fillH+'"/>'+
     '<rect x="0" y="266" width="260" height="26" fill="'+fillH+'"/><rect x="380" y="266" width="260" height="26" fill="'+fillH+'"/>'+
     '<rect x="234" y="0" width="26" height="154" fill="'+fillV+'"/><rect x="380" y="0" width="26" height="154" fill="'+fillV+'"/>'+
     '<rect x="234" y="266" width="26" height="134" fill="'+fillV+'"/><rect x="380" y="266" width="26" height="134" fill="'+fillV+'"/></g>';
  s+='<g stroke="#f0e9c8" stroke-width="2.5" stroke-dasharray="16 14" opacity=".65">'+
     '<line x1="0" y1="210" x2="228" y2="210"/><line x1="412" y1="210" x2="640" y2="210"/>'+
     '<line x1="320" y1="0" x2="320" y2="120"/><line x1="320" y1="300" x2="320" y2="400"/></g>';
  /* crosswalk bars: identical in both states, this is the point */
  s+='<g fill="#efece0" opacity=".92">';
  [158,238].forEach(function(y){ [266,288,310,332,354].forEach(function(x){
    s+='<rect x="'+x+'" y="'+y+'" width="11" height="24"/>'; }); });
  [264,352].forEach(function(x){ [160,182,204,226].forEach(function(y){
    s+='<rect x="'+x+'" y="'+y+'" width="24" height="11"/>'; }); });
  s+='</g>';
  s+=roadLabel(64,244,'W 4TH ST',0)+roadLabel(348,332,'COLORADO ST',-90);
  return s+'</svg>';
}

/* A street name set on its own plate, clear of the lane markings. */
function roadLabel(x,y,txt,rot){
  var w=txt.length*8.4+18, h=21;
  var t=rot?' transform="rotate('+rot+' '+x+' '+y+')"':'';
  return '<g'+t+'>'+
    '<rect x="'+(x-9)+'" y="'+(y-15)+'" width="'+w+'" height="'+h+'" rx="4" fill="#2b2b33" opacity=".72"/>'+
    '<text x="'+x+'" y="'+y+'" font-family="system-ui,sans-serif" font-size="12" font-weight="700" '+
    'fill="#f0ece2" letter-spacing="2.2">'+txt+'</text></g>';
}

/* Street view: standing on the corner looking down 4th, drawn in one-point perspective. */
function streetSVG(rainbow){
  var HZ=178, BOT=400, SPAN=BOT-HZ;
  // edge lines, near value at y=400 and far value at the horizon
  var E={lo:[-24,270],li:[168,300],ri:[472,340],ro:[664,370]};
  function ex(k,y){var f=(BOT-y)/SPAN; return E[k][0]+(E[k][1]-E[k][0])*f}
  // foreshortened depth steps
  var ys=[]; for(var i=0;i<17;i++) ys.push(HZ+SPAN*Math.pow(0.80,i));
  function quad(a,b,c,d){return a[0]+','+a[1]+' '+b[0]+','+b[1]+' '+c[0]+','+c[1]+' '+d[0]+','+d[1]}

  var s='<svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" role="img" aria-label="'+
    (rainbow?'Street level view of the corner with rainbow sidewalks':'Street level view of the corner today, in grey')+'">';
  s+='<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">'+
     '<stop offset="0%" stop-color="#9c86c4"/><stop offset="48%" stop-color="#c9b5d8"/>'+
     '<stop offset="100%" stop-color="#f6dcc0"/></linearGradient></defs>';
  s+='<rect width="640" height="'+HZ+'" fill="url(#sky)"/>';
  s+='<rect y="'+HZ+'" width="640" height="'+(BOT-HZ)+'" fill="#4a4a52"/>';

  // building facades, converging on the vanishing point
  s+='<polygon points="'+quad([-24,BOT],[270,HZ],[270,HZ-30],[-24,20])+'" fill="#c8c1b2"/>';
  s+='<polygon points="'+quad([664,BOT],[370,HZ],[370,HZ-30],[664,20])+'" fill="#bab3a4"/>';
  // windows: inset inside each depth slice so they read as openings, not fans
  var ftop=function(y){var f=(BOT-y)/SPAN; return 20+((HZ-30)-20)*f};
  var lerp=function(a,b,k){return a+(b-a)*k};
  ['l','r'].forEach(function(side){
    for(var i=1;i<9;i++){
      var y0=HZ+SPAN*Math.pow(0.78,i), y1=HZ+SPAN*Math.pow(0.78,i+1);
      var e0=side==='l'?ex('lo',y0):ex('ro',y0), e1=side==='l'?ex('lo',y1):ex('ro',y1);
      var yn=lerp(y0,y1,0.18), yf=lerp(y0,y1,0.82);
      var xn=lerp(e0,e1,0.18),  xf=lerp(e0,e1,0.82);
      var Tn=ftop(yn), Tf=ftop(yf);
      var hn=yn-Tn, hf=yf-Tf;
      for(var r=0;r<3;r++){
        var an=Tn+hn*(0.14+r*0.25), af=Tf+hf*(0.14+r*0.25);
        var bn=an+hn*0.15,          bf=af+hf*0.15;
        s+='<polygon points="'+quad([xn,an],[xf,af],[xf,bf],[xn,bn])+'" fill="#8b8475" opacity=".5"/>';
      }
    }
  });

  // road surface
  s+='<polygon points="'+quad([168,BOT],[472,BOT],[340,HZ],[300,HZ])+'" fill="#42424a"/>';
  // center line, foreshortened dashes
  for(var i=0;i<13;i+=2){
    var ya=ys[i], yb=ys[i+1]; if(yb===undefined) break;
    var ca=(ex('li',ya)+ex('ri',ya))/2, cb=(ex('li',yb)+ex('ri',yb))/2;
    var wa=Math.max(1,(ex('ri',ya)-ex('li',ya))*0.012), wb=Math.max(.6,(ex('ri',yb)-ex('li',yb))*0.012);
    s+='<polygon points="'+quad([ca-wa,ya],[ca+wa,ya],[cb+wb,yb],[cb-wb,yb])+'" fill="#efe4b8" opacity=".7"/>';
  }

  // sidewalks: the only thing that changes
  for(var i=0;i<ys.length-1;i++){
    var y0=ys[i], y1=ys[i+1];
    var col=rainbow?PRIDE[i%6]:(i%2?'#b4ada0':'#bab3a6');
    s+='<polygon points="'+quad([ex('lo',y0),y0],[ex('li',y0),y0],[ex('li',y1),y1],[ex('lo',y1),y1])+'" fill="'+col+'"/>';
    s+='<polygon points="'+quad([ex('ri',y0),y0],[ex('ro',y0),y0],[ex('ro',y1),y1],[ex('ri',y1),y1])+'" fill="'+col+'"/>';
  }
  // curbs
  s+='<polygon points="'+quad([ex('li',BOT),BOT],[ex('li',BOT)+7,BOT],[ex('li',HZ)+1,HZ],[ex('li',HZ),HZ])+'" fill="#8d8779"/>';
  s+='<polygon points="'+quad([ex('ri',BOT)-7,BOT],[ex('ri',BOT),BOT],[ex('ri',HZ),HZ],[ex('ri',HZ)-1,HZ])+'" fill="#8d8779"/>';

  // the crossing ahead: unchanged white bars, laid in perspective
  var cy0=ys[4], cy1=ys[6];
  for(var k=0;k<5;k++){
    var f0=k/5+0.02, f1=(k+0.62)/5+0.02;
    var la0=ex('li',cy0)+(ex('ri',cy0)-ex('li',cy0))*f0, la1=ex('li',cy0)+(ex('ri',cy0)-ex('li',cy0))*f1;
    var lb0=ex('li',cy1)+(ex('ri',cy1)-ex('li',cy1))*f0, lb1=ex('li',cy1)+(ex('ri',cy1)-ex('li',cy1))*f1;
    s+='<polygon points="'+quad([la0,cy0],[la1,cy0],[lb1,cy1],[lb0,cy1])+'" fill="#efece0" opacity=".9"/>';
  }

  // lamp posts and people, scaled by depth
  [[2,'l'],[5,'l'],[3,'r'],[7,'r']].forEach(function(p){
    var y=ys[p[0]], sc=(y-HZ)/SPAN;
    var x=p[1]==='l'?(ex('lo',y)+ex('li',y))/2*0.98:(ex('ri',y)+ex('ro',y))/2*1.01;
    var h=132*sc+8;
    s+='<rect x="'+(x-2.2*sc-0.6)+'" y="'+(y-h)+'" width="'+(4.4*sc+1.2)+'" height="'+h+'" fill="#6f6a5e"/>';
    s+='<rect x="'+(x-9*sc-2)+'" y="'+(y-h-5*sc-2)+'" width="'+(18*sc+4)+'" height="'+(6*sc+2.5)+'" rx="1.5" fill="#5d5950"/>';
    if(rainbow){
      for(var c=0;c<3;c++) s+='<rect x="'+(x-8*sc-1.6)+'" y="'+(y-h+(8+c*7)*sc)+'" width="'+(16*sc+3)+'" height="'+(6*sc+1.2)+'" fill="'+PRIDE[(p[0]+c)%6]+'"/>';
    }
  });
  [[1,'l',0.42],[3,'r',0.55],[6,'l',0.5]].forEach(function(p){
    var y=ys[p[0]], sc=(y-HZ)/SPAN;
    var x=p[1]==='l'?ex('lo',y)+(ex('li',y)-ex('lo',y))*p[2]:ex('ri',y)+(ex('ro',y)-ex('ri',y))*p[2];
    var h=96*sc+7, w=26*sc+2.4;
    s+='<rect x="'+(x-w/2)+'" y="'+(y-h)+'" width="'+w+'" height="'+(h*0.68)+'" rx="'+(w*0.42)+'" fill="#3a3a44" opacity=".78"/>';
    s+='<circle cx="'+x+'" cy="'+(y-h-w*0.28)+'" r="'+(w*0.36)+'" fill="#3a3a44" opacity=".78"/>';
  });

  s+=roadLabel(34,HZ-14,'W 4TH ST',0);
  return s+'</svg>';
}

/* ════════ compare slider ════════ */
var CVIEW='plan';
function renderCompare(){
  if(!$('#cmpBase')) return;   // not on this page
  var f=CVIEW==='plan'?planSVG:streetSVG;
  $('#cmpBase').innerHTML=f(false);
  $('#cmpAfter').innerHTML=f(true);
}
$$('.ct').forEach(function(b){
  b.addEventListener('click',function(){
    $$('.ct').forEach(function(x){x.classList.toggle('on',x===b)});
    CVIEW=b.dataset.cview; renderCompare();
    toast(CVIEW==='plan'?'Plan view, from above':'Street view, standing on the corner');
  });
});
renderCompare();
(function(){
  var r=$('#cmpRange'), after=$('#cmpAfter'), div=$('#cmpDiv');
  if(!r||!after||!div) return;   // not on this page
  function apply(){
    var v=+r.value;
    after.style.clipPath='inset(0 0 0 '+v+'%)';
    after.style.webkitClipPath='inset(0 0 0 '+v+'%)';
    div.style.left=v+'%';
    r.setAttribute('aria-valuetext', v<15?'Showing today':v>85?'Showing the proposal':Math.round(v)+'% today, '+Math.round(100-v)+'% proposed');
  }
  r.addEventListener('input',apply);
  apply();
  // one gentle sweep on first view so people notice the handle moves
  var touched=false;
  r.addEventListener('pointerdown',function(){touched=true});
  r.addEventListener('keydown',function(){touched=true});
  setTimeout(function(){
    if(touched||reduceMotion()) return;
    var from=50,to=76,dur=1400,t0=null;
    function step(ts){
      if(touched)return;
      if(t0===null)t0=ts;
      var k=Math.min((ts-t0)/dur,1);
      // out-and-back: 0 -> 1 -> 0
      var swing=Math.sin(k*Math.PI);
      var eased=1-Math.pow(1-swing,2);
      r.value=Math.round(from+(to-from)*eased);
      apply();
      if(k<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  },800);
})();

/* ════════ timeline ════════ */
(function(){
  var m=$('#timeline'); if(!m) return;   // not on this page
  TIMELINE.forEach(function(e){
    var li=el('div','tli'+(e.k?' key':'')+(e.k?' open':''));
    li.innerHTML='<div class="tlh" role="button" tabindex="0" aria-expanded="'+(e.k?'true':'false')+'"><div class="tld">'+e.d+'</div><div class="tlt">'+e.t+'</div><div class="tlchev">▶</div></div>'+
                 '<div class="tlb"><div class="tlb-in">'+e.b+srcLinks(e.s)+'</div></div>';
    var hd=$('.tlh',li);
    function tgl(){ li.classList.toggle('open'); hd.setAttribute('aria-expanded',li.classList.contains('open')?'true':'false'); }
    hd.addEventListener('click',tgl);
    hd.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();tgl()}});
    m.appendChild(li);
  });
})();

/* ════════ map ════════ */
var COLORS={win:'#0a6b45',gap:'#8f5100',none:'#b9b9c0'};
var STATUS={win:'Color restored',gap:'Open opportunity',none:'Awaiting a champion'};
var NS='http://www.w3.org/2000/svg';
function mk(t,attrs){var e=document.createElementNS(NS,t);
  for(var k in attrs) e.setAttribute(k,attrs[k]); return e}

(function(){
  var layer=$('#pinLayer'); if(!layer) return;   // not on this page
  CITIES.forEach(function(c,i){
    var dx=c.lp[0], dy=c.lp[1], anchor=c.lp[2];
    var lx=c.x+dx, ly=c.y+dy;
    var g=mk('g',{'class':'pin',tabindex:'0',role:'button'});
    g.dataset.id=c.id;
    g.setAttribute('aria-label',c.name+': '+c.short+'. '+STATUS[c.status]);
    g.style.animationDelay=(0.3+i*0.1)+'s';

    // leader line from the dot out to the label
    var lead=mk('line',{'class':'leader',x1:c.x+(dx>0?4.6:-4.6),y1:c.y+0.35,x2:lx-(dx>0?1.6:-1.6),y2:ly-1.2});
    // label plate, sized to the text
    // plate width from the wider of the two lines, at their own font sizes
    var bw=Math.max(c.name.length*1.72, c.short.length*1.32)+6, bh=8.6;
    var bx=anchor==='start'?lx-1.6:lx-bw+1.6;
    var plate=mk('rect',{'class':'labbg',x:bx,y:ly-6.1,width:bw,height:bh,rx:2.2});
    var t1=mk('text',{'class':'lab',x:anchor==='start'?lx+0.9:lx-0.9,y:ly-2.2,'text-anchor':anchor});
    t1.textContent=c.name;
    var t2=mk('text',{'class':'sub',x:anchor==='start'?lx+0.9:lx-0.9,y:ly+1.3,'text-anchor':anchor});
    t2.textContent=c.short;

    var halo=mk('circle',{'class':'halo',cx:c.x,cy:c.y,r:4.4,stroke:COLORS[c.status]});
    var ring=mk('circle',{'class':'ring2',cx:c.x,cy:c.y,r:3.0});
    var dot=mk('circle',{'class':'dot',cx:c.x,cy:c.y,r:2.3,fill:COLORS[c.status]});

    [halo,lead,plate,t1,t2,ring,dot].forEach(function(n){g.appendChild(n)});
    g.addEventListener('click',function(){selectCity(c.id)});
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectCity(c.id)}});
    layer.appendChild(g);
  });
})();

/* corridor illustration, a block of street rendered per city */
var RB=['#e40303','#ff8c00','#ffd500','#008026','#24408e','#732982'];
function corridorSVG(c){
  var s='<svg viewBox="0 0 400 148" role="img" aria-label="Illustration of '+c.street+'">';
  s+='<rect width="400" height="148" fill="#3b3b44"/>';
  // buildings
  s+='<g fill="#d9d4c8"><rect x="0" y="0" width="400" height="34"/><rect x="0" y="114" width="400" height="34"/></g>';
  s+='<g fill="#c9c3b5">';
  [10,74,140,206,272,338].forEach(function(x){s+='<rect x="'+x+'" y="6" width="50" height="22" rx="2.5"/>'});
  [26,96,168,240,312].forEach(function(x){s+='<rect x="'+x+'" y="122" width="46" height="20" rx="2.5"/>'});
  s+='</g>';
  // sidewalks
  if(c.sidewalk==='rainbow'){
    for(var i=0;i<400;i+=13){
      var col=RB[(i/13)%6];
      s+='<rect x="'+i+'" y="34" width="13" height="17" fill="'+col+'"/>';
      s+='<rect x="'+i+'" y="97" width="13" height="17" fill="'+col+'"/>';
    }
  } else {
    s+='<rect x="0" y="34" width="400" height="17" fill="#b9b3a6"/><rect x="0" y="97" width="400" height="17" fill="#b9b3a6"/>';
  }
  // lane dashes
  s+='<g stroke="#f0e9c8" stroke-width="2.4" stroke-dasharray="15 13" opacity=".6"><line x1="0" y1="74" x2="400" y2="74"/></g>';
  // plain compliant crossing
  s+='<g fill="#efece0" opacity=".9">';
  [0,1,2,3].forEach(function(k){s+='<rect x="'+(300+k*15)+'" y="53" width="8" height="42"/>'});
  s+='</g>';
  // per-city feature
  if(c.feature==='steps'){
    for(var k=0;k<6;k++) s+='<rect x="150" y="'+(4+k*4.6)+'" width="96" height="4.6" fill="'+RB[k]+'"/>';
    s+='<rect x="150" y="32" width="96" height="3" fill="#8f8a7c"/>';
    // bike racks on the sidewalk
    [60,92,124].forEach(function(x,ix){
      s+='<path d="M'+x+',108 v-10 h14 v10" fill="none" stroke="'+RB[ix*2]+'" stroke-width="3.2" stroke-linecap="round"/>';
    });
  }
  if(c.feature==='lamps'){
    [46,130,214,298].forEach(function(x,ix){
      s+='<rect x="'+(x-1.6)+'" y="36" width="3.2" height="14" fill="#7d7768"/>';
      s+='<rect x="'+(x-9)+'" y="34" width="18" height="4" fill="'+RB[(ix*2)%6]+'"/>';
      s+='<rect x="'+(x-9)+'" y="38" width="18" height="4" fill="'+RB[(ix*2+1)%6]+'"/>';
    });
  }
  if(c.feature==='mural'){
    s+='<rect x="120" y="6" width="120" height="22" rx="2" fill="#8e6fb8" opacity=".9"/>';
    [132,152,172,192,212].forEach(function(x,ix){
      s+='<circle cx="'+x+'" cy="17" r="5" fill="'+RB[ix]+'" opacity=".95"/>';
    });
    s+='<rect x="262" y="99" width="5" height="13" fill="#6b6558"/><rect x="256" y="94" width="17" height="8" rx="1.5" fill="#9b9484"/>';
  }
  s+=roadLabel(14,80,c.street.toUpperCase(),0);
  s+='</svg>';
  var cap = c.sidewalk==='rainbow' ? 'Rainbow sidewalks, both sides'
    : c.feature==='steps' ? 'Rainbow steps and bike racks'
    : c.feature==='lamps' ? 'Pride-wrapped lamp posts'
    : c.feature==='mural' ? 'A mural on a wall, a marker on the corner'
    : 'Grey. Nothing put back.';
  return '<div class="corridor"><span class="cap">'+cap+'</span>'+s+'</div>';
}

function selectCity(id){
  if(!$('#pinLayer')) return;   // not on this page
  var layer=$('#pinLayer');
  /* SVG has no z-index, so the selected pin has to be last in document order
     to paint on top. Two bugs came out of doing that naively: moving a node
     blurs it, so selecting with the keyboard lost focus, and repeated moves
     permanently shuffled tab order away from the geographic one.
     So: restore the original order first, then raise one pin, then put focus
     back where the person left it. */
  if(!layer._order) layer._order=$$('#txmap .pin');
  var had=document.activeElement;
  var sel=null;
  layer._order.forEach(function(p){
    var on=p.dataset.id===id;
    p.classList.toggle('sel',on);
    p.setAttribute('aria-pressed',on?'true':'false');
    if(on) sel=p; else layer.appendChild(p);
  });
  if(sel) layer.appendChild(sel);
  if(had && had.closest && had.closest('#pinLayer')) { try{ had.focus({preventScroll:true}) }catch(e){} }
  $$('#cmpTable tbody tr').forEach(function(r){r.classList.toggle('hi',r.dataset.id===id)});
  var c=CITIES.filter(function(x){return x.id===id})[0];
  var cls=c.status==='win'?'t-win':(c.status==='gap'?'t-gap':'t-none');
  var h='<span class="tag '+cls+'">'+STATUS[c.status]+'</span><h3>'+c.name+'</h3>'+
        '<p class="blurb">'+c.what+'</p>'+corridorSVG(c)+'<dl>';
  c.rows.forEach(function(r){h+='<dt>'+r[0]+'</dt><dd>'+r[1]+'</dd>'});
  var card=$('#citycard');
  card.innerHTML=h+'</dl>'+srcLinks(c.s);
  card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
}

/* ════════ comparison table ════════ */
var sortKey='rank', sortDir=1;
function renderTable(){
  if(!$('#cmpTable')) return;   // not on this page
  var rows=CITIES.slice().sort(function(a,b){
    var x=a[sortKey],y=b[sortKey];
    if(typeof x==='string'){x=x.toLowerCase();y=y.toLowerCase()}
    return x<y?-1*sortDir:x>y?1*sortDir:0;
  });
  var tb=$('#cmpTable tbody'); tb.innerHTML='';
  rows.forEach(function(c){
    var tr=el('tr'); tr.dataset.id=c.id;
    if($$('#txmap .pin.sel')[0]&&$$('#txmap .pin.sel')[0].dataset.id===c.id) tr.className='hi';
    tr.innerHTML='<td class="cty"><span class="dotc" style="background:'+COLORS[c.status]+'"></span>'+c.name+'</td>'+
      '<td>'+c.replaced+'</td><td>'+c.payer+'</td>'+
      '<td><span class="pill '+(c.vote==='no'?'no':c.vote==='na'?'na':'yes')+'">'+c.voteTxt+'</span></td>'+
      '<td>'+STATUS[c.status]+'</td>';
    tr.setAttribute('tabindex','0'); tr.setAttribute('role','button');
    tr.setAttribute('aria-label','Show details for '+c.name);
    tr.addEventListener('click',function(){selectCity(c.id)});
    tr.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();selectCity(c.id)}});
    tb.appendChild(tr);
  });
  $$('#cmpTable th').forEach(function(th){
    th.classList.remove('asc','desc');
    if(th.dataset.sort===sortKey) th.classList.add(sortDir===1?'asc':'desc');
  });
}
$$('#cmpTable th.sortable').forEach(function(th){
  if(!$('.ar',th)) th.insertAdjacentHTML('beforeend','<span class="ar">▲</span>');
  th.addEventListener('click',function(){
    var k=th.dataset.sort;
    if(k===sortKey) sortDir=-sortDir; else {sortKey=k; sortDir=1}
    if($('#cmpTable')) renderTable();
  });
});
$$('.vt').forEach(function(b){
  b.addEventListener('click',function(){
    $$('.vt').forEach(function(x){x.classList.toggle('on',x===b)});
    var map=b.dataset.view==='map';
    $('#mapView').hidden=!map; $('#tableView').hidden=map;
  });
});
renderTable();
selectCity('sanantonio');

/* ════════ playbook ════════ */
var CHECK='<svg viewBox="0 0 12 12" fill="none"><path d="M2.4 6.1l2.4 2.4 4.8-5.1" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function renderAsks(list,store,mount){
  if(!$(mount)) return;   // not on this page
  var m=$(mount); m.innerHTML='';
  list.forEach(function(a){
    var d=el('div','ask'+(store[a.id]?' on':''));
    d.setAttribute('role','checkbox'); d.setAttribute('tabindex','0');
    d.setAttribute('aria-checked',store[a.id]?'true':'false');
    var chips=a.chips.map(function(c){return '<span class="chip '+(c[1]||'')+'">'+c[0]+'</span>'}).join('');
    d.innerHTML='<div class="top"><div class="box">'+CHECK+'</div><div class="ttl">'+a.ttl+'</div></div>'+
                '<div class="desc">'+a.desc+'</div><div class="meta">'+chips+'</div>';
    function tog(){store[a.id]=!store[a.id]; d.classList.toggle('on',store[a.id]);
      d.setAttribute('aria-checked',store[a.id]?'true':'false'); save(); renderPicked(); badge()}
    d.addEventListener('click',tog);
    d.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tog()}});
    m.appendChild(d);
  });
}
renderAsks(ASKS,S.asks,'#askList');
renderAsks(FUNDS,S.funds,'#fundList');
(function(){
  var m=$('#objList'); if(!m) return;   // not on this page
  OBJS.forEach(function(o){
    var d=el('div','obj');
    d.innerHTML='<div class="obh" role="button" tabindex="0" aria-expanded="false"><span class="obq">The question</span><span class="qt">“'+o.q+'”</span><span class="chev">▶</span></div>'+
                '<div class="obb"><div class="obb-in">'+o.a+srcLinks(o.s)+'</div></div>';
    var oh=$('.obh',d);
    function ot(){ d.classList.toggle('open'); oh.setAttribute('aria-expanded',d.classList.contains('open')?'true':'false'); }
    oh.addEventListener('click',ot);
    oh.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();ot()}});
    m.appendChild(d);
  });
})();

function chosen(){
  return {asks:ASKS.filter(function(x){return S.asks[x.id]}), funds:FUNDS.filter(function(x){return S.funds[x.id]})};
}
function badge(){
  var n=chosen().asks.length;
  var b=$('#askBadge'); if(b){ b.textContent=n; b.style.display=n?'inline-block':'none' }
  var c=$('#selCount'); if(c) c.innerHTML='<b>'+n+'</b> ask'+(n===1?'':'s')+' selected';
}
function renderPicked(){
  if(!$('#pickedSummary')) return;   // not on this page
  var c=chosen(), n=c.asks.length+c.funds.length;
  var p=$('#pickedSummary');
  if(!c.asks.length){
    p.innerHTML='<span class="pi">👉</span><span>You haven\'t selected any asks yet. Head to <b>The playbook</b> and pick a few. Your letter is built from them.</span>'; return;
  }
  p.innerHTML='<span class="pi">✓</span><span>Your letter will ask for <b>'+c.asks.length+'</b> thing'+(c.asks.length===1?'':'s')+
    (c.funds.length?' and suggest <b>'+c.funds.length+'</b> way'+(c.funds.length===1?'':'s')+' to pay for '+(c.asks.length===1?'it':'them'):'')+
    '. Change them in <b>The playbook</b>.</span>';
}
badge(); renderPicked();

/* ════════ connection chips (multi-select) ════════ */
var CONNS=['I live in Austin','I live or work downtown','I own or run a business nearby',
  'I am a parent raising kids here','I am LGBTQ+ and this district is mine',
  'I moved to Austin partly because of places like this','I am an ally who walks past it every day',
  'I was at the vigil','I have family who visit this street'];
var connSel={0:true};
(function(){
  var m=$('#f-conn'); if(!m) return;   // not on this page
  CONNS.forEach(function(txt,i){
    var b=el('button','cchip'+(connSel[i]?' on':''));
    b.type='button'; b.setAttribute('aria-pressed',connSel[i]?'true':'false');
    b.innerHTML='<span class="tick">'+CHECK.replace(/#fff/g,'currentColor')+'</span><span>'+txt+'</span>';
    b.addEventListener('click',function(){
      connSel[i]=!connSel[i]; b.classList.toggle('on',connSel[i]);
      b.setAttribute('aria-pressed',connSel[i]?'true':'false');
    });
    m.appendChild(b);
  });
})();
function connText(){
  var picked=CONNS.filter(function(_,i){return connSel[i]});
  return picked.length?picked.join('; '):'A resident of Austin';
}

/* ════════ council district from the address ════════
   One same-origin call to /api/district. The worker does the geocode and the
   point-in-district query server-side, because the Census geocoder answers
   servers but returns 503 to anything sending a browser Origin header.

   This is still progressive enhancement: any failure falls back silently to
   the ZIP hint below, which narrows the choice but never fills the field in. */

var ZIP_HINT={
  '78701':[9],'78702':[3,1],'78703':[10,9],'78704':[9,5,3],'78705':[9],
  '78717':[6],'78719':[2],'78721':[1],'78722':[9,1],'78723':[1],'78724':[1],'78725':[1],
  '78726':[6],'78727':[7],'78728':[7],'78729':[6],'78730':[10],'78731':[10],'78732':[10],
  '78733':[8,10],'78734':[10],'78735':[8],'78736':[8],'78737':[8],'78738':[8,10],'78739':[8],
  '78741':[3,2],'78742':[3],'78744':[2],'78745':[5],'78746':[10],'78747':[2],'78748':[5],
  '78749':[8,5],'78750':[6],'78751':[9],'78752':[4],'78753':[4,7,1],'78754':[1],
  '78756':[7,9],'78757':[7],'78758':[7,4],'78759':[6,7]
};
var MAPLINK='<a href="https://www.austintexas.gov/council/district-map" target="_blank" rel="noopener">official district lookup</a>';

/* The matched address comes back from a third party (Census, via our worker)
   and lands in innerHTML, so it gets escaped. Not to be confused with esc(),
   which escapes for iCalendar and would do nothing useful here. */
function escHTML(s){
  return String(s==null?'':s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
var distTouched=false, lookupSeq=0;
var distSel=$('#f-dist');
if(distSel) distSel.addEventListener('change',function(){distTouched=true});

function hintEl(){ return $('#distHint') }
function setHint(cls,html){ var h=hintEl(); h.hidden=false; h.className='hint '+cls; h.innerHTML=html }

function fetchJSON(url,ms){
  if(typeof fetch!=='function') return Promise.reject(new Error('no fetch'));
  var ctl = (typeof AbortController==='function') ? new AbortController() : null;
  var t=setTimeout(function(){ if(ctl) ctl.abort() }, ms||7000);
  return fetch(url, ctl?{signal:ctl.signal}:undefined)
    .then(function(r){ clearTimeout(t); if(!r.ok) throw new Error(r.status); return r.json() })
    .catch(function(e){ clearTimeout(t); throw e });
}

/* the honest fallback: narrow it down, never choose */
function zipHint(z){
  var ds=ZIP_HINT[z];
  if(!ds){
    setHint('maybe','<span class="hi">?</span><span>'+z+' does not look like an Austin city ZIP. If you live outside the city you can still write, just say so. Check the '+MAPLINK+'.</span>');
    return;
  }
  var list = ds.length===1 ? 'usually falls in District <b>'+ds[0]+'</b>'
           : 'spans Districts <b>'+ds.slice(0,-1).join(', ')+'</b> and <b>'+ds[ds.length-1]+'</b>';
  setHint('maybe','<span class="hi">?</span><span>'+z+' '+list+
    ', though ZIP codes and council districts do not line up. Confirm on the '+MAPLINK+', then pick it above. '+
    ds.map(function(x){return '<button type="button" data-d="'+x+'">It is '+x+'</button>'}).join(' ')+'</span>');
  $$('button[data-d]',hintEl()).forEach(function(b){
    b.addEventListener('click',function(){
      $('#f-dist').value=b.dataset.d; distTouched=true; showYourCM(+b.dataset.d);
      setHint('ok','<span class="hi">✓</span><span>Set to District <b>'+b.dataset.d+'</b>. If that is not right, the '+MAPLINK+' will tell you.</span>');
    });
  });
}

function lookupDistrict(){
  var raw=$('#f-addr').value.trim();
  var z=(raw.match(/\b(78[67]\d\d)\b/)||[])[1];
  if(!raw){ hintEl().hidden=true; return }

  // needs a number and a street name before it is worth geocoding
  var worthTrying = /\d/.test(raw) && raw.replace(/[^a-z]/gi,'').length>=4;
  if(!worthTrying){ if(z) zipHint(z); else hintEl().hidden=true; return }

  var seq=++lookupSeq;
  var q=raw + (/austin/i.test(raw)?'':', Austin TX');
  setHint('maybe','<span class="hi">◌</span><span>Looking up your district…</span>');

  fetchJSON('/api/district?address='+encodeURIComponent(q), 8000)
  .then(function(r){
    if(seq!==lookupSeq) return;

    if(!r || !r.found){
      // outside_city is worth saying out loud; anything else is a quiet fallback
      if(r && r.reason==='outside_city' && r.matched){
        setHint('maybe','<span class="hi">?</span><span>We found <b>'+escHTML(r.matched)+'</b>, but it does not appear to sit inside Austin city limits. You can still write to the Council, just say where you live. '+MAPLINK+'</span>');
        return;
      }
      throw new Error(r && r.reason || 'no match');
    }

    var d=String(r.district);
    if(!distTouched) $('#f-dist').value=d;
    showYourCM(+d); track('district_found',{district:d});
    setHint('ok','<span class="hi">✓</span><span>Matched <b>'+escHTML(r.matched)+'</b>, which is in District <b>'+d+'</b>.'+
      (distTouched?' Your own choice above has been left alone.':' Set for you.')+
      ' Not right? '+MAPLINK+'</span>');
  })
  .catch(function(e){
    if(seq!==lookupSeq || (e&&e.message==='stale')) return;
    if(z) zipHint(z); else hintEl().hidden=true;   // quiet fallback
  });
}

var addrTimer;
on('#f-addr','input',function(){
  clearTimeout(addrTimer);
  var z=(this.value.match(/\b(78[67]\d\d)\b/)||[])[1];
  if(!this.value.trim()){ hintEl().hidden=true; return }
  if(z) zipHint(z);                       // instant, then refined by the lookup
  else hintEl().hidden=true;              // nothing useful yet, so say nothing
  addrTimer=setTimeout(lookupDistrict,800);
});
on('#f-addr','blur',function(){ clearTimeout(addrTimer); lookupDistrict() });
on('#findDist','click',lookupDistrict);

/* ════════ letter ════════ */
function buildPrompt(){
  var c=chosen();
  var name=$('#f-name').value.trim()||'[YOUR NAME]';
  var addr=$('#f-addr').value.trim()||'[YOUR ADDRESS]';
  var dist=$('#f-dist').value||'[#]';
  var conn=connText(), tone=$('#f-tone').value, story=$('#f-story').value.trim();
  var askLines=c.asks.map(function(a,i){return (i+1)+'. '+strip(a.ttl)+': '+strip(a.desc)}).join('\n');
  var fundLines=c.funds.map(function(f){return '- '+strip(f.ttl)+': '+strip(f.desc)}).join('\n');
  return [
"Write a letter from a resident to Mayor Kirk Watson and the Austin City Council. Output ONLY the letter text, with no preamble, no commentary, no markdown, no headings, no bullet points.",
"",
"BACKGROUND (all verified, use it accurately, do not invent additional facts):",
"- In October 2025 Gov. Abbott ordered TxDOT to withhold road funding from Texas cities keeping 'political' roadway art, following a similar federal directive. TxDOT denied every application to keep a rainbow crosswalk.",
"- Austin's rainbow crosswalk at West 4th and Colorado, in the heart of the city's LGBTQ+ district, was scraped away on 20-21 July 2026. The 'Black Artists Matter' lettering on East 11th, in Texas's first Black cultural heritage district, was removed too. About 75 people held a vigil at the corner.",
"- San Antonio, forced to remove its own crosswalk in January 2026, had Public Works paint rainbow SIDEWALKS along North Main Avenue from Laurel to Park instead, about $170,000, dedicated in late March 2026. The state's order covers roadways; sidewalks are city property. Crucially it required no council vote, because the corridor had been designated a Pride Cultural Heritage District in 2025, the first in Texas.",
"- Dallas painted the Oak Lawn Branch Library steps rainbow using city staff and private donations, and installed 18 rainbow bike racks. El Paso wrapped street lamps in Pride flags.",
"- Austin produced a community mural on 4th Street in June 2026, and unveiled an LGBTQIA+ historical marker at 4th and Colorado on 21 August 2026. That marker was three years of work by the LGBTQ+ Quality of Life Commission, approved by council in 2023, and was NOT a response to the crosswalk removal. Never write about it as a consolation prize. A city task force weighed sidewalk paint and held off for now, citing light rail construction expected within 18-24 months.",
"- Austin adopts its FY2027 budget on 12-14 August 2026.",
"",
"THE WRITER:",
"Name: "+name,"Address: "+addr,"Council district: "+dist,"Their connection: "+conn,
story?("In their own words (weave this in naturally, keep their phrasing and their voice): \""+story+"\""):"They did not share a personal story. Do NOT invent one. Stay on the civic argument.",
"",
"WHAT THEY ARE ASKING FOR (cover every item, in flowing prose, in their voice, not as a list):",
askLines,"",
(fundLines?("FUNDING ROUTES TO SUGGEST:\n"+fundLines):""),"",
"TONE: "+tone+".","",
"RULES:",
"- 250-350 words.",
"- Open by saying who they are and where they live. Sign off with 'Sincerely,' then their name and address on separate lines.",
"- Do NOT blame the city or its staff. They complied under a genuine funding threat, and there is a mural and a marker on that block already. Keep the letter warm toward the city and focused on the opportunity ahead.",
"- Lead with the San Antonio precedent; it is the strongest argument because it is proven, lawful and nearby.",
"- If light rail is relevant, frame it as a reason to sequence the work, not to skip it.",
"- No bullet points, no hashtags, no exclamation marks, no em-dashes, no 'As an AI', no salesy language.",
"- Plain, human, specific. It should read like one person wrote it, not a campaign.",
"- Constructive throughout. Assume the reader wants to help and needs a workable route, not persuading that they have failed."
  ].join('\n');
}

/* ════════ letter composition ════════
   No model here. Instead: pools of alternative phrasings, chosen by a seed
   derived from the writer's own inputs. The same person always gets the same
   letter; two people almost never get the same one. That matters because
   council offices log identical form letters as a single contact. */

function seedFrom(str){ var h=2166136261; for(var i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619) } return h>>>0 }
function rng(seed){ var x=seed||1; return function(){ x^=x<<13; x^=x>>>17; x^=x<<5; return ((x>>>0)%100000)/100000 } }
function pick(arr,r){ return arr[Math.floor(r()*arr.length)%arr.length] }
function tonePool(pool,tone){ var t=pool.filter(function(v){return v.t==='any'||v.t===tone}); return (t.length?t:pool).map(function(v){return v.s}) }

var L={
 open:[
  {t:'Measured and civic', s:"My name is {NAME} and I live at {ADDR}, in District {D}."},
  {t:'Measured and civic', s:"I am writing as a resident of District {D}. My name is {NAME} and I live at {ADDR}."},
  {t:'Personal and warm',  s:"My name is {NAME}. I live at {ADDR}, over in District {D}."},
  {t:'Personal and warm',  s:"I am {NAME}, a District {D} resident at {ADDR}, and I wanted to write to you directly."},
  {t:'Direct and urgent',  s:"I am {NAME}, District {D}, {ADDR}. I am writing about one specific thing."},
  {t:'Direct and urgent',  s:"My name is {NAME} and I live in District {D} at {ADDR}."},
  {t:'Plain-spoken Austin',s:"I am {NAME}, and I have been living at {ADDR} in District {D}."},
  {t:'Plain-spoken Austin',s:"My name is {NAME}, District {D}, {ADDR}."}
 ],
 stake:[
  {t:'Measured and civic', s:"I am writing about the rainbow crosswalk removed from Fourth and Colorado in July. I understand the city was placed in a genuinely difficult position by the state's funding threat, and I appreciate that staff moved quickly to find alternatives."},
  {t:'Measured and civic', s:"I want to raise the corner of Fourth and Colorado. I recognize the city had little room to maneuver once the state tied road funding to the question, and I do not fault the decision to comply."},
  {t:'Personal and warm',  s:"I am writing about the rainbow crosswalk that came up at Fourth and Colorado in July. I know the city's hands were tied, and I was glad to see the mural go up on Fourth Street in June. It mattered that the city responded at all."},
  {t:'Personal and warm',  s:"This is about the corner of Fourth and Colorado. That crosswalk told a lot of us that Austin sees us, and I would love to see that signal back in some form."},
  {t:'Direct and urgent',  s:"This is about Fourth and Colorado. The crosswalk came up in July under the state order, and there is a straightforward way to put Pride colors back on that corner."},
  {t:'Direct and urgent',  s:"I am writing about the crosswalk at Fourth and Colorado, and specifically about what can happen next."},
  {t:'Plain-spoken Austin',s:"I want to talk about Fourth and Colorado. Losing that crosswalk stung, and I know it was not the city's choice."},
  {t:'Plain-spoken Austin',s:"Fourth and Colorado has been on my mind since July. The city did what it had to do, and there is still a good option on the table."}
 ],
 precedent:[
  {t:'any', s:"Complying with the state does not have to be the end of it. When San Antonio was ordered to remove its own rainbow crosswalk, the city painted the sidewalks along North Main instead. The order covers roadways; sidewalks are city property. Their color is back, entirely legally, and it required no council vote, because that corridor had already been designated a Pride Cultural Heritage District."},
  {t:'any', s:"San Antonio faced exactly this and found a way through. Rather than repaint the road, the city treated the sidewalks along North Main, which sit outside the state's order because they belong to the city. It cost about $170,000, was dedicated in March, survived a legal challenge, and needed no council vote thanks to the corridor's cultural heritage district status."},
  {t:'any', s:"There is a precedent close to hand. San Antonio, under the same directive, put the color on its sidewalks instead of its roadway. Two blocks of North Main, dedicated last March, still there. The state's order reaches the road surface and stops at the curb."},
  {t:'any', s:"The route San Antonio took seems to me the obvious one. The state's order governs the roadway. Sidewalks do not fall under it, so the city painted those instead, and the result has stood since March without costing a cent of road funding."}
 ],
 lead:[
  {t:'any', s:"I would like to ask the Council to consider the following."},
  {t:'any', s:"So I am writing to ask for a few specific things."},
  {t:'any', s:"With that in mind, here is what I am hoping the Council will take up."},
  {t:'any', s:"What I would like to see is this."}
 ],
 close:[
  {t:'Measured and civic', s:"San Antonio has shown this can be done well, and Austin is better placed than most to do it. I would welcome a response setting out what the Council intends."},
  {t:'Measured and civic', s:"I appreciate the Council's attention to this, and I would be glad to hear what steps are being considered."},
  {t:'Personal and warm',  s:"I know there is a lot competing for the Council's attention. This one is unusually achievable, and it would mean a great deal to a lot of people. Thank you for reading."},
  {t:'Personal and warm',  s:"Thank you for taking the time. I would love to hear what the Council thinks is possible here."},
  {t:'Direct and urgent',  s:"The budget is adopted in August, which makes this timely. I would appreciate a reply on whether the Council will take it up."},
  {t:'Direct and urgent',  s:"This is achievable this budget cycle. Please let me know whether it is something the Council will pursue."},
  {t:'Plain-spoken Austin',s:"Austin is good at this sort of thing. I would love to see us do it, and I would appreciate hearing back."},
  {t:'Plain-spoken Austin',s:"Thanks for reading all this. I would genuinely like to know what you think."}
 ]
};

/* one sentence per connection, so the chips actually shape the letter */
var CONN_LINE={
 0:"", 
 1:"I live and work downtown, and I walk through that intersection most days.",
 2:"I run a business near that corner, and the character of the block matters to how it does.",
 3:"I am raising kids in this city, and I want them to grow up somewhere that shows plainly who it welcomes.",
 4:"I am LGBTQ+, and that district has been part of my life in this city for a long time.",
 5:"Places like that corner are part of why I moved to Austin in the first place.",
 6:"I walk past that corner most days, and I noticed immediately when the color went.",
 7:"I was at the gathering on the corner in July. Seventy-five or so of us stood there in the heat, which tells you something.",
 8:"When family visit, that street is one of the places I take them."
};

function askSentence(a){
  var m={
   sidewalk:"treat the sidewalks at Fourth and Colorado the way San Antonio treated North Main, with an interim installation now and a commitment to build it into whatever the street becomes after light rail",
   district:"begin designating the West 4th corridor an LGBTQ+ cultural heritage district, which would carry forward on its own and cost no concrete at all",
   furniture:"add rainbow bike racks, benches or planters on the block, which are city property and cost very little",
   steps:"paint the steps of a nearby public building, as Dallas did at its Oak Lawn library",
   lamps:"wrap the lamp posts on the block, which is what El Paso did and which nothing in the state's order touches",
   light:"light the intersection in rainbow colors at night, since light changes no road surface at all",
   marker:"back Six Square and the east-side organizations in whatever they ask for the Black Artists Matter lettering on East 11th, with the same council attention 4th Street just received",
   commission:"design whatever happens with the LGBTQ+ Quality of Life Advisory Commission and the Austin LGBT Chamber, the way San Antonio worked with its advisory board"
  };
  return m[a.id]||strip(a.ttl).toLowerCase();
}
function fundSentence(f){
  var m={
   budget:"fund it in the FY2027 budget",
   resolution:"pass a resolution directing staff to scope and cost it, which commits no money",
   donations:"accept community donations toward it, as Dallas did, so cost need not be the obstacle",
   arts:"route it through Art in Public Places rather than the transport budget"
  };
  return m[f.id]||strip(f.ttl).toLowerCase();
}
function joinList(a){
  if(a.length===1) return a[0];
  if(a.length===2) return a[0]+", and "+a[1];
  return a.slice(0,-1).join("; ")+"; and "+a[a.length-1];
}

var letterNonce=0;
function fallbackLetter(){
  var c=chosen();
  var name=$('#f-name').value.trim()||'[YOUR NAME]';
  var addr=$('#f-addr').value.trim()||'[YOUR ADDRESS]';
  var dist=$('#f-dist').value||'[#]';
  var story=$('#f-story').value.trim();
  var tone=$('#f-tone').value;
  var conns=CONNS.map(function(_,i){return i}).filter(function(i){return connSel[i]});

  var r=rng(seedFrom(name+'|'+addr+'|'+dist+'|'+tone+'|'+conns.join(',')+'|'+
        c.asks.map(function(a){return a.id}).join(',')+'|'+letterNonce));

  var fill=function(t){ return t.replace('{NAME}',name).replace('{ADDR}',addr).replace('{D}',dist) };
  var P=[];
  P.push(fill(pick(tonePool(L.open,tone),r)));
  var stake=pick(tonePool(L.stake,tone),r);
  var connLine=conns.map(function(i){return CONN_LINE[i]}).filter(Boolean);
  if(connLine.length) stake+=' '+pick(connLine,r);
  P.push(stake);
  if(story) P.push(story);
  P.push(pick(tonePool(L.precedent,tone),r));

  var asks=c.asks.map(askSentence);
  if(asks.length){
    P.push(pick(tonePool(L.lead,tone),r)+' I would like the Council to '+joinList(asks)+'.');
  }
  if(c.funds.length){
    P.push('On paying for it, the Council could '+joinList(c.funds.map(fundSentence))+'.');
  }
  P.push(pick(tonePool(L.close,tone),r));

  return 'Dear Mayor Watson and Members of the City Council,\n\n'+P.join('\n\n')+
         '\n\nSincerely,\n'+name+'\n'+addr;
}

var currentLetter='';
function setWordCount(t){
  if(!$('#wordCount')) return;   // not on this page
  var n=t.trim()?t.trim().split(/\s+/).length:0;
  var w=$('#wordCount'); w.textContent=n+' words'; w.style.display=n?'block':'none';
}
function typeOut(node,text,done){
  node.classList.remove('empty'); node.textContent='';
  node.setAttribute('contenteditable','true'); node.setAttribute('role','textbox');
  if(reduceMotion()){node.textContent=text; setWordCount(text); if(done)done(); return}
  var i=0, chunk=Math.max(3,Math.round(text.length/140));
  var cur=el('span','cursor'); node.appendChild(cur);
  var iv=setInterval(function(){
    i+=chunk; node.textContent=text.slice(0,i); node.appendChild(cur);
    if(i>=text.length){clearInterval(iv); node.textContent=text; setWordCount(text); if(done)done();
      node.oninput=function(){ setWordCount(letterText(node)) }; }
  },14);
}
function generate(){
  var btn=$('#gen'), out=$('#letterOut');
  btn.disabled=true; $('#regen').disabled=true;
  var old=btn.innerHTML; btn.innerHTML='<span class="spin"></span>Drafting…';
  out.classList.remove('empty'); out.textContent='';
  function finish(text){
    currentLetter=text;
    btn.disabled=false; $('#regen').disabled=false; btn.innerHTML=old;
    $('#regen').style.display='inline-block';
    typeOut(out,text,function(){ $('#letterActions').style.display='flex'; $('#editNote').hidden=false; });
    track('letter_generated',{tone:$('#f-tone').value, asks:chosen().asks.length});
  }
  var api=null;   // no model call: the letter is assembled locally, always
  if(!api){ var pk=$('#pickedSummary'); if(pk && !pk.dataset.noted){ pk.dataset.noted='1';
    pk.insertAdjacentHTML('beforeend','<span style="display:block;margin-top:6px;opacity:.75">Assembled from your answers on this page. Nothing you type is sent anywhere.</span>'); } }
  if(!api){setTimeout(function(){finish(fallbackLetter())},420); return}
  var timedOut=false;
  var timer=setTimeout(function(){timedOut=true; finish(fallbackLetter())},30000);
  Promise.resolve(api(buildPrompt(),[])).then(function(r){
    if(timedOut)return; clearTimeout(timer);
    var t=typeof r==='string'?r:(r&&(r.text||r.content||r.output||r.result))||'';
    if(typeof t!=='string')t=String(t||'');
    t=t.trim(); if(t.length<80)t=fallbackLetter();
    finish(t);
  }).catch(function(){ if(timedOut)return; clearTimeout(timer); finish(fallbackLetter()) });
}
on('#gen','click',generate);
on('#regen','click',function(){
  var sel=$('#f-tone'); sel.selectedIndex=(sel.selectedIndex+1)%sel.options.length;
  letterNonce++;
  toast('Rewriting, '+sel.value.toLowerCase()); generate();
});
function letterText(node){ var t=(typeof node.innerText==='string')?node.innerText:node.textContent; return (t||'').replace(/\u00a0/g,' ') }
function liveLetter(){
  var o=$('#letterOut');
  if(o.getAttribute('contenteditable')!=='true') return currentLetter;
  var t=letterText(o).trim();
  return t||currentLetter;
}
on('#copyBtn','click',function(){copy(liveLetter(),'Letter copied. Now open the council form and paste'); track('letter_copied',{edited:liveLetter()!==currentLetter})});
on('#openForm','click',function(){
  copy(liveLetter(),'Letter copied. Paste it into the form');
  track('council_form_opened');
  window.open('https://www.austintexas.gov/email/all-council-members','_blank','noopener');
});
on('#dlLetter','click',function(){
  var n=($('#f-name').value.trim()||'letter').replace(/[^\w]+/g,'-').toLowerCase();
  download('council-letter-'+n+'.txt',liveLetter()); toast('Downloaded');
});

/* ════════ tracker ════════ */
var CATS=[
 ['Do it now','Five minutes or less, from wherever you are reading this.'],
 ['This week','The budget window is open. These are the ones that actually move money.'],
 ['Go deeper','Slower, and how campaigns are genuinely won.']
];
var onlyQuick=false;
function mins(n){return n<60?n+' min':(n/60)+(n===60?' hr':' hrs')}
function renderTodos(){
  if(!$('#todoList')) return;   // not on this page
  var m=$('#todoList'); m.innerHTML='';
  var anyShown=false;
  CATS.forEach(function(cat){
    var items=TODOS.filter(function(t){return t.cat===cat[0] && (!onlyQuick||t.min<=5)});
    if(!items.length) return;
    anyShown=true;
    var doneN=items.filter(function(t){return S.done[t.id]}).length;
    var head=el('div','catrow');
    head.innerHTML='<div><div class="cath">'+cat[0]+'</div><div class="catd">'+cat[1]+'</div></div>'+
      '<div class="catn">'+doneN+'/'+items.length+'</div>';
    m.appendChild(head);
    items.forEach(function(t){
      var done=!!S.done[t.id];
      var d=el('div','todo'+(done?' done':''));
      var links=t.links.map(function(l){
        var ext=l[1].indexOf('http')===0?' target="_blank" rel="noopener"':'';
        return '<a class="lnk" href="'+l[1]+'"'+ext+'>'+l[0]+(ext?' ↗':'')+'</a>';
      }).join('');
      var btns='';
      if(t.tpl) btns+='<button class="lnkb" data-tpl="'+t.id+'">'+t.tplName+'</button>';
      if(t.go) btns+='<button class="lnkb" data-go="'+t.go+'">'+t.tplName+' →</button>';
      d.innerHTML='<div class="box" role="checkbox" tabindex="0" aria-checked="'+done+'" aria-label="'+t.t+'">'+CHECK+'</div>'+
        '<div class="body">'+
          '<div class="tthead"><div class="tt">'+t.t+'</div>'+
            '<span class="tmeta"><span class="tm">'+mins(t.min)+'</span>'+
            '<span class="tm imp-'+t.impact+'">'+t.impact+' impact</span></span></div>'+
          '<div class="td">'+t.d+'</div>'+
          ((links||btns)?'<div class="act">'+links+btns+'</div>':'')+
          (t.tpl?'<pre class="tplbox" id="tp-'+t.id+'" hidden>'+t.tpl.replace(/</g,'&lt;')+'</pre>':'')+
        '</div>';
      var box=$('.box',d);
      function tog(){S.done[t.id]=!S.done[t.id]; if(S.done[t.id]) track('action_completed',{action:t.id}); save(); renderTodos(); ring()}
      box.addEventListener('click',tog);
      box.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tog()}});
      var hit=$('.tt',d);   // tapping the title also ticks it
      hit.addEventListener('click',tog);
      var tb=$('[data-tpl]',d);
      if(tb) tb.addEventListener('click',function(){
        var pre=$('#tp-'+t.id); pre.hidden=!pre.hidden;
        copy(t.tpl,'Copied. '+(pre.hidden?'':'Shown below too.')); track('template_copied',{action:t.id});
      });
      var gb=$('[data-go]',d);
      if(gb) gb.addEventListener('click',function(){activate(t.go)});
      m.appendChild(d);
    });
  });
  if(!anyShown) m.innerHTML='<p class="note" style="padding:24px 0">Nothing matches that filter. Turn it off to see everything.</p>';
}
function ring(){
  if(!$('#ringFg')) return;   // not on this page
  var n=TODOS.filter(function(t){return S.done[t.id]}).length;
  var pct=Math.round(n/TODOS.length*100), C=2*Math.PI*43;
  $('#ringFg').setAttribute('stroke-dashoffset', C-(C*pct/100));
  $('#ringPct').textContent=pct+'%';
  $('#ringCt').textContent=n+' of '+TODOS.length;
  if(n===TODOS.length) toast('That\'s the whole list. Thank you.');
}
renderTodos(); ring();
on('#quickBtn','click',function(){
  onlyQuick=!onlyQuick;
  this.classList.toggle('on',onlyQuick);
  this.textContent=onlyQuick?'Showing quick wins':'Only 5-minute actions';
  renderTodos();
});
on('#resetTrack','click',function(){S.done={}; save(); renderTodos(); ring(); toast('Progress reset')});


/* ════════ photographs ════════
   Empty until real, licensed images exist. See PHOTOS.md for what to get and
   how to obtain rights. Add an entry and it renders, with its credit visible,
   which is both the ethical minimum and what makes the next photographer
   say yes. Self-hosted files need no CSP change. */
var PHOTOS=[
  // {
  //   id:'corner-today',
  //   src:'/img/4th-colorado-today.jpg',
  //   srcWebp:'/img/4th-colorado-today.webp',
  //   w:1600, h:1067,
  //   alt:'The corner of West 4th and Colorado, its crosswalk scraped back to grey asphalt',
  //   caption:'4th & Colorado after the removal, July 2026',
  //   credit:'Photograph by ...',
  //   creditUrl:'',
  //   license:'CC BY 4.0'
  // }
];
function photoHTML(p){
  if(!p) return '';
  return '<figure class="photo">'+
    '<picture>'+
      (p.srcWebp?'<source srcset="'+p.srcWebp+'" type="image/webp">':'')+
      '<img src="'+p.src+'" alt="'+p.alt.replace(/"/g,'&quot;')+'"'+
        (p.w?' width="'+p.w+'" height="'+p.h+'"':'')+' loading="lazy" decoding="async">'+
    '</picture>'+
    '<figcaption>'+p.caption+
      (p.credit?' <span class="credit">'+(p.creditUrl?'<a href="'+p.creditUrl+'" target="_blank" rel="noopener">'+p.credit+'</a>':p.credit)+
        (p.license?', '+p.license:'')+'</span>':'')+
    '</figcaption></figure>';
}
function photoById(id){ for(var i=0;i<PHOTOS.length;i++) if(PHOTOS[i].id===id) return PHOTOS[i]; return null }

/* ════════ the numbers ════════
   Every figure on this row is cited. If a number cannot be sourced it does not
   belong here, because the rest of the page depends on that being true. */
/* ════════ momentum ════════
   Three beats on one block. Two are done and dated, which is the whole
   argument for the third: this is a corridor a council keeps saying yes to. */
var MOMENTUM=[
 {when:'June 2026',    what:'A community mural on 4th Street', who:'Neighbors', done:true,  c:'var(--r1)'},
 {when:'21 Aug 2026',  what:'An LGBTQIA+ historical marker',   who:'The city, after three years of work by the LGBTQ+ Quality of Life Commission', done:true, c:'var(--r4)'},
 {when:'Next',         what:'A rainbow sidewalk at the corner', who:'Sits entirely with the city, on San Antonio\'s model', done:false, c:'var(--r6)'}
];
function renderMomentum(){
  var m=$('#momentum'); if(!m) return;
  m.innerHTML='<h2 class="mo-h">Three things on one block</h2>'+
    MOMENTUM.map(function(x){
      return '<div class="mo'+(x.done?' done':' next')+'" style="--mc:'+x.c+'">'+
        '<span class="mo-w">'+x.when+'</span>'+
        '<b>'+x.what+'</b>'+
        '<span class="mo-who">'+x.who+'</span>'+
        '<span class="mo-tick" aria-hidden="true">'+(x.done?'\u2713':'\u2192')+'</span>'+
        '<span class="sr">'+(x.done?'Done':'Still to come')+'</span></div>';
    }).join('');
}

var STATS=[
 {n:'3', w:'Texas cities that have already brought their color back', c:'var(--r1)', s:['tribune']},
 {n:'$170K', w:'What San Antonio invested in two blocks of rainbow sidewalk', c:'var(--r2)', t:'var(--r2-ink)', s:['sareport','tpr']},
 {n:'5,330', w:'Austinites who signed the petition to keep the crosswalk', c:'var(--r4)', s:['petition']},
 {n:'~75', w:'Neighbors who gathered on the corner in July', c:'var(--r5)', s:['kut']}
];
function renderStats(){
  var m=$('#statRow'); if(!m) return;
  m.innerHTML='';
  STATS.forEach(function(st){
    // --sw paints the 4px bar, --swt sets the numeral. They differ only where
    // the flag color is too light to read as type; t falls back to c.
    var d=el('div','stat'); d.style.setProperty('--sw',st.c); d.style.setProperty('--swt',st.t||st.c);
    d.innerHTML='<b>'+st.n+'</b><span>'+st.w+'</span>'+srcLinks(st.s);
    m.appendChild(d);
  });
}

/* ════════ the calendar ════════
   Rendered from today's date, so whatever is next is always at the top and
   whatever has passed is marked rather than deleted. The site stays useful
   after budget week, which is the point. */
var DATES=[
 {s:'2026-08-12',e:'2026-08-14',ics:'budget',tag:'Council',
  t:'FY2027 budget adoption',
  w:'The council adopts next year\'s budget, and public comment is taken. This is the week a sidewalk treatment gets funded or waits for the next cycle.',
  link:'https://www.austintexas.gov/department/public-participation-council-meetings'},
 {s:'2026-08-17',e:'2026-08-17',tag:'Commission',
  t:'LGBTQ+ Quality of Life Advisory Commission',
  w:'Meets monthly at City Hall with a public comment period, and its recommendations travel up to council through the Joint Inclusion Committee. A smaller room, a far shorter queue, and often the faster route in.',
  link:'https://www.austintexas.gov/boards-commissions'},
 {s:'2026-08-21',e:'2026-08-21',ics:'marker',tag:'Marker',
  t:'The LGBTQIA+ historical marker is unveiled',
  w:'10:30am at 4th and Colorado, beneath the Bettie Naylor street sign on the southwest corner. Three years in the making, approved by council back in September 2023, and nothing to do with the crosswalk: this was already coming. Speakers include Rep. Lloyd Doggett, Mayor Watson and CM Qadri, with a performance by Brigitte Bandit and a reception afterwards at Rain on 4th. Go. Be glad of it.',
  link:'https://www.austinchronicle.com/category-qmmunity/marking-queer-history-on-austins-fourth-street/'},
 {s:'2026-08-20',e:'2026-08-23',ics:'pride',tag:'Pride',
  t:'Austin Pride weekend',
  w:'Four days of it, themed Viva la Resistencia. The best week of the year to have this conversation with your neighbors, and to ask the businesses on 4th Street whether they will add their name.',
  link:'https://austinpride.org/pride2026/'},
 {s:'2026-08-22',e:'2026-08-22',ics:'parade',tag:'Pride',
  t:'The Pride parade, down Congress',
  w:'Steps off at 8pm. Council members march in this parade. If you want to put the ask in front of one of them in person, this is the friendliest possible setting for it.',
  link:'https://austinpride.org/pride2026/'},
 {s:'2026-08-27',e:'2026-08-27',ics:'council',tag:'Council',
  t:'Regular council meeting',
  w:'The first ordinary meeting after the budget, and the first chance to ask for a resolution rather than a line item. Sign up in advance to speak.',
  link:'https://www.austintexas.gov/council/meetings'},
 {s:'2026-09-10',e:'2026-09-10',tag:'Council',t:'Regular council meeting',
  w:'Another opportunity for a resolution directing staff to scope the work.',
  link:'https://www.austintexas.gov/council/meetings'},
 {s:'2026-09-21',e:'2026-09-21',tag:'Commission',t:'LGBTQ+ Quality of Life Advisory Commission',
  w:'Monthly meeting, public comment taken.',link:'https://www.austintexas.gov/boards-commissions'},
 {s:'2026-09-24',e:'2026-09-24',tag:'Council',t:'Regular council meeting',
  w:'Public comment taken.',link:'https://www.austintexas.gov/council/meetings'},
 {s:'2026-10-08',e:'2026-10-08',tag:'Council',t:'Regular council meeting',
  w:'Public comment taken.',link:'https://www.austintexas.gov/council/meetings'},
 {s:'2026-10-22',e:'2026-10-22',tag:'Council',t:'Regular council meeting',
  w:'Public comment taken.',link:'https://www.austintexas.gov/council/meetings'},
 {s:'2026-11-19',e:'2026-11-19',tag:'Council',t:'Regular council meeting',
  w:'Public comment taken.',link:'https://www.austintexas.gov/council/meetings'},
 {s:'2026-12-03',e:'2026-12-03',tag:'Council',t:'Regular council meeting',
  w:'Public comment taken.',link:'https://www.austintexas.gov/council/meetings'}
];
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function dparse(x){var a=x.split('-');return new Date(+a[0],+a[1]-1,+a[2])}
function today(){var d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function dfmt(d){
  var a=dparse(d.s), b=dparse(d.e);
  if(d.s===d.e) return a.getDate()+' '+MON[a.getMonth()]+' '+a.getFullYear();
  if(a.getMonth()===b.getMonth()) return a.getDate()+'–'+b.getDate()+' '+MON[b.getMonth()]+' '+b.getFullYear();
  return a.getDate()+' '+MON[a.getMonth()]+' – '+b.getDate()+' '+MON[b.getMonth()]+' '+b.getFullYear();
}
function daysAway(d){ return Math.round((dparse(d.s)-today())/86400000) }
function upcoming(){ var t=today(); return DATES.filter(function(d){return dparse(d.e)>=t}) }
function nextUp(){ var u=upcoming(); return u.length?u[0]:null }
function countdown(d){
  var n=daysAway(d);
  if(n<0) return 'on now';
  if(n===0) return 'today';
  if(n===1) return 'tomorrow';
  if(n<=21) return 'in '+n+' days';
  return 'in '+Math.round(n/7)+' weeks';
}
function renderDates(){
  var m=$('#dateList'); if(!m) return;
  m.innerHTML='';
  var t=today(), first=true;
  DATES.forEach(function(d){
    var past=dparse(d.e)<t;
    var row=el('div','date'+(past?' past':'')+(!past&&first?' next':''));
    var badge = past ? '<span class="dtag done">passed</span>'
                     : (first?'<span class="hot">next up, '+countdown(d)+'</span>':'<span class="dtag '+d.tag.toLowerCase()+'">'+d.tag+'</span>');
    var btn = (!past&&d.ics)?'<div class="btnrow" style="margin-top:11px"><button class="ghost sm" data-ics="'+d.ics+'">＋ Add to calendar</button></div>':'';
    var lnk = (!past&&d.link)?' <a href="'+d.link+'" target="_blank" rel="noopener">Details ↗</a>':'';
    row.innerHTML='<div class="dwhen">'+dfmt(d)+'</div>'+
      '<div class="dwhat"><b>'+d.t+' '+badge+'</b><span>'+d.w+lnk+'</span>'+btn+'</div>';
    if(!past) first=false;
    m.appendChild(row);
  });
}

/* The hero's countdown and "next up" banner used to be rendered at the end of
   renderDates(). They live on the home page and the date list lives on the action
   page, so tying them together meant the home page silently lost its countdown. */
function renderPulse(){
  var pu=$('#pulse');
  if(pu){
    pu.hidden=false;
    pu.innerHTML=
      '<a class="pu" href="https://www.change.org/p/city-of-austin-texas-approve-the-rainbow-crosswalks-in-austin-tx" target="_blank" rel="noopener">'+
        '<b>5,330</b> <span>have signed the petition</span></a>'+
      '<span class="pu"><b>3</b> <span>Texas cities have their color back</span></span>'+
      '<span class="pu"><b id="pulseDays"></b> <span id="pulseWhat"></span></span>';
    var nx=nextUp();
    if(nx){
      var days=daysAway(nx);
      if(days<0){ $('#pulseDays').textContent='Now';  $('#pulseWhat').textContent=nx.t+' is under way'; }
      else if(days===0){ $('#pulseDays').textContent='Today'; $('#pulseWhat').textContent=nx.t; }
      else { $('#pulseDays').textContent=days; $('#pulseWhat').textContent=(days===1?'day until ':'days until ')+nx.t; }
    } else {
      $('#pulseDays').textContent='Any';
      $('#pulseWhat').textContent='regular council meeting works';
    }
  }
  var n=nextUp();
  var s=$('#nextUp');
  if(s){
    if(n){ s.hidden=false;
      s.innerHTML='<span class="nu-tag">Next up</span><span><b>'+n.t+'</b>, '+dfmt(n)+', '+countdown(n)+'.</span>'; }
    else { s.hidden=false;
      s.innerHTML='<span class="nu-tag">Any time</span><span>Council meets through the year, and a resolution can be brought at any regular meeting.</span>'; }
  }
}

/* ════════ .ics ════════ */
function pad(n){return n<10?'0'+n:''+n}
function icsDate(y,m,d){return y+pad(m)+pad(d)}
function esc(s){return String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n')}
function blen(s){var n=0;for(var i=0;i<s.length;i++){var c=s.codePointAt(i);n+=c<0x80?1:c<0x800?2:c<0x10000?3:(i++,4)}return n}
function fold(l){
  if(blen(l)<=75)return l;
  var parts=[],cur='',lim=74;
  for(var i=0;i<l.length;i++){
    var ch=l[i];
    if(ch.codePointAt(0)>0xFFFF){ch=l.slice(i,i+2);i++}
    if(blen(cur)+blen(ch)>lim){parts.push(cur);cur=''}
    cur+=ch;
  }
  if(cur)parts.push(cur);
  return parts[0]+parts.slice(1).map(function(p){return '\r\n '+p}).join('');
}
function makeICS(o){
  var stamp=new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Keep Austin Colorful//Advocacy Pack//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',
  'BEGIN:VEVENT','UID:'+o.uid,'DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+o.start,'DTEND;VALUE=DATE:'+o.end,
  'SUMMARY:'+esc(o.summary),'LOCATION:'+esc(o.location),'DESCRIPTION:'+esc(o.desc),
  'BEGIN:VALARM','TRIGGER:-P2D','ACTION:DISPLAY','DESCRIPTION:'+esc(o.summary),'END:VALARM',
  'END:VEVENT','END:VCALENDAR'].map(fold).join('\r\n');
}
var ICS={
 marker:{uid:'atx-lgbtq-marker-2026@keepaustincolorful',start:icsDate(2026,8,21),end:icsDate(2026,8,22),
  summary:'LGBTQIA+ historical marker dedication, 4th & Colorado',
  location:'W 4th St & Colorado St, Austin TX 78701',
  desc:'10:30am at 4th and Colorado, beneath the Bettie Naylor street sign on the southwest corner.\n\nThree years of work by the LGBTQ+ Quality of Life Commission, approved by council in 2023. It is not a response to the crosswalk removal; it was already coming.\n\nSpeakers include Rep. Lloyd Doggett, Mayor Kirk Watson and Council Member Zo Qadri, with a performance by Brigitte Bandit. Reception afterwards at Rain on 4th.\n\nDetails: https://www.austinchronicle.com/category-qmmunity/marking-queer-history-on-austins-fourth-street/'},
 pride:{uid:'atx-pride-2026@keepaustincolorful',start:icsDate(2026,8,20),end:icsDate(2026,8,24),
  summary:'Austin Pride weekend: Viva la Resistencia',
  location:'Austin, Texas',
  desc:'Austin Pride 2026, themed Viva la Resistencia. Festival at Fiesta Gardens, parade down Congress Avenue on Saturday evening.\n\nA good weekend to talk to neighbors about the corner at 4th and Colorado, and to ask businesses on the block whether they will add their name to a letter.\n\nDetails: https://austinpride.org/pride2026/'},
 parade:{uid:'atx-pride-parade-2026@keepaustincolorful',start:icsDate(2026,8,22),end:icsDate(2026,8,23),
  summary:'Austin Pride parade, down Congress Avenue',
  location:'Congress Avenue, Austin, Texas',
  desc:'Steps off at 8pm. Council members march in this parade, which makes it the friendliest possible setting to put the 4th and Colorado ask in front of one of them.\n\nDetails: https://austinpride.org/pride2026/'},
 budget:{uid:'atx-budget-2026@keepaustincolorful',start:icsDate(2026,8,12),end:icsDate(2026,8,15),
  summary:'Austin FY2027 budget adoption: speak for a rainbow sidewalk at 4th & Colorado',
  location:'Austin City Hall, 301 W 2nd St, Austin TX 78701',
  desc:'The council adopts the FY2027 budget this week. This is the window to ask for a funded rainbow sidewalk treatment at 4th & Colorado, on San Antonio\'s model, and for an LGBTQ+ cultural heritage district designation for the West 4th corridor.\n\nSign up to speak in advance: https://www.austintexas.gov/department/public-participation-council-meetings\nCheck the agenda: https://www.austintexas.gov/council/meetings'},
 council:{uid:'atx-council-20260827@keepaustincolorful',start:icsDate(2026,8,27),end:icsDate(2026,8,28),
  summary:'Austin City Council meeting: public comment',
  location:'Austin City Hall, 301 W 2nd St, Austin TX 78701',
  desc:'First regular council meeting after budget adoption. Sign up in advance to speak.\n\nAgenda: https://www.austintexas.gov/council/meetings'}
};
/* Council office numbers run 512-978-2100 for the Mayor and 512-978-21NN per
   district; 2100 and 2109 are confirmed on the city's own contact pages, and
   each number below links to its district page so anyone can check it. */
function cmPhone(d){ return '512-978-21'+(d<10?'0'+d:d) }
function showYourCM(d){
  var box=$('#yourCM'), how=$('#yourCMhow');
  if(!box||!d) return;
  box.hidden=false;
  how.innerHTML='District '+d+' · <a href="tel:+1512978'+('21'+(d<10?'0'+d:d))+'">'+cmPhone(d)+'</a> · '+
    '<a href="https://www.austintexas.gov/district-'+d+'/contact" target="_blank" rel="noopener">contact page ↗</a>';
}
on('#f-dist','change',function(){ if(this.value) showYourCM(+this.value) });

function bindIcs(){ $$('[data-ics]').forEach(function(b){
  if(b.dataset.bound) return; b.dataset.bound='1';
  b.addEventListener('click',function(){
    var k=b.dataset.ics;
    download(k==='budget'?'austin-budget-hearings.ics':'austin-council-meeting.ics', makeICS(ICS[k]), 'text/calendar;charset=utf-8');
    track('calendar_added',{event:k});
    toast('Calendar file downloaded. Open it to add the event');
  });
})}
loadAnalytics();
(function(){
  var v=$('#verified');
  if(v && typeof VERIFIED!=='undefined') v.textContent='Every figure on this page was checked against its source on '+VERIFIED+'.';
})();
(function(){
  var box=$('#contactBox'); if(!box) return;
  var rows=[];
  if(CONTACT.email) rows.push(['General','<a href="mailto:'+CONTACT.email+'">'+CONTACT.email+'</a>']);
  if(CONTACT.press && CONTACT.press!==CONTACT.email) rows.push(['Press','<a href="mailto:'+CONTACT.press+'">'+CONTACT.press+'</a> · <a href="/press.html">press kit</a>']);
  else rows.push(['Press','<a href="/press.html">Press kit, facts and images</a>']);
  if(CONTACT.formUrl) rows.push(['Prefer a form','<a href="'+CONTACT.formUrl+'" target="_blank" rel="noopener">Send a message ↗</a>']);
  if(!CONTACT.email && !CONTACT.formUrl){
    rows.unshift(['Message us','<a href="'+CONTACT.github+'/discussions" target="_blank" rel="noopener">Start a discussion on GitHub ↗</a>, which reaches us and is public']);
  }
  rows.push(['Corrections','<a href="https://github.com/willhines90/keep-austin-colorful/issues/new/choose" target="_blank" rel="noopener">Open an issue ↗</a>, or email. Every claim here is meant to be checkable.']);
  rows.push(['Fork it','<a href="https://github.com/willhines90/keep-austin-colorful" target="_blank" rel="noopener">The whole thing is open source ↗</a>']);
  box.innerHTML=rows.map(function(r){return '<div class="contactrow"><b>'+r[0]+'</b><span>'+r[1]+'</span></div>'}).join('');
})();
(function(){
  var slot=$('#heroPhoto'); if(!slot) return;
  var p=photoById('corner-today');
  if(p){ slot.innerHTML=photoHTML(p); slot.hidden=false; }
})();
/* Decorative SVG announces itself as "graphic" to a screen reader and adds
   nothing but noise. Anything carrying a <title>, an aria-label or a role, and
   anything focusable, is left exactly as it is. */
function hideDecorativeSVG(root){
  $$('svg',root||document).forEach(function(s){
    if(s.getAttribute('aria-hidden')||s.getAttribute('aria-label')||
       s.getAttribute('role')||s.querySelector('title')) return;
    if(s.closest('[tabindex],button,a')) return;
    s.setAttribute('aria-hidden','true');
    s.setAttribute('focusable','false');
  });
}

renderStats(); renderMomentum(); renderDates(); renderPulse(); bindIcs(); hideDecorativeSVG();
if($('#pickedSummary')) renderPicked();   // the letter page needs its summary on load



/* Read by tools/build-meta.js so the JSON-LD, sitemap and llms.txt are
   generated from this data rather than maintained separately. */
window.__KAC__={OBJS:OBJS,DATES:DATES,STATS:STATS,SRC:SRC,ASKS:ASKS,TIMELINE:TIMELINE,TODOS:TODOS};
})();
