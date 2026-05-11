(function () {
  document.documentElement.classList.add("js-enabled");

  var body = document.body;
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  var header = document.querySelector("[data-header]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealItems = document.querySelectorAll("[data-reveal]");

  function closeMenu() {
    body.classList.remove("menu-open");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      var isOpen = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      var target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      closeMenu();
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  document.querySelectorAll(".faq-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".faq-item");
      var isOpen = item.classList.contains("is-open");

      document.querySelectorAll(".faq-item").forEach(function (faqItem) {
        faqItem.classList.remove("is-open");
        var button = faqItem.querySelector(".faq-trigger");
        if (button) {
          button.setAttribute("aria-expanded", "false");
        }
      });

      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  window.addEventListener(
    "scroll",
    function () {
      if (!header) {
        return;
      }

      header.classList.toggle("is-scrolled", window.scrollY > 12);
    },
    { passive: true }
  );

  if (!reducedMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.getAttribute("data-delay");
            if (delay) {
              entry.target.style.setProperty("--reveal-delay", delay + "ms");
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -5% 0px"
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  setTimeout(function () {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }, 800);
})();
