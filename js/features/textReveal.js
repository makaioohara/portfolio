import { prefersReducedMotion } from "../core/utils.js";

const WORD_CLASS = "reveal-word";
const TEXT_SELECTOR = ".reveal-text";
const TRIGGER_SELECTOR = ".reveal-section";

function wrapWords(textEl) {
  const rawText = textEl.textContent.trim();

  if (!rawText) {
    return [];
  }

  textEl.innerHTML = rawText
    .split(/\s+/)
    .map((word) => `<span class="${WORD_CLASS}">${word}</span>`)
    .join(" ");

  return textEl.querySelectorAll(`.${WORD_CLASS}`);
}

export function initTextReveal() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const textEls = document.querySelectorAll(TEXT_SELECTOR);

  if (!gsap || !ScrollTrigger || !textEls.length) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  textEls.forEach((textEl) => {
    const trigger = textEl.closest(TRIGGER_SELECTOR) ?? textEl;
    const wordSpans = wrapWords(textEl);

    if (!wordSpans.length) {
      return;
    }

    if (prefersReducedMotion()) {
      gsap.set(wordSpans, { color: "var(--white)" });
      return;
    }

    gsap.fromTo(
      wordSpans,
      { color: "rgba(255, 255, 255, 0.24)" },
      {
        color: "var(--white)",
        ease: "none",
        stagger: 0.1,
        duration: 0.5,
        scrollTrigger: {
          trigger,
          start: "top 40%",
          end: "bottom 98%",
          scrub: 1.5,
        },
      },
    );
  });
}
