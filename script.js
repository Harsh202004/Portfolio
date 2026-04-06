// GSAP plugin registration
gsap.registerPlugin(ScrollTrigger);

// Core DOM references
const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-link");
const typewriterTarget = document.getElementById("typewriter");
const skillRows = document.querySelectorAll(".skill-row");
const sections = document.querySelectorAll("main section[id]");
const cursorDot = document.querySelector(".cursor-dot");
const cursorTrail = document.querySelector(".cursor-trail");
const themeToggle = document.querySelector(".theme-toggle");
const projectsGrid = document.getElementById("projects-grid");
const loadingScreen = document.querySelector(".loading-screen");
const loaderProgress = document.querySelector(".loader-progress");
const loaderPercent = document.querySelector(".loader-percent");
const projectsFallback = document.getElementById("projects-fallback");

const heroName = "Harsha R Hutagi";
let typeIndex = 0;

// Hero typewriter animation
function runTypewriter() {
  if (typeIndex <= heroName.length) {
    typewriterTarget.textContent = heroName.slice(0, typeIndex);
    typeIndex += 1;
    setTimeout(runTypewriter, typeIndex === heroName.length + 1 ? 450 : 110);
  }
}

// Loading screen animation
function initLoader() {
  const loaderState = { value: 0 };

  gsap.to(loaderState, {
    value: 100,
    duration: 2.2,
    ease: "power2.out",
    onUpdate: () => {
      const current = Math.round(loaderState.value);
      loaderProgress.style.width = `${current}%`;
      loaderPercent.textContent = `${current}%`;
    },
    onComplete: () => {
      gsap.to(loadingScreen, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => loadingScreen.classList.add("is-hidden")
      });
    }
  });
}

// Dark and light theme handling
function initTheme() {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
  }

  themeToggle.addEventListener("click", () => {
    const isLight = body.classList.toggle("light-mode");
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  });
}

// Custom glowing cursor
function initCursor() {
  if (window.innerWidth <= 760) return;

  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const trail = { x: pointer.x, y: pointer.y };

  window.addEventListener("mousemove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    cursorDot.style.transform = `translate3d(${pointer.x - 5}px, ${pointer.y - 5}px, 0)`;
  });

  function animateTrail() {
    trail.x += (pointer.x - trail.x) * 0.15;
    trail.y += (pointer.y - trail.y) * 0.15;
    cursorTrail.style.transform = `translate3d(${trail.x - 17}px, ${trail.y - 17}px, 0)`;
    requestAnimationFrame(animateTrail);
  }

  animateTrail();
}

// Mobile navigation toggle
function initMenu() {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("menu-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Projects section rendering from JSON
async function loadProjects() {
  let projects;

  try {
    const response = await fetch("./projects.json");
    projects = await response.json();
  } catch (error) {
    projects = JSON.parse(projectsFallback.textContent);
  }

  projectsGrid.innerHTML = projects.map((project, index) => `
    <article class="project-card glass-card tilt-card">
      <div class="project-top">
        <p class="project-index">${String(index + 1).padStart(2, "0")}</p>
        <h3>${project.name}</h3>
      </div>
      <div class="tag-list">
        ${project.stack.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
      <p>${project.description}</p>
      <div class="project-links">
        <a href="${project.github}" target="_blank" rel="noreferrer" aria-label="${project.name} GitHub">GitHub</a>
        <a href="${project.live}" target="_blank" rel="noreferrer" aria-label="${project.name} Live Demo">Live</a>
      </div>
    </article>
  `).join("");
}

// Active nav link detection
function initSectionObserver() {
  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onToggle: ({ isActive }) => {
        if (!isActive) return;
        navLinks.forEach((link) => {
          const isMatch = link.getAttribute("href") === `#${section.id}`;
          link.classList.toggle("active", isMatch);
        });
      }
    });
  });
}

// Page load and scroll-triggered reveals
function initAnimations() {
  gsap.to(".load-reveal", {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.14,
    ease: "power3.out",
    delay: 0.25
  });

  gsap.fromTo(".reveal-left", { x: -80, opacity: 0 }, {
    x: 0,
    opacity: 1,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".about-grid", start: "top 75%" }
  });

  gsap.fromTo(".reveal-right", { x: 80, opacity: 0 }, {
    x: 0,
    opacity: 1,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".about-grid", start: "top 75%" }
  });

  gsap.fromTo(".terminal-card", { y: 60, opacity: 0 }, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".terminal-card", start: "top 80%" }
  });
}

// Project card animation after JSON render
function initProjectAnimations() {
  gsap.utils.toArray(".project-card").forEach((card, index) => {
    gsap.fromTo(card, { y: 60, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      delay: index * 0.08,
      scrollTrigger: {
        trigger: card,
        start: "top 88%"
      }
    });
  });
}

// Skills progress animation
function initSkillBars() {
  const skillsPanel = document.querySelector(".skills-panel");

  ScrollTrigger.create({
    trigger: skillsPanel,
    start: "top 75%",
    once: true,
    onEnter: () => {
      skillRows.forEach((row, index) => {
        const fill = row.querySelector(".skill-fill");
        const level = row.dataset.level;
        gsap.to(fill, {
          width: level,
          duration: 1,
          delay: index * 0.12,
          ease: "power2.out"
        });
      });
    }
  });
}

// 3D hover tilt for project cards
function initTiltCards() {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const rotateY = ((offsetX / rect.width) - 0.5) * 14;
      const rotateX = (0.5 - (offsetY / rect.height)) * 14;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
}

