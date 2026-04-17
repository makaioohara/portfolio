import { initHeader } from "./features/header.js";
import { initLoader } from "./features/loader.js";
import { initProjects } from "./features/projects.js";

function initLenis() {
  if (typeof window.Lenis !== "function") {
    return;
  }

  new window.Lenis({
    autoRaf: true,
    autoToggle: true,
    anchors: true,
    allowNestedScroll: true,
    naiveDimensions: true,
    stopInertiaOnNavigate: true,
  });
}

initLenis();
initHeader();
initLoader();
initProjects();
