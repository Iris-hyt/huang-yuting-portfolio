const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const visualSections = [...document.querySelectorAll("[data-visual]")];
const scenes = [...document.querySelectorAll(".scene")];

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.textContent = "菜单";
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

const toggleMenu = () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.textContent = willOpen ? "关闭" : "菜单";
  navigation.classList.toggle("is-open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
};

if (menuButton && navigation) {
  menuButton.addEventListener("click", toggleMenu);
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

const setCurrentNavigation = (id) => {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const setActiveScene = (name) => {
  scenes.forEach((scene) => {
    scene.classList.toggle("is-active", scene.dataset.photo === name);
  });
};

if ("IntersectionObserver" in window && visualSections.length) {
  const sceneObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;
      setActiveScene(visibleEntry.target.dataset.visual);
      setCurrentNavigation(visibleEntry.target.id);
    },
    {
      rootMargin: "-35% 0px -48% 0px",
      threshold: [0, 0.15, 0.4, 0.7],
    },
  );

  visualSections.forEach((section) => sceneObserver.observe(section));
}

const revealSelectors = [
  ".section h2",
  ".section-heading",
  ".about-grid > *",
  ".project",
  ".skill-list > div",
  ".experience-list article",
  ".contact h2",
  ".contact-note",
  ".contact-actions",
];

if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
  document.documentElement.classList.add("motion-ready");
  const revealElements = revealSelectors.flatMap((selector) => [
    ...document.querySelectorAll(selector),
  ]);

  revealElements.forEach((element, index) => {
    element.dataset.reveal = "";
    element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.08,
    },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

let toastTimer;
const toast = document.querySelector("[data-toast]");

const showToast = (message) => {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
};

const copyText = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) throw new Error("Copy command was rejected");
};

document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    const email = button.dataset.copyEmail;
    if (!email) return;

    try {
      await copyText(email);
      showToast("邮箱已复制");
    } catch {
      showToast(`请手动复制：${email}`);
    }
  });
});

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
