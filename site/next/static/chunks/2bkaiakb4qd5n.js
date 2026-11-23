(()=>{"use strict";(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,39362,e=>{var t=e.i(89970),i=e.i(83495);t.e.registerPlugin(i.ScrollTrigger),i.ScrollTrigger.config({ignoreMobileResize:!0});let s=0;e.s(["f",0,function(){s||(s=requestAnimationFrame(()=>{s=0,i.ScrollTrigger.refresh()}))}])},2810,e=>{let t=null,i=new Set;e.s(["c",0,{end:.4,railEnd:.3,labelsEnd:.12,othersOpacity:.15,ringRadiusPx:7,crossfadePx:150},"b",0,{stage:'[data-section="SessionSlowed"] .ss-stage',figure:'[data-section="SessionSlowed"] .ss-figure',radar:'[data-section="SessionSlowed"] .ss-radar',ext:130},"s",0,function(e){if(!(t&&1e-6>Math.abs(t.theta-e.theta)&&1e-6>Math.abs(t.r-e.r)))for(let s of(t=e,i))s(e)},"g",0,function(e){return i.add(e),t&&e(t),()=>{i.delete(e)}}])},15432,e=>{var t=e.i(43476),i=e.i(17026),s=e.i(68945);let n={vectorEffect:"non-scaling-stroke"};e.s(["E",0,function({ext:e,className:i,style:s,children:n,svg:r,svgRef:a}){return(0,t.jsxs)("div",{className:i,style:{position:"relative",aspectRatio:"1",...s},children:[(0,t.jsx)("svg",{ref:a,viewBox:`${-e} ${-e} ${2*e} ${2*e}`,className:"absolute inset-0 h-full w-full overflow-visible","aria-hidden":"true",focusable:"false",children:r}),n]})},"a",0,100,"_",0,function({opacity:e=1,slices:r=!1}){let[a,o,l,c]=i.H.map(e=>100*e);return(0,t.jsxs)("g",{opacity:e,children:[(0,t.jsx)("circle",{r:c,fill:i.F.hull,fillOpacity:.92}),(0,t.jsx)("circle",{r:l,fill:i.F.emerald,fillOpacity:.5}),(0,t.jsx)("circle",{r:o,fill:i.F.viridian,fillOpacity:.26}),(0,t.jsx)("circle",{r:a,fill:i.F.jade,fillOpacity:.3}),r&&Array.from({length:6},(e,r)=>{let[o,l]=(0,s.h)(r*i.V,a),[p,d]=(0,s.h)(r*i.V,c);return(0,t.jsx)("line",{x1:o,y1:l,x2:p,y2:d,stroke:i.F.rule,strokeWidth:1,strokeOpacity:.7,...n},r)}),[a,o,l,c].map(e=>(0,t.jsx)("circle",{r:e,fill:"none",stroke:i.F.rule,strokeWidth:1,...n},e))]})},"R",0,function(e,t,i){return{position:"absolute",left:`${50+e/(2*i)*100}%`,top:`${50+t/(2*i)*100}%`}}])},65174,e=>{var t=e.i(43476);let i=e.i(22103).f,s=`
/* ---------- shared ---------- */
.pin-section { position: relative; }

/* ---------- section 3: one session, slowed down ---------- */
/* overflow-x: clip keeps the read trail, laid out at a default width on the server, from widening a
   phone's layout viewport before this scene hydrates; nothing in the final layout reaches past the stage. */
.ss-stage { position: relative; --gx: max(24px, calc((100vw - 1360px) / 2 + 24px)); padding: 48px var(--gx); overflow-x: clip; }
.ss-head { max-width: 34rem; }
.ss-figure { position: relative; margin: 32px 0 8px; width: 210px; }
.ss-radar { position: relative; width: 100%; aspect-ratio: 1; }
.ss-lane { position: relative; margin-top: 32px; padding-left: 20px; }
.ss-connector { display: none; }
@media (min-width: 768px) {
  .ss-stage { display: grid; grid-template-columns: minmax(260px, 340px) minmax(0, 1fr); column-gap: 56px; --gx: max(40px, calc((100vw - 1360px) / 2 + 40px)); padding: 80px var(--gx); }
  .ss-head { grid-column: 1 / -1; }
  .ss-figure { width: 100%; margin: 24px 0 0; align-self: start; }
  .ss-lane { margin-top: 24px; }
  .ss-connector { display: block; }
}
@media ${i} {
  .ss-stage {
    display: block; height: 100svh; padding: 0; overflow: hidden;
    --R: min(calc(min(880px, clamp(760px, 100svh, 1000px) - 160px) * 0.31), 22vw);
    --cx: 25vw; --cy: 62%;
    --gx: max(40px, calc((100vw - 1360px) / 2 + 40px));
  }
  .ss-head { position: absolute; left: var(--gx); top: 100px; width: min(36rem, calc(100vw - var(--gx) * 2)); max-width: none; }
  .ss-figure { position: absolute; margin: 0; width: calc(var(--R) * 2.6); left: calc(var(--cx) - var(--R) * 1.3); top: calc(var(--cy) - var(--R) * 1.3); }
  .ss-lane {
    position: absolute; margin: 0; left: calc(var(--cx) + var(--R) + 48px); right: var(--gx); top: 100px; max-width: 840px;
  }
}
@media ${i} and (max-height: 820px) {
  .ss-lead { display: none; }
}
.ss-lane { transform-origin: 0 0; }

/* ---------- section 4: sector sweep ---------- */
.sw-stage { position: relative; display: flex; flex-direction: column; --gx: max(24px, calc((100vw - 1360px) / 2 + 24px)); padding: 48px var(--gx); }
.sw-col { display: contents; }
.sw-head { order: 1; max-width: 34rem; }
.sw-radar { order: 2; position: relative; width: 100%; max-width: 420px; margin: 40px auto 0; aspect-ratio: 1; }
.sw-stops { order: 3; margin-top: 32px; }
.sw-stoplist > li + li { margin-top: 28px; }
.sw-legend { order: 4; }
@media (min-width: 768px) {
  .sw-col { display: block; max-width: 34rem; }
  .sw-stage { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); column-gap: 40px; --gx: max(40px, calc((100vw - 1360px) / 2 + 40px)); padding: 80px var(--gx); align-items: center; }
  .sw-radar { margin: 0; max-width: 640px; }
}
@media ${i} {
  .sw-stage {
    display: block; height: 100svh; padding: 0; overflow: hidden;
    --R: min(300px, 22vw, calc((100svh - 230px) / 2));
    --cx: 66vw; --cy: 52%;
    --gx: max(40px, calc((100vw - 1360px) / 2 + 40px));
  }
  .sw-col { display: flex; position: absolute; left: var(--gx); top: 100px; width: min(26rem, 30vw); display: flex; flex-direction: column; gap: 52px; }
  .sw-stops { margin-top: 0; }
  .sw-stoplist { position: relative; height: 196px; }
  .sw-stoplist > li, .sw-stoplist > li + li { position: absolute; left: 0; top: 0; width: 100%; margin: 0; }
  .sw-radar { position: absolute; margin: 0; max-width: none; width: calc(var(--R) * 3); left: calc(var(--cx) - var(--R) * 1.5); top: calc(var(--cy) - var(--R) * 1.5); }
}
`;e.s(["f",0,function(){return(0,t.jsx)("style",{children:s})}])},68945,e=>{var t=e.i(41545),i=e.i(17026),s=e.i(78179);let n=t.default,r=new Map(n.topics.map(e=>[e.id,e])),a=new Map(n.questions.map(e=>[e.id,e])),o=new Map(n.sessions.map(e=>[e.id,e])),l=new Map(n.sources.map(e=>[e.tag,e])),c=new Map;for(let e of[...n.questions].sort((e,t)=>e.number-t.number)){let t=c.get(e.topic)??[];t.push(e),c.set(e.topic,t)}function p(e){let t=r.get(e.topic),n=c.get(e.topic)??[e],a=Math.max(0,n.findIndex(t=>t.id===e.id)),o=i.V-2*s.G;return s.h+(t?.index??0)*i.V+s.G+(a+.5)/n.length*o}function d(e){return 2===e?"2nd":3===e?"3rd":`${e}th`}let x=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],u=[...n.sources].sort((e,t)=>t.sessionsPct-e.sessionsPct),f=n.sessions.filter(e=>"claude-code"===e.agent),g=o.get(n.hero.handoffSessionId);e.s(["f",0,{yours:"Own page","your-listing":"Listing",rival:"Rival page","publish-here":"Accepts submissions","request-mention":"Could mention you",standard:"Neutral reference",diy:"DIY guide",news:"News",unclassified:"Unclassified"},"g",0,e=>n.meta.agents.find(t=>t.id===e)?.name??e,"W",0,function(e){return 1===e?"picked Brand X first":0===e?"Brand X not named":`Brand X named ${d(e)}`},"A",0,f,"Z",0,function(e){let t=0;for(let i of n.sessions)e(i)&&t++;return t},"x",0,function(e){let t=new Date(`${e.slice(0,10)}T00:00:00Z`);return`${x[t.getUTCMonth()]} ${t.getUTCDate()}, ${t.getUTCFullYear()}`},"X",0,g,"K",0,u,"a",0,d,"C",0,function(e){return Number.isInteger(e)?`${e}%`:`${e.toFixed(1)}%`},"Q",0,function(e){let t=e.trim().replace(/^developer request:\s*/i,"").trim();return(t=t.replace(/^[\s"'“‘]+/,"").replace(/[\s"'”’]+$/,"")).toLowerCase()},"h",0,function(e,t){let i=e*Math.PI/180;return[Math.cos(i)*t,Math.sin(i)*t]},"D",0,p,"u",0,a,"q",0,c,"$",0,function(e){let t=a.get(e.questionId);return t?p(t):s.h+(r.get(e.topic)?.index??0)*i.V+i.V/2},"v",0,o,"L",0,function(e,t="A"){let s=e.positions[t];if(0===s)return i.o+(e.seed-.5)*.06;let n=(0,i.z)(s),r=n.outer-n.inner;return n.inner+r*i.g[e.phrasing]+(e.seed-.5)*r*.12},"w",0,l,"i",0,n,"z",0,r])},48701,e=>{var t=e.i(43476),i=e.i(71645),s=e.i(63859),n=e.i(39362),r=e.i(89970),a=e.i(83495),o=e.i(58113);let l=i.useLayoutEffect;e.s(["S",0,function({children:e,className:i}){return(0,t.jsx)("p",{className:(0,o.f)("font-mono text-[11px] uppercase leading-4 tracking-[0.08em] text-mist",i),children:e})},"p",0,function({children:e,tone:i="phosphor",className:s}){return(0,t.jsx)("span",{className:(0,o.f)("font-mono tabular-nums","amber"===i?"text-amber":"bone"===i?"text-bone":"text-phosphor",s),children:e})},"P",0,function({children:e,className:i,id:s}){return(0,t.jsx)("h2",{id:s,className:(0,o.f)("font-sans text-[34px] font-medium leading-[1.06] tracking-[-0.025em] text-bone text-balance md:text-[48px] md:leading-[1.04]",i),children:e})},"Q",0,function({children:e,className:i}){return(0,t.jsx)("p",{className:(0,o.f)("max-w-[34rem] text-[16px] leading-[26px] text-mist md:text-[17px] md:leading-[27px]",i),children:e})},"M",0,"inline-flex h-12 items-center justify-center rounded-lg bg-bone px-5 text-[15px] font-medium text-hull transition-colors duration-200 hover:bg-white focus-visible:outline-offset-2","K",0,l,"q",0,function(){(0,i.useEffect)(()=>{let e=!0,t=document.fonts;return t?.ready.then(()=>{e&&(0,n.f)()}),()=>{e=!1}},[])},"c",0,function(e="top 90%"){let t=(0,i.useRef)(null),n=(0,s.useReducedMotion)();return l(()=>{let i=t.current;if(!i||n)return;let s=r.e.context(()=>{r.e.set(i,{opacity:0,y:12}),a.ScrollTrigger.create({trigger:i,start:e,once:!0,onEnter:()=>r.e.to(i,{opacity:1,y:0,duration:.9,ease:"power3.out",clearProps:"transform,opacity"})})});return()=>s.revert()},[n,e]),t},"s",0,function(e,t={w:640,h:400}){let[s,n]=(0,i.useState)(t);return(0,i.useEffect)(()=>{let t=e.current;if(!t)return;let i=()=>{let e=t.offsetWidth??t.getBoundingClientRect().width,i=t.offsetHeight??t.getBoundingClientRect().height;e>0&&n(t=>.5>Math.abs(t.w-e)&&.5>Math.abs(t.h-i)?t:{w:e,h:i})};i();let s=new ResizeObserver(i);return s.observe(t),()=>s.disconnect()},[e]),s}])}])})();