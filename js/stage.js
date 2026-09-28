// Lokr+ site — scroll-driven 3D stage engine (spec section 6 & 7)
(function () {
  "use strict";

  var POSES = [
    { tx: 0, rx: 32, ry: 0,   rz: -18, scale: 0.66, ty: 20 },   // 0 intro
    { tx: 1, rx: 0,  ry: 0,   rz: 0,   scale: 1,    ty: 0 },    // 1 cofre
    { tx: -1,rx: 0,  ry: 0,   rz: 0,   scale: 1,    ty: 0 },    // 2 gerador
    { tx: 0, rx: 0,  ry: 180, rz: 0,   scale: 0.68, ty: -13 },  // 3 traseira
    { tx: 1, rx: 0,  ry: 360, rz: 0,   scale: 1,    ty: 0 },    // 4 ajustes
    { tx: -1,rx: 0,  ry: 360, rz: 0,   scale: 1,    ty: 0 },    // 5 cofre isca
    { tx: 1, rx: 0,  ry: 360, rz: 0,   scale: 1,    ty: 0 },    // 6 registro
    { tx: 0, rx: 0,  ry: 360, rz: 0,   scale: 0.64, ty: -12 }   // 7 final
  ];

  var SEGMENT_COUNT = 7;
  var INTRO_END = 0.05;
  var SEG_SPAN = (1 - INTRO_END) / SEGMENT_COUNT;

  function segRange(i) {
    var start = INTRO_END + (i - 1) * SEG_SPAN;
    return { start: start, end: start + SEG_SPAN };
  }

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function lerpPose(a, b, t) {
    return {
      tx: lerp(a.tx, b.tx, t),
      rx: lerp(a.rx, b.rx, t),
      ry: lerp(a.ry, b.ry, t),
      rz: lerp(a.rz, b.rz, t),
      scale: lerp(a.scale, b.scale, t),
      ty: lerp(a.ty, b.ty, t)
    };
  }

  function screenForSegment(i, localT) {
    switch (i) {
      case 1: return "vault";
      case 2: return localT < 0.60 ? "b" : localT < 0.80 ? "c" : "d";
      case 3: return null; // back face — front image irrelevant while rotated away
      case 4: return "e";
      case 5: return "f";
      case 6: return "a";
      case 7: return "vault";
      default: return "g";
    }
  }

  var LEGEND_SIDE = { 1: "left", 2: "right", 3: "bottom", 4: "left", 5: "right", 6: "left", 7: "bottom" };

  function Stage(root) {
    this.root = root;
    this.outer = root.querySelector(".stage-outer");
    this.rig = root.querySelector(".phone-rig");
    this.screenImgs = {};
    root.querySelectorAll(".phone-screen img").forEach(function (img) {
      this.screenImgs[img.dataset.screen] = img;
    }.bind(this));
    if (this.screenImgs.g) this.screenImgs.g.classList.add("is-active");
    this.legendEls = {
      left: root.querySelector(".stage-legend.side-left"),
      right: root.querySelector(".stage-legend.side-right"),
      bottom: root.querySelector(".stage-legend.side-bottom")
    };
    this.heroEl = root.querySelector(".stage-hero");
    this.progressFill = root.querySelector(".stage-progress > span");
    this.mobileCard = document.querySelector("[data-mobile-legend]");

    this.currentScreen = "g";
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.isMobile = window.matchMedia("(max-width: 820px)").matches;

    // Render directly as a function of scroll position (rAF-throttled, not
    // delayed/eased) — the same approach real scroll-driven product pages
    // use: the frame always matches where the user physically is, so it
    // never "catches up" after they've already stopped scrolling.
    this._p = 0;
    this._raf = null;
    this._bind();
    this._renderStatic(0);
  };

  Stage.prototype._bind = function () {
    var self = this;
    var onScroll = function () {
      if (self._raf) return;
      self._raf = window.requestAnimationFrame(function () {
        self._raf = null;
        self._p = self._computeRawP();
        self.render(self._p);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      self.isMobile = window.matchMedia("(max-width: 820px)").matches;
      self._p = self._computeRawP();
      self.render(self._p);
    });
    document.addEventListener("lokr:lang", function () { self.render(self._p); });
    this._p = this._computeRawP();
    this.render(this._p);
  };

  Stage.prototype._computeRawP = function () {
    var rect = this.outer.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    var p = total > 0 ? -rect.top / total : 0;
    return Math.max(0, Math.min(1, p));
  };

Stage.prototype._setScreen = function (key) {
    if (!key || key === this.currentScreen) return;
    var prev = this.screenImgs[this.currentScreen];
    var next = this.screenImgs[key];
    if (prev) prev.classList.remove("is-active");
    if (next) next.classList.add("is-active");
    this.currentScreen = key;
  };

  Stage.prototype._applyTransform = function (pose, vh, vw, pastIntro) {
    var txPx = pose.tx * Math.min(250, 0.19 * vw);
    var tyPx = (pose.ty / 100) * vh;
    var scale = pose.scale;
    if (this.isMobile) {
      txPx = 0;
      // Spec section 7: phone scaled to ~60% of viewport width on mobile,
      // and raised an extra 10vh once past the intro pose to leave room
      // for the fixed legend card at the bottom instead of overlapping it.
      // The intro pose itself needs a bigger lift: its ty:+20vh was tuned
      // for a vertically-centered hero — now that the hero is anchored near
      // the top (see .stage-hero mobile override), that same push leaves a
      // huge empty gap between the title and the phone.
      scale = pose.scale * ((0.6 * vw) / 300);
      tyPx -= (pastIntro ? 0.10 : 0.20) * vh;
    }
    var t = "translate3d(" + txPx.toFixed(2) + "px," + tyPx.toFixed(2) + "px,0) " +
      "scale(" + scale.toFixed(4) + ") " +
      "rotateX(" + pose.rx.toFixed(2) + "deg) " +
      "rotateY(" + pose.ry.toFixed(2) + "deg) " +
      "rotateZ(" + pose.rz.toFixed(2) + "deg)";
    this.rig.style.transform = t;
  };

  Stage.prototype._showLegend = function (side, opacity, content) {
    var el = this.legendEls[side];
    if (!el) return;
    el.style.opacity = String(opacity);
    if (content && el.dataset.rendered !== content.key) {
      el.innerHTML = content.html;
      el.dataset.rendered = content.key;
    }
  };

  Stage.prototype._hideOtherLegends = function (activeSide) {
    var self = this;
    Object.keys(this.legendEls).forEach(function (side) {
      if (side !== activeSide && self.legendEls[side]) {
        self.legendEls[side].style.opacity = "0";
      }
    });
  };

  Stage.prototype._legendContentFor = function (i) {
    var t = window.LokrSite.t;
    if (i === 7) {
      var f = t.final;
      return {
        key: "final",
        html:
          '<h3 class="h-legend">' + f.title + "</h3>" +
          '<p class="body-text">' + f.body + "</p>" +
          '<button class="btn-primary" type="button" data-appstore-link>' + f.button + "</button>"
      };
    }
    var l = t.legends[i - 1];
    return {
      key: "legend" + i,
      html:
        '<span class="eyebrow">' + l.n + "</span>" +
        '<h3 class="h-legend">' + l.title + "</h3>" +
        '<p class="body-text">' + l.body + "</p>"
    };
  };

  Stage.prototype.render = function (p) {
    var vh = window.innerHeight;
    var vw = window.innerWidth;

    if (this.progressFill) this.progressFill.style.width = (p * 100).toFixed(1) + "%";

    // Hero legend / intro pose
    if (p <= INTRO_END) {
      this._applyTransform(POSES[0], vh, vw, false);
      this._setScreen("g");
      if (this.heroEl) this.heroEl.style.opacity = "1";
      this._hideOtherLegends(null);
      this._updateMobileCard(0, 0, null);
      return;
    }

    for (var i = 1; i <= SEGMENT_COUNT; i++) {
      var range = segRange(i);
      if (p < range.end || i === SEGMENT_COUNT) {
        var localT = Math.max(0, Math.min(1, (p - range.start) / (range.end - range.start)));

        var transitionT = Math.min(localT / 0.40, 1);
        var eased = easeInOutCubic(transitionT);
        var pose = lerpPose(POSES[i - 1], POSES[i], eased);
        this._applyTransform(pose, vh, vw, true);

        var screenKey = localT < 0.30 ? null : screenForSegment(i, localT);
        if (screenKey) this._setScreen(screenKey);

        // hero fade-out during first 20% of segment 1
        if (i === 1 && this.heroEl) {
          this.heroEl.style.opacity = String(Math.max(0, 1 - localT / 0.20));
        } else if (this.heroEl) {
          this.heroEl.style.opacity = "0";
        }

        var legendOpacity;
        if (localT < 0.36) legendOpacity = 0;
        else if (localT < 0.46) legendOpacity = (localT - 0.36) / 0.10;
        else if (i === SEGMENT_COUNT) legendOpacity = 1; // final legend stays
        else if (localT < 0.90) legendOpacity = 1;
        else if (localT < 0.97) legendOpacity = 1 - (localT - 0.90) / 0.07;
        else legendOpacity = 0;

        var side = LEGEND_SIDE[i];
        this._hideOtherLegends(side);
        this._showLegend(side, legendOpacity, this._legendContentFor(i));
        this._updateMobileCard(i, legendOpacity, this._legendContentFor(i));
        break;
      }
    }
  };

  Stage.prototype._updateMobileCard = function (i, opacity, content) {
    if (!this.mobileCard || !this.isMobile) return;
    // Once the viewport has scrolled fully past the sticky stage, this fixed
    // card must not linger on top of the sections that follow (recursos etc).
    if (this.outer.getBoundingClientRect().bottom <= 0) {
      this.mobileCard.style.opacity = "0";
      return;
    }
    if (i === 0 || !content) {
      this.mobileCard.style.opacity = "0";
      return;
    }
    this.mobileCard.style.opacity = String(Math.max(opacity, i === SEGMENT_COUNT ? 1 : opacity));
    if (this.mobileCard.dataset.rendered !== content.key) {
      this.mobileCard.innerHTML = content.html;
      this.mobileCard.dataset.rendered = content.key;
    }
  };

  Stage.prototype._renderStatic = function () {
    this._applyTransform(POSES[0], window.innerHeight, window.innerWidth);
  };

  window.LokrStage = { create: function (root) { return new Stage(root); } };
})();
