import { prefersReducedMotion } from "../core/utils.js";

const projects = [
  {
    title: "Breast Cancer AI",
    sub: "Deep Learning model for mammography based cancer detection.",
    tag: "Pytorch, CNN",
    num: "NEW",
    bg: "assets/images/Project-BreastCancer.png",
  },
  {
    title: "Game Server",
    sub: "Multiplayer game server for minecraft using Java and MySQL.",
    tag: "Java, MySQL",
    num: " ",
    bg: "assets/images/Project-Game.png",
  },
];

const PROJECTS_GAP = 16;
let projectsResizeObserver;

function preloadBackground(bgElement, imageUrl) {
  if (!bgElement || !imageUrl) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      bgElement.style.backgroundImage = `url('${imageUrl}')`;
      resolve();
    };
    image.onerror = () => {
      bgElement.style.backgroundImage =
        "linear-gradient(135deg, rgba(255, 122, 0, 0.24), rgba(0, 0, 0, 0.9))";
      resolve();
    };
    image.src = imageUrl;
  });
}

function createCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";
  card.setAttribute("aria-label", `${project.num}. ${project.title}`);

  card.innerHTML = `
    <div class="project-card__bg"></div>
    <div class="project-card__overlay"></div>
    <div class="project-card__num">${project.num}</div>
    <div class="project-card__content">
      <span class="project-card__tag">${project.tag}</span>
      <p class="project-card__title">${project.title}</p>
      <p class="project-card__subtitle">${project.sub}</p>
    </div>
  `;

  return card;
}

async function createProjectGroup(projectList, isClone = false) {
  const group = document.createElement("div");
  group.className = "projects-section__group";
  group.setAttribute("aria-hidden", String(isClone));

  const preloadTasks = projectList.map((project) => {
    const card = createCard(project);
    group.appendChild(card);
    const bgElement = card.querySelector(".project-card__bg");
    return preloadBackground(bgElement, project.bg);
  });

  await Promise.all(preloadTasks);
  return group;
}

function syncLoopDistance(track, group) {
  const gap = Number.parseFloat(
    getComputedStyle(track).columnGap ||
      getComputedStyle(track).gap ||
      PROJECTS_GAP,
  );
  const distance = group.getBoundingClientRect().width + gap;
  track.style.setProperty("--projects-loop-distance", `${distance}px`);
}

function scheduleLoopSync(track, group) {
  window.requestAnimationFrame(() => {
    syncLoopDistance(track, group);
  });

  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(() => {
      syncLoopDistance(track, group);
    });
  }
}

export async function initProjects() {
  const track = document.getElementById("projects-carousel-track");
  if (!track) {
    return;
  }

  track.replaceChildren();

  if (prefersReducedMotion()) {
    track.style.removeProperty("--projects-loop-distance");
    projectsResizeObserver?.disconnect();
    track.appendChild(await createProjectGroup(projects));
    return;
  }

  const firstGroup = await createProjectGroup(projects);

  track.append(firstGroup);

  while (track.scrollWidth < window.innerWidth * 2) {
    const cloneGroup = await createProjectGroup(projects, true);
    track.appendChild(cloneGroup);
  }

  scheduleLoopSync(track, firstGroup);
  track.classList.add("projects-section__track--ready");

  projectsResizeObserver?.disconnect();
  projectsResizeObserver = new ResizeObserver(() => {
    syncLoopDistance(track, firstGroup);
  });
  projectsResizeObserver.observe(firstGroup);

  window.addEventListener(
    "load",
    () => {
      syncLoopDistance(track, firstGroup);
    },
    { once: true },
  );
}

export const initProject = initProjects;
