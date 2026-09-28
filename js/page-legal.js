// Lokr+ site — Privacy & Support pages rendering
(function () {
  "use strict";

  function renderPrivacy() {
    var render = function () {
      var t = window.LokrSite.tLegal.privacy;
      document.querySelector("[data-p-eyebrow]").textContent = t.eyebrow;
      document.querySelector("[data-p-title]").textContent = t.title;
      document.querySelector("[data-p-intro]").textContent = t.intro;
      document.querySelector("[data-p-sections]").innerHTML = t.sections.map(function (s) {
        return "<div><h2>" + s.h + "</h2><p>" + s.p + "</p></div>";
      }).join("");
      document.title = t.title + " — Lokr+";
    };
    render();
    document.addEventListener("lokr:lang", render);
  }

  function renderSupport() {
    var render = function () {
      var t = window.LokrSite.tLegal.support;
      document.querySelector("[data-s-title]").textContent = t.title;
      document.querySelector("[data-s-subtitle]").textContent = t.subtitle;
      document.querySelector("[data-s-contact-title]").textContent = t.contactTitle;
      document.querySelector("[data-s-contact-body]").textContent = t.contactBody;
      document.querySelector("[data-s-contact-button]").textContent = t.contactButton;

      var host = document.querySelector("[data-s-faq]");
      host.innerHTML = t.faq.map(function (item, idx) {
        return (
          '<div class="faq-item" data-idx="' + idx + '">' +
          '<button type="button" class="faq-question"><span>' + item.q + '</span><span class="plus">+</span></button>' +
          '<div class="faq-answer"><p>' + item.a + "</p></div>" +
          "</div>"
        );
      }).join("");

      host.querySelectorAll(".faq-item").forEach(function (el) {
        var question = el.querySelector(".faq-question");
        var answer = el.querySelector(".faq-answer");
        question.addEventListener("click", function () {
          var isOpen = el.classList.contains("open");
          host.querySelectorAll(".faq-item.open").forEach(function (other) {
            other.classList.remove("open");
            other.querySelector(".faq-answer").style.maxHeight = null;
          });
          if (!isOpen) {
            el.classList.add("open");
            answer.style.maxHeight = answer.scrollHeight + "px";
          }
        });
      });

      document.title = t.title + " — Lokr+";
    };
    render();
    document.addEventListener("lokr:lang", render);
  }

  window.LokrPageLegal = { renderPrivacy: renderPrivacy, renderSupport: renderSupport };
})();
