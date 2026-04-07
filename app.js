/* Extracted from index.html */
/* ============================
       Config + Utilities
    ============================ */
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = () => window.innerWidth < 768;
    const responsiveParticleCount = () => {
      if (isMobile()) return 500;
      return window.devicePixelRatio > 1.5 ? 1800 : 3000;
    };

    const scenes = {};

    function clamp(num, min, max) {
      return Math.min(Math.max(num, min), max);
    }

    function createRipple(event, element) {
      const rect = element.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.style.position = "absolute";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = event.clientX - rect.left - size / 2 + "px";
      ripple.style.top = event.clientY - rect.top - size / 2 + "px";
      ripple.style.borderRadius = "50%";
      ripple.style.background = "rgba(255,255,255,0.35)";
      ripple.style.transform = "scale(0)";
      ripple.style.opacity = "0.8";
      ripple.style.pointerEvents = "none";
      element.appendChild(ripple);
      gsap.to(ripple, {
        scale: 5,
        opacity: 0,
        duration: 0.65,
        ease: "power2.out",
        onComplete: () => ripple.remove()
      });
    }

    /* ============================
       Loader Sequence
    ============================ */
    function initLoader() {
      const loader = document.getElementById("loader");
      const progressBar = document.getElementById("loader-progress");
      const percent = document.getElementById("loader-percent");
      const state = { value: 0 };

      gsap.to(state, {
        value: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          const val = Math.round(state.value);
          progressBar.style.transform = `scaleX(${val / 100})`;
          percent.textContent = val + "%";
        },
        onComplete: () => {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              loader.style.display = "none";
              document.body.classList.add("loaded");
              gsap.fromTo("#navbar-wrap", { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
              initGlitchName();
              initTypewriterRoles();
            }
          });
        }
      });
    }

    /* ============================
       Cursor
    ============================ */
    function initCursor() {
      if (isMobile()) return;
      const dot = document.querySelector(".cursor-dot");
      const ring = document.querySelector(".cursor-ring");
      const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const ringPos = { x: mouse.x, y: mouse.y };

      window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        dot.style.transform = `translate3d(${mouse.x - 5}px, ${mouse.y - 5}px, 0)`;
      });

      const tick = () => {
        ringPos.x += (mouse.x - ringPos.x) * 0.16;
        ringPos.y += (mouse.y - ringPos.y) * 0.16;
        ring.style.transform = `translate3d(${ringPos.x - 15}px, ${ringPos.y - 15}px, 0)`;
        requestAnimationFrame(tick);
      };
      tick();
    }

    /* ============================
       Hero Text Animations
    ============================ */
    function initGlitchName() {
      const heroName = document.getElementById("hero-name");
      const original = "Harsha Rajesh Hutagi";
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!*";
      let iteration = 0;

      const interval = setInterval(() => {
        heroName.textContent = original
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return original[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        iteration += 0.5;
        if (iteration >= original.length) {
          heroName.textContent = original;
          clearInterval(interval);
        }
      }, 45);
    }

    function initTypewriterRoles() {
      const roles = ["Software Developer", "Full-Stack Developer", "SDE Fresher (2026)", "Java | Python | MERN"];
      const target = document.getElementById("hero-role");
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;
      let holdTicks = 0;

      const interval = setInterval(() => {
        const current = roles[roleIndex];
        target.textContent = `// ${current.slice(0, charIndex)}`;

        if (!deleting && charIndex < current.length) {
          charIndex += 1;
          return;
        }

        if (!deleting && charIndex === current.length) {
          holdTicks += 1;
          if (holdTicks < 10) return;
          holdTicks = 0;
          deleting = true;
          return;
        }

        if (deleting && charIndex > 0) {
          charIndex -= 1;
          return;
        }

        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        if (!document.body.contains(target)) {
          clearInterval(interval);
        }
      }, 90);
    }

    /* ============================
       Navbar + Menu
    ============================ */
    function initNav() {
      const menuBtn = document.getElementById("menu-btn");
      const mobileMenu = document.getElementById("mobile-menu");
      const navWrap = document.getElementById("navbar-wrap");
      const navbar = navWrap.querySelector(".navbar");
      const navLinks = [...document.querySelectorAll(".nav-link")];
      const mobileLinks = [...document.querySelectorAll(".mobile-nav a")];
      const indicator = document.getElementById("nav-indicator");
      let lastScroll = window.scrollY;
      navbar.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      function moveIndicator(link) {
        const nav = document.getElementById("nav-links");
        if (!link || !nav || isMobile()) return;
        indicator.style.width = `${link.offsetWidth - 28}px`;
        indicator.style.transform = `translateX(${link.offsetLeft + 14}px)`;
      }

      menuBtn.addEventListener("click", () => {
        menuBtn.classList.toggle("open");
        mobileMenu.classList.toggle("open");
        document.body.classList.toggle("menu-open");
      });

      mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.remove("open");
          menuBtn.classList.remove("open");
          document.body.classList.remove("menu-open");
        });
      });

      const sections = [...document.querySelectorAll("section[id]")];
      sections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          fastScrollEnd: true,
          preventOverlaps: true,
          onToggle: ({ isActive }) => {
            if (!isActive) return;
            const active = navLinks.find((link) => link.getAttribute("href") === `#${section.id}`);
            navLinks.forEach((link) => link.classList.toggle("active", link === active));
            moveIndicator(active);
          }
        });
      });

      window.addEventListener("scroll", () => {
        const current = window.scrollY;
        if (current > lastScroll && current > 120 && !document.body.classList.contains("menu-open")) {
          navbar.style.transform = "translateY(-100%)";
        } else {
          navbar.style.transform = "translateY(0)";
        }
        lastScroll = current;
      });

      window.addEventListener("resize", () => {
        const active = document.querySelector(".nav-link.active");
        moveIndicator(active);
      });

      setTimeout(() => moveIndicator(document.querySelector(".nav-link.active")), 100);
    }

    /* ============================
       Hero Three.js Scene
    ============================ */
    function initHeroScene() {
      if (scenes.hero || !window.THREE) return;
      const canvas = document.getElementById("hero-canvas");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 18;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setAnimationLoop(animate);

      const count = reduceMotion ? 0 : responsiveParticleCount();
      const galaxyGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const original = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 14;
        const branchAngle = radius * 1.35 + Math.random() * 1.6;
        const spin = Math.sin(branchAngle) * radius;
        const spread = (Math.random() - 0.5) * 1.4;
        const x = Math.cos(branchAngle) * radius + spread;
        const y = (Math.random() - 0.5) * 2.8;
        const z = Math.sin(branchAngle) * radius + spin * 0.12;
        positions[i3] = original[i3] = x;
        positions[i3 + 1] = original[i3 + 1] = y;
        positions[i3 + 2] = original[i3 + 2] = z;

        const mix = Math.random();
        if (mix < 0.6) {
          colors[i3] = 56 / 255;
          colors[i3 + 1] = 189 / 255;
          colors[i3 + 2] = 248 / 255;
        } else {
          colors[i3] = 129 / 255;
          colors[i3 + 1] = 140 / 255;
          colors[i3 + 2] = 248 / 255;
        }
      }

      galaxyGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      galaxyGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const points = new THREE.Points(
        galaxyGeometry,
        new THREE.PointsMaterial({
          size: isMobile() ? 0.045 : 0.06,
          vertexColors: true,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );

      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(3.2, 1.02, 180, 26),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          wireframe: true,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.25
        })
      );

      const light = new THREE.PointLight(0x38bdf8, 2, 4);
      light.position.set(0, 0, 0);
      const spriteMat = new THREE.SpriteMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(3, 3, 1);
      const ambient = new THREE.AmbientLight(0xffffff, 0.55);
      scene.add(points, knot, light, sprite, ambient);

      const mouse = { x: 9999, y: 9999 };
      window.addEventListener("mousemove", (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      });

      let last = performance.now();
      function animate(now = performance.now()) {
        const delta = Math.min((now - last) / 1000, 0.033);
        last = now;
        if (!reduceMotion && count) {
          const attr = galaxyGeometry.attributes.position.array;
          for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const ox = original[i3];
            const oy = original[i3 + 1];
            const nx = ox / 15;
            const ny = oy / 8;
            const dx = nx - mouse.x;
            const dy = ny - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repel = Math.max(0, 1 - dist * 2.4);
            attr[i3] += ((ox + dx * repel * 1.6) - attr[i3]) * 0.07;
            attr[i3 + 1] += ((oy + dy * repel * 0.8) - attr[i3 + 1]) * 0.07;
            attr[i3 + 2] += ((original[i3 + 2] + repel * 0.5) - attr[i3 + 2]) * 0.07;
          }
          galaxyGeometry.attributes.position.needsUpdate = true;
        }
        points.rotation.y += delta * 0.08;
        points.rotation.x += delta * 0.015;
        knot.rotation.x += delta * 0.28;
        knot.rotation.y += delta * 0.34;
        renderer.render(scene, camera);
      }

      scenes.hero = { renderer, camera, scene };

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }

    /* ============================
       About Cube Scene
    ============================ */
    function initAboutScene() {
      if (scenes.about || !window.THREE) return;
      const canvas = document.getElementById("about-canvas");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.z = 4.5;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      renderer.setAnimationLoop(render);

      const faceThemes = [
        { a: "#38bdf8", b: "#0f172a" },
        { a: "#22d3ee", b: "#020617" },
        { a: "#60a5fa", b: "#111827" },
        { a: "#0ea5e9", b: "#030712" },
        { a: "#06b6d4", b: "#0b1120" },
        { a: "#3b82f6", b: "#020617" }
      ];

      const materials = faceThemes.map((theme, index) => {
        const c = document.createElement("canvas");
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext("2d");
        const grad = ctx.createLinearGradient(0, 0, 512, 512);
        grad.addColorStop(0, theme.b);
        grad.addColorStop(1, "#02040a");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Subtle texture to keep faces dynamic without text.
        ctx.globalAlpha = 0.14;
        for (let y = 0; y < 512; y += 8) {
          ctx.fillStyle = y % 16 === 0 ? "#0b2440" : "#020617";
          ctx.fillRect(0, y, 512, 2);
        }
        ctx.globalAlpha = 1;

        ctx.strokeStyle = theme.a;
        ctx.lineWidth = 12;
        ctx.strokeRect(24, 24, 464, 464);

        ctx.shadowColor = theme.a;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = theme.a;
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(90, 390 - index * 8);
        ctx.bezierCurveTo(170, 120 + index * 6, 320, 420 - index * 4, 420, 130 + index * 8);
        ctx.stroke();

        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(256, 256, 86 + index * 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(256, 256, 136 + index * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        return new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(c) });
      });

      const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), materials);
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(2.02, 2.02, 2.02)),
        new THREE.LineBasicMaterial({ color: 0x38bdf8 })
      );
      cube.add(edges);
      scene.add(cube);
      scene.add(new THREE.AmbientLight(0xffffff, 0.9));
      const point = new THREE.PointLight(0x38bdf8, 0.8, 20);
      point.position.set(3, 3, 4);
      scene.add(point);

      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      canvas.addEventListener("pointerdown", (e) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
      });
      window.addEventListener("pointerup", () => dragging = false);
      window.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        cube.rotation.y += (e.clientX - lastX) * 0.01;
        cube.rotation.x += (e.clientY - lastY) * 0.01;
        lastX = e.clientX;
        lastY = e.clientY;
      });

      function render() {
        if (!dragging && !reduceMotion) {
          cube.rotation.x += 0.005;
          cube.rotation.y += 0.008;
        }
        renderer.render(scene, camera);
      }

      scenes.about = { renderer, camera, scene };

      const resize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      window.addEventListener("resize", resize);
    }

    /* ============================
       Contact Starfield
    ============================ */
    function initContactScene() {
      if (scenes.contact || !window.THREE) return;
      const canvas = document.getElementById("contact-canvas");
      const section = document.getElementById("contact");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, section.clientWidth / section.clientHeight, 0.1, 1000);
      camera.position.z = 16;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.setSize(section.clientWidth, section.clientHeight);
      renderer.setAnimationLoop(render);

      const count = isMobile() ? 300 : 900;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 36;
        positions[i + 1] = (Math.random() - 0.5) * 18;
        positions[i + 2] = (Math.random() - 0.5) * 20;
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const stars = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          color: 0x38bdf8,
          size: 0.05,
          transparent: true,
          opacity: 0.75
        })
      );
      scene.add(stars);
      scene.add(new THREE.AmbientLight(0xffffff, 0.7));

      function render() {
        stars.rotation.y += 0.0008;
        stars.rotation.x += 0.00025;
        renderer.render(scene, camera);
      }

      scenes.contact = { renderer, camera, scene };

      window.addEventListener("resize", () => {
        camera.aspect = section.clientWidth / section.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(section.clientWidth, section.clientHeight);
      });
    }

    /* ============================
       Lazy Scene Init
    ============================ */
    function initLazyScenes() {
      initHeroScene();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target.id === "about") initAboutScene();
          if (entry.target.id === "contact") initContactScene();
        });
      }, { threshold: 0.2 });

      observer.observe(document.getElementById("about"));
      observer.observe(document.getElementById("contact"));
    }

    /* ============================
       GSAP Section Animation
    ============================ */
    function initAnimations() {
      if (reduceMotion) return;

      gsap.utils.toArray(".section-title, .section-copy, .about-text p, .stat-card, .skill-category, .timeline-entry, .terminal, .social-pill, .gallery-card").forEach((el, index) => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          delay: index * 0.02,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            fastScrollEnd: true,
            preventOverlaps: true
          }
        });
      });

      initProjectsScroll();
      initSkillBars();
      initCounters();
      initTimelineSlides();
    }

    function initProjectsScroll() {
      const projectsSection = document.querySelector("#projects");
      const track = document.getElementById("projects-track");
      if (isMobile()) {
        gsap.utils.toArray(".project-card").forEach((card) => {
          gsap.fromTo(card, { y: 50, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              fastScrollEnd: true,
              preventOverlaps: true
            }
          });
        });
        return;
      }

      const totalScroll = () => Math.max(track.scrollWidth - window.innerWidth, 0);
      if (totalScroll() <= 0) {
        gsap.set(track, { x: 0 });
        return;
      }

      gsap.to(track, {
        x: () => -totalScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: projectsSection,
          start: "top top",
          end: () => "+=" + Math.max(totalScroll(), projectsSection.offsetWidth),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
          fastScrollEnd: true,
          preventOverlaps: true,
          invalidateOnRefresh: true
        }
      });
    }

    function initSkillBars() {
      const rows = document.querySelectorAll(".skill-row");
      ScrollTrigger.create({
        trigger: "#skills",
        start: "top 70%",
        once: true,
        fastScrollEnd: true,
        preventOverlaps: true,
        onEnter: () => {
          rows.forEach((row, idx) => {
            const target = Number(row.dataset.skill);
            const fill = row.querySelector(".skill-fill");
            const count = row.querySelector(".skill-count");
            gsap.to(fill, {
              width: `${target}%`,
              duration: 1.2,
              delay: idx * 0.08,
              ease: "elastic.out(1, 0.6)"
            });
            gsap.to({ val: 0 }, {
              val: target,
              duration: 1.2,
              delay: idx * 0.08,
              ease: "power2.out",
              onUpdate() {
                count.textContent = `${Math.round(this.targets()[0].val)}%`;
              }
            });
          });
        }
      });
    }

    function initCounters() {
      const stats = document.querySelectorAll("[data-count]");
      ScrollTrigger.create({
        trigger: "#about",
        start: "top 65%",
        once: true,
        fastScrollEnd: true,
        preventOverlaps: true,
        onEnter: () => {
          stats.forEach((stat) => {
            const end = Number(stat.dataset.count);
            gsap.to({ value: 0 }, {
              value: end,
              duration: 1.2,
              ease: "power2.out",
              onUpdate() {
                stat.textContent = `${Math.round(this.targets()[0].value)}+`;
              }
            });
          });
        }
      });
    }

    function initTimelineSlides() {
      gsap.utils.toArray(".timeline-item").forEach((item, index) => {
        gsap.fromTo(item.querySelector(".timeline-card"),
          { x: index % 2 === 0 ? -80 : 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              fastScrollEnd: true,
              preventOverlaps: true
            }
          });
      });
    }

    /* ============================
       Tilt Cards
    ============================ */
    function initTiltCards() {
      document.querySelectorAll(".tilt-card").forEach((card) => {
        let rafId = null;
        card.addEventListener("mousemove", (e) => {
          if (isMobile()) return;
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.setProperty("--rx", `${y * 12}deg`);
            card.style.setProperty("--ry", `${-x * 12}deg`);
            card.style.boxShadow = "0 0 34px rgba(0,255,204,0.16), 0 0 54px rgba(168,85,247,0.16)";
          });
        });
        card.addEventListener("mouseleave", () => {
          if (rafId) cancelAnimationFrame(rafId);
          card.style.setProperty("--rx", "0deg");
          card.style.setProperty("--ry", "0deg");
          card.style.boxShadow = "";
        });
      });
    }

    /* ============================
       Image Gallery
    ============================ */
    function initImageGallery() {
      const cards = [...document.querySelectorAll(".gallery-card")];
      const lightbox = document.getElementById("gallery-lightbox");
      const lightboxImg = document.getElementById("gallery-lightbox-img");
      const lightboxCaption = document.getElementById("gallery-lightbox-caption");
      const closeBtn = document.getElementById("gallery-close");
      const prevBtn = document.getElementById("gallery-prev");
      const nextBtn = document.getElementById("gallery-next");
      if (!cards.length || !lightbox || !lightboxImg || !lightboxCaption || !closeBtn || !prevBtn || !nextBtn) return;

      const fallback = (label) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900">
          <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stop-color="#0b1220" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />
          <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#7dd3fc" font-size="48" font-family="Arial">Add Image</text>
          <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#cbd5e1" font-size="26" font-family="Arial">${label}</text>
        </svg>
      `)}`;

      let current = 0;

      function setImage(index) {
        current = (index + cards.length) % cards.length;
        const card = cards[current];
        const src = card.dataset.full || "";
        const caption = card.dataset.caption || `Image ${current + 1}`;
        lightboxImg.src = src;
        lightboxImg.alt = caption;
        lightboxCaption.textContent = caption;
      }

      function open(index) {
        setImage(index);
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
      }

      function close() {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
      }

      cards.forEach((card, index) => {
        const thumb = card.querySelector(".gallery-thumb");
        const label = card.dataset.caption || `Image ${index + 1}`;
        if (thumb) {
          thumb.addEventListener("error", () => {
            thumb.src = fallback(label);
          }, { once: true });
        }
        card.addEventListener("click", () => open(index));
      });

      lightboxImg.addEventListener("error", () => {
        const label = cards[current].dataset.caption || `Image ${current + 1}`;
        lightboxImg.src = fallback(label);
      });

      prevBtn.addEventListener("click", () => setImage(current - 1));
      nextBtn.addEventListener("click", () => setImage(current + 1));
      closeBtn.addEventListener("click", close);
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) close();
      });

      document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") setImage(current - 1);
        if (e.key === "ArrowRight") setImage(current + 1);
      });
    }

    /* ============================
       Contact Form + Confetti
    ============================ */
    function initForm() {
      const form = document.getElementById("contact-form");
      const sendBtn = document.getElementById("send-btn");
      const fields = document.querySelectorAll(".terminal-field input, .terminal-field textarea");
      const canvas = document.getElementById("confetti-canvas");
      const ctx = canvas.getContext("2d");
      const pieces = [];

      function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      fields.forEach((field) => {
        const wrapper = field.parentElement;
        const sync = () => wrapper.classList.toggle("empty", !field.value.trim());
        sync();
        field.addEventListener("input", sync);
      });

      function burstFromButton() {
        const rect = sendBtn.getBoundingClientRect();
        const baseX = rect.left + rect.width / 2;
        const baseY = rect.top + rect.height / 2 - window.scrollY;
        for (let i = 0; i < 44; i++) {
          pieces.push({
            x: baseX,
            y: baseY,
            vx: (Math.random() - 0.5) * 7,
            vy: (Math.random() - 1.6) * 6,
            life: 1,
            size: Math.random() * 4 + 2
          });
        }
      }

      function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = pieces.length - 1; i >= 0; i--) {
          const p = pieces[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12;
          p.life -= 0.016;
          ctx.fillStyle = `rgba(${p.size > 4 ? "168,85,247" : "0,255,204"},${p.life})`;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          if (p.life <= 0) pieces.splice(i, 1);
        }
        requestAnimationFrame(animateConfetti);
      }
      animateConfetti();

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        sendBtn.classList.add("loading");
        setTimeout(() => {
          sendBtn.classList.remove("loading");
          sendBtn.querySelector(".send-text").textContent = "[SENT]";
          burstFromButton();
          form.reset();
          document.querySelectorAll(".terminal-field").forEach((el) => el.classList.add("empty"));
          setTimeout(() => {
            sendBtn.querySelector(".send-text").textContent = "[ SEND_MESSAGE.exe ]";
          }, 1800);
        }, 1400);
      });
    }

    /* ============================
       Extras
    ============================ */
    function initExtras() {
      let typed = "";
      const easter = document.getElementById("easter-popup");
      const contextMenu = document.getElementById("context-menu");
      const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
      let konamiBuffer = [];
      const originalTitle = document.title;

      document.addEventListener("keydown", (e) => {
        typed += e.key.length === 1 ? e.key.toLowerCase() : "";
        typed = typed.slice(-20);
        if (typed.includes("sudo hire me")) {
          easter.classList.add("show");
          setTimeout(() => easter.classList.remove("show"), 2800);
          typed = "";
        }

        konamiBuffer.push(e.key);
        konamiBuffer = konamiBuffer.slice(-10);
        if (konami.every((key, i) => key === konamiBuffer[i])) {
          document.getElementById("send-btn").scrollIntoView({ behavior: "smooth", block: "center" });
          document.getElementById("send-btn").click();
          konamiBuffer = [];
        }
      });

      document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        contextMenu.style.left = `${clamp(e.clientX, 12, window.innerWidth - 232)}px`;
        contextMenu.style.top = `${clamp(e.clientY, 12, window.innerHeight - 220)}px`;
        contextMenu.classList.add("show");
      });

      document.addEventListener("click", () => contextMenu.classList.remove("show"));

      document.addEventListener("visibilitychange", () => {
        document.title = document.hidden ? "Come back!" : originalTitle;
      });
    }

    /* ============================
       Startup
    ============================ */
    window.addEventListener("DOMContentLoaded", () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.config({ force3D: true, nullTargetWarn: false });
      ScrollTrigger.config({ limitCallbacks: true });
      initLoader();
      initCursor();
      initNav();
      initLazyScenes();
      initAnimations();
      initTiltCards();
      initImageGallery();
      initForm();
      initExtras();
      document.querySelectorAll(".ripple-btn").forEach((btn) => {
        btn.addEventListener("pointerdown", (e) => createRipple(e, btn));
      });
      ScrollTrigger.addEventListener("refreshInit", () => {
        gsap.set(".gsap-animated", { clearProps: "all" });
      });
      ScrollTrigger.refresh();
    });
    window.addEventListener("load", () => {
      ScrollTrigger.refresh(true);
    });
