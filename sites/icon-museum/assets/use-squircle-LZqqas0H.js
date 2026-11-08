import{m as e,y as t}from"./utils-CnrKoOXK.js";var n=t(e(),1),r={r1:.0586,r2:.332};function i(e,t,n,r){return n=Math.min(n,r),`
    M 0,${r}
    C 0,${n} ${n},0 ${r},0
    L ${e-r},0
    C ${e-n},0 ${e},${n} ${e},${r}
    L ${e},${t-r}
    C ${e},${t-n} ${e-n},${t} ${e-r},${t}
    L ${r},${t}
    C ${n},${t} 0,${t-n} 0,${t-r}
    L 0,${r}
  `.trim().replace(/\n/g,` `)}function a(e){return`data:image/svg+xml,${e.replace(/"/g,`'`).replace(/>\s+</g,`><`).replace(/\s{2,}/g,` `).replace(/[\r\n%#()<>?[\\\]^`{|}]/g,encodeURIComponent)}`}function o(e,t,n,r){let o=`squircle-${e}-${t}-${n}-${r}`;return a(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${t}" viewBox="0 0 ${e} ${t}">
      <defs>
        <clipPath id="${o}"><path fill="#000" d="${i(e,t,n,r)}"/></clipPath>
      </defs>
      <g clip-path="url(#${o})">
        <rect width="${e}" height="${t}" fill="#000"/>
      </g>
    </svg>
  `.trim().replace(/\n| {2,}/g,``))}function s(e,t){let n=new Map;return function(...r){let i=t(...r),a=n.get(i);if(a)return a;let o=e(...r);return n.set(i,o),o}}var c=r.r1/r.r2;function l(e,t,n,r=c){let i=n===void 0||n===`auto`?`50%`:`${Math.max(0,n-15.5)}px`;if(e===0||t===0)return{borderRadius:i};let a=Math.min(e,t)/2,s=Math.min(n===void 0||n===`auto`?a:n,a),l=o(e,t,s*r,s);return{maskImage:`url("${l}")`,maskPosition:`center`,maskSize:`contain`,maskRepeat:`no-repeat`,WebkitMaskImage:`url("${l}")`,WebkitMaskPosition:`center`,WebkitMaskRepeat:`no-repeat`}}var u=s((e,t,n,r)=>l(e,t,n,r),(e,t,n,r)=>`${e}-${t}-${n}-${r}`);function d(e,t={}){let{radius:r,roundness:i}=t,[a,o]=(0,n.useState)({width:0,height:0}),s=(0,n.useCallback)(e=>{let t=e[0];if(!t)return;let n=t.borderBoxSize?.[0],r=n?n.inlineSize:t.target.getBoundingClientRect().width,i=n?n.blockSize:t.target.getBoundingClientRect().height;o(e=>e.width===r&&e.height===i?e:{width:r,height:i})},[]);return(0,n.useLayoutEffect)(()=>{let t=e.current;if(!t)return;let n=t.getBoundingClientRect();o({width:n.width,height:n.height})},[e]),(0,n.useEffect)(()=>{let t=e.current;if(!t)return;let n=new ResizeObserver(s);return n.observe(t,{box:`border-box`}),()=>n.disconnect()},[e,s]),u(a.width,a.height,r,i)}export{d as t};