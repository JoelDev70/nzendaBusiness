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

// gestion du pannel
// const product_card = document.querySelector(".product-card");
// product_card.addEventListener("click",()=>{
  
// })

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
   const forms = document.querySelectorAll('.contact-form');

forms.forEach((form) => {
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) {
          return;
        }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
         // 1. Vérification du Honeypot
    const botCheck = document.getElementById('verify_bot').value;
    if (botCheck !== "") {
        console.warn("Robot détecté !");
        return; // On arrête tout ici
    }
  
        // 2. Déterminer le titre du message selon le formulaire
        let titre = (this.id === 'form_commande') ? "*NOUVELLE COMMANDE NZB*" : "*NOUVEAU CONTACT NZB*";
      let messageCorps = "";
        // 3. Récupérer dynamiquement tous les champs remplis
        const formData = new FormData(this);

        for (const [key, value] of formData.entries()) {
            // Formate chaque champ : "Nom : Jean-Paul"
            messageCorps += `\n${key.toUpperCase()} : ${value}`;
        }
        // 4. Construire le lien WhatsApp final
        const messageFinal = encodeURIComponent(`${titre}\n${messageCorps}`);
        const suffixN = "243977"; 
        const  prefixN= "973473"; 
        const monNumero = suffixN + prefixN ; 
        const urlWhatsApp = `https://wa.me/${monNumero}?text=${messageFinal}\n`;
        console.log(messageCorps);
                alert("Envoi du message en cours vers WhatsApp...");
        // 5. Ouvrir l'application WhatsApp
        window.open(urlWhatsApp, '_blank');
        document.querySelector("form").reset();

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
