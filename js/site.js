// Lokr+ site — language resolution, header/footer render, shared behavior
(function () {
  "use strict";

  var STORAGE_KEY = "lokr-lang";
  var HTML_LANG = { pt: "pt-BR", en: "en-US", es: "es" };
  var SUPPORTED = ["pt", "en", "es"];

  function resolveLang() {
    var params = new URLSearchParams(window.location.search);
    var fromUrl = params.get("lang");
    if (fromUrl && SUPPORTED.indexOf(fromUrl) !== -1) return fromUrl;

    try {
      var fromStorage = window.localStorage.getItem(STORAGE_KEY);
      if (fromStorage && SUPPORTED.indexOf(fromStorage) !== -1) return fromStorage;
    } catch (e) { /* private mode, storage blocked — ignore */ }

    var nav = (window.navigator.language || "en").toLowerCase();
    if (nav.indexOf("pt") === 0) return "pt";
    if (nav.indexOf("es") === 0) return "es";
    return "en";
  }

  function persistLang(lang) {
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
  }

  function updateUrl(lang) {
    var url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url);
  }

  function decorateInternalLinks(lang) {
    document.querySelectorAll('a[href$=".html"], a[data-lang-link]').forEach(function (a) {
      try {
        var url = new URL(a.getAttribute("href"), window.location.href);
        if (url.origin === window.location.origin) {
          url.searchParams.set("lang", lang);
          a.setAttribute("href", url.pathname + url.search + url.hash);
        }
      } catch (e) { /* relative parse issue — leave link untouched */ }
    });
  }

  function svgLogo() {
    return (
      '<svg viewBox="0 0 212 212" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="212" height="212" rx="48" fill="var(--icon-bg)"/>' +
      '<rect x="43" y="114" width="16" height="66" rx="8" fill="var(--icon-bars)"/>' +
      '<rect x="74" y="49" width="16" height="93" rx="8" fill="var(--icon-bars)"/>' +
      '<rect x="102" y="129" width="16" height="54" rx="8" fill="var(--icon-bars)"/>' +
      '<rect x="132" y="34" width="16" height="101" rx="8" fill="var(--icon-bars)"/>' +
      '<rect x="162" y="91" width="16" height="73" rx="8" fill="var(--icon-bars)"/>' +
      "</svg>"
    );
  }

  function renderHeader(lang, activeKey) {
    var t = window.LOKR_I18N[lang];
    var host = document.querySelector("[data-site-header]");
    if (!host) return;

    var navItem = function (key, href) {
      var active = key === activeKey ? " active" : "";
      return '<a href="' + href + '" class="' + active.trim() + '">' + t.nav[key] + "</a>";
    };

    host.innerHTML =
      '<div class="wrap">' +
      '<a href="index.html" class="brand">' + svgLogo() + "<span>Lokr+</span></a>" +
      '<nav class="site-nav">' +
      navItem("recursos", "index.html#recursos") +
      navItem("isca", "index.html#cofre-isca") +
      navItem("planos", "index.html#planos") +
      navItem("suporte", "suporte.html") +
      "</nav>" +
      '<div class="header-right">' +
      '<div class="lang-pill" role="group" aria-label="Language">' +
      SUPPORTED.map(function (code) {
        return (
          '<button type="button" data-lang="' + code + '" class="' +
          (code === lang ? "active" : "") + '">' + code.toUpperCase() + "</button>"
        );
      }).join("") +
      "</div>" +
      '<button type="button" class="btn-download" data-appstore-link>' + t.download + "</button>" +
      "</div>" +
      "</div>";

    host.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });
  }

  function renderFooter(lang) {
    var t = window.LOKR_I18N[lang];
    var host = document.querySelector("[data-site-footer]");
    if (!host) return;

    host.innerHTML =
      '<div class="wrap">' +
      '<div class="brand">' + svgLogo() + "<span>Lokr+</span></div>" +
      '<p class="footer-text">' + t.footer.copyright + " · " + t.footer.tagline + "</p>" +
      '<div class="foot-links footer-text">' +
      '<a href="privacidade.html">' + (lang === "pt" ? "Privacidade" : lang === "es" ? "Privacidad" : "Privacy") + "</a>" +
      '<a href="termos.html">' + (lang === "pt" ? "Termos de uso" : lang === "es" ? "Términos de uso" : "Terms of use") + "</a>" +
      '<a href="suporte.html">' + t.nav.suporte + "</a>" +
      '<a href="mailto:lokr.security.support@gmail.com">lokr.security.support@gmail.com</a>' +
      "</div>" +
      "</div>";

    decorateInternalLinks(lang);
  }

  var toastTimer = null;
  function showToast(message) {
    var el = document.querySelector("[data-toast]");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("data-toast", "");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("visible");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { el.classList.remove("visible"); }, 2600);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("[data-appstore-link]");
    if (!btn) return;
    e.preventDefault();
    var t = window.LokrSite && window.LokrSite.t;
    showToast(t ? t.comingSoon : "Coming soon.");
  });

  function setLang(lang, opts) {
    opts = opts || {};
    if (SUPPORTED.indexOf(lang) === -1) lang = "en";
    document.documentElement.setAttribute("lang", HTML_LANG[lang]);
    window.LokrSite.lang = lang;
    window.LokrSite.t = window.LOKR_I18N[lang];
    window.LokrSite.tLegal = window.LOKR_I18N_LEGAL ? window.LOKR_I18N_LEGAL[lang] : null;

    persistLang(lang);
    if (opts.updateUrl !== false) updateUrl(lang);

    renderHeader(lang, window.LokrSite.pageKey);
    renderFooter(lang);
    decorateInternalLinks(lang);

    document.dispatchEvent(new CustomEvent("lokr:lang", { detail: { lang: lang } }));
  }

  window.LokrSite = {
    lang: null,
    t: null,
    tLegal: null,
    pageKey: null,
    init: function (pageKey) {
      window.LokrSite.pageKey = pageKey || null;
      var lang = resolveLang();
      setLang(lang, { updateUrl: true });
    },
    setLang: setLang
  };
})();
