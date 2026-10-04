/* =========================================================
   SWIGGY TOING CASE STUDY — INTERACTIVE ENGINE
   Full GSAP ScrollTrigger, Three.js 3D Hero, Sticky Horizontal
   Teardown, 3D Quadrant, Live Financial Model & Spotlight Footer
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initProgressAndSidenav();
  initHorizontalScroll();
  initHero3D();
  init3DQuadrant();
  initBusinessModel();
  init3DCharts();
  initFooterSpotlight();
});

/* =========================================================
   1. Reveal & Stagger Animation Observer
   ========================================================= */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        const d = parseFloat(el.dataset.delay || 0);
        el.style.transitionDelay = (d * 0.08) + "s";
        if (el.classList.contains("stg")) {
          el.style.animationDelay = (d * 0.09) + "s";
        }
        el.classList.add("in");
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  document.querySelectorAll(".reveal, .stg").forEach(el => io.observe(el));
}

/* =========================================================
   2. Progress Bar & Side Navigation Scrollspy
   ========================================================= */
function initProgressAndSidenav() {
  const progress = document.getElementById("progress");
  const navlinks = [...document.querySelectorAll("#sidenav a")];

  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    if (progress) {
      const scrollPct = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100;
      progress.style.width = scrollPct + "%";
    }
  }, { passive: true });

  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navlinks.forEach(a => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id);
        });
      }
    });
  }, { threshold: 0.35 });

  ["hero", "problem", "market", "diagnosis", "journey", "priority", "business", "metrics", "roadmap", "close"].forEach(id => {
    const s = document.getElementById(id);
    if (s) secObs.observe(s);
  });
}

/* =========================================================
   3. Sticky Horizontal Teardown Engine (Zero-Jank Pinning)
   ========================================================= */
function initHorizontalScroll() {
  const outer = document.getElementById("hzouter");
  const track = document.getElementById("hztrack");
  const bar = document.getElementById("hzbar");
  if (!outer || !track) return;

  let overflow = 0;

  function layout() {
    overflow = Math.max(0, track.scrollWidth - window.innerWidth);
    outer.style.height = (window.innerHeight + overflow) + "px";
    onScroll();
  }

  function onScroll() {
    const total = outer.offsetHeight - window.innerHeight;
    const top = outer.getBoundingClientRect().top;
    const p = total > 0 ? Math.min(1, Math.max(0, -top / total)) : 0;
    track.style.transform = `translate3d(${(-p * overflow).toFixed(1)}px, 0, 0)`;
    if (bar) bar.style.width = Math.max(16, p * 100).toFixed(1) + "%";
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", layout);
  window.addEventListener("load", layout);
  layout();
}

/* =========================================================
   4. GSAP ScrollTrigger for Sliding Panels & Timeline
   ========================================================= */
function initScrollFX() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // Slabs slide in smoothly
  gsap.utils.toArray(".slab[data-dir]").forEach(s => {
    const dir = s.dataset.dir === "right" ? 1 : -1;
    gsap.fromTo(s, { xPercent: 100 * dir }, {
      xPercent: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: s.closest(".panel"),
        start: "top bottom",
        end: "top 38%",
        scrub: true,
        invalidateOnRefresh: true
      }
    });
  });

  // Roadmap timeline glowing progress
  const tp = document.querySelector(".tl-progress");
  if (tp) {
    gsap.fromTo(tp, { scaleY: 0 }, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".timeline",
        start: "top 64%",
        end: "bottom 82%",
        scrub: true,
        invalidateOnRefresh: true
      }
    });
  }

  gsap.utils.toArray(".tl-item").forEach(item => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 74%",
      onEnter: () => item.classList.add("lit")
    });
  });

  const refresh = () => window.ScrollTrigger && ScrollTrigger.refresh();
  window.addEventListener("load", () => { setTimeout(refresh, 500); setTimeout(refresh, 1500); });
}
window.addEventListener("load", initScrollFX);

/* =========================================================
   5. Three.js 3D Hero Phone & Floating Delivery Cards
   ========================================================= */
