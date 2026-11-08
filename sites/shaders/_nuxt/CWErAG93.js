import{d as H,bi as L,A as V,B as z,b as M,i as O,V as S,n as F,T as I,r as m,l as n,o as C,D as R}from"./7cVyfpow.js";const A=H({__name:"RuledFlow",props:{edge:{default:"bottom"},speed:{default:800},gap:{default:8},delay:{default:0},once:{type:Boolean,default:!1}},setup(l){const o=l,s=L().replace(/[^a-zA-Z0-9]/g,""),p=`rfl-h-${s}`,f=`rfl-v-${s}`,w=`rfb-h-${s}`,y=`rfb-v-${s}`,t=m(null),b=m(!1),d=m(0);let i=null,c=null;function k(){if(!t.value)return;const e=o.edge==="bottom"||o.edge==="top";d.value=e?t.value.offsetWidth:t.value.offsetHeight}V(()=>{t.value&&(k(),c=new ResizeObserver(k),c.observe(t.value),o.once&&(i=new IntersectionObserver(([e])=>{e.isIntersecting&&(b.value=!0,i?.disconnect(),i=null)}),i.observe(t.value)))}),z(()=>{i?.disconnect(),c?.disconnect(),i=null,c=null});const v=n(()=>d.value<=0||o.speed<=0?1:d.value/o.speed),u=n(()=>v.value+Math.max(0,o.gap)),$=n(()=>u.value<=0?100:Math.max(2,Math.min(100,v.value/u.value*100))),_=n(()=>{const e=+$.value.toFixed(3),a=+(e*.14).toFixed(3),r=+(e*.86).toFixed(3),h=e<100?"100% { mask-position-x: 100cqw; -webkit-mask-position-x: 100cqw; opacity: 0; }":"",x=e<100?"100% { mask-position-y: 100cqh; -webkit-mask-position-y: 100cqh; opacity: 0; }":"",g=e<100?"100% { mask-position-x: 79cqw, 0; -webkit-mask-position-x: 79cqw, 0; opacity: 0; }":"",B=e<100?"100% { mask-position-y: 79cqh, 0; -webkit-mask-position-y: 79cqh, 0; opacity: 0; }":"";return`
@keyframes ${p} {
  0% { mask-position-x: -38cqw; -webkit-mask-position-x: -38cqw; opacity: 0; }
  ${a}% { opacity: 1; }
  ${r}% { opacity: 1; }
  ${e}% { mask-position-x: 100cqw; -webkit-mask-position-x: 100cqw; opacity: 0; }
  ${h}
}
@keyframes ${f} {
  0% { mask-position-y: -38cqh; -webkit-mask-position-y: -38cqh; opacity: 0; }
  ${a}% { opacity: 1; }
  ${r}% { opacity: 1; }
  ${e}% { mask-position-y: 100cqh; -webkit-mask-position-y: 100cqh; opacity: 0; }
  ${x}
}
@keyframes ${w} {
  0% { mask-position-x: -59cqw, 0; -webkit-mask-position-x: -59cqw, 0; opacity: 0; }
  ${a}% { opacity: 1; }
  ${r}% { opacity: 1; }
  ${e}% { mask-position-x: 79cqw, 0; -webkit-mask-position-x: 79cqw, 0; opacity: 0; }
  ${g}
}
@keyframes ${y} {
  0% { mask-position-y: -59cqh, 0; -webkit-mask-position-y: -59cqh, 0; opacity: 0; }
  ${a}% { opacity: 1; }
  ${r}% { opacity: 1; }
  ${e}% { mask-position-y: 79cqh, 0; -webkit-mask-position-y: 79cqh, 0; opacity: 0; }
  ${B}
}
`.trim()}),q=n(()=>({"--ruled-flow-cycle":`${u.value}s`,"--ruled-flow-delay":`${o.delay}s`,"--ruled-flow-anim-line-h":p,"--ruled-flow-anim-line-v":f,"--ruled-flow-anim-bloom-h":w,"--ruled-flow-anim-bloom-v":y}));return M({style:[{key:`ruled-flow-${s}`,innerHTML:_}]}),(e,a)=>(C(),O("div",{ref_key:"root",ref:t,class:F(["ruled-flow",[`ruled-flow--${l.edge}`,{"ruled-flow--once":l.once,"ruled-flow--paused":l.once&&!b.value}]]),style:S(q.value)},[...a[0]||(a[0]=[I('<div class="ruled-flow__bloom-group" data-v-57b7b5ec><div class="ruled-flow__bloom ruled-flow__bloom--far" data-v-57b7b5ec></div><div class="ruled-flow__bloom ruled-flow__bloom--mid" data-v-57b7b5ec></div><div class="ruled-flow__bloom ruled-flow__bloom--near" data-v-57b7b5ec></div></div><div class="ruled-flow__line" data-v-57b7b5ec></div>',2)])],6))}}),j=Object.assign(R(A,[["__scopeId","data-v-57b7b5ec"]]),{__name:"MarketingRuledFlow"});export{j as _};
