export function initHeader() {
  const root = document.documentElement;
  const header = document.querySelector("header");
  const navMoreToggle = document.getElementById("nav-more-toggle");
  const navMoreMenu = document.getElementById("nav-more-menu");

  function syncHeaderHeight() {
    const headerHeight = header ? header.offsetHeight : 0;
    root.style.setProperty("--headersize", `${headerHeight}px`);
  }

  function setMenuState(isOpen) {
    if (!navMoreToggle || !navMoreMenu) {
      return;
    }

    navMoreToggle.setAttribute("aria-expanded", String(isOpen));
    navMoreToggle.setAttribute(
      "aria-label",
      isOpen ? "Close more navigation links" : "Open more navigation links"
    );
    navMoreMenu.hidden = !isOpen;
    navMoreMenu.classList.toggle("is-open", isOpen);
  }

  syncHeaderHeight();
  window.addEventListener("load", syncHeaderHeight);
  window.addEventListener("resize", syncHeaderHeight);

  setMenuState(false);

  navMoreToggle?.addEventListener("click", () => {
    const isOpen = navMoreToggle.getAttribute("aria-expanded") !== "true";
    setMenuState(isOpen);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-more")) {
      setMenuState(false);
    }
  });

  document.querySelectorAll(".nav-more-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    const isMenuOpen = navMoreToggle?.getAttribute("aria-expanded") === "true";

    if (event.key === "Escape" && isMenuOpen) {
      setMenuState(false);
      navMoreToggle.focus();
    }
  });
}
