(function () {
  var supported = ["zh-CN", "en", "fr-CA"];
  var aliases = {
    zh: "zh-CN",
    "zh-cn": "zh-CN",
    "zh-hans": "zh-CN",
    en: "en",
    "en-us": "en",
    fr: "fr-CA",
    "fr-ca": "fr-CA",
    "fr-fr": "fr-CA"
  };

  function normalizeLocale(value) {
    if (!value) return "en";
    var key = String(value).toLowerCase();
    return aliases[key] || aliases[key.split("-")[0]] || "en";
  }

  function detectLocale() {
    var params = new URLSearchParams(window.location.search);
    if (params.has("lang")) {
      return normalizeLocale(params.get("lang"));
    }

    return normalizeLocale(navigator.language || navigator.userLanguage || "en");
  }

  function applyLocale(locale) {
    document.documentElement.lang = locale;
    document.body.setAttribute("data-active-locale", locale);
    document.querySelectorAll("[data-lang]").forEach(function (node) {
      node.hidden = node.getAttribute("data-lang") !== locale;
    });
    document.querySelectorAll("[data-lang-link]").forEach(function (node) {
      var active = node.getAttribute("data-lang-link") === locale;
      node.setAttribute("aria-pressed", active ? "true" : "false");
      node.classList.toggle("is-active", active);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var locale = detectLocale();
    applyLocale(locale);

    document.querySelectorAll("[data-lang-link]").forEach(function (node) {
      node.addEventListener("click", function (event) {
        event.preventDefault();
        var nextLocale = node.getAttribute("data-lang-link");
        var url = new URL(window.location.href);
        url.searchParams.set("lang", nextLocale);
        window.history.replaceState({}, "", url.toString());
        applyLocale(nextLocale);
      });
    });
  });
})();
