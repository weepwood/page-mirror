const components = [
  { path: '/pullcord', title: 'PullCord', desc: 'A cloth cord that really hangs. Pull it to switch the lights.', art: '<div class="art-rope"></div>' },
  { path: '/captcha', title: 'ClawCaptcha', desc: 'Prove you are human by winning the claw machine.', art: '<div class="art-claw"></div>' },
  { path: '/gradients', title: 'Gradient Builder', desc: 'Soft gradients blended from traditional Japanese colours.', art: '<div class="art-gradient"></div>' },
  { path: '/scenes', title: 'Screenery', desc: 'A shelf of finished app screens, each with a signature move.', art: '<div class="art-phone"></div>' },
  { path: '/deskfolio', title: 'DeskFolio', desc: 'A little book that blooms open and turns pages on a spring.', art: '<div class="art-book"></div>' },
  { path: '/blob', title: 'Blob', desc: 'A squishy jelly mascot that reacts inside a log-out modal.', art: '<div class="art-blob"></div>' },
  { path: '/animaps', title: 'AniMaps', desc: 'Animated route maps you can export and share.', art: '<div class="art-map"></div>' },
  { path: '/fur', title: 'Fur', desc: 'A pettable coat of fur, painted strand by strand.', art: '<div class="art-fur"></div>' },
  { path: '/vacuum', title: 'Vacuum', desc: 'Select a few tiles and a vacuum sucks them up the hose.', art: '<div class="art-vacuum"></div>' },
  { path: '/crumple', title: 'Crumple', desc: 'Notes crumple into paper balls and drop in the basket.', art: '<div class="art-crumple"></div>' },
  { path: '/hologram', title: 'Hologram', desc: 'A foil trading card that catches the light as you tilt it.', art: '<div class="art-holo"></div>' },
  { path: '/matchday', title: 'Matchday', desc: 'Letterboxd for football. Rate matches in half-stars.', art: '<div class="art-match"><span>2</span><small>FT</small><span>1</span></div>' }
]

const descriptions = {
  '/pullcord': 'A ceiling pull-cord you can actually grab. The rope hangs, stretches and swings; pull it down to crossfade between light and dark.',
  '/captcha': 'ClawCaptcha replaces blurry image grids with an arcade claw machine. Move the claw, drop it and grab the requested toy.',
  '/gradients': 'Build soft, layered gradients from traditional Japanese-inspired colours. Move the colour fields and copy the generated CSS.',
  '/scenes': 'A gallery of polished mobile app screens, each staged with a signature entrance animation and compact product-story layout.',
  '/deskfolio': 'A portfolio that behaves like a small physical book. Browse the about, work and contact pages from a warm desktop scene.',
  '/blob': 'A soft jelly mascot living inside a log-out modal. It changes expression and shape as you hover and choose an action.',
  '/animaps': 'Create an animated travel route across a tactile map canvas. Tune the vehicle and playback, then preview the journey.',
  '/fur': 'A canvas experiment that paints a coat of fur strand by strand. Move your cursor across it and watch the hair part and settle.',
  '/vacuum': 'Bulk deletion with theatre: select a few tiles, start the vacuum and watch the chosen objects disappear into the hose.',
  '/crumple': 'A paper metaphor for deleting notes. Write something, crumple it into a ball and drop it into the basket below.',
  '/hologram': 'A foil trading card rendered with pointer-driven 3D tilt and a shifting holographic sheen.',
  '/matchday': 'A calm football diary for logging watched matches and rating each one in half-star increments.'
}

const app = document.querySelector('#app')
const cleanPath = () => {
  const saved = sessionStorage.getItem('feralui-path')
  if (saved) {
    sessionStorage.removeItem('feralui-path')
    history.replaceState({}, '', saved)
  }
  const p = location.pathname.replace(/\/+$/, '') || '/'
  const repoBase = '/feralui'
  return p.startsWith(repoBase) ? (p.slice(repoBase.length) || '/') : p
}

