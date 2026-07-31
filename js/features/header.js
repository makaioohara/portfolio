export function initHeader() {
  const root = document.documentElement;
  const header = document.querySelector("header");
  const navList = document.querySelector(".header-nav__list");
  const navMoreToggle = document.getElementById("header-nav-more-toggle");
  const navMoreMenu = document.getElementById("header-nav-more-menu");
  const navMore = document.querySelector(".header-nav__more");

  function syncHeaderHeight() {
    const headerHeight = header ? header.offsetHeight : 0;
    root.style.setProperty("--headersize", `${headerHeight}px`);
  }

  function setMenuState(isOpen) {
    if (!navMoreToggle) {
      return;
    }

    navMoreToggle.setAttribute("aria-expanded", String(isOpen));
    navMoreToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );

    if (isOpen) {
      navMoreMenu?.classList.add("is-open");
      navList?.classList.add("is-open");
      navMoreMenu.hidden = false;
    } else {
      navMoreMenu?.classList.remove("is-open");
      navList?.classList.remove("is-open");
      navMoreMenu.hidden = true;
    }
  }

  syncHeaderHeight();
  window.addEventListener("load", syncHeaderHeight, { once: true });
  window.addEventListener("resize", syncHeaderHeight);

  setMenuState(false);

  navMoreToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = navMoreToggle.getAttribute("aria-expanded") !== "true";
    setMenuState(isOpen);
  });

  document.addEventListener("click", (event) => {
    if (
      (!navMore && !navList?.contains(event.target)) ||
      (navMore &&
        !event.target.closest(".header-nav__more") &&
        !event.target.closest(".header-nav__list"))
    ) {
      setMenuState(false);
    }
  });

  navMoreMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  navList?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    const isMenuOpen = navMoreToggle?.getAttribute("aria-expanded") === "true";

    if (event.key === "Escape" && isMenuOpen) {
      event.preventDefault();
      setMenuState(false);
      navMoreToggle?.focus();
    }
  });
}
