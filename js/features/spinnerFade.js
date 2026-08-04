export function initSpinnerFade() {
  const spinner = document.querySelector(".page-spinner");
  if (!spinner) {
    return;
  }

  const fadeStart = 0.65;
  const fadeEnd = 0.75;

  const updateSpinnerOpacity = () => {
    const doc = document.documentElement;
    const scrollTop = window.pageYOffset || doc.scrollTop;
    const scrollHeight = Math.max(doc.scrollHeight, document.body.scrollHeight);
    const clientHeight = doc.clientHeight;
    const maxScroll = Math.max(scrollHeight - clientHeight, 0);
    const ratio = maxScroll > 0 ? scrollTop / maxScroll : 0;

    if (ratio <= fadeStart) {
      spinner.style.opacity = "1";
      return;
    }

    const fadeProgress = Math.min(
      (ratio - fadeStart) / (fadeEnd - fadeStart),
      1,
    );
    spinner.style.opacity = String(1 - fadeProgress);
  };

  window.addEventListener("scroll", updateSpinnerOpacity, { passive: true });
  window.addEventListener("resize", updateSpinnerOpacity);
  updateSpinnerOpacity();
}
