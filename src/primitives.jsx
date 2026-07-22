/* global React */
/* ───────────────────────────────────────────────
   primitives.jsx — the four atoms of "In the Making"
   1. Stroke      — generative 3D-style path, mid-gesture
   2. Section     — hard cut + offset, a cross-section
   3. Passthrough — a windowed crop revealing another layer
   4. Annotation  — pill labels, ribbon-able

   Each is a pure SVG component sized via viewBox 0-100.
   They compose: render any number into a 100x100 stage.
─────────────────────────────────────────────── */

(function() {
const { useMemo } = React;

/* ─────────────────────────────────────────────
   1. STROKE — Catmull-Rom curve from seeded points
   The brand's signature gesture. Drawn with depth
   via dual paths (shadow underlay + bright top).
───────────────────────────────────────────── */
function strokePath(seed, n = 6, jitter = 30) {
  const rng = window.GS.buildRng(seed);
  const pts = [];
  // start somewhere on the left half, end somewhere on the right half
  pts.push([rng.range(5, 35), rng.range(20, 80)]);
  for (let i = 0; i < n - 2; i++) {
    pts.push([
      rng.range(10 + i * 12, 30 + i * 12),
      rng.range(10, 90),
    ]);
  }
  pts.push([rng.range(65, 95), rng.range(20, 80)]);

  // Catmull-Rom → cubic bezier
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const tension = 6;
    const cp1x = p1[0] + (p2[0] - p0[0]) / tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) / tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) / tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) / tension;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function Stroke({ seed = 1, color = "#92F5B5", width = 14, x = 0, y = 0, scale = 1, rotate = 0, transform }) {
  const d = useMemo(() => strokePath(seed), [seed]);
  const t = transform || `translate(${x} ${y}) scale(${scale}) rotate(${rotate} 50 50)`;
  // Darker shade derived by mixing toward black
  const shade = `color-mix(in oklab, ${color} 70%, #000)`;
  const hilite = `color-mix(in oklab, ${color} 70%, #fff)`;

  return (
    <g transform={t}>
      {/* dropped shadow underlay for depth */}
      <path d={d}
        fill="none"
        stroke={shade}
        strokeWidth={width + 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(1.5 2.5)"
        opacity="0.55"
      />
      {/* main fill stroke */}
      <path d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* upper highlight to suggest extrusion */}
      <path d={d}
        fill="none"
        stroke={hilite}
        strokeWidth={width * 0.18}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`translate(0 ${-width * 0.18})`}
        opacity="0.85"
      />
    </g>
  );
}

/* ─────────────────────────────────────────────
   2. SECTION — a cross-section reveal.
   A rectangle is split along an angle; halves are
   displaced perpendicular to the cut, revealing the
   gap behind.
───────────────────────────────────────────── */
function SectionView({ color = "#1A1A1B", contrast = "#FFFFFF", angle = 0, gap = 0.1, shift = 0.08, x = 0, y = 0, scale = 1, rotate = 0, transform }) {
  const t = transform || `translate(${x} ${y}) scale(${scale}) rotate(${rotate} 50 50)`;
  // A 60×60 square at (50,50) split horizontally; the two halves displace
  // up/down by `shift`, exposing a contrasting backing slab in the gap.
  // The whole thing rotates by `angle` around the centre.
  const cx = 50, cy = 50;
  const half = 30;
  const s = shift * 60; // displacement in local units
  return (
    <g transform={t}>
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        {/* contrasting backing slab — its edges peek through the gap */}
        <rect x={cx - half + 1} y={cy - half - s} width={half * 2 - 2} height={half * 2 + s * 2}
          fill={contrast} rx="2" opacity="0.95"/>
        {/* top half, displaced up */}
        <rect x={cx - half} y={cy - half - s} width={half * 2} height={half}
          fill={color} rx="2"/>
        {/* hatching on the cut edge of the top half */}
        <line x1={cx - half + 4} y1={cy - s + 0.6} x2={cx + half - 4} y2={cy - s + 0.6}
          stroke={contrast} strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.7"/>
        {/* bottom half, displaced down */}
        <rect x={cx - half} y={cy + s} width={half * 2} height={half}
          fill={color} rx="2"/>
        <line x1={cx - half + 4} y1={cy + s - 0.6} x2={cx + half - 4} y2={cy + s - 0.6}
          stroke={contrast} strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.7"/>
        {/* tick marks indicating "section" — small notches on the sides */}
        <rect x={cx - half - 1} y={cy - s - 1.5} width="2" height="3" fill={contrast} opacity="0.8"/>
        <rect x={cx + half - 1} y={cy + s - 1.5} width="2" height="3" fill={contrast} opacity="0.8"/>
      </g>
    </g>
  );
}

