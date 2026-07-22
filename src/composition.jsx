/* global React */
/* ───────────────────────────────────────────────
   composition.jsx — Render a recipe to a canvas
   A Composition is the system's atomic output.
   Same recipe → same pixels. Different seed → new pixels.
─────────────────────────────────────────────── */

(function() {
const { Stroke, SectionView, Passthrough, AnnotationRibbon, Pill } = window.GS;

/* Render the primary "hero" primitive at full canvas scale (or close) */
function HeroPrimitive({ recipe }) {
  const { primitive, strokeColor, strokeWidth, strokeSeed, hero, bg, sectionAngle, sectionGap, sectionShift, passthroughKind, onColor, passthroughW, passthroughH } = recipe;
  // hero placed via translate within 100x100 viewBox
  const hx = 10 + hero.x * 30; // narrowed band so hero is roughly centered
  const hy = 10 + hero.y * 30;
  const sc = hero.scale;

  if (primitive === "stroke") {
    // stroke spans the entire canvas; ignore scale (it owns the field)
    return <Stroke seed={strokeSeed} color={strokeColor} width={strokeWidth * 0.4} />;
  }
  if (primitive === "section") {
    // Place section view near canvas centre with mild seeded variation
    const cx = 35 + hero.x * 30; // 35..65
    const cy = 35 + hero.y * 30;
    return <SectionView color={strokeColor} contrast={bg === "#1A1A1B" ? "#FFFFFF" : "#1A1A1B"}
      angle={sectionAngle} gap={sectionGap} shift={sectionShift}
      transform={`translate(${cx} ${cy}) scale(${sc * 1.15}) translate(-50 -50)`} />;
  }
  if (primitive === "passthrough") {
    const w = passthroughW * 100;
    const h = passthroughH * 100;
    return <Passthrough kind={passthroughKind} w={w} h={h}
      x={(100 - w) / 2 + hero.x * 10 - 5}
      y={(100 - h) / 2 + hero.y * 10 - 5}
      rotate={hero.rot * 0.3}
      bg={bg === "#F0F0F0" ? "#FFFFFF" : "#F0F0F0"} />;
  }
  if (primitive === "annotation") {
    // hero annotation = larger single label
    return (
      <g transform={`translate(${hx} ${hy})`}>
        <rect width="60" height="14" rx="7" fill="#1A1A1B" />
        <text x="30" y="9.5" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5.5" fontWeight="700" letterSpacing="0.4" fill="#FFFFFF">
          IN THE MAKING <tspan letterSpacing="-0.3">{">>>"}</tspan>
        </text>
      </g>
    );
  }
  return null;
}

/* Render any support primitives at small scale */
function SupportPrimitive({ s, recipe }) {
  const { strokeColor, strokeSeed, bg } = recipe;
  const x = s.x * 100;
  const y = s.y * 100;
  if (s.kind === "stroke") {
    return (
      <g transform={`translate(${x} ${y}) scale(${s.scale}) translate(-50 -50) rotate(${s.rot} 50 50)`}>
        <Stroke seed={s.kind === "stroke" ? recipe.strokeSeed + 7 : 0} color={strokeColor} width={8} />
      </g>
    );
  }
  if (s.kind === "section") {
    const sx = x;
    const sy = y;
    return (
      <g transform={`translate(${sx} ${sy}) scale(${s.scale}) translate(-50 -50)`}>
        <SectionView color={strokeColor} contrast={bg === "#1A1A1B" ? "#FFFFFF" : "#1A1A1B"} angle={45} gap={0.1} shift={0.06} />
      </g>
    );
  }
  if (s.kind === "passthrough") {
    const w = 28, h = 36;
    return <Passthrough kind={recipe.passthroughKind} w={w * s.scale * 2} h={h * s.scale * 2}
      x={x - (w * s.scale * 2) / 2} y={y - (h * s.scale * 2) / 2}
      bg={bg === "#F0F0F0" ? "#FFFFFF" : "#F0F0F0"} />;
  }
  return null;
}

/* Headline placed in safe zones */
function CompositionHeadline({ recipe, text }) {
  const { headline, onColor } = recipe;
  if (!headline.show) return null;
  const z = headline.zone;
  const fs = headline.size;
  const styles = {
    tl: { top: "10%", left: "10%", textAlign: "left", maxWidth: "50%" },
    tr: { top: "10%", right: "10%", textAlign: "right", maxWidth: "50%" },
    bl: { bottom: "18%", left: "10%", textAlign: "left", maxWidth: "50%" },
    br: { bottom: "18%", right: "10%", textAlign: "right", maxWidth: "50%" },
  };
  return (
    <div style={{
      position: "absolute",
      ...styles[z],
      color: onColor,
      fontWeight: 700,
      fontSize: `${fs}cqw`,
      lineHeight: 0.95,
      letterSpacing: "-0.03em",
      pointerEvents: "none",
      whiteSpace: "pre-line",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
      hyphens: "auto",
    }}>
      {text}
    </div>
  );
}

/* Composition shell — the rendered output */
function Composition({ recipe, headlineText = "In the\nmaking", showMeta = true, className = "", style = {} }) {
  if (!recipe) return null;
  const { bg, primitive, supports, ribbon, onColor, fieldKey, seed } = recipe;
  return (
    <div className={`composition ${className}`} style={{
      width: "100%", height: "100%",
      position: "absolute", inset: 0,
      background: bg,
      containerType: "inline-size",
      ...style,
    }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <HeroPrimitive recipe={recipe} />
        {supports.map((s, i) => <SupportPrimitive key={i} s={s} recipe={recipe} />)}
        {ribbon.show && (
          <AnnotationRibbon
            edge={ribbon.edge}
            label={fieldKey === "ink" ? "BEHIND THE BUILD" : (primitive === "passthrough" ? "BEHIND THE BUILD" : "TAGLINE")}
            count={primitive === "annotation" ? 8 : 6}
            fill={onColor === "#FFFFFF" ? "#1A1A1B" : "#1A1A1B"}
            textColor="#FFFFFF"
          />
        )}
      </svg>
      <CompositionHeadline recipe={recipe} text={headlineText} />
      {showMeta && recipe.meta.show && (
        <div style={{
          position: "absolute",
          top: "8px", left: "10px",
          fontFamily: "ui-monospace, 'JetBrains Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: onColor,
          opacity: 0.6,
        }}>
          // seed {seed.toString().slice(-4)} · {primitive}
        </div>
      )}
    </div>
  );
}

window.GS = window.GS || {};
Object.assign(window.GS, { Composition, HeroPrimitive, SupportPrimitive, CompositionHeadline });
})();