// Hero Three.js particle field, wireframe icosahedron, and click shooting stars
function initHeroScene() {
  const canvas = document.getElementById("hero-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 13;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 80;
    positions[i + 1] = (Math.random() - 0.5) * 80;
    positions[i + 2] = (Math.random() - 0.5) * 80;
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x00ffcc,
    size: 0.06,
    transparent: true,
    opacity: 0.8
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const icosahedron = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.3, 0),
    new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true })
  );

  const glow = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.45, 0),
    new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.08 })
  );

  scene.add(icosahedron, glow);
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const clickPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const shootingStars = [];

  function createShootingStar(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const origin = new THREE.Vector3();
    raycaster.ray.intersectPlane(clickPlane, origin);

    const direction = new THREE.Vector3(2.2 + Math.random() * 2.4, -1.1 - Math.random() * 1.5, 0);
    const trailPoints = [origin.clone(), origin.clone().sub(direction.clone().multiplyScalar(0.6))];
    const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95
    });
    const trail = new THREE.Line(trailGeometry, trailMaterial);

    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    star.position.copy(origin);
    trail.position.set(0, 0, 0);
    scene.add(trail, star);

    shootingStars.push({
      star,
      trail,
      velocity: direction.multiplyScalar(0.06),
      life: 1
    });
  }

  canvas.addEventListener("click", createShootingStar);

  function updateShootingStars() {
    for (let i = shootingStars.length - 1; i >= 0; i -= 1) {
      const item = shootingStars[i];
      item.star.position.add(item.velocity);
      item.life -= 0.02;
      item.star.material.opacity = item.life;
      item.star.material.transparent = true;
      item.trail.material.opacity = item.life * 0.85;

      const head = item.star.position.clone();
      const tail = head.clone().sub(item.velocity.clone().multiplyScalar(8));
      item.trail.geometry.setFromPoints([head, tail]);

      if (item.life <= 0) {
        scene.remove(item.star, item.trail);
        item.star.geometry.dispose();
        item.star.material.dispose();
        item.trail.geometry.dispose();
        item.trail.material.dispose();
        shootingStars.splice(i, 1);
      }
    }
  }

  function renderHero() {
    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.00035;
    icosahedron.rotation.x += 0.003;
    icosahedron.rotation.y += 0.004;
    glow.rotation.x -= 0.0024;
    glow.rotation.y -= 0.0032;
    updateShootingStars();
    renderer.render(scene, camera);
    requestAnimationFrame(renderHero);
  }

  renderHero();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// About section Three.js rotating skill cube
function initAboutScene() {
  const canvas = document.getElementById("about-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 4.3;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const emojis = ["\u{1F4BB}", "\u269B\uFE0F", "\u{1F40D}", "\u{1F9E0}", "\u{1F6E0}\uFE0F", "\u{1F4CA}"];

  function createFaceTexture(emoji, background, accent) {
    const faceCanvas = document.createElement("canvas");
    faceCanvas.width = 512;
    faceCanvas.height = 512;
    const ctx = faceCanvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, background);
    gradient.addColorStop(1, "#050505");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 12;
    ctx.strokeRect(24, 24, 464, 464);

    ctx.font = "190px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 256, 240);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Space Mono, monospace";
    ctx.fillText("SKILL", 256, 410);

    return new THREE.CanvasTexture(faceCanvas);
  }

  const faceMaterials = emojis.map((emoji, index) => {
    const accent = index % 2 === 0 ? "#00ffcc" : "#a855f7";
    const bg = index % 2 === 0 ? "#042521" : "#1a0927";

    return new THREE.MeshStandardMaterial({
      map: createFaceTexture(emoji, bg, accent),
      emissive: new THREE.Color(accent),
      emissiveIntensity: 0.2,
      roughness: 0.4,
      metalness: 0.2
    });
  });

  const cube = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.9, 1.9), faceMaterials);
  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  const pointLight = new THREE.PointLight(0x00ffcc, 2.2, 20);
  const pointLightSecondary = new THREE.PointLight(0xa855f7, 1.8, 20);

  pointLight.position.set(3, 3, 5);
  pointLightSecondary.position.set(-3, -2, 4);
  scene.add(cube, ambient, pointLight, pointLightSecondary);

  function renderCube() {
    cube.rotation.x += 0.008;
    cube.rotation.y += 0.011;
    renderer.render(scene, camera);
    requestAnimationFrame(renderCube);
  }

  renderCube();

  const resizeAbout = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  window.addEventListener("resize", resizeAbout);
  resizeAbout();
}

// Smooth anchor scrolling with header offset
function initAnchorScroll() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    });
  });
}

// Terminal contact form interaction
function initForm() {
  const form = document.querySelector(".terminal-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector(".terminal-btn");
    button.textContent = "[MESSAGE_SENT.exe]";

    gsap.fromTo(button, { boxShadow: "0 0 0 rgba(125, 255, 141, 0)" }, {
      boxShadow: "0 0 25px rgba(125, 255, 141, 0.35)",
      duration: 0.5,
      repeat: 1,
      yoyo: true
    });

    form.reset();
  });
}

// App boot sequence
window.addEventListener("load", async () => {
  initLoader();
  initTheme();
  await loadProjects();
  runTypewriter();
  initCursor();
  initMenu();
  initSectionObserver();
  initAnimations();
  initProjectAnimations();
  initSkillBars();
  initTiltCards();
  initHeroScene();
  initAboutScene();
  initAnchorScroll();
  initForm();
});
