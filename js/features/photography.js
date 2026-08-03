const SLIDE_DURATION = 6000;
let slideTimer = 0;
let currentSlideIndex = 0;

function getSlides() {
  return Array.from(
    document.querySelectorAll("#photography-slider .photography-slide"),
  );
}

function getControls() {
  return Array.from(document.querySelectorAll(".photography-section__control"));
}

function activateSlide(index) {
  const slides = getSlides();
  const controls = getControls();

  if (!slides.length || !controls.length) {
    return;
  }

  currentSlideIndex = index % slides.length;
  if (currentSlideIndex < 0) {
    currentSlideIndex += slides.length;
  }

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === currentSlideIndex;
    slide.classList.toggle("photography-slide--active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  controls.forEach((control, controlIndex) => {
    const isActive = controlIndex === currentSlideIndex;
    control.setAttribute("aria-pressed", String(isActive));
  });
}

function nextSlide() {
  activateSlide(currentSlideIndex + 1);
}

function scheduleSlideAdvance() {
  if (slideTimer) {
    window.clearTimeout(slideTimer);
  }

  slideTimer = window.setTimeout(() => {
    nextSlide();
    scheduleSlideAdvance();
  }, SLIDE_DURATION);
}

function setupPhotographyControls() {
  const controls = getControls();
  controls.forEach((control, index) => {
    control.addEventListener("click", () => {
      activateSlide(index);
      scheduleSlideAdvance();
    });
  });
}

export function initPhotography() {
  const slider = document.getElementById("photography-slider");
  if (!slider) {
    return;
  }

  activateSlide(0);
  setupPhotographyControls();
  scheduleSlideAdvance();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearTimeout(slideTimer);
      slideTimer = 0;
      return;
    }
    scheduleSlideAdvance();
  });
}
