/* ───────────────────────────────────────────────
   rng.js — seeded RNG + composition rules
   The deterministic engine behind every output.
─────────────────────────────────────────────── */

// Mulberry32 — small, fast, seedable PRNG
function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Build an RNG with named helpers
function buildRng(seed) {
  const r = mulberry32(seed);
  return {
    next: r,
    range: (a, b) => a + (b - a) * r(),
    int:   (a, b) => Math.floor(a + (b - a + 1) * r()),
    pick:  (arr) => arr[Math.floor(r() * arr.length)],
    pickW: (items, weights) => {
      const total = weights.reduce((a, b) => a + b, 0);
      let x = r() * total;
      for (let i = 0; i < items.length; i++) {
        x -= weights[i];
        if (x <= 0) return items[i];
      }
      return items[items.length - 1];
    },
    chance: (p) => r() < p,
  };
}

/* ───────────────────────────────────────────────
   RULES — the formal system, as data.
   These are the "design system" of the brand.
─────────────────────────────────────────────── */

const RULES = {
  // RULE 1 — one brand field per composition
  fields: {
    blueberry: { bg: "#6530F7", on: "#FFFFFF", strokeOptions: ["mint", "mango", "raspberry"] },
    mint:      { bg: "#92F5B5", on: "#1A1A1B", strokeOptions: ["blueberry", "raspberry", "ink"] },
    mango:     { bg: "#FFBC3A", on: "#1A1A1B", strokeOptions: ["blueberry", "raspberry", "ink"] },
    raspberry: { bg: "#FA5050", on: "#FFFFFF", strokeOptions: ["mint", "blueberry", "ink"] },
    bone:      { bg: "#F0F0F0", on: "#1A1A1B", strokeOptions: ["blueberry", "raspberry", "mint", "mango"] },
    ink:       { bg: "#1A1A1B", on: "#FFFFFF", strokeOptions: ["mint", "mango", "raspberry"] },
  },

  // Resolve a stroke key to its hex
  strokeHex: {
    blueberry: "#6530F7",
    mint:      "#92F5B5",
    mango:     "#FFBC3A",
    raspberry: "#FA5050",
    ink:       "#1A1A1B",
    bone:      "#F0F0F0",
  },

  // RULE 2 — the four primitives. Always one HERO, optional 1 SUPPORT.
  primitives: ["stroke", "section", "passthrough", "annotation"],

  // RULE 3 — scale tier: hero primitive occupies 45-75% of canvas area
  scaleTiers: {
    sparse: { hero: [0.55, 0.85], support: 0 },
    medium: { hero: [0.45, 0.65], support: 1 },
    dense:  { hero: [0.4, 0.55],  support: 2 },
  },

  // RULE 4 — type lives in fixed safe zones (12-col grid anchors)
  safeZones: ["tl", "tr", "bl", "br"], // top-left, top-right, bottom-left, bottom-right

  // RULE 5 — annotation pills always run along ONE edge as a ribbon
  ribbonEdges: ["top", "bottom", "left", "right"],
};

/* ───────────────────────────────────────────────
   COMPOSE — turn a seed + params into a recipe
─────────────────────────────────────────────── */

function compose({ seed, fieldKey, primitive, density, headlineSize, hasRibbon, hasHeadline, hasMeta }) {
  const rng = buildRng(seed);
  const field = RULES.fields[fieldKey];

  // pick stroke / support color from this field's allowed contrast set
  const strokeKey = rng.pick(field.strokeOptions);
  const strokeColor = RULES.strokeHex[strokeKey];

  const tier = RULES.scaleTiers[density];
  const heroScale = rng.range(tier.hero[0], tier.hero[1]);

  // hero primitive placement
  const heroX = rng.range(0.15, 0.6);
  const heroY = rng.range(0.15, 0.55);
  const heroRot = rng.range(-25, 25);

  // support primitives (smaller, peripheral)
  const supports = [];
  const allSupports = RULES.primitives.filter(p => p !== primitive);
  for (let i = 0; i < tier.support; i++) {
    const sp = rng.pick(allSupports);
    supports.push({
      kind: sp,
      x: rng.range(0, 0.9),
      y: rng.range(0, 0.9),
      scale: rng.range(0.18, 0.32),
      rot: rng.range(-30, 30),
    });
  }

  // safe zone for headline
  const headlineZone = rng.pick(RULES.safeZones);

  // ribbon edge
  const ribbonEdge = rng.pick(RULES.ribbonEdges);

  // text color follows field rule
  const onColor = field.on;

  // stroke specifics
  const strokeWidth = rng.range(18, 36);
  const strokeSeed = Math.floor(rng.next() * 1e9);

  // section view specifics
  const sectionAngle = rng.pick([0, 45, 90, 135]);
  const sectionGap = rng.range(0.06, 0.14);
  const sectionShift = rng.range(0.04, 0.12);

  // passthrough specifics
  const passthroughKind = rng.pick(["sphere", "chair", "vrUser", "robot", "skyline"]);
  const passthroughW = rng.range(0.38, 0.6);
  const passthroughH = rng.range(0.38, 0.62);

  return {
    seed,
    rng,
    fieldKey,
    bg: field.bg,
    onColor,
    primitive,
    strokeKey,
    strokeColor,
    strokeWidth,
    strokeSeed,
    hero: { x: heroX, y: heroY, scale: heroScale, rot: heroRot },
    supports,
    sectionAngle,
    sectionGap,
    sectionShift,
    passthroughKind,
    passthroughW,
    passthroughH,
    headline: { zone: headlineZone, size: headlineSize, show: hasHeadline },
    ribbon: { edge: ribbonEdge, show: hasRibbon },
    meta: { show: hasMeta },
  };
}

// Expose globals for non-module scripts
window.GS = window.GS || {};
window.GS.RULES = RULES;
window.GS.buildRng = buildRng;
window.GS.compose = compose;
