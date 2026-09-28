// Lokr+ site — index page: builds the stage DOM + content sections
(function () {
  "use strict";

  var SCREEN_FILES = {
    g: "g.jpg", vault: "vault.jpg", b: "b.png", c: "c.png",
    d: "d.png", e: "e.jpg", f: "f.jpg", a: "a.jpg"
  };
  var SCREEN_ORDER = ["g", "vault", "b", "c", "d", "e", "f", "a"];

  function imgSet(lang) { return lang === "pt" ? "pt" : "en"; } // ES reuses EN screenshots

  function cameraIconSvg() {
    return (
      '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="30" cy="30" r="16" fill="rgba(255,255,255,.14)"/>' +
      '<circle cx="30" cy="30" r="9" fill="rgba(0,0,0,.5)"/>' +
      '<circle cx="70" cy="30" r="16" fill="rgba(255,255,255,.14)"/>' +
      '<circle cx="70" cy="30" r="9" fill="rgba(0,0,0,.5)"/>' +
      '<circle cx="50" cy="66" r="16" fill="rgba(255,255,255,.14)"/>' +
      '<circle cx="50" cy="66" r="9" fill="rgba(0,0,0,.5)"/>' +
      "</svg>"
    );
  }

  function buildStageSection() {
    var section = document.getElementById("stage-section");
    section.innerHTML =
      '<div class="stage-outer">' +
      '<div class="stage-sticky">' +
      '<div class="stage-glow"></div>' +
      '<div class="stage-hero">' +
      '<div class="wrap">' +
      '<span class="eyebrow" data-hero-eyebrow></span>' +
      '<h1 class="h-stage"><span data-hero-a></span><br><span class="accent-grad" data-hero-b></span></h1>' +
      "</div>" +
      "</div>" +
      '<div class="stage-scene">' +
      '<div class="phone-rig">' +
      '<div class="phone-body">' +
      '<div class="phone-face front">' +
      '<div class="phone-island"></div>' +
      '<div class="phone-screen">' +
      SCREEN_ORDER.map(function (key) {
        return '<img data-screen="' + key + '" alt="">';
      }).join("") +
      "</div>" +
      "</div>" +
      '<div class="phone-face back"><div class="phone-back-camera">' + cameraIconSvg() + "</div></div>" +
      '<div class="phone-side left"></div>' +
      '<div class="phone-side right"></div>' +
      '<div class="phone-side top"></div>' +
      '<div class="phone-side bottom"></div>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="stage-legend side-left"></div>' +
      '<div class="stage-legend side-right"></div>' +
      '<div class="stage-legend side-bottom"></div>' +
      '<div class="stage-progress"><span></span></div>' +
      "</div>" +
      "</div>";

    var mobileCard = document.createElement("div");
    mobileCard.className = "mobile-legend-card";
    mobileCard.setAttribute("data-mobile-legend", "");
    document.body.appendChild(mobileCard);

    buildStaticSequence(section);
  }

  function buildStaticSequence() {
    // prefers-reduced-motion fallback: static stacked sequence (spec section 7)
    var host = document.createElement("div");
    host.className = "static-sequence wrap";
    host.setAttribute("data-static-sequence", "");
    document.getElementById("stage-section").appendChild(host);
  }

  function renderStaticSequence(lang) {
    var host = document.querySelector("[data-static-sequence]");
    if (!host) return;
    var t = window.LokrSite.t;
    var set = imgSet(lang);
    var items = [
      { screen: "g", title: t.hero.titleA + " " + t.hero.titleB, body: t.hero.eyebrow },
      { screen: "vault", title: t.legends[0].title, body: t.legends[0].body },
      { screen: "b", title: t.legends[1].title, body: t.legends[1].body },
      { screen: null, title: t.legends[2].title, body: t.legends[2].body },
      { screen: "e", title: t.legends[3].title, body: t.legends[3].body },
      { screen: "f", title: t.legends[4].title, body: t.legends[4].body },
      { screen: "a", title: t.legends[5].title, body: t.legends[5].body },
      { screen: "vault", title: t.final.title, body: t.final.body }
    ];
    host.innerHTML = items.map(function (it) {
      var img = it.screen
        ? '<img src="assets/img/' + set + "/" + SCREEN_FILES[it.screen] + '" alt="">'
        : "";
      return (
        '<div class="static-item"><div class="static-phone">' + img + "</div>" +
        '<div class="static-text"><h3 class="h-legend">' + it.title + "</h3>" +
        '<p class="body-text">' + it.body + "</p></div></div>"
      );
    }).join("");
  }

  function renderStageContent(lang) {
    var t = window.LokrSite.t;
    var section = document.getElementById("stage-section");
    section.querySelector("[data-hero-eyebrow]").textContent = t.hero.eyebrow;
    section.querySelector("[data-hero-a]").textContent = t.hero.titleA;
    section.querySelector("[data-hero-b]").textContent = t.hero.titleB;

    var set = imgSet(lang);
    section.querySelectorAll(".phone-screen img").forEach(function (img) {
      img.src = "assets/img/" + set + "/" + SCREEN_FILES[img.dataset.screen];
    });

    renderStaticSequence(lang);
  }

  function renderRecursos(lang) {
    var t = window.LokrSite.t.recursos;
    var section = document.getElementById("recursos");
    section.className = "block wrap";
    section.innerHTML =
      '<div class="section-head">' +
      '<span class="eyebrow">' + t.eyebrow + "</span>" +
      '<h2 class="h-section">' + t.title + "</h2>" +
      "</div>" +
      '<div class="cards-grid">' +
      t.cards.map(function (c) {
        return (
          '<div class="feature-card"><h3 class="h-card">' + c.title + "</h3>" +
          '<p class="body-card">' + c.body + "</p></div>"
        );
      }).join("") +
      "</div>";
    observeCards();
  }

  function renderIsca(lang) {
    var t = window.LokrSite.t.isca;
    var section = document.getElementById("cofre-isca");
    section.className = "block wrap";
    section.innerHTML =
      '<div class="isca-block">' +
      '<span class="eyebrow">' + t.eyebrow + "</span>" +
      '<h2 class="h-section">' + t.title + "</h2>" +
      '<p class="body-text">' + t.intro + "</p>" +
      '<ul class="isca-list">' +
      t.list.map(function (item, idx) {
        return '<li><span class="disc">' + (idx + 1) + "</span>" + item + "</li>";
      }).join("") +
      "</ul>" +
      '<p class="isca-warning">' + t.warning + "</p>" +
      '<p class="isca-footer-line">' + t.footerLine + "</p>" +
      "</div>";
  }

  function renderPlanos(lang) {
    var t = window.LokrSite.t.planos;
    var section = document.getElementById("planos");
    section.className = "block wrap";
    section.innerHTML =
      '<div class="section-head"><h2 class="h-section">' + t.title + "</h2></div>" +
      '<div class="plans-grid">' +
      '<div class="plan-card free">' +
      '<div class="plan-head"><span class="h-plan">' + t.freeLabel + "</span><span>" + t.freeSub + "</span></div>" +
      '<ul class="plan-list">' +
      t.free.map(function (f) { return '<li><span class="tick">✓</span>' + f + "</li>"; }).join("") +
      "</ul></div>" +
      '<div class="plan-card pro">' +
      '<div class="plan-head"><span class="h-plan">' + t.proLabel + "</span><span class=\"pro-badge\">" + t.proBadge + "</span></div>" +
      '<ul class="plan-list">' +
      t.free.map(function (f) { return '<li><span class="tick">✓</span>' + f + "</li>"; }).join("") +
      "</ul>" +
      '<div class="plan-divider"><span>' + t.proExtra + "</span><span class=\"rule\"></span></div>" +
      '<ul class="plan-list pro-list">' +
      t.pro.map(function (f) { return '<li><span class="tick">✓</span>' + f + "</li>"; }).join("") +
      "</ul>" +
      '<div class="plans-cta">' +
      '<button class="btn-primary" type="button" data-appstore-link>' + t.button + "</button>" +
      '<p class="footer-text">' + t.note + "</p>" +
      "</div>" +
      "</div>" +
      "</div>";
  }

  var cardObserver = null;
  function observeCards() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".feature-card").forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    if (cardObserver) cardObserver.disconnect();
    cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    }, { threshold: 0.2 });
    document.querySelectorAll(".feature-card").forEach(function (el) { cardObserver.observe(el); });
  }

  function renderAll(lang) {
    renderStageContent(lang);
    renderRecursos(lang);
    renderIsca(lang);
    renderPlanos(lang);
    if (window.LokrStageInstance) window.LokrStageInstance.render(window.LokrStageInstance._p);
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildStageSection();
    window.LokrSite.init("recursos");
    renderAll(window.LokrSite.lang);
    window.LokrStageInstance = window.LokrStage.create(document.getElementById("stage-section"));

    document.addEventListener("lokr:lang", function (e) { renderAll(e.detail.lang); });
  });
})();
