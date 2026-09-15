(function () {
  document.documentElement.classList.add("js-enabled");

  var body = document.body;
  var header = document.querySelector("[data-header]");
  var menuButton = document.querySelector("[data-menu-button]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealItems = document.querySelectorAll("[data-reveal]");
  var workflowSteps = document.querySelectorAll("[data-step-card]");

  function closeMenu() {
    body.classList.remove("menu-open");

    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.querySelector(".sr-only").textContent = "Abrir menu";
    }

    if (mobileMenu) {
      mobileMenu.setAttribute("aria-hidden", "true");
    }
  }

  function toggleMenu() {
    if (!menuButton) {
      return;
    }

    var expanded = body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", expanded ? "true" : "false");
    menuButton.querySelector(".sr-only").textContent = expanded ? "Fechar menu" : "Abrir menu";
    mobileMenu.setAttribute("aria-hidden", expanded ? "false" : "true");

    if (expanded) {
      mobileMenu.querySelector("a").focus();
    }
  }

  function updateHeader() {
    if (!header) {
      return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  if (menuButton && mobileMenu) {
    mobileMenu.setAttribute("aria-hidden", "true");
    menuButton.addEventListener("click", toggleMenu);

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("click", function (event) {
    if (!body.classList.contains("menu-open") || !header.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && body.classList.contains("menu-open")) {
      closeMenu();
      menuButton.focus();
    }
  });

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

  workflowSteps.forEach(function (step) {
    step.addEventListener("mouseenter", function () {
      workflowSteps.forEach(function (item) {
        item.classList.remove("is-active");
        item.classList.remove("active");
      });

      step.classList.add(step.classList.contains("process-step") ? "active" : "is-active");
    });

    step.addEventListener("focusin", function () {
      workflowSteps.forEach(function (item) {
        item.classList.remove("is-active");
        item.classList.remove("active");
      });

      step.classList.add(step.classList.contains("process-step") ? "active" : "is-active");
    });
  });

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  if (!reducedMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          var delay = entry.target.getAttribute("data-delay");
          if (delay) {
            entry.target.style.setProperty("--delay", delay + "ms");
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -8% 0px"
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
})();
