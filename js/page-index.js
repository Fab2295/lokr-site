// Lokr+ site — index page: builds the WebGL 3D stage + content sections
const SCREEN_FILES = {
  g: "g.jpg", vault: "vault.jpg", b: "b.png", c: "c.png",
  d: "d.png", e: "e.jpg", f: "f.jpg", a: "a.jpg"
};
const SCREEN_ORDER = ["g", "vault", "b", "c", "d", "e", "f", "a"];
function imgSet(lang) { return lang === "pt" ? "pt" : "en"; } // ES reuses EN screenshots

const POSES = [
  { tx: 0, rx: 32, ry: 0, rz: -18, scale: 0.66, ty: 20 },
  { tx: 1, rx: 0, ry: 0, rz: 0, scale: 1, ty: 0 },
  { tx: -1, rx: 0, ry: 0, rz: 0, scale: 1, ty: 0 },
  { tx: 0, rx: 0, ry: 180, rz: 0, scale: 0.68, ty: -13 },
  { tx: 1, rx: 0, ry: 360, rz: 0, scale: 1, ty: 0 },
  { tx: -1, rx: 0, ry: 360, rz: 0, scale: 1, ty: 0 },
  { tx: 1, rx: 0, ry: 360, rz: 0, scale: 1, ty: 0 },
  { tx: 0, rx: 0, ry: 360, rz: 0, scale: 0.58, ty: -20 }
];
const SEGMENT_COUNT = 7;
const INTRO_END = 0.05;
const SEG_SPAN = (1 - INTRO_END) / SEGMENT_COUNT;
const LEGEND_SIDE = { 1: "left", 2: "right", 3: "bottom", 4: "left", 5: "right", 6: "left", 7: "bottom" };

