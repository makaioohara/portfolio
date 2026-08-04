export function initLenis() {
  if (typeof window.Lenis !== "function") {
    return;
  }

  if (!window.__portfolioLenis) {
    window.__portfolioLenis = new window.Lenis({
      autoRaf: true,
      autoToggle: true,
      anchors: true,
      allowNestedScroll: true,
      naiveDimensions: true,
      stopInertiaOnNavigate: true,
    });
  }
}