function header() {
  return `<header class="site-header">
    <a class="brand" href="./" data-link>FeralUI <small>v0.1.0</small></a>
    <div class="header-center">playful, physics-driven elements</div>
    <div class="header-actions">
      <button class="pill-btn" id="surprise">Surprise me</button>
      <a class="icon-btn" aria-label="GitHub repository" href="https://github.com/weepwood/feralui" target="_blank" rel="noreferrer">↗</a>
    </div>
  </header>`
}

function home() {
  return `<main class="page home">
    <section class="hero">
      <div class="eyebrow">An interaction library / built for the browser</div>
      <h1 class="hero-title">Components that move like <em>real things.</em></h1>
      <div class="hero-copy">
        <p>A small library of playful, physics-driven React-inspired elements. Real motion, hand-tuned animation and a little bit of whimsy.</p>
        <div class="hero-note">12 experiments · pointer friendly · responsive</div>
      </div>
    </section>
    <section class="component-grid" aria-label="Components">
      ${components.map((c,i)=>`<a class="component-card" href=".${c.path}" data-link>
        <div class="card-top"><div><div class="card-index">${String(i+1).padStart(2,'0')} / 12</div><h2 class="card-title">${c.title}</h2><p class="card-desc">${c.desc}</p></div><div class="card-arrow">↗</div></div>
        <div class="card-art">${c.art}</div>
      </a>`).join('')}
    </section>
  </main>`
}

function demoFrame(component, content) {
  return `<main class="page demo-page">
    <section class="demo-heading"><h1>${component.title}</h1><p>${descriptions[component.path]}</p></section>
    <section class="demo-stage">${content}</section>
    <div class="demo-footer"><span>${component.title} · interactive browser study</span><a href="./" data-link>Browse all components ↗</a></div>
  </main>`
}

function pullcord() {
  return demoFrame(components[0], `<div class="pull-stage"><div class="pull-label">DRAG THE HANDLE DOWN</div><div class="pull-cord" id="pullCord"><div class="cord-line" id="cordLine"></div><div class="cord-handle" id="cordHandle">PULL</div></div><div class="light-copy"><h2 id="lightTitle">The light is on.</h2><p>Pull past the line to switch the room.</p></div></div>`)
}

function captcha() {
  return demoFrame(components[1], `<div class="captcha-stage"><div class="captcha-box"><div class="captcha-title"><div><h3>Prove you are human</h3><p>Grab the duck with the claw.</p></div><span>🕹️</span></div><div class="machine"><div class="claw-rail"></div><div class="claw-unit" id="clawUnit"><div class="claw-cable" id="clawCable"></div><div class="claw-head"></div></div><div class="toy-row"><span class="toy" data-toy="frog">🐸</span><span class="toy" data-toy="duck">🐥</span><span class="toy" data-toy="bear">🧸</span><span class="toy" data-toy="panda">🐼</span></div></div><div class="machine-controls"><div class="joystick-wrap"><span>◀</span><input id="clawRange" type="range" min="10" max="90" value="50" aria-label="Move claw"><span>▶</span></div><button class="drop-btn" id="dropClaw">DROP</button></div><p class="captcha-status" id="captchaStatus">Move the joystick, then press the red button.</p></div></div>`)
}

const colors = [
  ['Sakura','桜','#f3c1c6'],['Mizu','水','#b8d8df'],['Fuji','藤','#c8b8db'],['Kohaku','琥珀','#d9a95f'],['Matcha','抹茶','#a9b48c'],['Sumi','墨','#5a5a58']
]
function gradients() {
  return demoFrame(components[2], `<div class="gradient-stage"><div class="gradient-app"><aside class="gradient-sidebar"><h3>Irodori</h3><div class="eyebrow">soft gradient builder</div><div class="swatch-list">${colors.map((c,i)=>`<button class="swatch ${i<2?'active':''}" data-color="${c[2]}"><span class="swatch-dot" style="background:${c[2]}"></span><span>${c[0]}</span><small>${c[1]}</small></button>`).join('')}</div></aside><div class="gradient-main"><div class="gradient-canvas" id="gradientCanvas"><div class="gradient-orb" id="gradientOrb" style="left:25%;top:28%"></div></div><div class="gradient-toolbar"><label>Blur <input id="blurRange" type="range" min="10" max="80" value="42"></label><label>Angle <input id="angleRange" type="range" min="0" max="360" value="135"></label><button class="copy-css" id="copyCss">Copy CSS</button></div></div></div></div>`)
}