function segRange(i) {
  const start = INTRO_END + (i - 1) * SEG_SPAN;
  return { start, end: start + SEG_SPAN };
}
function easeInOutCubic(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpPose(a, b, t) {
  return { tx: lerp(a.tx, b.tx, t), rx: lerp(a.rx, b.rx, t), ry: lerp(a.ry, b.ry, t), rz: lerp(a.rz, b.rz, t), scale: lerp(a.scale, b.scale, t), ty: lerp(a.ty, b.ty, t) };
}
function screenForSegment(i, t) {
  switch (i) {
    case 1: return "vault";
    case 2: return t < 0.60 ? "b" : t < 0.80 ? "c" : "d";
    case 3: return null;
    case 4: return "e";
    case 5: return "f";
    case 6: return "a";
    case 7: return "vault";
    default: return "g";
  }
}

function buildStageSection() {
  const section = document.getElementById("stage-section");
  section.innerHTML =
    '<div class="stage-outer"><div class="stage-sticky"><div class="stage-glow"></div>' +
    '<div class="stage-hero"><div class="wrap"><span class="eyebrow" data-hero-eyebrow></span>' +
    '<h1 class="h-stage"><span data-hero-a></span><br><span class="accent-grad" data-hero-b></span></h1></div></div>' +
    '<div class="stage-scene"></div>' +
    '<div class="stage-legend side-left"></div><div class="stage-legend side-right"></div><div class="stage-legend side-bottom"></div>' +
    '<div class="stage-progress"><span></span></div>' +
    '<div class="model-credit">Modelo 3D: "iPhone 17 Pro" por Ranguel (Sketchfab, CC-BY 4.0)</div>' +
    '</div></div>';

  const mobileCard = document.createElement("div");
  mobileCard.className = "mobile-legend-card";
  mobileCard.setAttribute("data-mobile-legend", "");
  document.body.appendChild(mobileCard);

  buildStaticSequence(section);
}

function buildStaticSequence() {
  // prefers-reduced-motion fallback: static stacked sequence (spec section 7)
  const host = document.createElement("div");
  host.className = "static-sequence wrap";
  host.setAttribute("data-static-sequence", "");
  document.getElementById("stage-section").appendChild(host);
}

function renderStaticSequence(lang) {
  const host = document.querySelector("[data-static-sequence]");
  if (!host) return;
  const t = window.LokrSite.t;
  const set = imgSet(lang);
  const items = [
    { screen: "g", title: t.hero.titleA + " " + t.hero.titleB, body: t.hero.eyebrow },
    { screen: "vault", title: t.legends[0].title, body: t.legends[0].body },
    { screen: "b", title: t.legends[1].title, body: t.legends[1].body },
    { screen: null, title: t.legends[2].title, body: t.legends[2].body },
    { screen: "e", title: t.legends[3].title, body: t.legends[3].body },
    { screen: "f", title: t.legends[4].title, body: t.legends[4].body },
    { screen: "a", title: t.legends[5].title, body: t.legends[5].body },
    { screen: "vault", title: t.final.title, body: t.final.body }
  ];
  host.innerHTML = items.map((it) => {
    const img = it.screen ? `<img src="assets/img/${set}/${SCREEN_FILES[it.screen]}" alt="">` : "";
    return (
      `<div class="static-item"><div class="static-phone">${img}</div>` +
      `<div class="static-text"><h3 class="h-legend">${it.title}</h3>` +
      `<p class="body-text">${it.body}</p></div></div>`
    );
  }).join("");
}

class Stage3D {
  constructor(root) {
    this.root = root;
    this.scene3d = root.querySelector(".stage-scene");
    this.outer = root.querySelector(".stage-outer");
    this.legendEls = {
      left: root.querySelector(".stage-legend.side-left"),
      right: root.querySelector(".stage-legend.side-right"),
      bottom: root.querySelector(".stage-legend.side-bottom")
    };
    this.heroEl = root.querySelector(".stage-hero");
    this.progressFill = root.querySelector(".stage-progress > span");
    this.mobileCard = document.querySelector("[data-mobile-legend]");
    this.isMobile = window.matchMedia("(max-width: 820px)").matches;
    this.desiredKey = "g";
    this.appliedKey = null;
    this.textures = {};

    this._p = 0;
    this._raf = null;

    this._initThree();
    this._loadTextures(window.LokrSite.lang);
    this._bind();
  }

  // White rounded-rect on black, used as an alphaMap so the front/back box
  // faces read as rounded corners without needing custom cap geometry.
  _roundedMaskTexture(w, h, r) {
    const scale = 3; // supersample so the curve stays smooth up close
    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    const rr = r * scale;
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, rr);
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  // Camera distance chosen so 1 three.js world unit == 1 CSS pixel at z=0 —
  // this lets the pose math (tx/ty/scale, all in px) drive the mesh
  // directly, and keeps it correctly framed on any viewport.
  _fitCamera() {
    const w = this.scene3d.clientWidth, h = this.scene3d.clientHeight;
    const fovRad = THREE.MathUtils.degToRad(this.camera.fov);
    this.camera.aspect = w / h;
    this.camera.position.z = h / (2 * Math.tan(fovRad / 2));
    this.camera.updateProjectionMatrix();
  }

  _initThree() {
    const w = this.scene3d.clientWidth, h = this.scene3d.clientHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.domElement.className = "stage-canvas";
    this.scene3d.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, w / h, 10, 5000);
    this._fitCamera();

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 0.45);
    key.position.set(250, 400, 500);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x8fa9ff, 0.22);
    rim.position.set(-300, -200, 200);
    this.scene.add(rim);

    // Placeholder half-thickness until the real model loads and reports its
    // own (see below) — keeps the screen/island reasonably placed for the
    // first frame or two.
    let halfThickness = 9;
    this.rig = new THREE.Group();

    // Screen: a separate, smaller inset plane sitting just in front of the
    // body — this is what actually carries the screenshot texture, leaving
    // a visible dark bezel around it (like a real phone) instead of the
    // image filling the whole frame edge-to-edge.
    const screenW = 300 - 20, screenH = 650 - 20;
    const screenMask = this._roundedMaskTexture(screenW, screenH, 40);
    this.frontMat = new THREE.MeshStandardMaterial({
      color: 0x000000, roughness: 0.55, metalness: 0.05, alphaMap: screenMask, transparent: true
    });
    const screenGeo = new THREE.PlaneGeometry(screenW, screenH);
    this.screenMesh = new THREE.Mesh(screenGeo, this.frontMat);
    this.screenMesh.position.set(0, 0, halfThickness + 0.15);
    this.rig.add(this.screenMesh);

    // Dynamic island
    const islandGeo = new THREE.PlaneGeometry(92, 27);
    const islandMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.island = new THREE.Mesh(islandGeo, islandMat);
    this.island.position.set(0, 650 / 2 - 14 - 13.5, halfThickness + 0.3);
    this.rig.add(this.island);

    // Body: a real modeled iPhone 17 Pro (CC-BY, Sketchfab/"Ranguel" — see
    // assets/model/CREDITS.md), triple-camera bump and all baked into the
    // geometry itself, so no procedural camera-bump decal is needed here.
    // Loaded async; the screen/island above don't depend on it and render
    // immediately with placeholder sizing, then get resized/repositioned to
    // match the model's real dimensions once it's known.
    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load("assets/model/iphone17.glb", (gltf) => {
      const body = gltf.scene;
      const box = new THREE.Box3().setFromObject(body);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      // Model is already authored upright and front-facing +Z (screen glass
      // sits at max.z, the triple-camera cluster at min.z) — matches this
      // rig's convention exactly, so no reorientation is needed.
      const scale = 300 / size.x;
      body.scale.setScalar(scale);
      body.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
      this.rig.add(body);

      const modelW = size.x * scale, modelH = size.y * scale;
      halfThickness = (size.z * scale) / 2;

      // Rebuild the screen overlay to match the real body size — a thin
      // bezel since this model is a modern near-bezel-less iPhone.
      const bezel = 7;
      const screenW = modelW - bezel * 2, screenH = modelH - bezel * 2;
      const screenMask = this._roundedMaskTexture(screenW, screenH, 40);
      this.screenMesh.geometry.dispose();
      this.screenMesh.geometry = new THREE.PlaneGeometry(screenW, screenH);
      this.frontMat.alphaMap = screenMask;
      this.frontMat.needsUpdate = true;
      this.screenMesh.position.z = halfThickness + 0.15;

      this.island.position.set(0, modelH / 2 - 14 - 13.5, halfThickness + 0.3);

      this._renderFrame();
    });

    this.scene.add(this.rig);
    this._renderFrame();
  }

  _loadTextures(lang) {
    const set = imgSet(lang);
    const loader = new THREE.TextureLoader();
    SCREEN_ORDER.forEach((key) => {
      loader.load("assets/img/" + set + "/" + SCREEN_FILES[key], (tex) => {
        tex.encoding = THREE.sRGBEncoding;
        this.textures[key] = tex;
        if (key === this.desiredKey) this._applyScreenTexture(key);
      });
    });
  }

  _applyScreenTexture(key) {
    const tex = this.textures[key];
    if (!tex) return;
    this.frontMat.map = tex;
    this.frontMat.color.set(0xffffff);
    this.frontMat.needsUpdate = true;
    this.appliedKey = key;
    this._renderFrame();
  }

  _bind() {
    const self = this;
    window.addEventListener("resize", () => {
      self.isMobile = window.matchMedia("(max-width: 820px)").matches;
      self._resizeRenderer();
      self._p = self._computeRawP();
      self.render(self._p);
    });
    document.addEventListener("lokr:lang", (e) => {
      self.textures = {};
      self._loadTextures(e.detail.lang);
      self.render(self._p);
    });

    // Render continuously (rAF loop) while the stage is anywhere near the
    // viewport, rather than only in response to 'scroll' events. A plain
    // scroll-event listener (even rAF-throttled) can lag behind a fast
    // momentum-scroll fling on iOS Safari — scroll events get coalesced
    // during the fling, so the pose and the fixed-position mobile legend
    // card would render a stale frame (a dark, near-opaque card stuck over
    // the sections below it, reading as a black screen / missing sections)
    // until the next scroll event happened to fire. Gating the loop with
    // IntersectionObserver keeps it off (battery/CPU) outside the stage,
    // and forces one final authoritative render the instant the stage
    // enters or leaves view, so overlays can never get stuck stale.
    const loop = () => {
      self._p = self._computeRawP();
      self.render(self._p);
      self._raf = window.requestAnimationFrame(loop);
    };
    const observer = new IntersectionObserver((entries) => {
      const active = entries.some((entry) => entry.isIntersecting);
      if (active && self._raf === null) {
        self._raf = window.requestAnimationFrame(loop);
      } else if (!active && self._raf !== null) {
        window.cancelAnimationFrame(self._raf);
        self._raf = null;
        self._p = self._computeRawP();
        self.render(self._p);
      }
    });
    observer.observe(this.outer);

    this._p = this._computeRawP();
    this.render(this._p);
  }

  _resizeRenderer() {
    const w = this.scene3d.clientWidth, h = this.scene3d.clientHeight;
    this.renderer.setSize(w, h);
    this._fitCamera();
  }

  _computeRawP() {
    const rect = this.outer.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const p = total > 0 ? -rect.top / total : 0;
    return Math.max(0, Math.min(1, p));
  }

  _showLegend(side, opacity, content) {
    const el = this.legendEls[side];
    if (!el) return;
    el.style.opacity = String(opacity);
    if (content && el.dataset.rendered !== content.key) {
      el.innerHTML = content.html;
      el.dataset.rendered = content.key;
    }
  }
  _hideOtherLegends(activeSide) {
    Object.keys(this.legendEls).forEach((side) => {
      if (side !== activeSide) this.legendEls[side].style.opacity = "0";
    });
  }
  _legendContentFor(i) {
    const t = window.LokrSite.t;
    if (i === SEGMENT_COUNT) {
      const f = t.final;
      return { key: "final", html: `<h3 class="h-legend">${f.title}</h3><p class="body-text">${f.body}</p><button class="btn-primary" type="button" data-appstore-link>${f.button}</button>` };
    }
    const l = t.legends[i - 1];
    return { key: "legend" + i, html: `<span class="eyebrow">${l.n}</span><h3 class="h-legend">${l.title}</h3><p class="body-text">${l.body}</p>` };
  }
  _updateMobileCard(i, opacity, content) {
    if (!this.mobileCard || !this.isMobile) return;
    if (this.outer.getBoundingClientRect().bottom <= 0) {
      this.mobileCard.style.opacity = "0";
      return;
    }
    if (i === 0 || !content) { this.mobileCard.style.opacity = "0"; return; }
    this.mobileCard.style.opacity = String(i === SEGMENT_COUNT ? 1 : opacity);
    if (this.mobileCard.dataset.rendered !== content.key) {
      this.mobileCard.innerHTML = content.html;
      this.mobileCard.dataset.rendered = content.key;
    }
  }

  render(p) {
    if (this.progressFill) this.progressFill.style.width = (p * 100).toFixed(1) + "%";

    let pose, screenKey, legendOpacity, side, heroOpacity, segIndex;

    if (p <= INTRO_END) {
      pose = POSES[0];
      screenKey = "g";
      heroOpacity = 1;
      this._hideOtherLegends(null);
      this._updateMobileCard(0, 0, null);
      segIndex = 0;
    } else {
      for (let i = 1; i <= SEGMENT_COUNT; i++) {
        const range = segRange(i);
        if (p < range.end || i === SEGMENT_COUNT) {
          const localT = Math.max(0, Math.min(1, (p - range.start) / (range.end - range.start)));
          const transitionT = Math.min(localT / 0.40, 1);
          const eased = easeInOutCubic(transitionT);
          pose = lerpPose(POSES[i - 1], POSES[i], eased);

          const sk = localT < 0.30 ? null : screenForSegment(i, localT);
          if (sk) screenKey = sk;

          heroOpacity = i === 1 ? Math.max(0, 1 - localT / 0.20) : 0;

          if (localT < 0.36) legendOpacity = 0;
          else if (localT < 0.46) legendOpacity = (localT - 0.36) / 0.10;
          else if (i === SEGMENT_COUNT) legendOpacity = 1;
          else if (localT < 0.90) legendOpacity = 1;
          else if (localT < 0.97) legendOpacity = 1 - (localT - 0.90) / 0.07;
          else legendOpacity = 0;

          side = LEGEND_SIDE[i];
          this._hideOtherLegends(side);
          this._showLegend(side, legendOpacity, this._legendContentFor(i));
          this._updateMobileCard(i, legendOpacity, this._legendContentFor(i));
          segIndex = i;
          break;
        }
      }
    }

    if (this.heroEl) this.heroEl.style.opacity = String(heroOpacity);
    if (screenKey) this.desiredKey = screenKey;
    if (this.desiredKey !== this.appliedKey) this._applyScreenTexture(this.desiredKey);

    const vw = window.innerWidth, vh = window.innerHeight;
    let txPx = pose.tx * Math.min(250, 0.19 * vw);
    let tyPx = (pose.ty / 100) * vh;
    let scale = pose.scale;
    if (this.isMobile) {
      txPx = 0;
      scale = pose.scale * ((0.44 * vw) / 300);
      tyPx -= (segIndex > 0 ? 0.10 : 0.20) * vh;
    }
    this.rig.position.set(txPx, -tyPx, 0);
    this.rig.scale.setScalar(scale);
    this.rig.rotation.set(
      THREE.MathUtils.degToRad(pose.rx) * -1,
      THREE.MathUtils.degToRad(pose.ry),
      THREE.MathUtils.degToRad(pose.rz) * -1
    );
    this.island.visible = segIndex === 0 || screenKey === "g" || (pose.ry % 360 < 90 || pose.ry % 360 > 270);

    this._renderFrame();
  }

  _renderFrame() {
    this.renderer.render(this.scene, this.camera);
  }
}

