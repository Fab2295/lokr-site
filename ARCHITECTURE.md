# ARCHITECTURE.md — Lokr+ marketing site

This doc is written for a future Claude session picking up this repo with zero prior context. It describes what's actually in the code as of the commit checked out, not a spec or a plan.

## 1. What this is

A static, no-build marketing site for **Lokr+**, an iOS password manager. Four pages, three languages, one big scroll-driven 3D hero on the homepage. Deployed to **GitHub Pages** straight from the `main` branch of `https://github.com/Fab2295/lokr-site.git` — whatever is committed to `main` is what visitors see, with no CI/build/publish step in between.

There is no `package.json`, no bundler, no framework, no transpilation. Every `.html`/`.css`/`.js` file is served byte-for-byte as written.

## 2. Stack summary

- **HTML**: 4 static entry pages (below).
- **CSS**: 5 plain stylesheets, no preprocessor, split by concern.
- **JS**: vanilla ES6+, no modules (`<script>` tags in global scope), no npm dependencies of the project's own. Loaded in a fixed order via `<script src="...">` tags.
- **3D**: [Three.js](https://threejs.org) r128 + `GLTFLoader`, loaded from `cdn.jsdelivr.net` (not vendored, not npm-installed).
- **i18n**: hand-rolled, data-driven (plain JS objects), no library.
- **Analytics**: Google Analytics (`gtag.js`) loaded inline in every page's `<head>`, tracking ID `G-HVHB862MR1`. This is separate from and unrelated to the iOS app itself — see §8.
- **Hosting**: GitHub Pages, root of `main`. `.nojekyll` at repo root disables Jekyll processing (needed because file/folder names like `.claude` would otherwise be swallowed, and so Pages serves the repo as pure static files).
- **Local dev**: no dev server tooling of its own — see §7.

## 3. Entry pages

| File | Purpose | Page-specific script |
|---|---|---|
| [index.html](index.html) | Home: 3D scroll stage + Recursos (features) + Cofre isca (decoy vault) + Planos (pricing) | [js/page-index.js](js/page-index.js) |
| [privacidade.html](privacidade.html) | Privacy policy | [js/page-legal.js](js/page-legal.js) → `renderPrivacy()` |
| [termos.html](termos.html) | Terms of Use | [js/page-legal.js](js/page-legal.js) → `renderTerms()` |
| [suporte.html](suporte.html) | Support / FAQ + contact | [js/page-legal.js](js/page-legal.js) → `renderSupport()` |

All four pages share the same `<head>` boilerplate (GA snippet, viewport meta, favicon, `tokens.css`/`layout.css`), a `<header class="site-header" data-site-header>` and `<footer class="site-footer" data-site-footer>` that [js/site.js](js/site.js) fills in at runtime, and end with a small inline `<script>` that calls `window.LokrSite.init(pageKey)` plus the page's own render function. There is no server-side templating — every page repeats this boilerplate by hand, which is also why cache-busting versions must be kept in sync manually (§6).

## 4. i18n system

Two data files, one engine:

- [js/i18n.js](js/i18n.js) — `window.LOKR_I18N = { pt: {...}, en: {...}, es: {...} }`. Home-page copy: `nav`, `download`, `comingSoon`, `hero`, `legends[]` (the 6 stage legend cards), `final`, `recursos`, `isca`, `planos`, `footer`.
- [js/i18n-legal.js](js/i18n-legal.js) — `window.LOKR_I18N_LEGAL = { pt: {...}, en: {...}, es: {...} }`. Each locale has `privacy`, `terms`, `support`, each with its own `eyebrow`/`title`/`intro`/`sections[]` (or `faq[]` for support). Privacy currently has 11 numbered sections per locale (see §8).
- [js/site.js](js/site.js) — the language **engine**, loaded on every page. Responsibilities:
  - `resolveLang()`: picks the active language in priority order **`?lang=` URL param → `localStorage["lokr-lang"]` → `navigator.language`** (pt-prefixed → `pt`, es-prefixed → `es`, else `en`). Falls back safely if `localStorage` throws (private browsing).
  - `setLang(lang)`: sets `<html lang>`, populates `window.LokrSite.{lang, t, tLegal}`, persists to `localStorage`, rewrites the URL's `?lang=` via `history.replaceState`, re-renders header/footer, decorates internal links, and fires a `lokr:lang` `CustomEvent` on `document` so page-specific code can re-render without a reload.
  - `renderHeader()` / `renderFooter()`: build the shared chrome from a template string (logo SVG inline, nav links, language pill `PT/EN/ES`, download button, footer legal links + support email) using the current `t`/locale strings.
  - `decorateInternalLinks(lang)`: walks `a[href$=".html"]` and `a[data-lang-link]` and appends `?lang=<current>` to same-origin links, so navigating between pages preserves the chosen language.
  - The global "Baixar/App Store" click handler (delegated on `document`, matches `[data-appstore-link]`) shows a **"coming soon" toast** instead of navigating anywhere — there is no live App Store link yet.
  - **`window.LokrSite`** is the shared global object every other script reads from: `{ lang, t, tLegal, pageKey, init(pageKey), setLang(lang) }`. `t` = current-locale `LOKR_I18N[lang]`; `tLegal` = current-locale `LOKR_I18N_LEGAL[lang]` (null on pages that don't load `i18n-legal.js`, but `index.html` doesn't need it).

Adding a new UI string means adding it to all three locale blocks in the relevant i18n file, then reading it via `window.LokrSite.t.xxx` (or `.tLegal.xxx` on legal pages) from the page's render function; there's no fallback/missing-key handling, so a typo'd key silently renders `undefined`.

## 5. The 3D stage (`js/page-index.js`)

The homepage hero is a **scroll-driven, sticky, WebGL** sequence: a `<section id="stage-section">` that becomes a `1000vh`-tall track (`.stage-outer`, see [css/stage.css](css/stage.css)) containing a `position: sticky; height: 100vh` viewport (`.stage-sticky`). As the user scrolls through that 1000vh of page height, a scroll-progress value `p ∈ [0, 1]` drives a Three.js scene showing a real, textured iPhone model rotating/translating/rescaling through a sequence of poses, with screenshot textures swapped onto its screen and side-anchored "legend" text blocks fading in/out to narrate each step.

This used to be built with hand-written CSS 3D transforms (`js/stage.js`, `.phone-rig`/`.phone-face`/`.phone-side` etc. in `stage.css`). That engine was **deleted** in commit `3600aae` ("promote the Three.js/WebGL 3D stage to the official homepage") when an experimental WebGL version (previously `js/page-index-three.js` + `index-three.html`) was merged in as the one and only homepage. If you're looking for the old CSS rig, it's gone — `git show 3600aae` has the diff.

### 5.1 Model

- `assets/model/iphone17.glb` — a real modeled "iPhone 17 Pro" by Ranguel (Sketchfab, **CC-BY 4.0**). Attribution is legally required and is rendered on-page (`.model-credit` div, bottom-left of the stage) — see [assets/model/CREDITS.md](assets/model/CREDITS.md). Don't remove that credit line without checking the license.
- `assets/model/phone.glb` is a leftover CC0 placeholder from before the real model was sourced; nothing loads it anymore (kept only for traceability per `CREDITS.md`).
- The model loads async via `GLTFLoader`. Before it's ready, the screen/dynamic-island planes render at hardcoded placeholder dimensions (`halfThickness = 9`, `300×650`); once loaded, `Stage3D._initThree()`'s load callback measures the model's real bounding box and rescales/repositions the screen mesh and island to fit it. The model is authored upright, front-facing +Z (screen glass at `max.z`), which matches this code's convention exactly, so it does no reorientation — only uniform scale-to-fit (`scale = 300 / size.x`) and recentering.
- The "screen" the screenshots render onto is **not** the glTF mesh's own material — it's a separate `PlaneGeometry` (`this.screenMesh`) positioned just in front of the phone body, textured with the current locale's screenshot plus a canvas-generated rounded-rect alpha mask (`_roundedMaskTexture`) so it reads as a bezeled screen instead of a hard-edged rectangle. The "dynamic island" notch is likewise a separate small black plane, not part of the model.

### 5.2 Screenshots

`SCREEN_FILES`/`SCREEN_ORDER` map short keys (`g`, `vault`, `b`, `c`, `d`, `e`, `f`, `a`) to filenames under `assets/img/<pt|en>/`. `imgSet(lang)` returns `"pt"` for Portuguese and `"en"` for everything else — **Spanish reuses the English screenshots**, there is no `assets/img/es/`. Textures are (re)loaded whenever the language changes (`lokr:lang` listener in `_bind()`).

### 5.3 The pose system — how to safely change a pose

This is the part most likely to need editing later, so read this before touching `POSES`.

```js
const POSES = [
  { tx: 0,  rx: 32, ry: 0,   rz: -18, scale: 0.66, ty: 20 },   // [0] intro pose
  { tx: 1,  rx: 0,  ry: 0,   rz: 0,   scale: 1,    ty: 0  },   // [1] end of segment 1
  { tx: -1, rx: 0,  ry: 0,   rz: 0,   scale: 1,    ty: 0  },   // [2] end of segment 2
  { tx: 0,  rx: 0,  ry: 180, rz: 0,   scale: 0.68, ty: -13 },  // [3] end of segment 3
  { tx: 1,  rx: 0,  ry: 360, rz: 0,   scale: 1,    ty: 0  },   // [4] end of segment 4
  { tx: -1, rx: 0,  ry: 360, rz: 0,   scale: 1,    ty: 0  },   // [5] end of segment 5
  { tx: 1,  rx: 0,  ry: 360, rz: 0,   scale: 1,    ty: 0  },   // [6] end of segment 6
  { tx: 0,  rx: 0,  ry: 360, rz: 0,   scale: 0.58, ty: -20 },  // [7] end of segment 7 (final)
];
```

There are **8 poses for 7 segments** — `POSES[i-1]` is the *start* and `POSES[i]` the *end* of segment `i` (1-indexed, `SEGMENT_COUNT = 7`). `POSES[0]` doubles as both "the intro pose" (`p <= INTRO_END`) and the start of segment 1.

Field meanings (all are keyframe values, linearly interpolated — `lerpPose` — between the two endpoints of whichever segment is active, then eased):

- `tx`: horizontal position, **in units of "screen-relative slots"**, not pixels. `-1` / `0` / `1` roughly mean "off to the left" / "centered" / "off to the right"; it gets converted to actual pixels in `render()` via `pose.tx * Math.min(250, 0.19 * viewportWidth)` — so `tx` is scale-independent of viewport size, capped at 250px per unit on wide screens. **On mobile this is ignored** (`txPx = 0` forced — mobile poses never move horizontally, see §5.4).
  <br>Why alternating ±1: the stage alternates the phone left/right across segments so each side-anchored legend card (`LEGEND_SIDE`) has room to sit opposite it without overlapping the phone.
- `ty`: vertical offset, **in percent of viewport height** (`(pose.ty / 100) * viewportHeight`). Positive moves the phone down.
- `rx`, `ry`, `rz`: rotation in **degrees** around X/Y/Z. Note the sign flip in `render()`: `rig.rotation.x = -degToRad(rx)`, `rig.rotation.z = -degToRad(rz)`, but `rig.rotation.y = +degToRad(ry)` (no flip). `ry` climbs by 180° per remaining segment (180 → 360 → 360 → 360...) rather than resetting — this is a full physical spin of the phone across segments 3–7, not a snap-back; don't "normalize" it to 0–360 without checking how that changes the visual spin direction/continuity.
- `scale`: uniform scale multiplier on the whole rig. `1` = the model's natural 300-world-unit width (see §5.1); `<1` shrinks it (used for the intro pose and the final pose, which need to leave room for hero text / the final CTA legend). On mobile it's *also* rescaled again (`pose.scale * (0.44 * vw / 300)`, see §5.4) so pose authors don't need to hand-tune two separate scale numbers per breakpoint — one `scale` value drives both, mobile just applies a different viewport-relative multiplier on top.

**Segment → scroll-progress mapping**: the first `INTRO_END = 0.05` (5%) of total scroll progress is a static intro (locked to `POSES[0]`, hero text visible). The remaining 95% is split evenly into `SEGMENT_COUNT = 7` equal slices (`SEG_SPAN = (1 - INTRO_END) / 7 ≈ 0.1357` each) via `segRange(i)`. Within a segment, `localT ∈ [0,1]` is that segment's own local progress; **poses only interpolate across the first 40% of each segment's local progress** (`transitionT = min(localT / 0.40, 1)`, then eased with `easeInOutCubic`) — the remaining 60% of the segment holds the end pose steady while the legend text/screenshot for that segment is fully visible and readable before the next transition starts. If you add/remove a segment, you must also update `SEGMENT_COUNT`, add/remove a `POSES` entry, and add/remove entries in `LEGEND_SIDE` and the `screenForSegment`/`_legendContentFor` switches (which key off segment index 1–7, matching `t.legends[i-1]` in i18n — see §4).

**Screenshot swap timing** (`screenForSegment(i, localT)`) is independent of pose timing: it only starts considering a swap after `localT >= 0.30` (`sk = localT < 0.30 ? null : screenForSegment(...)`), and segment 2 alone shows three different screenshots at different points in its own local progress (`b` → `c` → `d` at the 60%/80% marks). Segment 3 shows no screenshot at all (`return null`) — it's a "the vault leaves the device" beat where the legend copy speaks for itself.

**Legend visibility** (`legendOpacity`) fades in over `localT` 0.36→0.46, holds at 1 until 0.90, then fades out 0.90→0.97 — except segment 7 (`SEGMENT_COUNT`), which holds at opacity 1 once faded in and never fades out (it's the final CTA, meant to stay put once the page stops scrolling at the bottom). `LEGEND_SIDE` (`{1: left, 2: right, 3: bottom, 4: left, 5: right, 6: left, 7: bottom}`) picks which of the three fixed-position legend slots (`.stage-legend.side-{left,right,bottom}` in `css/stage.css`) is used per segment; only one is shown at a time (`_hideOtherLegends`).

**To safely change a single pose**: edit only the `tx/ty/rx/ry/rz/scale` numbers on the relevant `POSES[n]` entry. Don't change array length or reorder without also updating `SEGMENT_COUNT`/`LEGEND_SIDE`/`screenForSegment`/`_legendContentFor`, all of which are keyed by segment index and assume exactly 7 segments / 8 poses. After any change, reload with a **fresh browser tab** (see §9 gotchas) and scrub the full scroll range to check both desktop and the mobile viewport, since mobile applies its own scale/position math on top (§5.4) and can expose overlap/gap issues that don't show up on desktop.

### 5.4 Mobile vs desktop

`Stage3D.isMobile = matchMedia("(max-width: 820px)").matches`, re-evaluated on resize. When mobile:
- `txPx` is forced to `0` — no horizontal movement, since side-anchored legends are hidden on mobile anyway (`.stage-legend { display: none }` under `@media (max-width: 820px)` in `css/stage.css`) in favor of a single fixed-position `.mobile-legend-card` at the bottom of the viewport.
- `scale` is recomputed as `pose.scale * (0.44 * viewportWidth / 300)` — i.e. the phone is sized to ~44% of viewport width regardless of the pose's own `scale`, using the pose's `scale` only as a further multiplier on top of that.
- `tyPx` gets an extra fixed upward offset subtracted (`-0.10 * vh` once scrolled into a segment, `-0.20 * vh` during the intro) to compensate for the mobile legend card and header eating vertical space differently than desktop's side legends do.
- The dynamic-island visibility rule (`this.island.visible = ...`) and screen-texture logic are shared between mobile/desktop — only position/scale differ.

Camera FOV/distance (`_fitCamera`) is the same on both; the camera is positioned so **1 Three.js world unit = 1 CSS pixel at z=0**, which is what makes the px-based pose math in `render()` work directly without a separate unit-conversion step — if you ever change camera FOV or scene setup, re-derive this invariant or all the pose numbers above become wrong.

### 5.5 Reduced motion

`buildStaticSequence()` + `renderStaticSequence()` build a `.static-sequence` list (one row per stage beat, using the same screenshot files and i18n legend copy) that's hidden by default and shown instead of `.stage-outer` under `@media (prefers-reduced-motion: reduce)` (see `css/sections.css`). This is a straight vertical list with no scroll-driven animation — it exists purely so motion-sensitive users still get the content.

## 6. CSS

Five files, loaded in this order on `index.html`: `tokens.css` → `layout.css` → `stage.css` → `sections.css`. Legal pages load `tokens.css` → `layout.css` → `legal.css` (they don't need `stage.css`/`sections.css`).

| File | Responsibility |
|---|---|
| [css/tokens.css](css/tokens.css) | CSS custom properties (`--bg`, `--text`, `--accent-1/2`, etc.), global resets, type scale (`.h-stage`, `.h-section`, `.h-legend`, `.body-text`, etc.), `.wrap` container, `.accent-grad` gradient-text helper, `.sr-only`. Everything else depends on these variables. |
| [css/layout.css](css/layout.css) | Fixed header (`.site-header`, blur backdrop, language pill, nav), footer, `.btn-primary`/`.btn-download`, the "coming soon" `.toast`. Shared across every page. |
| [css/stage.css](css/stage.css) | The homepage 3D stage: `.stage-outer` (1000vh), `.stage-sticky`, `.stage-glow`, `.stage-hero`, `.stage-legend` (left/right/bottom variants), `.stage-progress` bar, `.model-credit`, mobile breakpoint override at 820px. |
| [css/sections.css](css/sections.css) | Everything below the stage on the homepage: `.cards-grid`/`.feature-card` (Recursos), `.isca-block` (Cofre isca), `.plans-grid`/`.plan-card` (Planos), `.mobile-legend-card`, and the `prefers-reduced-motion` static-sequence fallback styles. |
| [css/legal.css](css/legal.css) | Privacy/Terms/Support-only: `.legal-hero`, `.legal-sections`, `.support-layout`, `.contact-card`, `.faq-item`/`.faq-question`/`.faq-answer` accordion styles. |

No CSS-in-JS, no scoping mechanism — class names are just assumed unique enough by convention.

## 7. Local dev

No npm, no build tool, nothing to install. Just a static file server:

```bash
python3 -m http.server 8843
```

then open `http://localhost:8843`. This exact command is codified in [.claude/launch.json](.claude/launch.json) as the `"lokr-site"` configuration, so Claude Code's browser-preview tooling can start it by name instead of you typing the command.

## 8. Versioning, cache-busting, and deploy

### 8.1 Deploy

Plain **GitHub Pages** serving the repo root of `main` directly (`https://github.com/Fab2295/lokr-site.git`, published at `https://fab2295.github.io/lokr-site/` per `robots.txt`/`sitemap.xml`). There is no GitHub Actions workflow, no build artifact, no `gh-pages` branch — push to `main` and Pages picks it up. `.nojekyll` at repo root disables GitHub's default Jekyll processing so dotfile-prefixed paths (like `.claude/`) aren't silently excluded from the published site.

### 8.2 Git tags

Every shipped change gets a commit **and** a tag, `vMAJOR.MINOR.PATCH`. Looking at the actual tag history:

```
v0.1.0  scaffold (tokens, layout, i18n, language engine)
v0.2.0  feat: index page — 3D scroll stage, recursos, cofre isca, planos
v0.3.0  feat: privacy and support pages
v0.4.0  chore: robots.txt / sitemap.xml
v0.4.1  chore: .nojekyll
v0.4.2  fix: intro pose tilt
v0.4.3  fix: overflow-x on iOS Safari
v0.4.4  fix: final stage pose crowding
v0.4.5  fix: privacy list indentation
v0.5.0  feat: GDPR/CCPA sections + Terms of Use page
v0.6.0  feat: promote the Three.js/WebGL stage to the homepage
v0.6.1  chore: add Google Analytics
v0.6.2  docs: disclose GA in the privacy policy
v0.6.3  feat: "coming soon" toast + desktop hero gap fix
```

Pattern: **MINOR** bumps for new pages/features/major reworks, **PATCH** bumps for bug fixes and small copy/doc changes. There's no automation for this (no `npm version`, no release script) — it's a manual `git commit` + `git tag vX.Y.Z` per ship.

### 8.3 Manual cache-busting — read this before editing any shared CSS/JS file

Every `<link>`/`<script>` tag for a local CSS/JS file carries a manually-maintained `?v=` query string, e.g.:

```html
<link rel="stylesheet" href="css/tokens.css?v=1790621655">
<script src="js/site.js?v=1790621655"></script>
```

**`index.html` uses one shared unix-timestamp** (`1790621655` as of this writing) across *all* of its CSS/JS tags. **The legal pages (`privacidade.html`/`termos.html`/`suporte.html`) use small hand-incremented integers instead** (currently `tokens.css?v=1` — never bumped since it hasn't changed since scaffold — `layout.css?v=2`, `legal.css?v=2`, `i18n.js?v=2`, `i18n-legal.js?v=3`, `site.js?v=3`, `page-legal.js?v=2`), and the three legal pages are kept in lockstep with each other but use a **different numbering scheme from index.html**.

**The rule**: if you edit a file that's `<link>`/`<script>`-included from more than one HTML page (`css/tokens.css`, `css/layout.css`, `js/i18n.js`, `js/site.js`), you must bump the `?v=` on **every page that includes it**, not just the page you were testing on — otherwise visitors with that file already cached (and GitHub Pages' own CDN caching) keep serving the stale version indefinitely. This is not hypothetical: commit `a5cbb77` ("chore: version-query the asset tags so fixes don't get stuck behind browser cache") exists specifically because earlier fixes weren't reaching visitors due to missing cache-busting. When in doubt, bump the version on all pages that reference the changed file, using whichever numbering convention that page already follows (shared timestamp for `index.html`, small incrementing integer for the legal pages).

## 9. Recent legal/compliance additions

- **`privacidade.html`** now has 11 numbered sections per locale (in `js/i18n-legal.js`), including a **GDPR** section ("Your rights in the European Union") and a **CCPA/CPRA** section ("Your rights in California and the U.S."), added in `v0.5.0`. The core privacy claim throughout is that Lokr+ (the app) collects/stores/transmits nothing to any server — these sections mainly explain that there's therefore very little for the GDPR/CCPA rights (access, deletion, portability, etc.) to act on, beyond an anonymized hash fragment mentioned elsewhere in the policy.
- **`termos.html`** is a new, dedicated Terms of Use page (also added in `v0.5.0`) — previously there wasn't one.
- **Section 11 of the privacy policy ("Site analytics / Analytics do site")**, added in `v0.6.2`, explicitly discloses that **Google Analytics runs on this marketing website only, via cookies, and never inside the iOS app** — added right after Google Analytics (`gtag.js`) was wired into all four pages' `<head>`s in `v0.6.1`. If you add any other tracking/analytics to the site, this is the section to extend.

## 10. Known gotchas for a future session

1. **Manual cache-busting is easy to forget** — see §8.3. If a fix "isn't showing up" during testing or after deploy, check the `?v=` query params first before assuming the code is wrong.
2. **Fresh browser tab per WebGL reload.** This project's browser-preview tooling exhausts the WebGL canvas context if you reload the *same* tab repeatedly while iterating on the 3D stage — open a **new** tab for each reload/test cycle instead of navigating the existing one.
3. **`tabId` matters when clicking by `ref`.** When driving the browser preview with element refs, pass the correct `tabId` explicitly — omitting it (or assuming "the active tab") can silently click into the wrong tab if more than one is open, with no error to signal the mistake.
4. **Spanish has no screenshot set.** `imgSet()` deliberately falls back to `en` for `es` — don't expect `assets/img/es/` to exist; if Spanish-specific screenshots are ever added, this is a one-line change in `js/page-index.js`.
5. **`POSES`/`SEGMENT_COUNT`/`LEGEND_SIDE`/`screenForSegment`/`_legendContentFor` are all coupled to "exactly 7 segments"** — changing the count means touching all of them together (§5.3).
6. **No missing-translation fallback** — a typo'd i18n key renders `undefined` in the UI silently; there's no dev warning for it.

## 11. Roadmap

This is a **marketing-site repo only** — it has no build pipeline, no backend, and no code for the Lokr+ iOS app itself. Anything below about the app's own features is inference from the site's copy or was reported by another session working elsewhere (most likely the app's own repo), not something verifiable from files in this repo. Sorted from "actually visible in this repo" to "speculative/parked."

**In progress / visible directly in this repo's code or copy:**
- No live App Store listing yet: every "Baixar"/download CTA (`[data-appstore-link]`) shows a "coming soon" toast instead of linking out (`js/site.js`, added in `v0.6.3`). This is the one concrete, unambiguous release blocker for the site itself — the download buttons have nothing to point to yet.
- The site's own copy states there is **no automatic sync between devices** today — transferring a vault means exporting a `.lokr`/CSV file and importing it manually on the new device (`js/i18n-legal.js`, support FAQ, all three locales). This is documentation of current behavior, not a stated future plan, but it's the natural place a "sync" roadmap item would eventually need copy updates if that ever changes.

(Spanish reusing the English screenshot set is **not** a gap, despite how it might look — it's a deliberate choice, called out both inline in `imgSet()` and in `README.md`. Not a roadmap item; see §5.2/§10.)

**App-repo items (Cofre, the actual Lokr+ iOS codebase — not this repo). Originally relayed secondhand and flagged unverified here; since then, a peer session working directly in that repo (name: "Lokr-app") reported back with grep/file-level verification. Still can't be independently re-checked from inside this repo — no app code lives here — but it's now sourced-with-evidence rather than a bare claim:**
- **"Option C"** — a master-password-derived key plus iCloud/CloudKit sync. Per that session: **parked, not started** — zero hits for `KEK`/`masterPassword`/`wrap` in the app code; the only traces are `cloudKitDatabase: .none` in `Shared/SharedModelContainer.swift` (comment: needs a paid Apple dev team) and an inert "Sincronizar" row in `SettingsView.swift` showing "indisponível nesta build". They also flagged that adopting it later means reworking how the vault key is gated — today the PIN/Face ID don't wrap the AES key at all, it's Data-Protection-wrapped in a plain file, so a real master-password design is a bigger lift than just turning on sync. **This still directly conflicts with this site's current privacy copy**, which affirmatively states the vault is deliberately excluded from iCloud backup by design (`js/i18n-legal.js`) and whose whole "no account, no cloud" positioning runs through `js/i18n.js` — if Option C ships, that copy needs a coordinated rewrite here, not just an app-side change.
- **Analytics/telemetry beyond Google Analytics**: per that session, confirmed no SDK, crash reporter, or telemetry of any kind in the app beyond local `os.log` — i.e. no decision has actually been implemented either way yet. This repo's own GA is site-only regardless (disclosed in privacy §11, see §9 above).
- **Pro-onboarding-on-purchase flow**: confirmed not built — `PaywallView` just dismisses on the `isPro` flip, no welcome/tour screen. The site's `planos` section (`js/i18n.js`) is unaffected either way; it just distinguishes Free vs. Pro feature lists and points at the (not-yet-live) App Store purchase.
- **Other release blockers**: per that session, confirmed still open — `CODE_SIGN_STYLE Automatic` on a personal team, no `.storekit` config, Pro hard-unlocked via `StoreManager.isPersonalBuildUnlocked = true`, and `LokrApp.swift` seeds demo data (including a pre-flagged-compromised item) explicitly commented "remove before distributing." None of this is specific to the site's own release blocker (§11 group 1's "coming soon" CTA) — they're independent, both need to clear before a real launch.
- Side note from that session, not this site's concern to fix but worth knowing: the app's home-screen widget has a stale string claiming cloud sync ("senhas fortes, só no seu iCloud") despite sync being disabled — an app-side copy bug, unrelated to anything in this repo.
- Also reported: that session cross-checked this site's privacy-policy security claims (AES-GCM + 32-byte App Group key, PBKDF2 Keychain PIN, SHA-1 + 5-char-prefix HIBP k-anonymity check) against the actual crypto code and said **everything currently matches**. Good to know, but re-verify before relying on it if the app's crypto code changes later — this repo has no way to detect that drift on its own.

If you're picking up work from this section, treat it as a well-sourced pointer to go confirm directly in the Lokr+ app repository (or ask the user) before acting on it, not as something this repo's own files can prove — none of the file paths above (`Shared/SharedModelContainer.swift`, `SettingsView.swift`, `PaywallView`, `LokrApp.swift`) exist in this repo.

## 12. Current status

As of the latest commit (`f0625d3`, tag `v0.6.3`): the homepage's WebGL 3D stage is the shipped, official homepage (no longer an experiment); Google Analytics is live site-wide with a disclosure in the privacy policy; GDPR/CCPA sections and a Terms of Use page exist; and the header/legend "Baixar"/App Store buttons show a "coming soon" toast rather than linking anywhere, since there is no live App Store listing yet.
