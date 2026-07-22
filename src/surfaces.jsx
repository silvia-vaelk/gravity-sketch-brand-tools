/* global React */
/* ───────────────────────────────────────────────
   surfaces.jsx — applied surfaces using the system.
   Each surface uses the same primitives + rules,
   proving the system holds across contexts.
─────────────────────────────────────────────── */

(function() {
const { Composition, Stroke, Passthrough, SectionView, AnnotationRibbon, Pill, compose } = window.GS;

/* ─────────────────────────────────────────────
   LANDING HERO
───────────────────────────────────────────── */
function LandingHero() {
  // hero recipe — strict: bone field, big stroke gesture
  const recipe = compose({
    seed: 4071,
    fieldKey: "bone",
    primitive: "stroke",
    density: "sparse",
    headlineSize: 0,
    hasRibbon: false,
    hasHeadline: false,
    hasMeta: false,
  });
  // override stroke to green / blueberry alternating
  recipe.strokeColor = "#3DDC83";

  return (
    <div className="landing-hero">
      <div className="left">
        <div style={{display: "flex", alignItems: "center", gap: 10}}>
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="#6530F7" strokeWidth="3" fill="none"/>
            <path d="M14 26 C 18 14, 26 14, 28 22" stroke="#6530F7" strokeWidth="3" strokeLinecap="round" fill="none"/>
          </svg>
          <span style={{fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: "#6530F7"}}>gravity sketch</span>
        </div>
        <div>
          <h1>Bringing better products to life.</h1>
          <p className="sub">In the making — a 3D design platform for the moment between idea and reality.</p>
        </div>
        <div style={{display: "flex", gap: 8}}>
          <span className="pill berry">Start a session <span className="arr">&gt;&gt;&gt;</span></span>
          <span className="pill outline">Watch demo</span>
        </div>
      </div>
      <div className="right" style={{background: "#EAE8FF", position: "relative"}}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
          style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}>
          <Stroke seed={4071} color="#3DDC83" width={18} />
          <Stroke seed={4073} color="#3DDC83" width={6} />
        </svg>
      </div>
      <div className="pill-ribbon" style={{position: "absolute", bottom: 18, left: -8, gap: 4}}>
        {Array.from({length: 8}).map((_, i) => (
          <span key={i} className="pill outline">TAGLINE <span className="arr">&gt;&gt;&gt;</span></span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MARKETING TILE GRID — like the user's ref image 1
   3 cols × 4 rows of compositions following the rules
───────────────────────────────────────────── */

const MARKETING_TILES = [
  // Format: { seed, fieldKey, primitive, headlineText, mode, eyebrow, density }
  { seed: 11, fieldKey: "mango", primitive: "annotation", density: "sparse",
    headlineText: "Updated\nselection\ntool", eyebrow: "UPDATE", cta: "Discover new features", mode: "marketing" },
  { seed: 22, fieldKey: "blueberry", primitive: "stroke", density: "medium",
    headlineText: "", mode: "image-only" },
  { seed: 33, fieldKey: "ink", primitive: "passthrough", density: "medium",
    headlineText: "", mode: "ribbon-image", passthroughKind: "robot" },

  { seed: 44, fieldKey: "bone", primitive: "section", density: "sparse",
    headlineText: "Meeting our\ncustomers\nwhere they are", eyebrow: "TRAINING", footerPill: "WORKFLOW SERIES", mode: "marketing-light" },
  { seed: 55, fieldKey: "bone", primitive: "stroke", density: "medium",
    headlineText: "", mode: "screenshot", passthroughKind: "robot" },
  { seed: 66, fieldKey: "bone", primitive: "stroke", density: "sparse",
    headlineText: "", mode: "image-only", strokeOverride: "#BAB1FF" },

  { seed: 77, fieldKey: "bone", primitive: "passthrough", density: "sparse",
    headlineText: "", mode: "photo-mono", passthroughKind: "vrUser" },
  { seed: 88, fieldKey: "bone", primitive: "annotation", density: "dense",
    headlineText: "Webinar", mode: "webinar", passthroughKind: "robot" },
  { seed: 99, fieldKey: "mango", primitive: "annotation", density: "sparse",
    headlineText: "What's new\nin Gravity\nSketch 6.5?", eyebrow: "UPDATE", cta: "Discover new features", mode: "marketing" },

  { seed: 111, fieldKey: "raspberry", primitive: "passthrough", density: "medium",
    headlineText: "", mode: "ar-shot", passthroughKind: "skyline", strokeOverride: "#3DDC83" },
  { seed: 122, fieldKey: "bone", primitive: "stroke", density: "sparse",
    headlineText: "", mode: "product-shot", ribbon: true },
  { seed: 133, fieldKey: "ink", primitive: "annotation", density: "sparse",
    headlineText: "Julia Miles\nAutomotive designer", mode: "portrait" },
];

function MarketingTile({ t }) {
  const recipe = compose({
    seed: t.seed,
    fieldKey: t.fieldKey,
    primitive: t.primitive,
    density: t.density,
    headlineSize: 11,
    hasRibbon: false,
    hasHeadline: false,
    hasMeta: false,
  });
  if (t.strokeOverride) recipe.strokeColor = t.strokeOverride;
  if (t.passthroughKind) recipe.passthroughKind = t.passthroughKind;

  // Three layout templates: marketing-text, image-only, ribbon-image, portrait
  if (t.mode === "marketing" || t.mode === "marketing-light") {
    const isLight = t.mode === "marketing-light";
    return (
      <div style={{
        position: "relative",
        background: recipe.bg,
        color: recipe.onColor,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%",
      }}>
        <span className="pill" style={{background: "#1A1A1B", color: "#fff", alignSelf: "flex-start"}}>{t.eyebrow}</span>
        <div style={{
          fontSize: 26, lineHeight: 1.05, fontWeight: 700, letterSpacing: "-0.02em",
          whiteSpace: "pre-line", marginTop: 8,
        }}>{t.headlineText}</div>
        <div style={{flex: 1, position: "relative", marginInline: -10}}>
          {/* A small support primitive at the bottom */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
            style={{position: "absolute", bottom: 0, right: 0, width: "70%", height: "70%"}}>
            {!isLight && <SectionView color="#1A1A1B" contrast="#FFFFFF" angle={45} gap={0.08} shift={0.05} />}
            {isLight && <Passthrough kind="sphere" w={70} h={70} x={15} y={15} bg="#E5C28A" />}
          </svg>
        </div>
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <span style={{fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: "0.08em", fontWeight: 700}}>
            {t.cta?.toUpperCase()} →
          </span>
          {t.footerPill && <span className="pill mint">{t.footerPill}</span>}
        </div>
      </div>
    );
  }

  if (t.mode === "image-only") {
    return (
      <div style={{position: "relative", background: recipe.bg, height: "100%"}}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
          style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}>
          <Stroke seed={recipe.strokeSeed} color={recipe.strokeColor} width={recipe.strokeWidth * 0.6} />
          <Stroke seed={recipe.strokeSeed + 11} color={recipe.strokeColor} width={recipe.strokeWidth * 0.3} />
        </svg>
      </div>
    );
  }

  if (t.mode === "ribbon-image") {
    return (
      <div style={{position: "relative", background: "#2A2A2D", height: "100%", overflow: "hidden"}}>
        {/* fake hero shot via a passthrough subject filling the tile */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
          style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}>
          <Passthrough kind="robot" w={120} h={120} x={-10} y={-10} bg="#2A2A2D" />
        </svg>
        <div style={{position: "absolute", top: "30%", left: 0, right: 0, display: "flex", gap: 4, whiteSpace: "nowrap"}}>
          {Array.from({length: 6}).map((_, i) => (
            <span key={i} className="pill mango">BEHIND THE BUILD <span className="arr">&gt;&gt;&gt;</span></span>
          ))}
        </div>
      </div>
    );
  }

  if (t.mode === "screenshot") {
    // a mini-browser/app screenshot framed by a stroke
    return (
      <div style={{position: "relative", background: recipe.bg, height: "100%"}}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
          style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}>
          <Stroke seed={recipe.strokeSeed} color={recipe.strokeColor} width={6} />
        </svg>
        <div style={{
          position: "absolute", left: "22%", top: "30%", width: "56%", height: "40%",
          background: "#2A2A2D",
          borderRadius: 6,
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}>
          <div style={{height: 14, background: "#1A1A1B", display: "flex", alignItems: "center", padding: "0 6px"}}>
            <span style={{width: 4, height: 4, background: "#FA5050", borderRadius: 99, marginRight: 3}}></span>
            <span style={{width: 4, height: 4, background: "#FFBC3A", borderRadius: 99, marginRight: 3}}></span>
            <span style={{width: 4, height: 4, background: "#3DDC83", borderRadius: 99}}></span>
          </div>
          <div style={{padding: 10, color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em"}}>4:12 — Home<br/>Orientation</div>
        </div>
      </div>
    );
  }

  if (t.mode === "photo-mono") {
    // Mono photo of a person in VR — using passthrough VR-user
    return (
      <div style={{position: "relative", background: "#dedede", height: "100%", overflow: "hidden", filter: "grayscale(1) contrast(1.05)"}}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
          style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}>
          <rect width="100" height="100" fill="#cfcfcf" />
          <rect x="0" y="60" width="100" height="40" fill="#a8a8a8" />
          <Passthrough kind="vrUser" w={60} h={70} x={20} y={15} bg="transparent" />
        </svg>
        <div style={{position: "absolute", top: "32%", left: -4, display: "flex", gap: 3, whiteSpace: "nowrap"}}>
          {Array.from({length: 5}).map((_, i) => (
            <span key={i} className="pill" style={{background: "#1A1A1B", color: "#fff", fontSize: 9}}>CHALLENGE <span className="arr">&gt;&gt;&gt;</span></span>
          ))}
        </div>
      </div>
    );
  }

  if (t.mode === "webinar") {
    return (
      <div style={{position: "relative", background: "#F0F0F0", height: "100%", overflow: "hidden"}}>
        {/* large WEBINAR text in background */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: "48px", letterSpacing: "-0.04em", color: "#DCDCDC",
        }}>WEBINAR</div>
        <div style={{
          position: "absolute", inset: "12% 8%",
          borderRadius: 6, overflow: "hidden", background: "#A9C0CC",
        }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{width: "100%", height: "100%"}}>
            <Passthrough kind="robot" w={140} h={140} x={-20} y={-10} bg="#A9C0CC" />
          </svg>
          <span className="pill" style={{position: "absolute", bottom: 8, left: 8, background: "#1A1A1B", color: "#fff"}}>
            <span style={{width: 6, height: 6, background: "#3DDC83", borderRadius: 99, display: "inline-block", marginRight: 4}}></span>
            JOIN US LIVE
          </span>
        </div>
      </div>
    );
  }

  if (t.mode === "ar-shot") {
    return (
      <div style={{position: "relative", background: "#FA5050", height: "100%", overflow: "hidden"}}>
        <div style={{
          position: "absolute", left: "10%", bottom: "8%", width: "60%", aspectRatio: "4/3",
          background: "#bbb", borderRadius: 6, overflow: "hidden",
        }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{width: "100%", height: "100%"}}>
            <rect width="100" height="100" fill="#9c9c9c" />
            <rect x="40" y="40" width="20" height="55" fill="#cfcfcf" />
            <Stroke seed={211} color="#3DDC83" width={14} />
          </svg>
        </div>
      </div>
    );
  }

  if (t.mode === "product-shot") {
    return (
      <div style={{position: "relative", background: "#F0F0F0", height: "100%", overflow: "hidden"}}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}>
          <Passthrough kind="chair" w={90} h={90} x={5} y={5} bg="#F0F0F0" />
        </svg>
        <div style={{position: "absolute", top: "35%", left: -4, display: "flex", gap: 3, whiteSpace: "nowrap"}}>
          {Array.from({length: 6}).map((_, i) => (
            <span key={i} className="pill mango" style={{fontSize: 9}}>BEHIND THE BUILD <span className="arr">&gt;&gt;&gt;</span></span>
          ))}
        </div>
      </div>
    );
  }

  if (t.mode === "portrait") {
    return (
      <div style={{position: "relative", background: "#1A1A1B", height: "100%", overflow: "hidden"}}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{position: "absolute", inset: 0, width: "100%", height: "100%", filter: "grayscale(1)"}}>
          <rect width="100" height="100" fill="#3a3a3a" />
          <circle cx="62" cy="60" r="28" fill="#a8a8a8" />
          <rect x="42" y="82" width="40" height="30" fill="#7a7a7a" />
        </svg>
        <div style={{position: "absolute", top: 14, left: 16, color: "#fff", fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em", lineHeight: 1.0}}>
          Julia Miles<br/>
          <span style={{fontWeight: 400, fontSize: 14, opacity: 0.8}}>Automotive designer</span>
        </div>
      </div>
    );
  }

  return <div style={{background: recipe.bg, height: "100%"}}></div>;
}

function MarketingGrid() {
  return (
    <div className="tile-grid">
      {MARKETING_TILES.map((t, i) => <MarketingTile key={i} t={t} />)}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT UI BLOCK — Room dashboard inside GSWeb.
   The system holds in dense UI by demoting brand
   to thumbnails only — never to chrome.
───────────────────────────────────────────── */

const ROOMS = [
  { name: "Seat shell concept v3", meta: "Edited 2h · Maya, Tom", seed: 31, fieldKey: "blueberry", primitive: "stroke" },
  { name: "Side mirror sweep", meta: "Edited yesterday · Solo", seed: 32, fieldKey: "ink", primitive: "stroke" },
  { name: "Trainer outsole — A/B", meta: "Edited 3d · Footwear team", seed: 33, fieldKey: "mango", primitive: "section" },
  { name: "Cockpit IP study", meta: "Shared with you", seed: 34, fieldKey: "bone", primitive: "passthrough" },
  { name: "Toy figure rev. 02", meta: "Edited 1w", seed: 35, fieldKey: "raspberry", primitive: "stroke" },
  { name: "Door panel — section view", meta: "Edited 1w · Auto", seed: 36, fieldKey: "mint", primitive: "section" },
  { name: "Helmet visor study", meta: "Edited 2w · Solo", seed: 37, fieldKey: "bone", primitive: "stroke" },
  { name: "Loft loft loft", meta: "Edited 3w", seed: 38, fieldKey: "ink", primitive: "annotation" },
];

function RoomCard({ room }) {
  const recipe = compose({
    seed: room.seed,
    fieldKey: room.fieldKey,
    primitive: room.primitive,
    density: "sparse",
    headlineSize: 0,
    hasRibbon: false,
    hasHeadline: false,
    hasMeta: false,
  });
  return (
    <div className="ui-card">
      <div className="ui-thumb">
        <Composition recipe={recipe} showMeta={false} />
      </div>
      <div className="ui-info">
        <div className="name">{room.name}</div>
        <div className="meta">{room.meta}</div>
      </div>
    </div>
  );
}

function ProductUIBlock() {
  return (
    <div className="ui-block">
      <div className="ui-head">
        <div>
          <div className="title">My rooms</div>
          <div className="sub">8 designs · 4 collaborators</div>
        </div>
        <div className="spacer"></div>
        <span className="ui-search">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          Search rooms
        </span>
        <button className="btn">+ New room</button>
      </div>
      <div className="ui-grid">
        {ROOMS.map((r, i) => <RoomCard key={i} room={r} />)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SOCIAL TILES — story + square + portrait banner
───────────────────────────────────────────── */
function SocialTiles() {
  const story = compose({ seed: 901, fieldKey: "blueberry", primitive: "stroke", density: "medium", headlineSize: 9, hasRibbon: true, hasHeadline: true, hasMeta: false });
  story.strokeColor = "#92F5B5";
  story.ribbon.edge = "bottom";

  const square = compose({ seed: 902, fieldKey: "mango", primitive: "annotation", density: "sparse", headlineSize: 12, hasRibbon: false, hasHeadline: true, hasMeta: false });

  const banner = compose({ seed: 903, fieldKey: "ink", primitive: "passthrough", density: "sparse", headlineSize: 8, hasRibbon: true, hasHeadline: true, hasMeta: false });
  banner.passthroughKind = "robot";
  banner.ribbon.edge = "top";

  return (
    <div className="social-row">
      <div className="social story">
        <div style={{position: "relative", width: "100%", height: "100%"}}>
          <Composition recipe={story} headlineText={"Bringing\nbetter\nproducts\nto life."} showMeta={false} />
        </div>
      </div>
      <div className="social square">
        <div style={{position: "relative", width: "100%", height: "100%"}}>
          <Composition recipe={square} headlineText={"What's new\nin 6.5?"} showMeta={false} />
        </div>
      </div>
      <div className="social banner">
        <div style={{position: "relative", width: "100%", height: "100%"}}>
          <Composition recipe={banner} headlineText={"Behind\nthe build"} showMeta={false} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EMAIL — release announcement
───────────────────────────────────────────── */
function EmailCard() {
  const recipe = compose({
    seed: 555,
    fieldKey: "blueberry",
    primitive: "stroke",
    density: "medium",
    headlineSize: 0,
    hasRibbon: false,
    hasHeadline: false,
    hasMeta: false,
  });
  recipe.strokeColor = "#FFBC3A";
  return (
    <div className="email-card">
      <div className="e-hero">
        <Composition recipe={recipe} showMeta={false} />
      </div>
      <div className="e-body">
        <span className="eyebrow">Release · 6.5</span>
        <h3>A new selection tool — fewer clicks, more flow.</h3>
        <p>We rebuilt selection from the ground up. Smart proximity, multi-stroke editing, and an undo stack that finally keeps up with you.</p>
        <div style={{display: "flex", gap: 8, marginTop: "auto"}}>
          <span className="pill berry">Read the notes <span className="arr">&gt;&gt;&gt;</span></span>
          <span className="pill outline">Watch — 90s</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window.GS, { LandingHero, MarketingGrid, ProductUIBlock, SocialTiles, EmailCard, MarketingTile });
})();
