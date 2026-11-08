function initPullcord() {
  const cord=document.querySelector('#pullCord'), line=document.querySelector('#cordLine'), handle=document.querySelector('#cordHandle')
  if(!cord) return
  let active=false,startY=0,offset=0
  const move=y=>{offset=Math.max(0,Math.min(145,y-startY)); handle.style.transform=`translateY(${offset}px)`; line.style.height=`${410+offset}px`; line.style.transform=`rotate(${Math.sin(offset/24)*1.4}deg)`}
  cord.addEventListener('pointerdown',e=>{active=true;startY=e.clientY-offset;cord.setPointerCapture(e.pointerId)})
  cord.addEventListener('pointermove',e=>{if(active)move(e.clientY)})
  const end=()=>{if(!active)return;active=false;if(offset>92){document.body.classList.toggle('dark');document.querySelector('#lightTitle').textContent=document.body.classList.contains('dark')?'The light is off.':'The light is on.'} offset=0;handle.style.transform='';line.style.height='410px';line.style.transform=''}
  cord.addEventListener('pointerup',end);cord.addEventListener('pointercancel',end)
}

function initCaptcha() {
  const range=document.querySelector('#clawRange'), unit=document.querySelector('#clawUnit'), cable=document.querySelector('#clawCable'), status=document.querySelector('#captchaStatus'), btn=document.querySelector('#dropClaw')
  if(!range) return
  range.addEventListener('input',()=>unit.style.left=`${range.value}%`)
  btn.addEventListener('click',()=>{
    if(btn.disabled)return;btn.disabled=true;cable.style.height='235px';status.textContent='The claw is dropping…'
    setTimeout(()=>{
      const v=Number(range.value);const toys=[...document.querySelectorAll('.toy')];let picked=null
      if(v<28)picked=toys[0];else if(v<48)picked=toys[1];else if(v<72)picked=toys[2];else picked=toys[3]
      picked.classList.add('caught');cable.style.height='92px';
      setTimeout(()=>{status.textContent=picked.dataset.toy==='duck'?'Verified — you caught the duck!':'That is not the duck. Try again.'; if(picked.dataset.toy==='duck')toast('Human verified'); setTimeout(()=>picked.classList.remove('caught'),900);btn.disabled=false},650)
    },600)
  })
}

function initGradients() {
  const swatches=[...document.querySelectorAll('.swatch')],canvas=document.querySelector('#gradientCanvas'),orb=document.querySelector('#gradientOrb'),blur=document.querySelector('#blurRange'),angle=document.querySelector('#angleRange')
  if(!canvas)return
  let selected=['#f3c1c6','#b8d8df'],pos={x:25,y:28}
  const update=()=>{canvas.style.background=`radial-gradient(circle at ${pos.x}% ${pos.y}%, ${selected[0]} 0, transparent ${blur.value}%), radial-gradient(circle at 78% 22%, ${selected[1]} 0, transparent 45%), linear-gradient(${angle.value}deg, #e4d8c8, #d8c6de)`}
  swatches.forEach(s=>s.addEventListener('click',()=>{if(s.classList.contains('active')){s.classList.remove('active')}else{if(document.querySelectorAll('.swatch.active').length>=2)document.querySelector('.swatch.active').classList.remove('active');s.classList.add('active')} selected=[...document.querySelectorAll('.swatch.active')].map(x=>x.dataset.color);while(selected.length<2)selected.push('#d8c6de');update()}))
  let drag=false;orb.addEventListener('pointerdown',e=>{drag=true;orb.setPointerCapture(e.pointerId)});orb.addEventListener('pointermove',e=>{if(!drag)return;const r=canvas.getBoundingClientRect();pos.x=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100));pos.y=Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100));orb.style.left=pos.x+'%';orb.style.top=pos.y+'%';update()});orb.addEventListener('pointerup',()=>drag=false)
  blur.addEventListener('input',update);angle.addEventListener('input',update)
  document.querySelector('#copyCss').addEventListener('click',async()=>{const css=canvas.style.background;try{await navigator.clipboard.writeText(`background: ${css};`);toast('Gradient CSS copied')}catch{toast('Copy unavailable')}})
  update()
}

