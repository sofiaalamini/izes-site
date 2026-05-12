(function () {
  document.documentElement.classList.add("js-enabled");

  // Seletores principais.
  var corpo = document.body;
  var botaoMenu = document.querySelector("[data-botao-menu]");
  var menuMobile = document.querySelector("[data-menu-mobile]");
  var cabecalho = document.querySelector("[data-cabecalho]");
  var movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var itensRevelados = document.querySelectorAll("[data-reveal]");

  function fecharMenu() {
    corpo.classList.remove("menu-open");

    if (botaoMenu) {
      botaoMenu.setAttribute("aria-expanded", "false");
    }
  }

  function alternarMenu() {
    if (!botaoMenu) {
      return;
    }

    var estaAberto = corpo.classList.toggle("menu-open");
    botaoMenu.setAttribute("aria-expanded", estaAberto ? "true" : "false");
  }

  function atualizarCabecalho() {
    if (!cabecalho) {
      return;
    }

    cabecalho.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  if (botaoMenu && menuMobile) {
    botaoMenu.addEventListener("click", alternarMenu);

    menuMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", fecharMenu);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var alvoId = anchor.getAttribute("href");

      if (!alvoId || alvoId === "#") {
        return;
      }

      var alvo = document.querySelector(alvoId);
      if (!alvo) {
        return;
      }

      event.preventDefault();
      fecharMenu();
      alvo.scrollIntoView({
        behavior: movimentoReduzido ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  document.querySelectorAll(".faq-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".faq-item");
      var estaAberto = item.classList.contains("is-open");

      document.querySelectorAll(".faq-item").forEach(function (itemFaq) {
        itemFaq.classList.remove("is-open");
        var botao = itemFaq.querySelector(".faq-trigger");

        if (botao) {
          botao.setAttribute("aria-expanded", "false");
        }
      });

      if (!estaAberto) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  window.addEventListener("scroll", atualizarCabecalho, { passive: true });
  atualizarCabecalho();

  if (!movimentoReduzido && "IntersectionObserver" in window) {
    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            var atraso = entrada.target.getAttribute("data-delay");

            if (atraso) {
              entrada.target.style.setProperty("--reveal-delay", atraso + "ms");
            }

            entrada.target.classList.add("is-visible");
            observador.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -5% 0px"
      }
    );

    itensRevelados.forEach(function (item) {
      observador.observe(item);
    });
  } else {
    itensRevelados.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  setTimeout(function () {
    itensRevelados.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }, 800);
})();