function scenes() {
  return demoFrame(components[3], `<div class="scenes-stage"><div class="scenes-bar"><h3>Complete app screens with real motion.</h3><div class="scene-tabs"><button class="scene-tab active" data-scene="onboarding">Onboarding</button><button class="scene-tab" data-scene="paywall">Paywall</button><button class="scene-tab" data-scene="music">Music</button></div></div><div class="phone-shelf" id="phoneShelf"></div></div>`)
}

const folioPages = [
  ['Hello, I’m Mort.','Front-end developer crafting playful interfaces with motion, sound and a stubborn attention to detail.','About / 01'],
  ['Selected work','PullCord theme toggle\nClawCaptcha arcade check\nGradient Builder\nAniMaps route studio','Projects / 02'],
  ['Tools & craft','React · TypeScript · Motion\nCanvas · SVG · Web Audio\nPrototyping · Interaction design','Skills / 03'],
  ['Say hello','Available for thoughtful interface work and small experiments with a physical feel.\n\nhello@feralui.dev','Contact / 04']
]
function deskfolio() {
  return demoFrame(components[4], `<div class="desk-stage"><div class="desk"><span class="desk-sticker one">✿</span><span class="desk-sticker two">★</span><div class="folio-book"><article class="folio-page left"><div class="eyebrow">FeralUI journal</div><div class="folio-lines"></div><p>Notes, components and selected work.</p></article><article class="folio-page right" id="folioPage"></article></div><div class="book-nav"><button id="folioPrev">←</button><button id="folioNext">→</button></div></div></div>`)
}

function blob() {
  return demoFrame(components[5], `<div class="blob-stage"><div class="logout-modal"><div class="blob-mascot" id="blobMascot"><span class="blob-eye left"></span><span class="blob-eye right"></span><span class="blob-mouth"></span></div><h3>Leaving already?</h3><p>Your tiny jelly friend will keep everything safe until you come back.</p><div class="modal-actions"><button class="cancel-logout" id="stayBtn">Stay here</button><button class="confirm-logout" id="leaveBtn">Log out</button></div></div></div>`)
}

function animaps() {
  return demoFrame(components[6], `<div class="map-stage"><aside class="map-panel"><h3>AniMaps</h3><div class="eyebrow">route animation studio</div><div class="map-field"><label>From</label><input value="Kyoto"></div><div class="map-field"><label>To</label><input value="Tokyo"></div><div class="map-field"><label>Vehicle</label><select id="vehicleSelect"><option value="🚗">Car</option><option value="🚆">Train</option><option value="✈️">Plane</option><option value="🚲">Bike</option></select></div><div class="map-field"><label>Duration</label><input type="range" min="2" max="8" value="5" id="mapDuration"></div><button class="map-play" id="playMap">Play journey</button></aside><div class="map-canvas" id="mapCanvas"><div class="map-land a"></div><div class="map-land b"></div><svg class="route-svg" viewBox="0 0 1000 700" preserveAspectRatio="none"><path class="route-line" d="M180 455 C260 210 410 230 540 340 S760 130 850 280" pathLength="1"/><path class="route-progress" d="M180 455 C260 210 410 230 540 340 S760 130 850 280" pathLength="1"/></svg><div class="vehicle" id="vehicle">🚗</div></div></div>`)
}

function fur() {
  return demoFrame(components[7], `<div class="fur-stage"><canvas id="furCanvas"></canvas><div class="fur-hint">MOVE YOUR CURSOR THROUGH THE COAT</div></div>`)
}

