/* global React, ReactDOM */
/* ───────────────────────────────────────────────
   app.jsx — the working doc itself
   Sections: cover · concept · stress test · principles
   · primitives · live generator · gallery · surfaces
   · tokens · open questions
─────────────────────────────────────────────── */

(function() {
const { useState, useMemo, useCallback } = React;
const { Composition, Stroke, SectionView, Passthrough, AnnotationRibbon, Pill, compose, RULES,
        LandingHero, MarketingGrid, ProductUIBlock, SocialTiles, EmailCard } = window.GS;

/* ─────────────────────────────────────────────
   Section frame
───────────────────────────────────────────── */
function Section({ num, label, tag, children, dataLabel }) {
  return (
    <section className="doc-section" data-screen-label={dataLabel}>
      <div className="section-meta">
        <span className="num">§{num}</span>
        <span className="label">{label}</span>
        {tag && <span className="tag">{tag}</span>}
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   COVER
───────────────────────────────────────────── */
function Cover() {
  return (
    <section className="doc-section cover" data-screen-label="01 Cover">
      <div>
        <div className="doc-id">
          <span>brand · working spec v0.1</span>
          <span>author · lead product design</span>
          <span>status · in review</span>
          <span>last edit · 19 may 2026</span>
        </div>
        <h1>In the <em>making</em>.<br/>A system, not an asset.</h1>
        <p className="lede">
          <strong>"In the Making"</strong> is the moment between idea and reality — real enough to touch,
          open enough to change. This doc formalises that concept into a generative
          system: <strong>four primitives, six fields, one rule of contrast.</strong> Every output
          rolls from the same dice.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   STRESS TEST
───────────────────────────────────────────── */
function StressTest() {
  return (
    <Section num="01" label="Stress test" tag="quick verdicts" dataLabel="02 Stress test">
      <h2 className="section-h">Does the system hold?</h2>
      <p className="body-l text-sub">
        Three scenarios. Pass / partial / fail. Where the system bends, the rule that needs to flex.
      </p>
      <div className="verdict-grid">
        <div className="verdict">
          <span className="scenario">Scenario A</span>
          <h4>Does it scale to enterprise contexts?</h4>
          <span className="status partial">Partial — needs a quiet mode</span>
          <ul>
            <li>Big colour fields photograph well in IR materials and proposals.</li>
            <li>The "mid-gesture" stroke reads as <em>unfinished</em> to procurement; needs an "evidence" variant — same primitives, lower saturation, mono ink option (the <strong>ink</strong> field).</li>
            <li>OEM logo lockups: keep the stroke <strong>off</strong> co-branded headers. Annotation primitive is the only one that survives logo-density.</li>
            <li>Verdict: ship a <strong>"calm" preset</strong> — bone field, ink stroke, one primitive, no ribbon.</li>
          </ul>
        </div>
        <div className="verdict">
          <span className="scenario">Scenario B</span>
          <h4>Can marketing use it without a designer?</h4>
          <span className="status pass">Pass — with guardrails</span>
          <ul>
            <li>Six fields × four primitives × seed = a finite, browsable library. Marketers pick a seed they like and lock it.</li>
            <li>The rule "one brand field per composition, one hero primitive" is enforceable by template.</li>
            <li>Risk: the headline / safe-zone rule needs auto-placement, not manual. Build it into the Figma plugin and the email tool.</li>
            <li>Verdict: ship a <strong>seed picker</strong> + lock. No free composition.</li>
          </ul>
        </div>
        <div className="verdict">
          <span className="scenario">Scenario C</span>
          <h4>Does it break in dense UI / small formats?</h4>
          <span className="status fail">Fails — and that's correct</span>
          <ul>
            <li>Below ~120px the stroke loses its 3D shading and reads as a smudge. Annotation pills crash into each other below 240px wide.</li>
            <li>This is a <strong>feature, not a bug</strong>: the brand should never appear in product chrome. Demote to thumbnails only.</li>
            <li>Inside GSWeb: brand lives in room thumbnails and empty states. Toolbar, modals, settings = neutral system UI.</li>
            <li>Verdict: codify a <strong>minimum-size rule</strong> (240px short edge); below it, fall back to the wordmark alone.</li>
          </ul>
        </div>
      </div>
      <div className="note">
        <strong>One direction to push:</strong> the system is rule-based, not asset-based — so the
        rules <em>are</em> the brand. Documenting them in code (this page) means a Figma plugin,
        a CMS template, and the product can all consume the same source of truth. No DAM with
        500 stale PNGs.
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   PRINCIPLES
───────────────────────────────────────────── */
const PRINCIPLES = [
  {
    n: "P01",
    title: "One field. One gesture.",
    body: "Every composition gets a single brand colour as a full-bleed field, and a single hero primitive. Never two accents fighting. Never two heroes. The field is loud; the gesture is what you remember.",
    anti: "ANTI: gradients, two-colour splits, multiple heroes",
  },
  {
    n: "P02",
    title: "Mid-gesture, never resolved.",
    body: "Strokes don't close. Sections don't re-align. Annotations don't summarise. The brand is the act of making, not the artefact. If it looks finished, the seed is wrong — reseed.",
    anti: "ANTI: closed loops, centred symmetry, summary copy",
  },
  {
    n: "P03",
    title: "Contrast by rule, not by eye.",
    body: "Each field has a fixed set of allowed stroke colours. Blueberry × mint, blueberry × mango, raspberry × mint — never raspberry × mango. The rule lives in code; designers don't audition.",
    anti: "ANTI: brand colour on its own scale, washed pairs",
  },
  {
    n: "P04",
    title: "Four primitives — no fifth.",
    body: "Stroke, section view, passthrough crop, annotation. Each maps to a product feature. Adding a fifth costs nothing in software and everything in clarity — refuse new ones.",
    anti: "ANTI: 'iconography sets', illustrative cast members, hero photography",
  },
  {
    n: "P05",
    title: "Type is structural, not decorative.",
    body: "Inter, three sizes, four corner anchors. Always a safe zone (TL/TR/BL/BR), never floating mid-canvas. Headlines are short enough to fit one anchor at 14ch.",
    anti: "ANTI: centred type, display script faces, type wrapped to primitives",
  },
  {
    n: "P06",
    title: "Annotations are the brand voice.",
    body: "The ribbon pills — TAGLINE >>>, BEHIND THE BUILD >>> — are the only place the brand 'talks'. Always mono, always uppercase, always with the >>> terminator. Used sparingly; one ribbon per layout.",
    anti: "ANTI: tagline as headline, decorative quotation, multiple ribbons",
  },
  {
    n: "P07",
    title: "Brand stops at the chrome.",
    body: "Inside the product, brand lives in thumbnails, empty states, and onboarding moments only. Toolbars, modals, dense lists use neutral system UI. The product is the canvas, not the painting.",
    anti: "ANTI: brand-coloured menus, branded toasts, branded loading spinners",
  },
  {
    n: "P08",
    title: "Every output has a seed.",
    body: "Compositions are deterministic — same recipe, same pixels. Marketing locks a seed; product picks one per room. We can rebuild any past asset from its seed alone. No DAM rot.",
    anti: "ANTI: untraceable variants, one-off PSDs, 'designer's vibe'",
  },
];

function Principles() {
  return (
    <Section num="02" label="Principles" tag="rules of the system" dataLabel="03 Principles">
      <h2 className="section-h">Eight rules.<br/>Every output passes all eight.</h2>
      <div className="principles">
        {PRINCIPLES.map(p => (
          <div className="principle" key={p.n}>
            <span className="pnum">{p.n}</span>
            <h4>{p.title}</h4>
            <p>{p.body}</p>
            <span className="ant">{p.anti}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   PRIMITIVES CATALOG
───────────────────────────────────────────── */
function PrimitivesCatalog() {
  const stroke = compose({ seed: 7012, fieldKey: "bone", primitive: "stroke", density: "sparse", headlineSize: 0, hasRibbon: false, hasHeadline: false, hasMeta: false });
  const section = compose({ seed: 7013, fieldKey: "bone", primitive: "section", density: "sparse", headlineSize: 0, hasRibbon: false, hasHeadline: false, hasMeta: false });
  section.strokeColor = "#1A1A1B";
  const passthrough = compose({ seed: 7014, fieldKey: "bone", primitive: "passthrough", density: "sparse", headlineSize: 0, hasRibbon: false, hasHeadline: false, hasMeta: false });
  passthrough.passthroughKind = "chair";
  const annotation = compose({ seed: 7015, fieldKey: "bone", primitive: "annotation", density: "sparse", headlineSize: 0, hasRibbon: true, hasHeadline: false, hasMeta: false });
  annotation.ribbon.edge = "bottom";

  const cards = [
    { recipe: stroke, name: "Stroke", role: "PRODUCT · 3D PEN", desc: "The signature gesture. A Catmull-Rom curve with depth shading. Always mid-stroke. Width is the only knob." },
    { recipe: section, name: "Section view", role: "PRODUCT · SECTION VIEW", desc: "A slice + displacement. Reveals interior, never seals back. Angle and gap are seeded — never user-controlled in templates." },
    { recipe: passthrough, name: "Passthrough crop", role: "PRODUCT · PASSTHROUGH AR", desc: "A windowed crop showing 'the world' inside the brand. The thing being made (chair, helmet, shoe). The only place real photography lives." },
    { recipe: annotation, name: "Annotation", role: "PRODUCT · ANNOTATIONS", desc: "Mono pills, uppercase, with the >>> terminator. The only verbal layer. Runs as a ribbon along one edge — never two." },
  ];

  return (
    <Section num="03" label="Primitives" tag="four atoms" dataLabel="04 Primitives">
      <h2 className="section-h">Four primitives. Each maps to a product feature.</h2>
      <p className="body-l text-sub">The brand is the product. The four atoms below are the only things we draw. Each one is a Gravity Sketch feature the user already uses — the brand is functional, not applied.</p>
      <div className="primitives-grid">
        {cards.map((c, i) => (
          <div className="primitive-card" key={i}>
            <div className="canvas">
              <Composition recipe={c.recipe} showMeta={false} />
            </div>
            <div className="meta">
              <span className="role">{c.role}</span>
              <h4>{c.name}</h4>
              <p className="desc">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   LIVE GENERATOR — the heart of the doc
───────────────────────────────────────────── */
function Generator() {
  const [seed, setSeed] = useState(2057);
  const [fieldKey, setFieldKey] = useState("blueberry");
  const [primitive, setPrimitive] = useState("stroke");
  const [density, setDensity] = useState("medium");
  const [headlineSize, setHeadlineSize] = useState(14);
  const [hasRibbon, setHasRibbon] = useState(true);
  const [hasHeadline, setHasHeadline] = useState(true);
  const [hasMeta, setHasMeta] = useState(true);

  const recipe = useMemo(() => compose({
    seed, fieldKey, primitive, density, headlineSize, hasRibbon, hasHeadline, hasMeta,
  }), [seed, fieldKey, primitive, density, headlineSize, hasRibbon, hasHeadline, hasMeta]);

  const reroll = useCallback(() => setSeed(Math.floor(Math.random() * 999999)), []);

  // Pretty-printed recipe (the rules in JSON form)
  const recipeJson = useMemo(() => {
    return [
      <div key="0"><span className="c">// rolls deterministically from seed</span></div>,
      <div key="1"><span className="k">seed</span> · <span className="v">{seed}</span></div>,
      <div key="2"><span className="k">field</span> · <span className="v">"{fieldKey}"</span> <span className="c">→ {recipe.bg}</span></div>,
      <div key="3"><span className="k">primitive</span> · <span className="v">"{primitive}"</span> <span className="c">(hero)</span></div>,
      <div key="4"><span className="k">density</span> · <span className="v">"{density}"</span> <span className="c">→ {recipe.supports.length} support primitive{recipe.supports.length === 1 ? "" : "s"}</span></div>,
      <div key="5"><span className="k">stroke</span> · <span className="v">"{recipe.strokeKey}"</span> <span className="c">{recipe.strokeColor}</span> <span className="c">// chosen from field's allow-list</span></div>,
      <div key="6"><span className="k">headline.zone</span> · <span className="v">"{recipe.headline.zone}"</span></div>,
      <div key="7"><span className="k">ribbon.edge</span> · <span className="v">"{recipe.ribbon.edge}"</span></div>,
      <div key="8"></div>,
      <div key="9"><span className="b">composition.render(recipe)</span> <span className="c">→ pixels</span></div>,
    ];
  }, [seed, fieldKey, primitive, density, recipe]);

  return (
    <Section num="04" label="Live generator" tag="parametric · seeded" dataLabel="05 Live generator">
      <h2 className="section-h">The system, running live.</h2>
      <p className="body-l text-sub">Move a control. Every composition on this page below stays the same — that's deterministic. Click the canvas to reroll; the recipe on the right is the only thing that changes between outputs.</p>

      <div className="generator">
        <div className="gen-stage">
          <div className="stage-head">
            <span>// composition · seed {seed}</span>
            <span>{primitive} · {fieldKey} · {density}</span>
          </div>
          <div className="canvas-wrap" onClick={reroll} title="Click to reroll" style={{cursor: "pointer"}}>
            <Composition recipe={recipe} />
          </div>
          <div className="recipe">{recipeJson}</div>
        </div>

        <div className="gen-controls">
          <h4>Controls</h4>

          <div className="ctrl-group">
            <label><span>Seed</span><span>{seed}</span></label>
            <div className="btn-row">
              <button className="btn secondary" onClick={() => setSeed(s => Math.max(1, s - 1))}>−</button>
              <button className="btn" style={{flex: 1}} onClick={reroll}>↻ Reroll</button>
              <button className="btn secondary" onClick={() => setSeed(s => s + 1)}>+</button>
            </div>
          </div>

          <div className="ctrl-group">
            <label><span>Field</span><span>{fieldKey}</span></label>
            <div className="swatch-row">
              {Object.entries(RULES.fields).map(([k, v]) => (
                <button key={k}
                  className="swatch"
                  aria-pressed={fieldKey === k}
                  onClick={() => setFieldKey(k)}
                  style={{ background: v.bg }}
                  title={k}
                />
              ))}
            </div>
          </div>

          <div className="ctrl-group">
            <label><span>Hero primitive</span><span>{primitive}</span></label>
            <div className="seg">
              {RULES.primitives.map(p => (
                <button key={p} aria-pressed={primitive === p} onClick={() => setPrimitive(p)}>{p.slice(0, 4)}</button>
              ))}
            </div>
          </div>

          <div className="ctrl-group">
            <label><span>Density</span><span>{density}</span></label>
            <div className="seg">
              {["sparse", "medium", "dense"].map(d => (
                <button key={d} aria-pressed={density === d} onClick={() => setDensity(d)}>{d}</button>
              ))}
            </div>
          </div>

          <div className="ctrl-group">
            <label><span>Headline size</span><span>{headlineSize}cqw</span></label>
            <input type="range" min="8" max="22" step="1" value={headlineSize}
              onChange={e => setHeadlineSize(+e.target.value)} />
          </div>

          <div className="ctrl-group">
            <label><span>Layers</span></label>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6}}>
              <button className={`btn ${hasHeadline ? "" : "secondary"}`} onClick={() => setHasHeadline(v => !v)}>Headline</button>
              <button className={`btn ${hasRibbon ? "" : "secondary"}`} onClick={() => setHasRibbon(v => !v)}>Ribbon</button>
              <button className={`btn ${hasMeta ? "" : "secondary"}`} onClick={() => setHasMeta(v => !v)} style={{gridColumn: "span 2"}}>Recipe overlay</button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   GALLERY — 12 outputs from the same rules
───────────────────────────────────────────── */
function Gallery() {
  const cells = useMemo(() => {
    const out = [];
    const fields = ["blueberry", "mint", "mango", "raspberry", "ink", "bone"];
    const prims = ["stroke", "section", "passthrough", "annotation"];
    const densities = ["sparse", "medium", "dense"];
    const headlines = ["In the\nmaking", "Bringing\nbetter\nproducts", "Behind\nthe build", "Section\nview", "Mid\ngesture", "Six fields,\none rule", "Tagline\nribbon", "From idea\nto real", "Iterate\nin context", "Annotate\nthe world", "Pass\nthrough", "Always\nopen"];
    let seed = 1000;
    for (let i = 0; i < 12; i++) {
      const r = compose({
        seed: seed + i * 17,
        fieldKey: fields[i % fields.length],
        primitive: prims[i % prims.length],
        density: densities[i % densities.length],
        headlineSize: 11,
        hasRibbon: i % 2 === 0,
        hasHeadline: true,
        hasMeta: false,
      });
      out.push({ recipe: r, headline: headlines[i] });
    }
    return out;
  }, []);

  return (
    <Section num="05" label="Gallery" tag="12 outputs · same rules" dataLabel="06 Gallery">
      <h2 className="section-h">Same eight rules. Twelve outputs.</h2>
      <p className="body-l text-sub">No two are alike. No two look out of system. This is what a generative brand looks like at rest — a finite vocabulary, infinite phrases.</p>
      <div className="gallery">
        {cells.map((c, i) => (
          <div className="tile" key={i}>
            <Composition recipe={c.recipe} headlineText={c.headline} showMeta={true} />
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   APPLIED SURFACES
───────────────────────────────────────────── */
function AppliedSurfaces() {
  return (
    <Section num="06" label="Applied" tag="proof in context" dataLabel="07 Applied surfaces">
      <h2 className="section-h">It holds across every surface we ship.</h2>
      <p className="body-l text-sub">Same primitives. Same rules. From landing page to in-product thumbnail to social. The system flexes; the brand doesn't break.</p>

      <div className="surfaces">
        <div className="surface-block">
          <div className="surface-label">
            <span className="num">SURFACE 01</span>
            Landing — hero
            <p>Bone field, single green stroke, ribbon pills along the bottom edge.</p>
          </div>
          <LandingHero/>
        </div>

        <div className="surface-block">
          <div className="surface-label">
            <span className="num">SURFACE 02</span>
            Marketing tile grid
            <p>Twelve tiles, each obeying the field × primitive rule. Updates · trainings · webinars · portraits — the layout templates differ; the system doesn't.</p>
          </div>
          <MarketingGrid/>
        </div>

        <div className="surface-block">
          <div className="surface-label">
            <span className="num">SURFACE 03</span>
            Product UI · room dashboard
            <p>Brand demoted to room thumbnails. Chrome is neutral. P07 in action.</p>
          </div>
          <ProductUIBlock/>
        </div>

        <div className="surface-block">
          <div className="surface-label">
            <span className="num">SURFACE 04</span>
            Social tiles
            <p>Story (9:16), square (1:1), portrait banner (4:5). Same rules at three crops — no bespoke art per format.</p>
          </div>
          <SocialTiles/>
        </div>

        <div className="surface-block">
          <div className="surface-label">
            <span className="num">SURFACE 05</span>
            Email — release announcement
            <p>Hero is a composition. Body is the design system. Two CTAs, no decorative graphics.</p>
          </div>
          <EmailCard/>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   TOKENS
───────────────────────────────────────────── */
function Tokens() {
  const swatches = [
    { name: "blueberry", val: "#6530F7", on: "#fff" },
    { name: "mint",      val: "#92F5B5", on: "#000" },
    { name: "mango",     val: "#FFBC3A", on: "#000" },
    { name: "raspberry", val: "#FA5050", on: "#fff" },
    { name: "bone",      val: "#F0F0F0", on: "#000" },
    { name: "ink",       val: "#1A1A1B", on: "#fff" },
    { name: "stroke-green", val: "#3DDC83", on: "#000" },
    { name: "primary-50",   val: "#F4F2FF", on: "#000" },
  ];
  return (
    <Section num="07" label="Tokens" tag="colour · type · motion" dataLabel="08 Tokens">
      <h2 className="section-h">Tokens are the contract.</h2>
      <p className="body-l text-sub">Every value in this doc resolves to a CSS custom property in <code style={{fontFamily: "var(--font-mono)"}}>colors_and_type.css</code>. No new tokens were invented for this brand evolution — we composed with what already exists.</p>
      <div className="tokens-grid">
        {swatches.map(s => (
          <div className="token-chip" key={s.name}>
            <div className="swatch-large" style={{background: s.val}}></div>
            <span className="name">{s.name}</span>
            <span className="val">{s.val}</span>
          </div>
        ))}
      </div>
      <div className="callout">
        <span className="mono">type</span>
        <div>
          <div style={{fontWeight: 700, fontSize: 56, lineHeight: 0.95, letterSpacing: "-0.04em"}}>Inter — display</div>
          <div className="text-sub" style={{marginTop: 4, fontSize: 13}}>700 / -0.04em tracking · used for all headlines and primitive type. Three sizes max per layout: display-xl, display-md, text-sm.</div>
        </div>
      </div>
      <div className="callout">
        <span className="mono">motion</span>
        <div>
          <div style={{fontWeight: 600, fontSize: 18, letterSpacing: "-0.01em"}}>Always mid-gesture.</div>
          <div className="text-sub" style={{marginTop: 4, fontSize: 13}}>Strokes animate as if being drawn — but never complete. Use a 1.6s draw loop with a 0.3s pause at ~88% completion, then snap back. Section views shift on enter (200ms ease-out displacement). No spring.</div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   OPEN QUESTIONS
───────────────────────────────────────────── */
function OpenQuestions() {
  const qs = [
    { q: "Should the four primitives ever combine into a fifth?", a: "Strong no in v1. If a fifth pattern emerges from real use after 6 months, formalise it. The cost of a fifth is not pixel space — it's the loss of the 'four' as a memorable claim." },
    { q: "What about photography of real designers / users?", a: "Allowed inside the passthrough primitive only. Always mono, always cropped to the passthrough window shape. Never full-bleed. Photography is content; the system is the frame." },
    { q: "Does each enterprise client get a custom field?", a: "No. The four brand fields are fixed. Enterprise can have a co-brand pill (annotation primitive, outline variant) — that's the extension surface." },
    { q: "How does this render in 3D / VR?", a: "Open. The stroke primitive is already 3D inside the product. The passthrough primitive already exists as a feature. Section view too. The brand is the product's UI taken outside of the product — VR materials should use the actual feature output, not a 2D mock of it." },
    { q: "What replaces hero photography in case studies?", a: "Passthrough crops of the design itself (chair, helmet, shoe), surrounded by stroke gestures showing iteration. The case study IS the iteration, visualised. No before/after; only mid-process." },
  ];
  return (
    <Section num="08" label="Open questions" tag="for discussion" dataLabel="09 Open questions">
      <h2 className="section-h">Where we still have to decide.</h2>
      <div style={{display: "flex", flexDirection: "column", gap: 12}}>
        {qs.map((x, i) => (
          <div key={i} className="callout" style={{gridTemplateColumns: "60px 1fr"}}>
            <span className="mono">Q.0{i + 1}</span>
            <div>
              <div style={{fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em", marginBottom: 4}}>{x.q}</div>
              <div className="text-sub" style={{fontSize: 14, lineHeight: 1.5}}>{x.a}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="note" style={{marginTop: 16}}>
        <strong>Next steps.</strong> (1) Codify the rule set as a small JS package that the website, Figma plugin, and email tool can all consume. (2) Build the seed-lock UI for marketing. (3) Decide the calm enterprise preset. (4) Run a fresh marketing campaign generated entirely from the system — measure if non-designers can ship without art-direction round-trips.
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────
   STATUS BAR
───────────────────────────────────────────── */
function StatusBar() {
  return (
    <div className="statusbar">
      <span className="dot"></span>
      <div className="breadcrumb">
        <span>Brand</span>
        <span style={{color: "var(--color-greys-200)"}}>/</span>
        <span style={{color: "var(--color-text-default)"}}>In the Making — Working spec</span>
      </div>
      <span className="spacer"></span>
      <span className="meta">
        <span>v0.1</span>
        <span>4 primitives · 6 fields · 8 rules</span>
        <span>last edit · today</span>
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
function App() {
  return (
    <>
      <StatusBar />
      <main>
        <Cover />
        <StressTest />
        <Principles />
        <PrimitivesCatalog />
        <Generator />
        <Gallery />
        <AppliedSurfaces />
        <Tokens />
        <OpenQuestions />
        <footer style={{padding: "48px 0 24px", borderTop: "1px solid var(--color-border-default)", color: "var(--color-text-subtle)", fontSize: 12, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em"}}>
          // end of working spec · in the making · v0.1
        </footer>
      </main>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
})();
