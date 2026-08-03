import { onReady } from "./core/utils.js";
import { initHeader } from "./features/header.js";
import { initLoader } from "./features/loader.js";
import { initProjects } from "./features/projects.js";
import { initPhotography } from "./features/photography.js";
import { initTextReveal } from "./features/textReveal.js";

function initLenis() {
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

onReady(() => {
  initLenis();
  initHeader();
  initLoader();
  initProjects();
  initPhotography();
  initTextReveal();
});
