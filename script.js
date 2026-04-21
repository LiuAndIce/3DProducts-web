const sequencePaths = Array.from({ length: 142 }, (_, index) => {
  return `./webp/frame_${String(index).padStart(3, "0")}_delay-0.041s.webp`;
});

const variants = [
  {
    name: "黑芒气泡",
    subtitle: "NOCTURNE FIZZ",
    eyebrow: "MANGO DELIGHT",
    description:
      "一个现代功能性汽水品牌，受经典口味启发，但采用更好的原料制作。黑芒气泡把成熟芒果的厚度、利落气泡和干净配方压进一罐夜色般克制的提神口感。",
    accent: "#f6f2e8",
    cardNote: "黑场、细泡、成熟果感",
    frames: sequencePaths,
  },
  {
    name: "冰芒原味",
    subtitle: "CRISP CLASSIC",
    eyebrow: "CINEMATIC POUR",
    description:
      "更接近经典汽水记忆的版本，前段是明亮芒果，中段有更锐利的气泡冲击，尾韵收得更干净，适合全天候饮用。",
    accent: "#ffffff",
    cardNote: "最接近经典汽水的清爽表达",
    frames: sequencePaths,
  },
  {
    name: "深夜零糖",
    subtitle: "MIDNIGHT ZERO",
    eyebrow: "FUNCTIONAL CUT",
    description:
      "保留热带香气和金属般利落的气泡触感，进一步压低糖感，适合夜间工作、训练后和需要清醒但不想负担过重的时段。",
    accent: "#e6e6e6",
    cardNote: "低糖、更干净、夜间友好",
    frames: sequencePaths,
  },
];

const state = {
  variantIndex: 0,
  frameIndex: 0,
  activeFrames: [],
  frameCache: new Map(),
  rafId: 0,
};

const body = document.body;
const loadingScreen = document.getElementById("loadingScreen");
const loadingBarFill = document.getElementById("loadingBarFill");
const loadingPercent = document.getElementById("loadingPercent");
const heroScroll = document.getElementById("hero");
const heroCanvas = document.getElementById("heroCanvas");
const heroCopy = document.getElementById("heroCopy");
const heroEyebrow = document.getElementById("heroEyebrow");
const heroTitle = document.getElementById("heroTitle");
const heroSubtitle = document.getElementById("heroSubtitle");
const heroDescription = document.getElementById("heroDescription");
const variantIndex = document.getElementById("variantIndex");
const variantLoader = document.getElementById("variantLoader");
const prevVariant = document.getElementById("prevVariant");
const nextVariant = document.getElementById("nextVariant");
const flavorGrid = document.getElementById("flavorGrid");
const navLinks = [...document.querySelectorAll(".top-nav a")];
const ctx = heroCanvas.getContext("2d");

body.classList.add("is-loading");

function setAccent(accent) {
  document.documentElement.style.setProperty("--theme", accent);
  document.documentElement.style.setProperty("--theme-strong", accent);
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  heroCanvas.width = Math.floor(window.innerWidth * dpr);
  heroCanvas.height = Math.floor(window.innerHeight * dpr);
  heroCanvas.style.width = `${window.innerWidth}px`;
  heroCanvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  drawFrame(state.frameIndex);
}

function drawFrame(index) {
  const image = state.activeFrames[index];
  if (!image) {
    return;
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const viewportRatio = viewportWidth / viewportHeight;
  const imageRatio = image.naturalWidth / image.naturalHeight;

  let drawWidth = viewportWidth;
  let drawHeight = viewportHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > viewportRatio) {
    drawHeight = viewportHeight;
    drawWidth = drawHeight * imageRatio;
    offsetX = (viewportWidth - drawWidth) / 2;
  } else {
    drawWidth = viewportWidth;
    drawHeight = drawWidth / imageRatio;
    offsetY = (viewportHeight - drawHeight) / 2;
  }

  ctx.clearRect(0, 0, viewportWidth, viewportHeight);
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

function updateFrameByScroll() {
  const rect = heroScroll.getBoundingClientRect();
  const total = heroScroll.offsetHeight - window.innerHeight;
  const progress = Math.min(Math.max(-rect.top / total, 0), 1);
  const targetIndex = Math.round(progress * (state.activeFrames.length - 1));

  if (targetIndex !== state.frameIndex) {
    state.frameIndex = targetIndex;
  }

  drawFrame(state.frameIndex);
  state.rafId = 0;
}

function requestFrameUpdate() {
  if (state.rafId) {
    return;
  }
  state.rafId = requestAnimationFrame(updateFrameByScroll);
}

function preloadImages(paths, onProgress) {
  let loaded = 0;
  const total = paths.length;

  const jobs = paths.map((path) => {
    const cached = state.frameCache.get(path);
    if (cached) {
      loaded += 1;
      onProgress?.(loaded, total);
      return Promise.resolve(cached);
    }

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        state.frameCache.set(path, image);
        loaded += 1;
        onProgress?.(loaded, total);
        resolve(image);
      };
      image.onerror = reject;
      image.src = path;
    });
  });

  return Promise.all(jobs);
}

