import{i as e,t}from"./jsx-runtime-Cx0BB4qO.js";import{t as n}from"./react-3BKWdGy3.js";import{t as r}from"./chevron-left-B0mNKy8d.js";import{o as i}from"./sound-Q67qmSVK.js";import{Ot as a}from"./index-DTeREl5f.js";var o=e(n(),1),s=t(),c=256,l=336,u=[{src:`/lab/bloom/bird.jpg`,name:`The bird`},{src:`/lab/bloom/house.jpg`,name:`Hillside`},{src:`/lab/bloom/man.jpg`,name:`Portrait`},{src:`/lab/bloom/queue.jpg`,name:`The queue`},{src:`/lab/bloom/cow.jpg`,name:`Pasture`}],d=600/900,f=`
attribute vec2 a;
varying vec2 vUv;
void main() { vUv = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`,p=`
precision highp float;
uniform sampler2D uA;
uniform sampler2D uB;
uniform float uP;
uniform vec2 uO;
uniform float uMax;
uniform float uRough;
uniform float uSeed;
uniform vec2 uAspect;
uniform vec2 uCover;
varying vec2 vUv;

float hash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
vec2 cover(vec2 uv) { return (uv - 0.5) * uCover + 0.5; }

void main() {
  vec2 uv = vUv;
  vec2 d = (uv - uO) * uAspect;
  float dist = length(d);
  vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
  /* the edge: a circle, pushed about by noise that drifts as it grows */
  float n = fbm(uv * 3.2 + vec2(uSeed, uSeed * 0.7) + uP * 1.4) - 0.5;
  float r = uP * (uMax + 0.3);
  float e = dist + n * uRough * 0.32 * (0.35 + uP);
  float inside = 1.0 - smoothstep(r - 0.012, r + 0.004, e);
  /* the lens: a band at the edge bending both pictures outward */
  float band = exp(-pow((e - r) / 0.05, 2.0)) * (1.0 - uP * 0.85);
  vec2 bend = dir / uAspect * band * 0.035;
  /* the old picture is drawn in a hair toward the press as it goes */
  vec2 uvA = mix(uv, uO, uP * 0.05) - bend;
  vec2 uvB = uv + bend * 0.6;
  vec3 a = texture2D(uA, cover(uvA)).rgb;
  vec3 b = texture2D(uB, cover(uvB)).rgb;
  vec3 col = mix(a, b, inside);
  col += band * 0.06;
  gl_FragColor = vec4(col, 1.0);
}`;function m({edge:e=50,speed:t=50}={}){let[n,m]=(0,o.useState)(0),[h,g]=(0,o.useState)(!1),_=(0,o.useRef)(null),v=(0,o.useRef)(null),y=(0,o.useRef)({raf:0,busy:!1,from:0,to:0,o:[.5,.5],p:0,seed:0}),b=(0,o.useRef)({edge:e,speed:t});b.current={edge:e,speed:t};let x=()=>{let e=v.current;if(!e)return;let{g:t,u:n,tex:r,ready:i}=e,a=y.current;if(!i[a.from]||!i[a.to])return;t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,r[a.from]),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,r[a.to]),t.uniform1f(n.uP,a.p),t.uniform2f(n.uO,a.o[0],a.o[1]);let o=c/l,s=Math.max(...[[0,0],[1,0],[0,1],[1,1]].map(([e,t])=>Math.hypot((e-a.o[0])*o,t-a.o[1])));t.uniform1f(n.uMax,s),t.uniform1f(n.uRough,b.current.edge/50),t.uniform1f(n.uSeed,a.seed),t.drawArrays(t.TRIANGLES,0,3)};(0,o.useEffect)(()=>{let e=_.current;if(!e)return;let t=Math.min(2,window.devicePixelRatio||1);e.width=Math.round(c*t),e.height=Math.round(l*t);let n=e.getContext(`webgl`,{antialias:!1,premultipliedAlpha:!1});if(!n){g(!0);return}let r=e=>{e.preventDefault(),g(!0)};e.addEventListener(`webglcontextlost`,r);let i=(e,t)=>{let r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),r},a=n.createProgram();n.attachShader(a,i(n.VERTEX_SHADER,f)),n.attachShader(a,i(n.FRAGMENT_SHADER,p)),n.linkProgram(a),n.useProgram(a);let o=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW);let s=n.getAttribLocation(a,`a`);n.enableVertexAttribArray(s),n.vertexAttribPointer(s,2,n.FLOAT,!1,0,0),n.viewport(0,0,e.width,e.height);let m={};for(let e of[`uA`,`uB`,`uP`,`uO`,`uMax`,`uRough`,`uSeed`,`uAspect`,`uCover`])m[e]=n.getUniformLocation(a,e);n.uniform1i(m.uA,0),n.uniform1i(m.uB,1),n.uniform2f(m.uAspect,c/l,1);let h=c/l;n.uniform2f(m.uCover,1,d/h);let b=[],S=u.map(()=>!1);n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!0),u.forEach((e,t)=>{let r=n.createTexture();b[t]=r;let i=new Image;i.onload=()=>{n.bindTexture(n.TEXTURE_2D,r),n.texImage2D(n.TEXTURE_2D,0,n.RGB,n.RGB,n.UNSIGNED_BYTE,i),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),S[t]=!0,(t===y.current.from||t===y.current.to)&&x()},i.src=e.src}),v.current={g:n,prog:a,tex:b,ready:S,u:m};let C=y.current;return()=>{e.removeEventListener(`webglcontextlost`,r),cancelAnimationFrame(C.raf),C.raf=0,C.busy=!1,v.current=null}},[]);let S=(e,t)=>{let n=y.current;if(e===n.to)return;if(n.busy&&(cancelAnimationFrame(n.raf),n.raf=0,n.busy=!1,n.from=n.to,n.p=0),h||!v.current){n.from=n.to=e,m(e),i(`whisk`,{gap:80});return}n.busy=!0,n.from=n.to,n.to=e,n.o=[t[0],1-t[1]],n.p=0,n.seed=Math.random()*40,m(e),i(`whisk`,{gap:80});let r=1900-b.current.speed/100*1e3,a=performance.now(),o=e=>1-(1-e)*(1-e),s=e=>{let t=Math.min(1,(e-a)/r);if(n.p=o(t),x(),t<1){n.raf=requestAnimationFrame(s);return}n.from=n.to,n.p=0,x(),n.raf=0,n.busy=!1};n.raf=requestAnimationFrame(s)},C=e=>S((y.current.to+e+u.length)%u.length,[e>0?.86:.14,.5]);return(0,s.jsx)(`div`,{className:`ibl`,style:{width:c},children:(0,s.jsxs)(`span`,{className:`ibl-frame`,style:{width:c,height:l},children:[(0,s.jsx)(`img`,{className:`ibl-still`,src:u[n].src,alt:``,"aria-hidden":`true`,draggable:!1}),(0,s.jsx)(`canvas`,{"data-flat":h||void 0,ref:_,className:`ibl-gl`,style:{width:c,height:l},role:`img`,"aria-label":u[n].name,onPointerDown:e=>{if(e.button!==0)return;let t=e.currentTarget.getBoundingClientRect();S((y.current.to+1)%u.length,[(e.clientX-t.left)/t.width,(e.clientY-t.top)/t.height])}}),(0,s.jsx)(`button`,{type:`button`,className:`ibl-btn`,"data-side":`prev`,"aria-label":`Previous picture`,onPointerDown:e=>{e.button===0&&(e.preventDefault(),C(-1))},onClick:e=>{e.detail===0&&C(-1)},children:(0,s.jsx)(r,{size:18,strokeWidth:2.2,"aria-hidden":`true`})}),(0,s.jsx)(`button`,{type:`button`,className:`ibl-btn`,"data-side":`next`,"aria-label":`Next picture`,onPointerDown:e=>{e.button===0&&(e.preventDefault(),C(1))},onClick:e=>{e.detail===0&&C(1)},children:(0,s.jsx)(a,{size:18,strokeWidth:2.2,"aria-hidden":`true`})})]})})}export{m as InkBloom};