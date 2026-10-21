const menuToggle = document.querySelector("[data-menu-toggle]");
const navList = document.querySelector("[data-nav-list]");
const navLinks = [...document.querySelectorAll(".nav-link")];
const siteHeader = document.querySelector("[data-header]");
const toast = document.querySelector("[data-toast]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const closeMenu = () => {
  if (!menuToggle || !navList) return;
  menuToggle.setAttribute("aria-expanded", "false");
  navList.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

if (menuToggle && navList) {
  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    navList.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

const updateHeader = () => {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const sections = navLinks
  .map((link) => {
    const id = link.getAttribute("href");
    return id?.startsWith("#") ? document.querySelector(id) : null;
  })
  .filter(Boolean);

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

if ("IntersectionObserver" in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) setActiveLink(visible[0].target.id);
    },
    {
      rootMargin: "-24% 0px -58% 0px",
      threshold: [0, 0.15, 0.35, 0.6],
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const revealElements = [...document.querySelectorAll(".reveal")];

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  revealElements.forEach((element) => element.classList.add("will-reveal"));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

let toastTimer;

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
  const wasCopied = document.execCommand("copy");
  textarea.remove();

  if (!wasCopied) throw new Error("Copy command was rejected");
};

document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    const email = button.getAttribute("data-copy-email");
    if (!email) return;

    try {
      await copyText(email);
      showToast("邮箱已复制，期待与你交流。");
    } catch {
      showToast(`请手动复制邮箱：${email}`);
    }
  });
});

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