function updateHeroText(variant) {
  heroEyebrow.textContent = variant.eyebrow;
  heroTitle.textContent = variant.name;
  heroSubtitle.textContent = variant.subtitle;
  heroDescription.textContent = variant.description;
  variantIndex.textContent = String(state.variantIndex + 1).padStart(2, "0");
}

function renderFlavorCards() {
  flavorGrid.innerHTML = variants
    .map((variant, index) => {
      const activeClass = index === state.variantIndex ? " is-active" : "";
      return `
        <button class="flavor-card${activeClass}" type="button" data-variant-index="${index}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h3>${variant.name}</h3>
          <p>${variant.subtitle}</p>
          <p>${variant.cardNote}</p>
        </button>
      `;
    })
    .join("");
}

async function activateVariant(nextIndex, initial = false) {
  const variant = variants[nextIndex];
  state.variantIndex = nextIndex;
  setAccent(variant.accent);

  if (!initial) {
    heroCopy.classList.add("is-swapping");
    variantLoader.classList.add("is-visible");
  }

  const frames = await preloadImages(variant.frames);
  state.activeFrames = frames;
  updateHeroText(variant);
  renderFlavorCards();
  drawFrame(state.frameIndex);
  requestFrameUpdate();

  if (initial) {
    loadingScreen.classList.add("is-hidden");
    body.classList.remove("is-loading");
    return;
  }

  window.setTimeout(() => {
    heroCopy.classList.remove("is-swapping");
    variantLoader.classList.remove("is-visible");
  }, 80);
}

function onVariantChange(direction) {
  const nextIndex = (state.variantIndex + direction + variants.length) % variants.length;
  activateVariant(nextIndex).catch((error) => {
    console.error("Variant load failed:", error);
    heroCopy.classList.remove("is-swapping");
    variantLoader.classList.remove("is-visible");
  });
}

function updateLoadingProgress(loaded, total) {
  const progress = Math.round((loaded / total) * 100);
  loadingBarFill.style.width = `${progress}%`;
  loadingPercent.textContent = `${progress}%`;
}

function observeSections() {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    {
      threshold: 0.55,
      rootMargin: "-10% 0px -25% 0px",
    }
  );

  document.querySelectorAll("main > section[id]").forEach((section) => {
    if (section.id !== "hero") {
      sectionObserver.observe(section);
    }
  });
}

function bindEvents() {
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("scroll", requestFrameUpdate, { passive: true });
  prevVariant.addEventListener("click", () => onVariantChange(-1));
  nextVariant.addEventListener("click", () => onVariantChange(1));
  flavorGrid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-variant-index]");
    if (!trigger) {
      return;
    }

    const nextIndex = Number(trigger.dataset.variantIndex);
    if (Number.isNaN(nextIndex) || nextIndex === state.variantIndex) {
      return;
    }

    activateVariant(nextIndex).catch((error) => {
      console.error("Variant load failed:", error);
      heroCopy.classList.remove("is-swapping");
      variantLoader.classList.remove("is-visible");
    });
  });
}

async function init() {
  resizeCanvas();
  bindEvents();
  observeSections();

  try {
    await preloadImages(variants[0].frames, updateLoadingProgress);
    await activateVariant(0, true);
  } catch (error) {
    console.error("Initial sequence load failed:", error);
    loadingPercent.textContent = "LOAD FAILED";
  }
}

init();
