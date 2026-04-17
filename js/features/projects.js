const projects = [
  {
    title: "Breast Cancer AI",
    sub: "Deep Learning model for mammography based cancer detection.",
    tag: "Pytorch, CNN",
    num: "NEW",
    bg: "assets/images/Project-BreastCancer.png",
  },
  {
    title: "Weather Dashboard",
    sub: "Real-time data visualization",
    tag: "Vue / D3.js",
    num: " ",
    bg: "https://images.unsplash.com/photo-1504608524841-42584120d693?w=600&q=80",
  },
];

let projectsResizeObserver;

function createCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";
  card.setAttribute("aria-label", `${project.num}. ${project.title}`);

  card.innerHTML = `
    <div class="project-card-bg" style="background-image: url('${project.bg}')"></div>
    <div class="project-card-overlay"></div>
    <div class="project-card-num">${project.num}</div>
    <div class="project-card-content">
      <span class="project-card-tag">${project.tag}</span>
      <p class="project-card-title">${project.title}</p>
      <p class="project-card-sub">${project.sub}</p>
    </div>
  `;

  return card;
}

function createProjectGroup(projectList, isClone = false) {
  const group = document.createElement("div");
  group.className = "projects-group";
  group.setAttribute("aria-hidden", String(isClone));

  projectList.forEach((project) => {
    group.appendChild(createCard(project));
  });

  return group;
}

function syncLoopDistance(track, group) {
  track.style.setProperty("--projects-loop-distance", `${group.scrollWidth}px`);
}

export function initProjects() {
  const track = document.getElementById("projects-track");
  if (!track) {
    return;
  }

  track.replaceChildren();

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    track.style.removeProperty("--projects-loop-distance");
    projectsResizeObserver?.disconnect();
    track.appendChild(createProjectGroup(projects));
    return;
  }

  const firstGroup = createProjectGroup(projects);
  const secondGroup = createProjectGroup(projects, true);

  track.append(firstGroup, secondGroup);
  syncLoopDistance(track, firstGroup);

  projectsResizeObserver?.disconnect();
  projectsResizeObserver = new ResizeObserver(() => {
    syncLoopDistance(track, firstGroup);
  });
  projectsResizeObserver.observe(firstGroup);
}

export const initProject = initProjects;