function renderRecursos() {
  const t = window.LokrSite.t.recursos;
  const section = document.getElementById("recursos");
  section.className = "block wrap";
  section.innerHTML = `<div class="section-head"><span class="eyebrow">${t.eyebrow}</span><h2 class="h-section">${t.title}</h2></div>` +
    '<div class="cards-grid">' +
    t.cards.map((c) => `<div class="feature-card"><h3 class="h-card">${c.title}</h3><p class="body-card">${c.body}</p></div>`).join("") +
    "</div>";
  observeCards();
}
function renderIsca() {
  const t = window.LokrSite.t.isca;
  const section = document.getElementById("cofre-isca");
  section.className = "block wrap";
  section.innerHTML = `<div class="isca-block"><span class="eyebrow">${t.eyebrow}</span><h2 class="h-section">${t.title}</h2>` +
    `<p class="body-text">${t.intro}</p><ul class="isca-list">` +
    t.list.map((item, idx) => `<li><span class="disc">${idx + 1}</span>${item}</li>`).join("") +
    `</ul><p class="isca-warning">${t.warning}</p><p class="isca-footer-line">${t.footerLine}</p></div>`;
}
function renderPlanos() {
  const t = window.LokrSite.t.planos;
  const section = document.getElementById("planos");
  section.className = "block wrap";
  section.innerHTML = `<div class="section-head"><h2 class="h-section">${t.title}</h2></div><div class="plans-grid">` +
    `<div class="plan-card free"><div class="plan-head"><span class="h-plan">${t.freeLabel}</span><span>${t.freeSub}</span></div><ul class="plan-list">` +
    t.free.map((f) => `<li><span class="tick">✓</span>${f}</li>`).join("") +
    `</ul></div><div class="plan-card pro"><div class="plan-head"><span class="h-plan">${t.proLabel}</span><span class="pro-badge">${t.proBadge}</span></div><ul class="plan-list">` +
    t.free.map((f) => `<li><span class="tick">✓</span>${f}</li>`).join("") +
    `</ul><div class="plan-divider"><span>${t.proExtra}</span><span class="rule"></span></div><ul class="plan-list pro-list">` +
    t.pro.map((f) => `<li><span class="tick">✓</span>${f}</li>`).join("") +
    `</ul><div class="plans-cta"><button class="btn-primary" type="button" data-appstore-link>${t.button}</button><p class="footer-text">${t.note}</p></div></div></div>`;
}
let cardObserver = null;
function observeCards() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".feature-card").forEach((el) => el.classList.add("in-view"));
    return;
  }
  if (cardObserver) cardObserver.disconnect();
  cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("in-view"); });
  }, { threshold: 0.2 });
  document.querySelectorAll(".feature-card").forEach((el) => cardObserver.observe(el));
}

function renderStageTexts() {
  const t = window.LokrSite.t;
  const section = document.getElementById("stage-section");
  section.querySelector("[data-hero-eyebrow]").textContent = t.hero.eyebrow;
  section.querySelector("[data-hero-a]").textContent = t.hero.titleA;
  section.querySelector("[data-hero-b]").textContent = t.hero.titleB;
}

function renderAll(lang) {
  renderStageTexts();
  renderStaticSequence(lang);
  renderRecursos();
  renderIsca();
  renderPlanos();
}

document.addEventListener("DOMContentLoaded", () => {
  buildStageSection();
  window.LokrSite.init("recursos");
  renderAll(window.LokrSite.lang);
  window.LokrStageInstance = new Stage3D(document.getElementById("stage-section"));

  document.addEventListener("lokr:lang", (e) => { renderAll(e.detail.lang); });
});