/* ─────────────────────────────────────────────
   3. PASSTHROUGH — a windowed crop showing
   "the real world" inside the brand layer.
   Drawn as a content-shaped rect with a placeholder
   subject (chair, sphere, VR-user silhouette, etc).
───────────────────────────────────────────── */

function PassthroughSubject({ kind, w, h }) {
  // Each subject is drawn fitting 0..w / 0..h
  const cx = w / 2, cy = h / 2;
  if (kind === "sphere") {
    return (
      <g>
        <defs>
          <radialGradient id={`sg-${kind}-${w}-${h}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95"/>
            <stop offset="40%" stopColor="#B8C4D2" />
            <stop offset="100%" stopColor="#383E47"/>
          </radialGradient>
        </defs>
        <ellipse cx={cx} cy={h - 8} rx={w * 0.34} ry="2.5" fill="#000" opacity="0.18"/>
        <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.32} fill={`url(#sg-${kind}-${w}-${h})`} />
      </g>
    );
  }
  if (kind === "chair") {
    // simple side-view chair silhouette
    return (
      <g fill="#F4A48F" stroke="#C97B66" strokeWidth="0.4">
        <rect x={cx - w * 0.18} y={cy - h * 0.05} width={w * 0.36} height={h * 0.06} rx="1.5" />
        <rect x={cx - w * 0.16} y={cy - h * 0.25} width={w * 0.04} height={h * 0.22} rx="1.5" />
        <rect x={cx + w * 0.12} y={cy - h * 0.32} width={w * 0.04} height={h * 0.28} rx="1.5" />
        <rect x={cx - w * 0.14} y={cy + h * 0.01} width={w * 0.02} height={h * 0.18} rx="1" />
        <rect x={cx + w * 0.12} y={cy + h * 0.01} width={w * 0.02} height={h * 0.18} rx="1" />
      </g>
    );
  }
  if (kind === "vrUser") {
    // silhouette of a head with headset (side profile)
    return (
      <g fill="#2A2A2D">
        <circle cx={cx} cy={cy - 2} r={Math.min(w, h) * 0.22} />
        <rect x={cx - w * 0.18} y={cy - h * 0.1} width={w * 0.36} height={h * 0.12} rx="2.5" fill="#1A1A1B" />
        <rect x={cx - w * 0.05} y={cy + h * 0.16} width={w * 0.1} height={h * 0.25} fill="#2A2A2D" rx="2" />
      </g>
    );
  }
  if (kind === "robot") {
    // boxy robot head
    return (
      <g>
        <rect x={cx - w * 0.18} y={cy - h * 0.22} width={w * 0.36} height={h * 0.36} fill="#E5E7EA" stroke="#7A8088" rx="3"/>
        <rect x={cx - w * 0.10} y={cy - h * 0.10} width={w * 0.20} height={h * 0.12} fill="#1A1A1B" rx="2" />
        <circle cx={cx - w * 0.04} cy={cy - h * 0.04} r="1.6" fill="#92F5B5" />
        <circle cx={cx + w * 0.04} cy={cy - h * 0.04} r="1.6" fill="#92F5B5" />
      </g>
    );
  }
  // skyline / room outline
  return (
    <g fill="#7E7F86" opacity="0.7">
      <rect x={2} y={h * 0.55} width={w * 0.22} height={h * 0.4} />
      <rect x={w * 0.25} y={h * 0.35} width={w * 0.18} height={h * 0.6} />
      <rect x={w * 0.46} y={h * 0.5} width={w * 0.2} height={h * 0.45} />
      <rect x={w * 0.7} y={h * 0.3} width={w * 0.25} height={h * 0.65} />
    </g>
  );
}

function Passthrough({ kind = "sphere", w = 40, h = 50, x = 30, y = 25, rotate = 0, bg = "#F0F0F0" }) {
  // window has a rounded mask and a thin border (like a viewport crop)
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate} ${w / 2} ${h / 2})`}>
      <rect x="0" y="0" width={w} height={h} rx="2.5" fill={bg} />
      <PassthroughSubject kind={kind} w={w} h={h} />
      <rect x="0" y="0" width={w} height={h} rx="2.5" fill="none" stroke="#1A1A1B" strokeWidth="0.5" opacity="0.25" />
    </g>
  );
}

/* ─────────────────────────────────────────────
   4. ANNOTATION — pill ribbon
   A row of identical pills running along an edge.
   Always uppercase mono, always with ">>>" terminator.
───────────────────────────────────────────── */
function AnnotationRibbon({ edge = "bottom", label = "TAGLINE", count = 6, fill = "#1A1A1B", textColor = "#FFFFFF" }) {
  // Returns SVG groups that lay out along an edge inside 100x100 viewBox.
  const pills = [];
  const pillW = 22; const pillH = 6.5; const gap = 2;
  const total = (pillW + gap) * count;
  const isHoriz = edge === "top" || edge === "bottom";
  const start = isHoriz ? -((total - 100) / 2) : -((total - 100) / 2);
  const edgePos = edge === "top" ? 3 : edge === "bottom" ? 100 - pillH - 3 : edge === "left" ? 3 : 100 - pillH - 3;

  for (let i = 0; i < count; i++) {
    const px = isHoriz ? start + i * (pillW + gap) : edgePos;
    const py = isHoriz ? edgePos : start + i * (pillW + gap);
    pills.push(
      <g key={i} transform={isHoriz ? `translate(${px} ${py})` : `translate(${px} ${py}) rotate(${edge === "left" ? -90 : 90} 0 0) translate(${edge === "left" ? -pillW : 0} ${edge === "left" ? 0 : -pillH})`}>
        <rect width={pillW} height={pillH} rx={pillH / 2} fill={fill} />
        <text x={pillW / 2} y={pillH / 2 + 1.3}
          textAnchor="middle"
          fontFamily="ui-monospace, 'JetBrains Mono', monospace"
          fontSize="2.6"
          fontWeight="700"
          letterSpacing="0.18"
          fill={textColor}
        >{label} <tspan letterSpacing="-0.15">{">>>"}</tspan></text>
      </g>
    );
  }
  return <g>{pills}</g>;
}

/* ─────────────────────────────────────────────
   Single Annotation pill (HTML version — used in
   layouts that need real DOM pills, not SVG)
───────────────────────────────────────────── */
function Pill({ children, variant = "dark", arrow = true }) {
  const classes = { dark: "", outline: "outline", mint: "mint", mango: "mango", berry: "berry", rasp: "rasp" };
  return (
    <span className={`pill ${classes[variant] || ""}`}>
      <span>{children}</span>
      {arrow && <span className="arr">&gt;&gt;&gt;</span>}
    </span>
  );
}

window.GS = window.GS || {};
Object.assign(window.GS, {
  Stroke, SectionView, Passthrough, AnnotationRibbon, Pill, strokePath, PassthroughSubject,
});
})();
