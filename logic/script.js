async function loadIncludes() {
  const includeTargets = document.querySelectorAll("[data-include]");
  const basePath = document.body.dataset.basePath || "./";

  await Promise.all(
    [...includeTargets].map(async (target) => {
      const filePath = target.dataset.include;
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`Impossible de charger ${filePath}`);
      }

      const html = await response.text();
      target.innerHTML = html.replaceAll("{{base}}", basePath);
    })
  );
}

function markActiveNavigation() {
  const currentPage = document.body.dataset.page;

  if (!currentPage) {
    return;
  }

  document.querySelectorAll(`[data-nav="${currentPage}"]`).forEach((link) => {
    link.classList.add("active");
  });
}

function setupMobileNavigation() {
  const siteHeader = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (!siteHeader || !menuToggle || !mobileNav) {
    return;
  }

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    menuToggle.classList.remove("is-active");
    mobileNav.classList.remove("is-open");
    siteHeader.classList.remove("nav-open");
  };

  const openMenu = () => {
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fermer le menu");
    menuToggle.classList.add("is-active");
    mobileNav.classList.add("is-open");
    siteHeader.classList.add("nav-open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      closeMenu();
      return;
    }

    openMenu();
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!siteHeader.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      closeMenu();
    }
  });

  closeMenu();
}

function setupScrollAnimations() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = document.querySelectorAll(
    [
      ".eyebrow",
      ".hero h1",
      ".page-hero h1",
      ".hero-text",
      ".lead-text",
      ".section-intro",
      ".hero-metrics article",
      ".hero-showcase",
      ".hero-note",
      ".brand-strip-grid p",
      ".info-card",
      ".story-tile",
      ".showcase-card",
      ".product-card",
      ".contact-form",
      ".info-list article",
      ".cta-box"
    ].join(", ")
  );

  const typeTargets = document.querySelectorAll(
    [
      ".hero h1",
      ".page-hero h1",
      ".section-heading h2",
      ".hero-note h3",
      ".showcase-copy h2"
    ].join(", ")
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("scroll-reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
  });

  typeTargets.forEach((element) => {
    element.classList.add("scroll-reveal");
    element.dataset.fullText = element.textContent.trim();
    element.dataset.typed = "false";
  });

  if (reducedMotion) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const typeElement = (element) => {
    if (element.dataset.typed === "true") {
      return;
    }

    const fullText = element.dataset.fullText || element.textContent.trim();
    element.dataset.typed = "true";
    element.textContent = "";
    element.classList.add("is-typing");

    let charIndex = 0;
    const write = () => {
      element.textContent = fullText.slice(0, charIndex + 1);
      charIndex += 1;

      if (charIndex < fullText.length) {
        window.setTimeout(write, 24);
        return;
      }

      element.classList.remove("is-typing");
    };

    write();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");

        if (entry.target.dataset.fullText) {
          typeElement(entry.target);
        }

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  new Set([...revealTargets, ...typeTargets]).forEach((element) => observer.observe(element));
}

function setupBackToTopButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "back-to-top";
  button.setAttribute("aria-label", "Retour en haut");
  button.textContent = "↑";
  document.body.appendChild(button);

  const toggleButton = () => {
    button.classList.toggle("is-visible", window.scrollY > 420);
  };

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", toggleButton, { passive: true });
  toggleButton();
}

function setupFormEnhancements() {
  const forms = document.querySelectorAll(".contact-form");

  forms.forEach((form) => {
    const submitButton = form.querySelector('button[type="submit"]');

    if (!submitButton) {
      return;
    }

    let feedback = form.querySelector(".form-feedback");

    if (!feedback) {
      feedback = document.createElement("p");
      feedback.className = "form-feedback";
      feedback.setAttribute("aria-live", "polite");
      form.appendChild(feedback);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      submitButton.disabled = true;
      submitButton.classList.add("is-loading");
      submitButton.dataset.originalLabel = submitButton.dataset.originalLabel || submitButton.textContent.trim();
      submitButton.textContent = "Envoi en cours...";

      feedback.textContent = "Traitement de votre demande...";
      feedback.classList.remove("is-success");

      window.setTimeout(() => {
        submitButton.disabled = false;
        submitButton.classList.remove("is-loading");
        submitButton.textContent = submitButton.dataset.originalLabel;

        feedback.textContent = "Votre demande a bien été enregistrée. Nous vous recontacterons rapidement.";
        feedback.classList.add("is-success");

        form.reset();
      }, 1100);
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadIncludes();
    markActiveNavigation();
    setupMobileNavigation();
    setupScrollAnimations();
    setupBackToTopButton();
    setupFormEnhancements();
  } catch (error) {
    console.error(error);
  }
});
