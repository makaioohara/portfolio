import { onReady } from "./core/utils.js";
import { initHeader } from "./features/header.js";
import { initLoader } from "./features/loader.js";
import { initProjects } from "./features/projects.js";
import { initTextReveal } from "./features/textReveal.js";
import { initLenis } from "./features/lenis.js";
import { initSpinnerFade } from "./features/spinnerFade.js";
import { initPhotography } from "./features/photography.js";

onReady(() => {
  initLenis();
  initHeader();
  initLoader();
  initProjects();
  initTextReveal();
  initSpinnerFade();
  initPhotography();
});