function renderScene(type='onboarding') {
  const shelf=document.querySelector('#phoneShelf'); if(!shelf)return
  const c=type==='paywall'?['Unlock everything','One plan. Every feature.','Start free trial']:type==='music'?['Now playing','Signal Bloom','Listen now']:['A softer way to plan','Bring calm to busy days.','Get started']
  shelf.innerHTML=`<div class="scene-phone ${type}"><div class="phone-notch"></div><div class="phone-content"><div class="eyebrow">${type}</div><div class="scene-hero"></div><h2>${c[0]}</h2><p>${c[1]}</p><div class="scene-card" style="background:#f1efe8"><strong>${c[2]}</strong><p style="color:#777">A polished screen with a focused entrance.</p></div></div></div><div class="scene-phone ${type}" style="animation-delay:.12s;transform:rotateY(-8deg)"><div class="phone-notch"></div><div class="phone-content"><div class="scene-card" style="background:#e9f0df"><div class="eyebrow">Daily ritual</div><h2>Small steps,<br>visible progress.</h2></div><div class="scene-hero" style="margin-top:18px"></div></div></div>`
}
function initScenes(){renderScene();document.querySelectorAll('.scene-tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.scene-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderScene(b.dataset.scene)}))}

function initDeskfolio(){let i=0;const p=document.querySelector('#folioPage');if(!p)return;const draw=()=>{const d=folioPages[i];p.innerHTML=`<div class="eyebrow">${d[2]}</div><h3>${d[0]}</h3><p>${d[1].replaceAll('\n','<br>')}</p><span class="page-counter">${i+1} / ${folioPages.length}</span>`;p.animate([{transform:'rotateY(-14deg)',opacity:.2},{transform:'rotateY(0)',opacity:1}],{duration:430,easing:'cubic-bezier(.2,.8,.2,1)'})};draw();document.querySelector('#folioPrev').addEventListener('click',()=>{i=(i-1+folioPages.length)%folioPages.length;draw()});document.querySelector('#folioNext').addEventListener('click',()=>{i=(i+1)%folioPages.length;draw()})}

function initBlob(){const blob=document.querySelector('#blobMascot');if(!blob)return;const happy=()=>{blob.style.setProperty('--squish','1.12');blob.style.borderRadius='58% 42% 56% 44% / 47% 60% 40% 53%';blob.querySelector('.blob-mouth').style.borderBottom='4px solid #272321';blob.querySelector('.blob-mouth').style.borderTop='0'};const sad=()=>{blob.style.setProperty('--squish','.86');blob.querySelector('.blob-mouth').style.borderBottom='0';blob.querySelector('.blob-mouth').style.borderTop='4px solid #272321';blob.querySelector('.blob-mouth').style.top='80px'};document.querySelector('#stayBtn').addEventListener('mouseenter',happy);document.querySelector('#leaveBtn').addEventListener('mouseenter',sad);document.querySelector('#stayBtn').addEventListener('click',()=>{happy();toast('The blob is relieved')});document.querySelector('#leaveBtn').addEventListener('click',()=>{sad();toast('Demo logout only')})}

function initAnimaps(){const canvas=document.querySelector('#mapCanvas'),vehicle=document.querySelector('#vehicle'),sel=document.querySelector('#vehicleSelect'),dur=document.querySelector('#mapDuration');if(!canvas)return;sel.addEventListener('change',()=>vehicle.textContent=sel.value);document.querySelector('#playMap').addEventListener('click',()=>{canvas.classList.remove('playing');void canvas.offsetWidth;canvas.style.setProperty('--duration',dur.value+'s');vehicle.style.animationDuration=dur.value+'s';canvas.querySelector('.route-progress').style.animationDuration=dur.value+'s';canvas.classList.add('playing')})}

function initFur(){const canvas=document.querySelector('#furCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');let strands=[],pointer={x:-999,y:-999};const resize=()=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio,2);canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);strands=[];for(let y=0;y<r.height+12;y+=10){for(let x=0;x<r.width+12;x+=9){strands.push({x:x+(Math.random()*8-4),y,angle:-1.45+Math.random()*.25,base:-1.45+Math.random()*.25,len:16+Math.random()*12})}}};resize();addEventListener('resize',resize);canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top});canvas.addEventListener('pointerleave',()=>pointer={x:-999,y:-999});const draw=()=>{const r=canvas.getBoundingClientRect();ctx.fillStyle='#3b2b20';ctx.fillRect(0,0,r.width,r.height);for(const s of strands){const dx=s.x-pointer.x,dy=s.y-pointer.y,dist=Math.hypot(dx,dy);let target=s.base;if(dist<75)target=Math.atan2(dy,dx);s.angle+=(target-s.angle)*.12;const ex=s.x+Math.cos(s.angle)*s.len,ey=s.y+Math.sin(s.angle)*s.len;ctx.strokeStyle=`rgba(${115+Math.random()*16},${78+Math.random()*10},${51+Math.random()*8},.95)`;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.quadraticCurveTo(s.x+Math.cos(s.angle)*s.len*.5,s.y+Math.sin(s.angle)*s.len*.55,ex,ey);ctx.stroke()}requestAnimationFrame(draw)};draw()}

