const MIN_DISPLAY_MS = 2800;
const FORCE_DISMISS_MS = 6000;
const IMAGE_FADE_DELAY_MS = 380;
const CONTENT_REVEAL_DELAY_MS = 1950;
const ORB_STYLE_ID = "loader-orb-style";
const ORB_COLORS = [
  "rgba(255, 30, 55, 0.9)",
  "rgba(191, 22, 39, 0.75)",
  "rgba(255, 80, 100, 0.6)",
];

function ensureOrbStyles() {
  if (document.getElementById(ORB_STYLE_ID)) {
    return;
  }

  const orbStyle = document.createElement("style");
  orbStyle.id = ORB_STYLE_ID;
  orbStyle.textContent = `
    @keyframes orbBurst {
      0% { opacity: 0.9; transform: translate(0, 0) scale(1); }
      100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0.2); }
    }
  `;

  document.head.appendChild(orbStyle);
}

function fireOrbs(loader) {
  if (!loader) {
    return;
  }

  for (let i = 0; i < 10; i += 1) {
    const orb = document.createElement("div");
    const size = Math.random() * 10 + 5;
    const angle = Math.random() * 360;
    const distance = Math.random() * 120 + 60;
    const duration = Math.random() * 500 + 600;
    const delay = Math.random() * 120;
    const color = ORB_COLORS[Math.floor(Math.random() * ORB_COLORS.length)];
    const translateX = Math.cos((angle * Math.PI) / 180) * distance;
    const translateY = Math.sin((angle * Math.PI) / 180) * distance;

    orb.classList.add("loader-orb");
    orb.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, ${color} 0%, transparent 70%);
      animation: orbBurst ${duration}ms cubic-bezier(0.2, 0, 0.8, 1) ${delay}ms forwards;
      --tx: ${translateX}px;
      --ty: ${translateY}px;
    `;

    loader.appendChild(orb);
    setTimeout(() => orb.remove(), duration + delay + 100);
  }
}

export function initLoader() {
  const loader = document.getElementById("page-loader");
  const loaderImg = loader?.querySelector(".page-loader__image");
  const content = document.getElementById("page-content");

  ensureOrbStyles();

  let dismissed = false;
  const startTime = Date.now();

  function dismissLoader() {
    if (dismissed || !loader || !loaderImg) {
      return;
    }

    dismissed = true;
    fireOrbs(loader);
    loaderImg.classList.add("fade-out");

    setTimeout(() => {
      loader.classList.add("fade-out");
    }, IMAGE_FADE_DELAY_MS);

    setTimeout(() => {
      content?.classList.add("show");
    }, CONTENT_REVEAL_DELAY_MS);
  }

  window.addEventListener("load", () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
    setTimeout(dismissLoader, remaining);
  });

  setTimeout(dismissLoader, FORCE_DISMISS_MS);
}