function vacuum() {
  const tileColors = ['#d8b7a0','#a8bdc4','#d6c97f','#9fae85','#c8a9c0','#8fb3aa','#daa099','#c3b28b','#a2a4c7','#ceb9a6']
  return demoFrame(components[8], `<div class="vacuum-stage"><div class="vacuum-toolbar"><strong><span id="selectedCount">0</span> Selected</strong><div class="vacuum-actions"><button id="selectAll">Select All</button><button id="vacuumDelete">Vacuum selected</button></div></div><div class="vacuum-grid">${tileColors.map((c,i)=>`<button class="vacuum-tile" style="--tile-bg:${c}" data-id="${i}"><span class="tile-thumb"></span><span class="tile-name">Object ${String(i+1).padStart(2,'0')}</span></button>`).join('')}</div><div class="vacuum-unit"></div></div>`)
}

function crumple() {
  return demoFrame(components[9], `<div class="crumple-stage"><div class="crumple-desk"><div class="note-paper" id="notePaper"><textarea aria-label="Note">Deleting a note should feel like actually throwing paper away.</textarea></div><button class="crumple-btn" id="crumpleBtn">Crumple note</button><div class="trash-basket"></div></div></div>`)
}

function hologram() {
  return demoFrame(components[10], `<div class="holo-stage" id="holoStage"><article class="holo-card" id="holoCard"><div class="holo-inner"><div class="holo-top"><span>FERALMON</span><span>120 HP</span></div><div class="holo-creature">🦊</div><div class="holo-info"><h3>Prism Fox</h3><p>Its coat splits moonlight into a thousand tiny interface states.</p></div></div></article></div>`)
}

const matches = [
  ['ARS','CHE','Arsenal 2–1 Chelsea','Premier League · 12 May','★★★★☆'],
  ['RMA','FCB','Real Madrid 3–3 Barcelona','La Liga · 21 April','★★★★★'],
  ['BVB','B04','Dortmund 1–0 Leverkusen','Bundesliga · 30 March','★★★☆☆'],
  ['INT','MIL','Inter 2–2 Milan','Serie A · 18 February','★★★★☆']
]
function matchday() {
  return demoFrame(components[11], `<div class="match-stage"><div class="match-app"><div class="match-nav"><strong>Matchday</strong><div class="match-profile">M</div></div><div class="match-hero"><h3>Your season,<br>match by match.</h3><div><p>Log what you watched, rate the atmosphere and build a personal diary of the games that stayed with you.</p><button class="add-match" id="addMatch">+ Log a match</button></div></div><div class="match-list" id="matchList">${matches.map((m,i)=>`<article class="match-row"><div class="club-pair"><span>${m[0]}</span><span>·</span><span>${m[1]}</span></div><div class="match-meta"><h4>${m[2]}</h4><small>${m[3]}</small></div><div class="stars" data-row="${i}" aria-label="Rating">${[1,2,3,4,5].map((n)=>`<span data-star="${n}">${m[4][n-1]}</span>`).join('')}</div></article>`).join('')}</div></div></div>`)
}

const routes = {'/':home,'/pullcord':pullcord,'/captcha':captcha,'/gradients':gradients,'/scenes':scenes,'/deskfolio':deskfolio,'/blob':blob,'/animaps':animaps,'/fur':fur,'/vacuum':vacuum,'/crumple':crumple,'/hologram':hologram,'/matchday':matchday}

function toast(message) {
  let el = document.querySelector('.toast')
  if (!el) { el = document.createElement('div'); el.className='toast'; document.body.append(el) }
  el.textContent=message; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),1800)
}

function navigate(path) {
  const base = location.pathname.startsWith('/feralui') ? '/feralui' : ''
  history.pushState({},'',base + path)
  render()
}

function bindGlobal() {
  document.querySelectorAll('[data-link]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault(); const href=a.getAttribute('href').replace(/^\./,'')||'/'; navigate(href)}))
  document.querySelector('#surprise')?.addEventListener('click',()=>navigate(components[Math.floor(Math.random()*components.length)].path))
}

