(function () {
  "use strict";

  // -------- Theme toggle --------
  var THEME_KEY = "buildstack-theme";
  function applyTheme(theme) {
    var dark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }
  var stored = (function () {
    try {
      return localStorage.getItem(THEME_KEY) || "system";
    } catch (e) {
      return "system";
    }
  })();
  applyTheme(stored);
  var toggleBtn = document.querySelector("[data-theme-toggle]");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      var current = document.documentElement.classList.contains("dark") ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });
  }

  // -------- Mobile nav toggle --------
  var navToggle = document.querySelector("[data-nav-toggle]");
  var mobileNav = document.getElementById("mobile-nav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      if (open) mobileNav.setAttribute("hidden", "");
      else mobileNav.removeAttribute("hidden");
    });
  }

  // -------- Header scroll state --------
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // -------- Reading progress --------
  var progress = document.querySelector("[data-reading-progress]");
  if (progress) {
    var onProgress = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, pct)) + "%";
    };
    onProgress();
    window.addEventListener("scroll", onProgress, { passive: true });
    window.addEventListener("resize", onProgress, { passive: true });
  }

  // -------- Search --------
  document.querySelectorAll("[data-search]").forEach(function (root) {
    var input = root.querySelector("[data-search-input]");
    var resultsEl = root.querySelector("[data-search-results]");
    var dataEl = root.querySelector("[data-search-data]");
    if (!input || !resultsEl || !dataEl) return;
    var posts = [];
    try { posts = JSON.parse(dataEl.textContent || "[]"); } catch (e) {}

    function escapeAttr(s) {
      return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
    }
    function escapeHtml(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function render(query) {
      var q = (query || "").trim().toLowerCase();
      if (!q) { resultsEl.setAttribute("hidden", ""); resultsEl.innerHTML = ""; return; }
      var matches = posts.filter(function (p) {
        var haystack = (p.title + " " + p.description + " " + p.category + " " + (p.tags || []).join(" ")).toLowerCase();
        return haystack.indexOf(q) !== -1;
      }).slice(0, 6);
      resultsEl.removeAttribute("hidden");
      if (!matches.length) {
        resultsEl.innerHTML = '<p class="search-empty">No articles match "' + escapeHtml(query) + '".</p>';
        return;
      }
      resultsEl.innerHTML = '<ul role="listbox">' + matches.map(function (p) {
        return (
          '<li><a role="option" href="/blog/' + escapeAttr(p.slug) + '/">' +
            '<p class="eyebrow">' + escapeHtml(p.category) + '</p>' +
            '<p class="result-title">' + escapeHtml(p.title) + '</p>' +
            '<p class="result-desc">' + escapeHtml(p.description) + '</p>' +
          '</a></li>'
        );
      }).join("") + '</ul>';
    }

    input.addEventListener("input", function () { render(input.value); });
    input.addEventListener("focus", function () { render(input.value); });
    document.addEventListener("mousedown", function (e) {
      if (!root.contains(e.target)) { resultsEl.setAttribute("hidden", ""); }
    });
    document.addEventListener("keydown", function (e) {
      var target = e.target;
      var typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (e.key === "/" && !typing) { e.preventDefault(); input.focus(); }
      if (e.key === "Escape") { resultsEl.setAttribute("hidden", ""); input.blur(); }
    });
  });

  // -------- Subscribe form (simulate, but allow real action) --------
  document.querySelectorAll("[data-subscribe]").forEach(function (form) {
    var success = form.querySelector("[data-subscribe-success]");
    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";
      if (action.indexOf("your-id") !== -1) {
        e.preventDefault();
        if (success) success.removeAttribute("hidden");
        form.reset();
      }
    });
  });

  // -------- Contact form --------
  document.querySelectorAll("[data-contact-form]").forEach(function (form) {
    var success = form.querySelector("[data-contact-success]");
    var error = form.querySelector("[data-contact-error]");
    form.addEventListener("submit", function (e) {
      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var email = String(data.get("email") || "").trim();
      var msg = String(data.get("message") || "").trim();
      if (!name || !email || !msg) {
        e.preventDefault();
        if (error) {
          error.removeAttribute("hidden");
          error.textContent = "Please fill out name, email, and message.";
        }
        return;
      }
      var action = form.getAttribute("action") || "";
      if (action.indexOf("your-id") !== -1) {
        e.preventDefault();
        if (error) error.setAttribute("hidden", "");
        if (success) success.removeAttribute("hidden");
        form.reset();
      }
    });
  });
})();