function initHero3D() {
  const canvas = document.getElementById("hero-3d");
  if (!window.THREE || !canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const group = new THREE.Group();
  scene.add(group);

  const createPlane = (w, h, c, o) => {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, side: THREE.DoubleSide })
    );
  };

  // Phone body (white sleek mockup on vibrant orange)
  const edge = createPlane(2.74, 5.34, 0xFFFFFF, 0.22);
  edge.position.z = -0.03;
  const phone = createPlane(2.6, 5.2, 0xFFFFFF, 0.98);
  const screen = createPlane(2.36, 4.5, 0xFFF7F2, 1);
  screen.position.z = 0.02;
  group.add(edge, phone, screen);

  // Phone UI header lines (Swiggy Orange header)
  const topBar = createPlane(2.36, 0.65, 0xFC8019, 1);
  topBar.position.set(0, 1.9, 0.03);
  group.add(topBar);

  for (let i = 0; i < 4; i++) {
    const line = createPlane(1.9, 0.18, i === 0 ? 0xDE5A00 : 0xFFD8C0, i === 0 ? 0.95 : 0.8);
    line.position.set(0, 1.2 - i * 0.65, 0.03);
    group.add(line);
  }

  // Floating 3D meal delivery cards
  const cardColors = [0xDE5A00, 0xFC8019, 0xA63800, 0xFC8019, 0xFFD0A8];
  const cards = [];
  cardColors.forEach((color, i) => {
    const card = createPlane(1.7, 0.55, color, 0.92);
    card.position.set(
      (i % 2 ? 1 : -1) * (2.2 + Math.random() * 1.2),
      2 - i * 1.0,
      0.6 + i * 0.25
    );
    card.userData = {
      speed: 0.4 + Math.random() * 0.5,
      baseY: card.position.y,
      phase: i
    };
    group.add(card);
    cards.push(card);
  });

  // Particle Starfield (white & soft orange embers)
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 130;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  scene.add(new THREE.Points(particleGeo, new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.045,
    transparent: true,
    opacity: 0.55
  })));

  // Mouse Parallax
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0, time = 0;
  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX / window.innerWidth - 0.5;
    targetY = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    group.position.x = w > 900 ? 2.8 : 0;
    group.position.y = w > 900 ? 0 : -1.8;
    const scale = w > 900 ? 1 : 0.65;
    group.scale.set(scale, scale, scale);
  }
  window.addEventListener("resize", resize);

  function animate() {
    time += 0.01;
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    group.rotation.y = Math.sin(time * 0.4) * 0.25 + mouseX * 0.5;
    group.rotation.x = Math.cos(time * 0.3) * 0.07 - mouseY * 0.3;

    cards.forEach(c => {
      c.position.y = c.userData.baseY + Math.sin(time * c.userData.speed + c.userData.phase) * 0.18;
      c.rotation.z = Math.sin(time * 0.5 + c.userData.phase) * 0.04;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(() => { resize(); animate(); });
}

/* =========================================================
   6. 3D Interactive Quadrant Stage (Perspective Tilt)
   ========================================================= */
function init3DQuadrant() {
  const stage = document.getElementById("quadStage");
  if (!stage) return;

  stage.addEventListener("mousemove", (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    stage.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 22}deg)`;
  });

  stage.addEventListener("mouseleave", () => {
    stage.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

/* =========================================================
   7. Live Interactive Business Model (Rupee Simulator)
   ========================================================= */
function initBusinessModel() {
  const sAov = document.getElementById("sAov");
  const sBatch = document.getElementById("sBatch");
  const sAds = document.getElementById("sAds");

  const vAov = document.getElementById("vAov");
  const vBatch = document.getElementById("vBatch");
  const vAds = document.getElementById("vAds");

  const bmMargin = document.getElementById("bmMargin");
  const bmPlatformRev = document.getElementById("bmPlatformRev");
  const bmDeliveryCost = document.getElementById("bmDeliveryCost");
  const bmTakeRate = document.getElementById("bmTakeRate");
  const bmFill = document.getElementById("bmFill");
  const bmReset = document.getElementById("bmReset");

  if (!sAov || !sBatch || !sAds) return;

  function updateSliderFill(slider) {
    const min = parseFloat(slider.min || 0);
    const max = parseFloat(slider.max || 100);
    const val = parseFloat(slider.value || 0);
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.setProperty('--p', pct.toFixed(1) + '%');
  }

  function calculate() {
    const aov = parseFloat(sAov.value);
    const batch = parseFloat(sBatch.value);
    const adsPct = parseFloat(sAds.value);

    // Update dynamic track fills
    updateSliderFill(sAov);
    updateSliderFill(sBatch);
    updateSliderFill(sAds);

    // Text labels
    if (vAov) vAov.textContent = `₹${aov}`;
    if (vBatch) vBatch.textContent = `${batch.toFixed(1)} drops`;
    if (vAds) vAds.textContent = `${adsPct}%`;

    // Mathematical Model:
    // Platform Gross Revenue = (AOV * (Ads% / 100)) + ₹12 Platform Fee
    // Effective Delivery Cost per drop = ₹33 (rider base) / batch
    // Net Contribution Margin = Gross Platform Rev - Delivery Cost
    const platformRev = (aov * (adsPct / 100)) + 12.00;
    const deliveryCost = 33.00 / batch;
    const netMargin = platformRev - deliveryCost;
    const takeRate = ((platformRev / aov) * 100);

    if (bmMargin) {
      bmMargin.textContent = (netMargin >= 0 ? "+" : "") + `₹${netMargin.toFixed(2)}`;
      bmMargin.parentElement.style.color = netMargin >= 0 ? "#60B244" : "#E23744";
    }
    if (bmPlatformRev) bmPlatformRev.textContent = platformRev.toFixed(2);
    if (bmDeliveryCost) bmDeliveryCost.textContent = deliveryCost.toFixed(2);
    if (bmTakeRate) bmTakeRate.textContent = takeRate.toFixed(1);

    if (bmFill) {
      const fillPct = Math.min(100, Math.max(10, ((netMargin + 10) / 35) * 100));
      bmFill.style.width = fillPct + "%";
      bmFill.style.background = netMargin >= 0 ? "linear-gradient(90deg, #60B244, #48962E)" : "linear-gradient(90deg, #E23744, #C0182A)";
    }
  }

  [sAov, sBatch, sAds].forEach(slider => {
    slider.addEventListener("input", calculate);
  });

  if (bmReset) {
    bmReset.addEventListener("click", () => {
      sAov.value = 109;
      sBatch.value = 1.8;
      sAds.value = 14;
      calculate();
    });
  }

  calculate();
}

/* =========================================================
   8. Interactive 3D WebGL Charts (#aovBox, #kBox)
   ========================================================= */
function init3DCharts() {
  if (!window.THREE) return;
  buildAOVChart();
  buildCohortDonut();
}

function buildAOVChart() {
  const box = document.getElementById("aovBox");
  if (!box) return;
  const canvas = box.querySelector("canvas");
  const tip = box.querySelector(".c3d-tip");
  const labelsWrap = box.querySelector(".c3d-labels");
  if (!canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 2.6, 7.2);
  camera.lookAt(0, 0.85, 0);

  // Soft balanced lighting (no harsh glare)
  const ambLight = new THREE.AmbientLight(0xFFF7F0, 0.85);
  scene.add(ambLight);
  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
  dirLight.position.set(5, 10, 6);
  scene.add(dirLight);
  const backLight = new THREE.DirectionalLight(0xFFD4B8, 0.4);
  backLight.position.set(-5, -2, -4);
  scene.add(backLight);

  const group = new THREE.Group();
  scene.add(group);

  // Subtle Ground Grid
  const grid = new THREE.GridHelper(6.5, 10, 0xFC8019, 0xEEDCCE);
  grid.position.y = 0;
  grid.material.opacity = 0.45;
  grid.material.transparent = true;
  group.add(grid);

  // Bar 1: Toing (₹99 basket) - Scaled with ample top clearance
  const b1H = 0.95;
  const b1Geo = new THREE.BoxGeometry(1.2, b1H, 1.2);
  const b1Mat = new THREE.MeshStandardMaterial({
    color: 0xFC8019,
    roughness: 0.35,
    metalness: 0.08,
    emissive: 0x551E00,
    emissiveIntensity: 0.08
  });
  const bar1 = new THREE.Mesh(b1Geo, b1Mat);
  bar1.position.set(-1.35, b1H / 2, 0);
  bar1.userData = {
    title: "Toing Budget Order",
    aov: "₹99 meal",
    fee: "₹12 flat fee",
    pkg: "₹0 packaging",
    del: "FREE delivery",
    total: "₹124 Checkout"
  };
  group.add(bar1);

  // Bar 2: Core Swiggy (₹700 basket) - Scaled with headroom
  const b2H = 2.25;
  const b2Geo = new THREE.BoxGeometry(1.2, b2H, 1.2);
  const b2Mat = new THREE.MeshStandardMaterial({
    color: 0xDE5A00,
    roughness: 0.35,
    metalness: 0.08,
    emissive: 0x441400,
    emissiveIntensity: 0.08
  });
  const bar2 = new THREE.Mesh(b2Geo, b2Mat);
  bar2.position.set(1.35, b2H / 2, 0);
  bar2.userData = {
    title: "Core Swiggy Order",
    aov: "₹700 family feast",
    fee: "₹14.99 platform fee",
    pkg: "₹19 packaging",
    del: "₹60 delivery + surge",
    total: "₹793.99 Checkout"
  };
  group.add(bar2);

  const bars = [bar1, bar2];

  // HTML Floating Labels
  if (labelsWrap) {
    labelsWrap.innerHTML = `
      <div class="c3d-lab" id="lab-toing"><b>₹99</b> · Toing AOV</div>
      <div class="c3d-lab" id="lab-core"><b>₹700</b> · Core Swiggy AOV</div>
    `;
  }
  const labToing = document.getElementById("lab-toing");
  const labCore = document.getElementById("lab-core");

  function projectToScreen(mesh, yOffset) {
    const v = new THREE.Vector3();
    mesh.getWorldPosition(v);
    v.y += yOffset;
    v.project(camera);
    const rect = canvas.getBoundingClientRect();
    const x = (v.x * 0.5 + 0.5) * rect.width;
    const rawY = (-(v.y * 0.5) + 0.5) * rect.height;
    // Clamp to ensure it never touches or clips the top/bottom boundary
    const y = Math.max(28, Math.min(rect.height - 20, rawY));
    return { x, y };
  }

  // Interactive Raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-999, -999);
  let hoveredBar = null;
  let targetRotY = 0, targetRotX = 0;

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    targetRotY = mouse.x * 0.28;
    targetRotX = -mouse.y * 0.12;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(bars);

    if (intersects.length > 0) {
      hoveredBar = intersects[0].object;
      canvas.style.cursor = "pointer";
      if (tip) {
        const d = hoveredBar.userData;
        tip.innerHTML = `
          <strong style="color:#FC8019;font-size:0.78rem;display:block;margin-bottom:3px">${d.title}</strong>
          <div>Basket: <b>${d.aov}</b></div>
          <div>Extras: ${d.fee} + ${d.pkg}</div>
          <div>Logistics: ${d.del}</div>
          <div style="border-top:1px dashed #444;margin-top:4px;padding-top:3px;color:#FFF;font-weight:bold">${d.total}</div>
        `;
        tip.style.left = (e.clientX - rect.left) + "px";
        tip.style.top = (e.clientY - rect.top - 12) + "px";
        tip.classList.add("visible");
      }
    } else {
      hoveredBar = null;
      canvas.style.cursor = "default";
      if (tip) tip.classList.remove("visible");
    }
  }

  box.addEventListener("mousemove", onMouseMove);
  box.addEventListener("mouseleave", () => {
    hoveredBar = null;
    if (tip) tip.classList.remove("visible");
    targetRotY = 0;
    targetRotX = 0;
  });

  function resize() {
    const w = box.clientWidth || 300;
    const h = box.clientHeight || 340;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  function animate() {
    group.rotation.y += (targetRotY - group.rotation.y) * 0.08;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.08;

    bars.forEach(b => {
      const isHov = (b === hoveredBar);
      const targetScale = isHov ? 1.06 : 1.0;
      b.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
      b.material.emissiveIntensity = isHov ? 0.28 : 0.08;
    });

    if (labToing) {
      const p1 = projectToScreen(bar1, b1H / 2 + 0.28);
      labToing.style.left = p1.x + "px";
      labToing.style.top = p1.y + "px";
    }
    if (labCore) {
      const p2 = projectToScreen(bar2, b2H / 2 + 0.28);
      labCore.style.left = p2.x + "px";
      labCore.style.top = p2.y + "px";
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

function buildCohortDonut() {
  const box = document.getElementById("kBox");
  if (!box) return;
  const canvas = box.querySelector("canvas");
  const tip = box.querySelector(".c3d-tip");
  const labelsWrap = box.querySelector(".c3d-labels");
  if (!canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 3.6, 4.4);
  camera.lookAt(0, 0, 0);

  // Soft diffused lighting
  const ambLight = new THREE.AmbientLight(0xFFFAF5, 0.9);
  scene.add(ambLight);
  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.75);
  dirLight.position.set(5, 10, 6);
  scene.add(dirLight);
  const bounceLight = new THREE.DirectionalLight(0xFFD8C0, 0.35);
  bounceLight.position.set(-5, -2, -3);
  scene.add(bounceLight);

  const group = new THREE.Group();
  scene.add(group);

  // Create mathematically precise closed annular sector geometry
  function createDonutSlice(startAngle, endAngle, depth, color) {
    const shape = new THREE.Shape();
    const innerRadius = 1.05;
    const outerRadius = 1.95;

    // Start at inner arc start point
    shape.moveTo(Math.cos(startAngle) * innerRadius, Math.sin(startAngle) * innerRadius);
    // Line out to outer arc start point
    shape.lineTo(Math.cos(startAngle) * outerRadius, Math.sin(startAngle) * outerRadius);
    // Trace outer arc clockwise/counter-clockwise to endAngle
    shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
    // Line in to inner arc end point
    shape.lineTo(Math.cos(endAngle) * innerRadius, Math.sin(endAngle) * innerRadius);
    // Trace inner arc back to startAngle
    shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);
    shape.closePath();

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
      curveSegments: 64
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center ONLY along Z-axis (depth) to preserve (0,0) as the shared donut ring center
    geometry.translate(0, 0, -depth / 2);

    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.4,
      metalness: 0.06,
      emissive: color,
      emissiveIntensity: 0.05
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  // Slice 1: 66% First-Time Users (Vibrant Swiggy Orange)
  const slice1Angle = Math.PI * 2 * 0.66;
  const slice1MidAngle = slice1Angle / 2;
  const slice1 = createDonutSlice(0, slice1Angle, 0.45, 0xFC8019);
  slice1.userData = {
    title: "66% First-Time Online Eaters",
    desc: "Acquired from offline habit in Tier-2/3 cities. Demonstrates massive greenfield category expansion.",
    midAngle: slice1MidAngle
  };
  group.add(slice1);

  // Slice 2: 34% Existing Swiggy Switchers (Warm Slate / Cocoa)
  const slice2MidAngle = slice1Angle + (Math.PI * 2 - slice1Angle) / 2;
  const slice2 = createDonutSlice(slice1Angle, Math.PI * 2, 0.45, 0x8C786E);
  slice2.userData = {
    title: "34% Swiggy Switchers",
    desc: "Existing app users ordering budget snacks without cannibalizing high-margin dinner baskets.",
    midAngle: slice2MidAngle
  };
  group.add(slice2);

  const slices = [slice1, slice2];

  // HTML Floating 3D Labels
  if (labelsWrap) {
    labelsWrap.innerHTML = `
      <div class="c3d-lab" id="lab-s1" style="background:#FC8019"><b>66%</b> First-Timers</div>
      <div class="c3d-lab" id="lab-s2" style="background:#8C786E"><b>34%</b> Switchers</div>
    `;
  }
  const labS1 = document.getElementById("lab-s1");
  const labS2 = document.getElementById("lab-s2");

  function projectDonutPoint(angle, radius) {
    const v = new THREE.Vector3(Math.cos(angle) * radius, 0.35, -Math.sin(angle) * radius);
    v.applyMatrix4(group.matrixWorld);
    v.project(camera);
    const rect = canvas.getBoundingClientRect();
    const x = (v.x * 0.5 + 0.5) * rect.width;
    const y = Math.max(24, Math.min(rect.height - 20, (-(v.y * 0.5) + 0.5) * rect.height));
    return { x, y };
  }

  // Interactive Raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-999, -999);
  let hoveredSlice = null;
  let targetRotY = 0, targetRotX = 0;

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    targetRotY = mouse.x * 0.35;
    targetRotX = -mouse.y * 0.15;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(slices);

    if (intersects.length > 0) {
      hoveredSlice = intersects[0].object;
      canvas.style.cursor = "pointer";
      if (tip) {
        const d = hoveredSlice.userData;
        tip.innerHTML = `
          <strong style="color:#FC8019;font-size:0.78rem;display:block;margin-bottom:3px">${d.title}</strong>
          <div style="color:#EEE;font-size:0.68rem;line-height:1.4">${d.desc}</div>
        `;
        tip.style.left = (e.clientX - rect.left) + "px";
        tip.style.top = (e.clientY - rect.top - 12) + "px";
        tip.classList.add("visible");
      }
    } else {
      hoveredSlice = null;
      canvas.style.cursor = "default";
      if (tip) tip.classList.remove("visible");
    }
  }

  box.addEventListener("mousemove", onMouseMove);
  box.addEventListener("mouseleave", () => {
    hoveredSlice = null;
    if (tip) tip.classList.remove("visible");
    targetRotY = 0;
    targetRotX = 0;
  });

  function resize() {
    const w = box.clientWidth || 300;
    const h = box.clientHeight || 340;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  let autoRot = 0;
  function animate() {
    autoRot += 0.0025;
    group.rotation.y = autoRot + targetRotY;
    group.rotation.x = 0.35 + targetRotX;

    slices.forEach(s => {
      const isHov = (s === hoveredSlice);
      const angle = s.userData.midAngle;
      const offsetDist = isHov ? 0.22 : 0;
      const targetX = Math.cos(angle) * offsetDist;
      const targetZ = -Math.sin(angle) * offsetDist;

      s.position.x += (targetX - s.position.x) * 0.15;
      s.position.z += (targetZ - s.position.z) * 0.15;
      s.scale.lerp(new THREE.Vector3(isHov ? 1.05 : 1, isHov ? 1.05 : 1, isHov ? 1.05 : 1), 0.15);
    });

    if (labS1) {
      const p1 = projectDonutPoint(slice1MidAngle + group.rotation.y, 1.5);
      labS1.style.left = p1.x + "px";
      labS1.style.top = p1.y + "px";
    }
    if (labS2) {
      const p2 = projectDonutPoint(slice2MidAngle + group.rotation.y, 1.5);
      labS2.style.left = p2.x + "px";
      labS2.style.top = p2.y + "px";
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

/* =========================================================
   9. Footer Flashlight Spotlight Effect (Smooth Cursor Follow)
   ========================================================= */
function initFooterSpotlight() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  const glow = footer.querySelector(".ft-word-glow");
  if (!glow) return;

  let targetX = -800, targetY = -800;
  let currentX = -800, currentY = -800;
  let raf = 0;

  const setPos = (x, y) => {
    glow.style.setProperty("--mx", x.toFixed(1) + "px");
    glow.style.setProperty("--my", y.toFixed(1) + "px");
  };

  function loop() {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    setPos(currentX, currentY);

    if (Math.abs(targetX - currentX) > 0.6 || Math.abs(targetY - currentY) > 0.6) {
      raf = requestAnimationFrame(loop);
    } else {
      setPos(targetX, targetY);
      raf = 0;
    }
  }

  footer.addEventListener("pointermove", (e) => {
    const r = glow.getBoundingClientRect();
    targetX = e.clientX - r.left;
    targetY = e.clientY - r.top;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });

  footer.addEventListener("pointerleave", () => {
    const r = glow.getBoundingClientRect();
    targetX = r.width / 2;
    targetY = -r.height * 1.5;
    if (!raf) raf = requestAnimationFrame(loop);
  });
}
