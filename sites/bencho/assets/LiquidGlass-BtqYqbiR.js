import{i as e,t}from"./jsx-runtime-Cx0BB4qO.js";import{t as n}from"./react-3BKWdGy3.js";import{n as r}from"./spring-BlTUx5Yd.js";import{o as i}from"./sound-Q67qmSVK.js";import{t as a}from"./cow-CTOWkrqx.js";var o=e(n(),1),s=t(),c=440,l=90,u=620,d=u,f=20,p=`
attribute vec2 pos;
varying vec2 vUv;
void main() {
  vUv = vec2(pos.x * 0.5 + 0.5, 0.5 - pos.y * 0.5);
  gl_Position = vec4(pos, 0.0, 1.0);
}`,m=`
precision highp float;
uniform sampler2D tex;
uniform vec2 res;
uniform vec2 c;
uniform vec2 b;
uniform float r;
uniform float bend;
uniform float fringe;
uniform float dark;
varying vec2 vUv;

float sdf(vec2 p) {
  vec2 q = abs(p - c) - b + vec2(r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

/* premultiplied: the margin round the picture is transparent,
   so the real card shows through it and the glass over it bends
   nothing — only its light and its shadow are left */
vec4 read(vec2 p) {
  return texture2D(tex, clamp(p / res, 0.0, 1.0));
}

void main() {
  vec2 p = vUv * res;
  float d = sdf(p);
  vec4 col = read(p);

  /* what it casts: soft, a little below. It darkens the picture
     where there is one and is a shadow of its own where there
     is not. */
  float ds = sdf(p - vec2(0.0, 9.0));
  float sh = (1.0 - smoothstep(-8.0, 26.0, ds)) * mix(0.14, 0.3, dark);
  if (d > 0.0) col = vec4(col.rgb * (1.0 - sh), col.a) + vec4(0.0, 0.0, 0.0, sh * (1.0 - col.a));

  if (d < 1.0) {
    float e = 1.5;
    vec2 n = normalize(vec2(
      sdf(p + vec2(e, 0.0)) - sdf(p - vec2(e, 0.0)),
      sdf(p + vec2(0.0, e)) - sdf(p - vec2(0.0, e))
    ) + 1e-5);
    /* the bending band scales with the ball, so a big one is
       still a lens and a small one is not all rim */
    float bevel = min(b.y, max(22.0, b.y * 0.36));
    /* 0 at the rim, 1 once past the bevel */
    float t = clamp(-d / bevel, 0.0, 1.0);
    float edge = pow(1.0 - t, 2.4);

    vec2 mag = c + (p - c) / 1.1;
    vec2 off = n * edge * bevel * 1.1 * bend;
    vec2 q = mag + off;
    vec4 mid = read(q);
    vec4 g = vec4(read(q + off * fringe).r, mid.g, read(q - off * fringe).b, mid.a);

    /* the light: a thin lit band just inside the edge, bright
       where it faces up-left, a weaker catch on the far side
       where light has come through and out again */
    vec2 L = normalize(vec2(-0.55, -0.85));
    float rim = smoothstep(0.0, 1.6, -d) * (1.0 - smoothstep(1.6, 4.5, -d));
    float lit = max(dot(n, L), 0.0);
    float far = max(dot(n, -L), 0.0);
    g.rgb *= mix(1.03, 1.08, dark);
    /* light is added as light: colour and coverage together, so
       it shows on the card as well as on the picture */
    float light = rim * (0.18 + 0.75 * lit) + rim * far * 0.22 + edge * mix(0.05, 0.08, dark);
    g += vec4(vec3(light), light);
    g = clamp(g, 0.0, 1.0);

    float a = 1.0 - smoothstep(-0.6, 0.6, d);
    col = mix(col, g, a);
  }
  gl_FragColor = col;
}`,h=(e,t,n)=>Math.min(n,Math.max(t,e));function g(){let e=()=>document.documentElement.dataset.theme===`dark`,[t,n]=(0,o.useState)(e);return(0,o.useEffect)(()=>{let t=new MutationObserver(()=>n(e()));return t.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`]}),()=>t.disconnect()},[]),t}function _(e){let t=(t,n)=>{let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r},n=e.createProgram();return e.attachShader(n,t(e.VERTEX_SHADER,p)),e.attachShader(n,t(e.FRAGMENT_SHADER,m)),e.linkProgram(n),e.getProgramParameter(n,e.LINK_STATUS)?n:null}function v({size:e=180,bend:t=60,fringe:n=30,corner:p=f}={}){let m=g(),v=r(),y=(0,o.useRef)(null),b=(0,o.useRef)(null),x=(0,o.useRef)(null),S=(0,o.useRef)(0),C=(0,o.useRef)({x:u*.6,y:d*.42,vx:0,vy:0,tx:u*.6,ty:d*.42}),w=(0,o.useRef)(null),T=(0,o.useRef)({size:e,bend:t,fringe:n,dark:m});T.current={size:e,bend:t,fringe:n,dark:m};let E=()=>{let e=b.current,t=y.current;if(!e||!t)return;let{g:n,prog:r}=e,i=t.width/u,a=C.current,{size:o,bend:s,fringe:c,dark:l}=T.current,d=Math.hypot(a.vx,a.vy),f=v?0:Math.min(.14,d*.012),p=d>.01?Math.abs(a.vx)/d:1,m=h(o,100,280)/2,g=m*(1+f*p-f*.5*(1-p)),_=m*(1+f*(1-p)-f*.5*p);n.viewport(0,0,t.width,t.height),n.useProgram(r);let x=e=>n.getUniformLocation(r,e);n.uniform2f(x(`res`),t.width,t.height),n.uniform2f(x(`c`),a.x*i,a.y*i),n.uniform2f(x(`b`),g*i,_*i),n.uniform1f(x(`r`),Math.min(g,_)*i),n.uniform1f(x(`bend`),h(s,0,100)/100),n.uniform1f(x(`fringe`),h(c,0,40)/100),n.uniform1f(x(`dark`),+!!l),n.drawArrays(n.TRIANGLE_STRIP,0,4)},D=()=>{if(S.current)return;let e=0,t=n=>{let r=e?h((n-e)/16.67,0,2.5):1;e=n;let i=C.current;if(v)i.x=i.tx,i.y=i.ty,i.vx=0,i.vy=0;else{let e=.22,t=.66**r;i.vx=(i.vx+(i.tx-i.x)*e*r)*t,i.vy=(i.vy+(i.ty-i.y)*e*r)*t,i.x+=i.vx*r,i.y+=i.vy*r}E();let a=Math.abs(i.tx-i.x)>.05||Math.abs(i.ty-i.y)>.05||Math.abs(i.vx)>.05||Math.abs(i.vy)>.05||w.current;S.current=a?requestAnimationFrame(t):0};S.current=requestAnimationFrame(t)},O=async()=>{let e=y.current,t=b.current;if(!e||!t)return;let n=x.current??=document.createElement(`canvas`);n.width=e.width,n.height=e.height;let r=n.getContext(`2d`),i=e.width/u;r.clearRect(0,0,n.width,n.height);let o=new Image;o.src=a,await o.decode().catch(()=>{});let s=l*i,d=c*i,f=Math.max(d/o.width,d/o.height),m=o.width*f,g=o.height*f;r.save(),r.beginPath(),r.roundRect(s,s,d,d,h(p,0,60)*i),r.clip(),r.drawImage(o,s+(d-m)/2,s+(d-g)/2,m,g),r.restore();let{g:_,tex:v}=t;_.bindTexture(_.TEXTURE_2D,v),_.pixelStorei(_.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),_.texImage2D(_.TEXTURE_2D,0,_.RGBA,_.RGBA,_.UNSIGNED_BYTE,n),E()};(0,o.useEffect)(()=>{let e=y.current;if(!e)return;let t=Math.min(2,window.devicePixelRatio||1);e.width=Math.round(u*t),e.height=Math.round(d*t);let n=e.getContext(`webgl`,{antialias:!0,premultipliedAlpha:!0,alpha:!0});if(!n)return;let r=_(n);if(!r)return;let i=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,i),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),n.STATIC_DRAW);let a=n.getAttribLocation(r,`pos`);n.enableVertexAttribArray(a),n.vertexAttribPointer(a,2,n.FLOAT,!1,0,0);let o=n.createTexture();return n.bindTexture(n.TEXTURE_2D,o),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),b.current={g:n,prog:r,tex:o},()=>{cancelAnimationFrame(S.current),S.current=0,b.current=null}},[]),(0,o.useEffect)(()=>{O()},[m,p]),(0,o.useEffect)(()=>{E()},[e,t,n]);let k=e=>{let t=e.currentTarget.getBoundingClientRect(),n=t.width/u;return{x:(e.clientX-t.left)/n,y:(e.clientY-t.top)/n}},A=t=>{let n=C.current;return Math.hypot(t.x-n.x,t.y-n.y)<=h(e,100,280)/2+4};return(0,s.jsx)(`div`,{className:`lqg`,children:(0,s.jsx)(`canvas`,{ref:y,className:`lqg-canvas`,style:{width:u,height:d},"aria-label":`A ball of glass over a photograph. Drag it.`,role:`img`,onPointerDown:e=>{let t=k(e);if(!A(t))return;let n=C.current;w.current={dx:t.x-n.x,dy:t.y-n.y};try{e.currentTarget.setPointerCapture(e.pointerId)}catch{}i(`lift`),D()},onPointerMove:e=>{let t=k(e),n=w.current;if(e.currentTarget.dataset.over=A(t)||n?`true`:`false`,!n)return;let r=C.current;r.tx=h(t.x-n.dx,0,u),r.ty=h(t.y-n.dy,0,d),D()},onPointerUp:()=>{w.current&&(w.current=null,i(`drop`),D())},onPointerCancel:()=>{w.current=null,D()}})})}export{v as LiquidGlass};