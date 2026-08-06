export function initPhotography() {
  const showcase = document.getElementById("section-portfolio-photo-showcase");

  if (!showcase) return;

  const paginatorButtons = showcase.querySelectorAll(
    ".portfolio-photo-showcase__dot",
  );

  const cards = showcase.querySelectorAll(".portfolio-photo-showcase__card");

  if (!paginatorButtons.length || !cards.length) return;

  let currentIndex = 0;
  let previousIndex = 0;
  let slideshowInterval;

  const SLIDESHOW_INTERVAL = 8000;

  paginatorButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (index === currentIndex) return;

      const targetPhoto = button.dataset.photoTarget;

      previousIndex = currentIndex;
      currentIndex = index;

      switchToCard(targetPhoto);
      updatePaginator(targetPhoto);

      resetSlideshow();
    });
  });

  const firstPhoto = paginatorButtons[0].dataset.photoTarget;

  switchToCard(firstPhoto);
  updatePaginator(firstPhoto);

  startSlideshow();

  function startSlideshow() {
    slideshowInterval = setInterval(() => {
      previousIndex = currentIndex;
      currentIndex = (currentIndex + 1) % paginatorButtons.length;

      const targetPhoto = paginatorButtons[currentIndex].dataset.photoTarget;

      switchToCard(targetPhoto);
      updatePaginator(targetPhoto);
    }, SLIDESHOW_INTERVAL);
  }

  function resetSlideshow() {
    clearInterval(slideshowInterval);
    startSlideshow();
  }

  function switchToCard(photoId) {
    const direction = currentIndex > previousIndex ? "right" : "left";

    cards.forEach((card) => {
      const cardPhoto = card.dataset.photo;

      if (cardPhoto === photoId) {
        card.classList.add("portfolio-photo-showcase__card--active");
        card.setAttribute("data-slide-direction", direction);
        card.setAttribute("aria-hidden", "false");

        const metaGrid = card.querySelector(
          ".portfolio-photo-showcase__card-meta-grid",
        );

        if (metaGrid) {
          animateMetaDecode(metaGrid);
        }
      } else {
        card.classList.remove("portfolio-photo-showcase__card--active");
        card.removeAttribute("data-slide-direction");
        card.setAttribute("aria-hidden", "true");
      }
    });
  }

  function updatePaginator(photoId) {
    paginatorButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        button.dataset.photoTarget === photoId,
      );
    });
  }

  function animateMetaDecode(metaGrid) {
    if (metaGrid.dataset.decoding === "true") return;

    metaGrid.dataset.decoding = "true";

    const card = metaGrid.closest(".portfolio-photo-showcase__card-content");

    if (!card) return;

    // Skip animating the description element; only animate strong elements.
    const strongElements = metaGrid.querySelectorAll("strong");

    strongElements.forEach((element, index) => {
      animateTextTypewriter(element, index);
    });
  }

  function animateTextTypewriter(textEl, elementIndex) {
    gsap.killTweensOf(textEl);

    const originalText = textEl.dataset.originalText || textEl.textContent;
    textEl.dataset.originalText = originalText;

    const delay = elementIndex * 0.08;
    const charsLength = originalText.length;

    const state = { progress: 0 };

    const caret = document.createElement("span");
    caret.className = "portfolio-typewriter-caret";

    gsap.to(state, {
      progress: charsLength,
      duration: Math.min(charsLength * 0.04, 1),
      delay,
      ease: "power2.out",

      onStart() {
        textEl.setAttribute("aria-live", "polite");
      },

      onUpdate() {
        const revealCount = Math.floor(state.progress);
        textEl.textContent = originalText.slice(0, revealCount);
        textEl.appendChild(caret);
      },

      onComplete() {
        textEl.textContent = originalText;
        if (caret.parentNode) caret.parentNode.removeChild(caret);

        const parentGrid = textEl.closest(
          ".portfolio-photo-showcase__card-meta-grid",
        );

        if (parentGrid) {
          parentGrid.dataset.decoding = "false";
        }
      },
    });
  }
}
