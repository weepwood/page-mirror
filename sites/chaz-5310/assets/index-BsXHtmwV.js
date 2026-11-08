var N=Object.defineProperty;var q=(r,e,t)=>e in r?N(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var a=(r,e,t)=>q(r,typeof e!="symbol"?e+"":e,t);import{i as z,T as H,_ as Y}from"./common-T6EVmSF8.js";import{S as R,C as j,V as Q,O as $,A as J}from"./webgl-BwqbpGKL.js";import{bo as k,bF as K,ag as h,bu as T,bG as X,bH as ee,af as L,aY as O,aw as te,a8 as y,aA as d,br as U,av as se,bv as V,ab as ae,aG as ie,ad as W,bI as oe,ah as b,bk as P,bJ as ne,bp as re,bq as ce,bK as le,bL as de,bM as F,e as I,bN as he,d as me,r as G,D as fe,bc as pe,o as ue,c as ge,g as ve,a as f,n as C,t as we,bO as Se,_ as xe}from"./vendor-CpRJ2cul.js";class ye{constructor(){a(this,"stage",R.getInstance());a(this,"scene",new k)}}let E=null;function be(){if(E)return E.clone();const r=document.createElement("canvas");r.width=256,r.height=256;const e=r.getContext("2d");e&&(e.fillStyle="white",e.fillRect(0,0,256,256),e.fillStyle="black",e.fillRect(0,0,256,128));const t=new U(r);t.repeat.set(1,4),t.wrapS=t.wrapT=1e3;const s=new h(0,0);return t.offset=s,t.rotation=Math.PI/4,E=t,t}class M extends ye{constructor(e){super();const t=this.createTestMesh(e);this.stage.on("tick",()=>{}),this.scene.add(t)}createTestMesh(e){const t=new K(.26,.36,3);t.translate(0,0,.1);const s=[[t,new h(3,3)],[new T(.33,.33,.33,1,1,1),new h(1,1)],[new X(.25,0),new h(3,3)],[new ee(.22,32,32),new h(3,3)]],i=be();i.repeat.copy(s[e][1]);const o=new L({flatShading:!0,roughness:.5,roughnessMap:i,metalness:0,ior:1.5,transmission:1,thickness:.3,dispersion:3,specularIntensity:1,side:z?O:te,color:new y(16777215)});o.color.setHSL(e%2?.8:.5,.8,.7),o.flatShading=e!==3;const c=e??Math.floor(Math.random()*s.length);return new d(s[c][0],o)}}class Pe extends k{constructor(){super();const e=new T;e.deleteAttribute("uv");const t=new se({side:V}),s=new ae(16777215,3,28,2);s.position.set(.418,16.199,.3),this.add(s);const i=new d(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,40.305,28.591);const o=new ie;o.position.set(0,1,0),this.add(o);const c=new d(e,S(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),o.add(c);const n=new d(e,S(50));n.position.set(-16.109,18.021,-8.207),n.scale.set(.1,2.425,2.751),o.add(n);const g=new d(e,S(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),o.add(g);const p=new d(e,S(23));p.position.set(-.462,3.89,14.52),p.scale.set(4.38,5.441,.088),o.add(p);const v=new d(e,S(20));v.position.set(3.235,11.486,-12.541),v.scale.set(4.5,4,.1),o.add(v);const w=new d(e,S(20));w.position.set(0,20,0),w.scale.set(3,.1,3),o.add(w)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function S(r){const e=new W;return e.color.setScalar(r),e}const Ie={uniforms:{color:{value:new y(14803455)},bg:{value:new y(4003903)},time:{value:0},resolution:{value:new h(0,0)},fadeEdgeProgress:{value:0},mainArea:{value:new h(0,0)}},vertexShader:`
		// precision highp float;
    uniform float fadeEdgeProgress;
    varying vec3 vPosition;
    void main() {
      vPosition = position.xyz;
      // vPosition.z *= 2.0;
      // vPosition.z -= 0.5;
      // if (vPosition.z < 0.0) {
      //   vPosition.z = -1.0;
      // }
      float angle = (0.45 - vPosition.z) * 1.0;
      angle = max(angle, 0.);
      angle = mix(0.0, angle, fadeEdgeProgress);
      float s = sin( angle ), c = cos( angle );
      vPosition.xy = vec2( c * vPosition.x - s * vPosition.y, s * vPosition.x + c * vPosition.y );
      vPosition.xy *= 1. - (0.47 - vPosition.z) * 0.3 * fadeEdgeProgress;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );

    }
  `,fragmentShader:`
	  precision highp float;
    uniform vec3 color;
    uniform vec3 bg;
    uniform float time;
    varying vec3 vPosition;
    uniform float fadeEdgeProgress;
    uniform vec2 resolution;
    uniform vec2 mainArea;
    void main() {
      vec2 halfResolution = resolution.xy * 0.5;
      vec2 coord = gl_FragCoord.xy - halfResolution;
      vec2 clipxy = coord / (mainArea / 2.0);
      float edgeOpacity = 1.0 - smoothstep(0.0, 1., abs(clipxy.x));
      edgeOpacity *= 1.0 - smoothstep(0.0, 1., abs(clipxy.y));
      edgeOpacity = mix(1.0, edgeOpacity, fadeEdgeProgress);

      float opacity = smoothstep(-0.4, 0.5, vPosition.z);
      float gap = smoothstep(0.6, 0.9, abs(fract((vPosition.z + time) * 10.) * 2. - 1. ));

      opacity *= gap;

      gl_FragColor = vec4(color, 1.0);
      gl_FragColor *= opacity * 0.3;
      gl_FragColor *= edgeOpacity;


      // gl_FragColor.rgb = color * max(opacity, 0.01);
      // gl_FragColor.a *= opacity;
      #include <colorspace_fragment>
    }
  `},_=Math.PI*.5;class Me{constructor(e){a(this,"gltf");a(this,"stage",R.getInstance());a(this,"resolutionUniform",{value:new h(this.stage.size.x*this.stage.ratio,this.stage.size.y*this.stage.ratio)});a(this,"mainAreaUniform",{value:new h(0,0)});a(this,"camera");a(this,"view");a(this,"output");a(this,"sideScenes",[]);a(this,"sideBoxes",[]);a(this,"sideBoxEnvRenderTarget",new oe(256));a(this,"isZoomIn",!0);a(this,"zoomInRadius",1);a(this,"zoomOutRadius",z?2.4:2.8);a(this,"zoomInProgressUniform",{value:this.isZoomIn?1:0});a(this,"cameraPosition",new b(2,0,5).setLength(this.isZoomIn?this.zoomInRadius:this.zoomOutRadius));a(this,"cameraSpherical",new P().setFromVector3(this.cameraPosition));a(this,"cameraSpherical2",new P);a(this,"dampOffsetSpherical",new P);a(this,"offsetSpherical",new P);a(this,"currentSideBoxIndex",0);a(this,"addTheta",this.cameraSpherical.theta);a(this,"rotateTween");this.gltf=e,this.camera=new j,this.camera.setDefault(new b(2,0,5).setLength(3.8)),this.camera.instance.position.copy(this.cameraPosition),this.camera.instance.lookAt(new b(0,0,0)),this.camera.instance.fov=50,this.camera.instance.near=.1,this.camera.instance.far=200,this.camera.instance.updateProjectionMatrix(),z&&(this.camera.enableControls(),this.camera.controls.minDistance=.1,this.camera.controls.maxDistance=100,this.camera.controls.enableZoom=!1,this.camera.controls.enablePan=!1,this.camera.controls.maxPolarAngle=Math.PI*.6,this.camera.controls.minPolarAngle=Math.PI*.4,this.camera.controls.rotateSpeed=.7,this.camera.controls.autoRotate=!0,this.camera.controls.autoRotateSpeed=-1),this.view=new Q("index"),this.view.setCamera(this.camera);const t=this.view.scene,s=new Pe(this.stage.renderer),o=new ne(this.stage.renderer).fromScene(s,.015).texture;t.environment=o,t.environmentIntensity=1,s.dispose(),this.output=new $,this.output.setView(this.view);const c=e.scene.getObjectByName("sideframe");c.material=new L({flatShading:!1,roughness:.3,metalness:0,ior:1.5,transmission:1,opacity:.8,thickness:.03,dispersion:1,specularIntensity:1,side:O,color:new y(14803455)}),c.material.onBeforeCompile=l=>{l.uniforms.fadeEdgeProgress=this.zoomInProgressUniform,l.uniforms.resolution=this.resolutionUniform,l.uniforms.mainArea=this.mainAreaUniform,l.fragmentShader=l.fragmentShader.replace("void main() {",`
          uniform float fadeEdgeProgress;
          uniform vec2 resolution;
          uniform vec2 mainArea;
          void main() {
        `).replace("#include <opaque_fragment>",`
          vec2 halfResolution = resolution.xy * 0.5;
          vec2 coord = gl_FragCoord.xy - halfResolution;
          vec2 clipxy = coord / (mainArea / 2.0);
          float edgeOpacity = 1.0 - smoothstep(0.0, 1., abs(clipxy.x));
          edgeOpacity = mix(1.0, edgeOpacity, fadeEdgeProgress);
          #include <opaque_fragment>
          gl_FragColor *= edgeOpacity;
        `)},t.add(c);const n=.4317*2,g=.4782,p=new re(Ie);p.side=V;const v=new T(n,n,g*2,20,20,180),w=new d(v,p.clone()),Z=new ce(n,n),D=new W({color:new y(16777215)}),B=new d(Z,D);B.position.z=g;for(let l=0;l<4;l++){const A=l+1,u=B.clone();u.material=B.material.clone(),u.material.side=O,u.material.stencilWrite=!0,u.material.stencilFunc=le,u.material.stencilRef=A,u.material.depthWrite=!1,u.material.stencilZPass=de,u.renderOrder=0;const m=w.clone();m.material=p.clone(),m.renderOrder=1,m.material.stencilWrite=!0,m.material.stencilRef=A,m.material.stencilFunc=F,m.material.uniforms.fadeEdgeProgress=this.zoomInProgressUniform,m.material.uniforms.resolution=this.resolutionUniform,m.material.uniforms.mainArea=this.mainAreaUniform;const x=new k;x.rotation.y=l*Math.PI*.5,x.add(m),x.add(u),this.sideScenes.push(x),this.sideBoxes.push(m),t.add(x)}this.stage.on("tick",()=>{this.sideBoxes.forEach(l=>{l.material.uniforms.time.value+=.001})}),this.stage.on("resize",()=>{this.onResize()}),this.onResize(),this.initEvent()}render(){}initEvent(){z||(document.addEventListener("mousemove",e=>{const t=e.clientX/window.innerWidth,s=e.clientY/window.innerHeight,i=Math.PI*.3*(t-.5),o=Math.PI*.2*(s-.5);this.offsetSpherical.theta=i,this.offsetSpherical.phi=o}),this.stage.on("tick",()=>{this.dampOffsetSpherical.phi+=(this.offsetSpherical.phi-this.dampOffsetSpherical.phi)*.1,this.dampOffsetSpherical.theta+=(this.offsetSpherical.theta-this.dampOffsetSpherical.theta)*.1,this.cameraSpherical2.phi=this.cameraSpherical.phi+this.dampOffsetSpherical.phi,this.cameraSpherical2.theta=this.cameraSpherical.theta+this.dampOffsetSpherical.theta,this.cameraSpherical2.radius=this.cameraSpherical.radius,this.camera.instance.position.setFromSpherical(this.cameraSpherical2),this.camera.instance.lookAt(new b(0,0,0))}),document.addEventListener("wheel",e=>{e.deltaY>40?this.goNextSideBox():e.deltaY<-40&&this.goPrevSideBox()})),this.stage.container.addEventListener("mousedown",()=>{this.isZoomIn=!this.isZoomIn;const{isZoomIn:e,zoomInRadius:t,zoomOutRadius:s}=this,i={progress:this.zoomInProgressUniform.value};new I.Tween(i).to({progress:e?1:0},500).easing(I.Easing.Quartic.Out).onUpdate(()=>{this.zoomInProgressUniform.value=i.progress,this.cameraSpherical.radius=s+(t-s)*i.progress,this.camera.instance.position.setLength(this.cameraSpherical.radius)}).start()})}goNextSideBox(){this.toSideBox((this.currentSideBoxIndex+1)%4)}goPrevSideBox(){this.toSideBox((this.currentSideBoxIndex-1+4)%4)}toSideBox(e=0){if(this.rotateTween||e===this.currentSideBoxIndex)return;const t=this.currentSideBoxIndex;this.currentSideBoxIndex=e;const s=_*t;let i=_*e;t===0&&e===3?i=-_:t===3&&e===0&&(i=_*4),this.rotateTween=new I.Tween({theta:s}).to({theta:i},1e3).easing(I.Easing.Quartic.Out).onUpdate(({theta:o})=>{this.cameraSpherical.theta=o+this.addTheta}).onComplete(()=>{this.rotateTween=void 0}).start()}createSideBoxTexture(){const e=document.createElement("canvas");e.width=64,e.height=64;const t=e.getContext("2d");t.fillStyle="#fff",t.fillRect(0,0,e.width/4,e.height),e.style.position="absolute",e.style.top="0";const s=new U(e);return s.anisotropy=16,s.needsUpdate=!0,s.generateMipmaps=!0,s}addSideScene(e,t=0){this.sideScenes[t].add(e.scene),e.scene.traverse(s=>{s instanceof d&&"material"in s&&(s.material.stencilWrite=!0,s.material.stencilRef=t+1,s.material.stencilFunc=F,s.material.envMap=this.view.scene.environment,s.material.envMapRotation=new he(0,Math.PI*.5*t,0))})}onResize(){const e=window.innerWidth>window.innerHeight,s=document.querySelector(".response-container").clientWidth;this.resolutionUniform.value.set(this.stage.size.x*this.stage.ratio,this.stage.size.y*this.stage.ratio);const i=this.stage.size.x>1800?1800:this.stage.size.x;this.mainAreaUniform.value.set(i*this.stage.ratio,this.resolutionUniform.value.y),e?this.camera.offsetView(new h(-s*.2,0),0):this.camera.offsetView(new h(0,0),0)}}const _e="/assets/impossible_box-CWC4Ybv3.glb",ze={class:"fixed-page index"},Be={class:"main"},Ce={class:"banner"},Ee={class:"hero-container response-container"},Oe=me({__name:"index",setup(r){const e=G(!1),t=G(),s=new J;let i,o;return fe(()=>{s.load({gltf:_e},()=>{},c=>{const n=new pe({antialias:!0,stencil:!0,alpha:!0});o=new R(t.value,n),i=new Me(c.gltf);const g=new M(0),p=new M(1),v=new M(2),w=new M(3);i.addSideScene(g,0),i.addSideScene(p,1),i.addSideScene(v,2),i.addSideScene(w,3),H.addTick(o.tick),e.value=!0})}),(c,n)=>(ue(),ge("div",ze,[ve(Y,{mode:"overlay"}),f("main",Be,[f("div",{class:C(["gradient-bg response-container",{active:e.value}])},n[0]||(n[0]=[f("div",null,null,-1),f("div",null,null,-1)]),2),f("div",Ce,[f("div",Ee,[f("div",{class:C(["hero",{active:e.value}])},[n[1]||(n[1]=f("h1",{class:"art-font2"},"Chaz 3D Experience",-1)),f("p",null,we(c.$t("index.slogan")),1)],2)]),f("div",{class:C(["canvas-container",{"canvas-container--loaded":e.value}]),ref_key:"refCanvasContainer",ref:t},null,2)])]),n[2]||(n[2]=Se('<div class="footer-wrapper" data-v-7f42b97f><footer class="footer response-container" data-v-7f42b97f><span class="footer__item" data-v-7f42b97f>Designed by Chaz</span><div class="footer-group" data-v-7f42b97f><a class="footer__item" href="https://beian.miit.gov.cn/" target="_blank" data-v-7f42b97f>粤ICP备2022001828号-2</a><a class="footer__item" target="_blank" href="https://beian.mps.gov.cn/#/query/webSearch?code=44030002002161" data-v-7f42b97f>粤公网安备 44030002002161号 </a></div></footer></div>',1))]))}}),Fe=xe(Oe,[["__scopeId","data-v-7f42b97f"]]);export{Fe as default};
//# sourceMappingURL=index-BsXHtmwV.js.map
