export function initHeader() {
  const root = document.documentElement;
  const header = document.querySelector("header");
  const navList = document.querySelector(".header-nav__list");
  const navToggle = document.getElementById("header-nav-toggle");
  const navMoreToggle = document.getElementById("header-nav-more-toggle");
  const navMoreMenu = document.getElementById("header-nav-more-menu");
  const navMore = document.querySelector(".header-nav__more");
  const tabletMenuQuery = window.matchMedia("(max-width: 820px)");
  let resizeFrame = 0;

  function syncHeaderHeight() {
    const headerHeight = header ? header.offsetHeight : 0;
    root.style.setProperty("--headersize", `${headerHeight}px`);
  }

  function setMainMenuState(isOpen) {
    if (!navToggle) {
      return;
    }

    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
    navList?.classList.toggle("is-open", isOpen);

    if (!navMoreMenu) {
      return;
    }

    if (tabletMenuQuery.matches) {
      navMoreMenu.hidden = !isOpen;
      navMoreMenu.classList.toggle("is-open", isOpen);
      return;
    }

    if (!isOpen && navMoreToggle?.getAttribute("aria-expanded") !== "true") {
      navMoreMenu.classList.remove("is-open");
      window.setTimeout(() => {
        if (navMoreToggle?.getAttribute("aria-expanded") !== "true") {
          navMoreMenu.hidden = true;
        }
      }, 220);
    }
  }

  function setMoreMenuState(isOpen) {
    if (!navMoreToggle) {
      return;
    }

    navMoreToggle.setAttribute("aria-expanded", String(isOpen));
    navMoreToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );

    if (!navMoreMenu) {
      return;
    }

    if (isOpen) {
      navMoreMenu.hidden = false;
      window.requestAnimationFrame(() => {
        navMoreMenu.classList.add("is-open");
      });
      return;
    }

    navMoreMenu.classList.remove("is-open");
    window.setTimeout(() => {
      if (navMoreToggle?.getAttribute("aria-expanded") !== "true") {
        navMoreMenu.hidden = true;
      }
    }, 220);
  }

  function closeAllMenus() {
    setMainMenuState(false);
    setMoreMenuState(false);
  }

  function resetMenuState() {
    navList?.classList.remove("is-open");
    navMoreMenu?.classList.remove("is-open");
    if (navMoreMenu) {
      navMoreMenu.hidden = true;
    }

    navToggle?.setAttribute("aria-expanded", "false");
    navMoreToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation menu");
    navMoreToggle?.setAttribute("aria-label", "Open navigation menu");
  }

  function scheduleHeaderSync() {
    if (resizeFrame) {
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      syncHeaderHeight();
      resetMenuState();
    });
  }

  syncHeaderHeight();
  window.addEventListener("load", syncHeaderHeight, { once: true });
  window.addEventListener("resize", scheduleHeaderSync);

  resetMenuState();

  navToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = navToggle.getAttribute("aria-expanded") !== "true";
    setMainMenuState(isOpen);
    if (!isOpen) {
      setMoreMenuState(false);
    }
  });

  navMoreToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = navMoreToggle.getAttribute("aria-expanded") !== "true";
    setMoreMenuState(isOpen);
    if (isOpen) {
      setMainMenuState(true);
    }
  });

  tabletMenuQuery.addEventListener("change", () => {
    resetMenuState();
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const clickedInsideHeader = target.closest(".header-nav");
    if (!clickedInsideHeader) {
      resetMenuState();
      return;
    }

    if (
      !target.closest(".header-nav__list") &&
      !target.closest(".header-nav__more") &&
      !target.closest(".header-nav__toggle") &&
      !target.closest(".header-nav__more-toggle")
    ) {
      resetMenuState();
    }
  });

  navMoreMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      resetMenuState();
    });
  });

  navList?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      resetMenuState();
    });
  });

  document.addEventListener("keydown", (event) => {
    const isMainMenuOpen = navToggle?.getAttribute("aria-expanded") === "true";
    const isMoreMenuOpen =
      navMoreToggle?.getAttribute("aria-expanded") === "true";

    if (event.key === "Escape" && (isMainMenuOpen || isMoreMenuOpen)) {
      event.preventDefault();
      resetMenuState();
      navToggle?.focus();
    }
  });
}
