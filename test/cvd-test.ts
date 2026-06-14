// test/cvd-test.ts
//
// OBJECTIVE GATE for the CVD (Color Vision Deficiency) themes.
//
// A CVD-safe palette is a claim that must be *proven*, not eyeballed. This file
// turns the design rules from src/roles into machine-checked assertions and is
// run as part of `npm test`. It fails the build (exit non-zero) if any Tier-1 or
// Tier-2 requirement regresses, so the themes cannot silently drift back into a
// red-green-ambiguous state.
//
// HOW IT WORKS (for engineers new to CVD):
//   1. simulate — recolor each role as a protan/deutan/tritan viewer would see it
//      (Machado 2009 model, src/color/cvd.ts), at full dichromacy (severity 1.0).
//   2. distinguishability — for every pair of roles that co-occurs on screen,
//      measure the perceptual distance (ΔE₀₀) between the *simulated* colors. If
//      two signals (e.g. "added" vs "deleted") still look far apart, a CVD user
//      can tell them apart. ΔE₀₀ > ~10 ≈ "clearly different".
//   3. contrast — WCAG legibility of each foreground vs its background, checked
//      both normally and after simulation (simulation shifts luminance).
//
// TIERS — graded by WHAT CARRIES THE SIGNAL WHEN COLOR FAILS. Under full
// dichromacy there are only ~2 usable hue poles + luminance but ~20 chromatic
// roles, so not every pair can be hue-unique. We gate hardest where color is the
// *only* cue, and lean on the editor's built-in non-color cues elsewhere.
//   • Tier 1 (hard gate, ΔE ≥ 11) — color is the SOLE disambiguator:
//       diff add/delete backgrounds (success/danger), diff inserted/deleted TEXT
//       (string/tag), merge-conflict backgrounds (merge/info), terminal pass/fail
//       (ansi red/green). None of these has a glyph fallback.
//   • Tier 2 (hard gate, ΔE ≥ 8) — color PLUS a non-color cue:
//       diagnostics (error/warn/info — distinct icon SHAPES), and the
//       highest-frequency syntax adjacencies + comment-vs-code.
//   • Tier 3 (advisory, reported only) — color is tertiary:
//       the git-tree clique (every entry already carries an M/A/D/U/C letter
//       badge) and extended syntax (bold/italic + position carry it). Reported
//       so regressions stay visible without blocking the build.

import {
  protanDeutanLight,
  protanDeutanDark,
  tritanopiaLight,
  tritanopiaDark,
  type Roles,
} from "../src/roles";
import { simulateCVD, contrastRatio, deltaE2000, cvdSelfChecks, type CVDType } from "../src/color";
import {
  filterDeficiencyProt, filterDeficiencyDeuter, filterDeficiencyTrit,
  differenceCiede2000, wcagContrast, formatHex,
} from "culori";

// ── Thresholds (standards-derived, tuned empirically during build-out) ──────
const TIER1_DELTA_E = 11; // co-occurring opposite-meaning signals
const TIER2_DELTA_E = 8;  // critical syntax adjacencies
const TEXT_CONTRAST = 4.5; // WCAG 2.1 SC 1.4.3 normal text
const UI_CONTRAST = 3.0;   // WCAG 2.1 SC 1.4.11 UI glyphs / SC 1.4.3 large text

// ── Pair definitions ────────────────────────────────────────────────────────
// A selector plucks one concrete hex from a resolved Roles object.
type Sel = (r: Roles) => string;
type Pair = { tier: 1 | 2 | 3; label: string; a: Sel; b: Sel; group: string };

const S = {
  success: (r: Roles) => r.states.success,
  danger: (r: Roles) => r.states.danger,
  warn: (r: Roles) => r.states.warn,
  info: (r: Roles) => r.states.info,
  merge: (r: Roles) => r.states.merge,
  accent: (r: Roles) => r.accent.primary,
  ansiRed: (r: Roles) => r.ansi.red,
  ansiGreen: (r: Roles) => r.ansi.green,
  comment: (r: Roles) => r.syntax.comment,
  string: (r: Roles) => r.syntax.string,
  keyword: (r: Roles) => r.syntax.keyword,
  variable: (r: Roles) => r.syntax.variable,
  func: (r: Roles) => r.syntax.func,
  type: (r: Roles) => r.syntax.type,
  number: (r: Roles) => r.syntax.number,
  tag: (r: Roles) => r.syntax.tag, // = diff "deleted" text token
};

// Generate every unordered pair within a group of named selectors.
function clique(group: string, tier: 1 | 2 | 3, members: [string, Sel][]): Pair[] {
  const out: Pair[] = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      out.push({
        tier,
        group,
        label: `${members[i][0]} vs ${members[j][0]}`,
        a: members[i][1],
        b: members[j][1],
      });
    }
  }
  return out;
}

const PAIRS: Pair[] = [
  // ── Tier 1 — color is the only cue (ΔE ≥ 11) ──────────────────────────────
  // Diff gutter / overview ruler: added vs deleted backgrounds (no glyph).
  { tier: 1, group: "diff bg", label: "success(added) vs danger(deleted)", a: S.success, b: S.danger },
  // Diff TEXT tokens: inserted vs deleted, the semantic core of a review.
  { tier: 1, group: "diff text", label: "string(inserted) vs tag(deleted)", a: S.string, b: S.tag },
  // Merge conflict view: current(merge) vs incoming(info) tinted backgrounds.
  { tier: 1, group: "merge conflict", label: "merge vs info", a: S.merge, b: S.info },
  // Terminal pass/fail.
  { tier: 1, group: "terminal", label: "ansi.red vs ansi.green", a: S.ansiRed, b: S.ansiGreen },

  // ── Tier 2 — color + a non-color cue (ΔE ≥ 8) ─────────────────────────────
  // Diagnostics & notifications: error/warn/info — backed by distinct icon
  // shapes (✕ / △ / ⓘ), so color is the secondary channel.
  ...clique("diagnostics", 2, [
    ["danger", S.danger],
    ["warn", S.warn],
    ["info", S.info],
  ]),
  // Comment must never be mistaken for live code.
  ...clique("comment vs code", 2, [
    ["comment", S.comment],
    ["string", S.string],
    ["keyword", S.keyword],
    ["variable", S.variable],
  ]).filter((p) => p.label.startsWith("comment")),
  // The three highest-frequency code tokens.
  ...clique("core syntax", 2, [
    ["keyword", S.keyword],
    ["string", S.string],
    ["variable", S.variable],
  ]),

  // ── Tier 3 (advisory) ─────────────────────────────────────────────────────
  // Git tree: added/modified/deleted/conflict — every entry has an M/A/D/U/C
  // letter badge, so identical-looking colors are still unambiguous. Reported.
  ...clique("git tree", 3, [
    ["success", S.success],
    ["danger", S.danger],
    ["merge", S.merge],
    ["accent.primary", S.accent],
  ]),
  ...clique("extended syntax", 3, [
    ["func", S.func],
    ["type", S.type],
    ["number", S.number],
    ["keyword", S.keyword],
    ["string", S.string],
    ["variable", S.variable],
  ]),
];

// ── Theme registry ──────────────────────────────────────────────────────────
// Each protan/deutan theme must satisfy the gate under BOTH protan and deutan
// simulation; tritanopia themes under tritan.
type CvdThemeDef = { name: string; roles: Roles; cvds: CVDType[] };
const THEMES: CvdThemeDef[] = [
  { name: "Pierre Light Protanopia & Deuteranopia", roles: protanDeutanLight, cvds: ["protan", "deutan"] },
  { name: "Pierre Dark Protanopia & Deuteranopia", roles: protanDeutanDark, cvds: ["protan", "deutan"] },
  { name: "Pierre Light Tritanopia", roles: tritanopiaLight, cvds: ["tritan"] },
  { name: "Pierre Dark Tritanopia", roles: tritanopiaDark, cvds: ["tritan"] },
];

// CONTRAST POLICY. We hold the CVD themes to WCAG bars, but only the bar that
// fits how each color renders — and we do NOT impose a bar the *standard* Pierre
// themes never met (base Pierre LIGHT runs syntax/signal colors at 2–4.5:1 by
// design; see ACCESSIBILITY.md):
//   • Body text (editor foreground)              → 4.5:1  (SC 1.4.3 normal text)
//   • Syntax tokens & meaningful signal colors   → 3.0:1  (SC 1.4.11 UI / large)
//     checked NORMAL and AFTER simulation (simulation shifts luminance).
//   • Report-only (printed, never fails): colors whose canonical/brand hue is
//     intrinsically high-luminance and which base Pierre itself keeps bright —
//     `accent.primary`/`link` (brand blue), `warn` (caution yellow/amber), and
//     the decorative ansi colors. Their *distinguishability* (ΔE) is what the
//     gate enforces, not their raw contrast.
const SYNTAX_REPORT_ONLY = new Set<string>([]); // (none — all syntax tokens gated)
// Syntax tokens are text-on-editor at the 3:1 bar; `invalid` is intentionally a
// background-tinted color, not a foreground, so it is excluded.
function syntaxForegrounds(r: Roles): [string, string][] {
  return Object.entries(r.syntax).filter(([k]) => k !== "invalid" && !SYNTAX_REPORT_ONLY.has(k));
}
// Signal colors gated at 3:1 (carry meaning): states except the bright `warn`,
// plus the terminal pass/fail pair.
function signalForegrounds(r: Roles): [string, string][] {
  return [
    ["states.success", r.states.success],
    ["states.danger", r.states.danger],
    ["states.info", r.states.info],
    ["states.merge", r.states.merge],
    ["ansi.red", r.ansi.red],
    ["ansi.green", r.ansi.green],
  ];
}
// Report-only (never fails the build).
function reportOnlyForegrounds(r: Roles): [string, string][] {
  return [
    ["accent.primary", r.accent.primary],
    ["states.warn", r.states.warn],
    ["ansi.yellow", r.ansi.yellow],
    ["ansi.blue", r.ansi.blue],
    ["ansi.cyan", r.ansi.cyan],
    ["ansi.magenta", r.ansi.magenta],
  ];
}

// ── Runner ────────────────────────────────────────────────────────────────
type Failure = { theme: string; kind: string; detail: string };
type SimulationConvention = "linear" | "gamma";

function pad(s: string, n: number) {
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}

const gammaSim: Record<CVDType, (c: string) => unknown> = {
  protan: filterDeficiencyProt(1) as unknown as (c: string) => unknown,
  deutan: filterDeficiencyDeuter(1) as unknown as (c: string) => unknown,
  tritan: filterDeficiencyTrit(1) as unknown as (c: string) => unknown,
};

function simulateForConvention(hex: string, cvd: CVDType, convention: SimulationConvention): string {
  if (convention === "linear") return simulateCVD(hex, cvd);
  const simulated = formatHex(gammaSim[cvd](hex) as any);
  if (!simulated) throw new Error(`culori could not simulate ${hex} for ${cvd}`);
  return simulated;
}

// Worst-case contrast of fg on bg after simulation, across both gamma conventions
// (the same linear + gamma pair the distinguishability check uses).
function simulatedContrast(fg: string, bg: string, cvd: CVDType): number {
  let worst = Infinity;
  for (const convention of ["linear", "gamma"] as const) {
    worst = Math.min(
      worst,
      contrastRatio(simulateForConvention(fg, cvd, convention), simulateForConvention(bg, cvd, convention))
    );
  }
  return worst;
}

// Cross-validate our hand-rolled color math against culori (dev-only oracle).
function referenceCrossChecks(): { name: string; ok: boolean; detail: string }[] {
  const ciede = differenceCiede2000();
  // culori parses hex strings at runtime; its types want parsed Color objects, so
  // we loosen the signatures here (dev-only oracle).
  const samples = [
    "#009fff", "#d52c36", "#199f43", "#ffca00", "#1a85d4", "#d47628",
    "#a13cee", "#00c5d2", "#ff5d36", "#737373", "#ffffff", "#0a0a0a",
  ];

  // contrast & ΔE: must match culori to floating-point noise.
  let maxC = 0, maxDe = 0;
  for (let i = 0; i < samples.length; i++) {
    for (let j = i + 1; j < samples.length; j++) {
      const a = samples[i], b = samples[j];
      maxC = Math.max(maxC, Math.abs(contrastRatio(a, b) - (wcagContrast(a, b) as number)));
      maxDe = Math.max(maxDe, Math.abs(deltaE2000(a, b) - ciede(a, b)));
    }
  }

  // simulation: differs from culori only in gamma convention, but must collapse
  // the same axis — verify each maps the confusable pair to a much smaller ΔE.
  const axisOk = (["protan", "deutan", "tritan"] as CVDType[]).every((t) => {
    const x = t === "tritan" ? "#009fff" : "#ff2e3f"; // blue (tritan) / red (protan,deutan)
    const y = "#199f43"; // green
    const before = deltaE2000(x, y);
    const ours = deltaE2000(simulateCVD(x, t), simulateCVD(y, t));
    const lib = ciede(
      simulateForConvention(x, t, "gamma"),
      simulateForConvention(y, t, "gamma")
    );
    // Both implementations must collapse the confusable pair to under half its
    // un-simulated separation (exact residual differs by gamma convention).
    return ours < before * 0.5 && lib < before * 0.5;
  });

  return [
    { name: "contrast matches culori", ok: maxC < 0.01, detail: `max |Δ| ${maxC.toFixed(4)}` },
    { name: "ΔE2000 matches culori", ok: maxDe < 0.1, detail: `max |Δ| ${maxDe.toFixed(4)}` },
    { name: "simulation collapses same axis", ok: axisOk, detail: axisOk ? "ours & culori agree" : "axis mismatch" },
  ];
}

export function runCvdGate(): boolean {
  console.log("\n🎨 CVD theme objective gate");
  console.log("=".repeat(60));

  const failures: Failure[] = [];

  // 0) Color-science self-checks (prove the simulation/contrast/ΔE math itself).
  console.log("\n🔬 Color-science self-checks (Machado 2009 / WCAG / CIEDE2000):");
  for (const c of cvdSelfChecks()) {
    console.log(`   ${c.ok ? "✅" : "❌"} ${pad(c.name, 34)} ${c.detail}`);
    if (!c.ok) failures.push({ theme: "(self-check)", kind: "color-science", detail: c.name });
  }

  // 0b) Reference cross-validation vs culori. We keep our own implementation
  //     (its CVD simulation uses the more-correct linear-RGB convention), but
  //     prove the standardized formulas agree with a vetted library: contrast and
  //     ΔE must match to floating-point noise, and our simulation must collapse
  //     the same axes culori's does (it differs only in gamma convention, by
  //     design — see src/color/cvd.ts).
  for (const r of referenceCrossChecks()) {
    console.log(`   ${r.ok ? "✅" : "❌"} ${pad(r.name, 34)} ${r.detail}`);
    if (!r.ok) failures.push({ theme: "(cross-check)", kind: "reference", detail: `${r.name}: ${r.detail}` });
  }

  for (const { name, roles, cvds } of THEMES) {
    console.log(`\n■ ${name}  [simulated as: ${cvds.join(", ")}]`);
    const bgEditor = roles.bg.editor;
    const bgWindow = roles.bg.window;

    // 1) Contrast (normal + simulated). The simulated check takes the worst case
    //    across both gamma conventions; backgrounds are near-neutral so they barely
    //    move, but we simulate them under each convention for correctness.
    const reportOnlyMin: Record<string, number> = {};
    for (const cvd of cvds) {
      // Body text — the one role held to the full 4.5:1 text bar.
      {
        const normal = contrastRatio(roles.fg.base, bgEditor);
        const sim = simulatedContrast(roles.fg.base, bgEditor, cvd);
        if (normal < TEXT_CONTRAST || sim < TEXT_CONTRAST) {
          failures.push({
            theme: name,
            kind: "contrast(body)",
            detail: `fg.base on editor — normal ${normal.toFixed(2)}, ${cvd} ${sim.toFixed(2)} (< ${TEXT_CONTRAST})`,
          });
        }
      }

      for (const [key, hex] of syntaxForegrounds(roles)) {
        const normal = contrastRatio(hex, bgEditor);
        const sim = simulatedContrast(hex, bgEditor, cvd);
        if (normal < UI_CONTRAST || sim < UI_CONTRAST) {
          failures.push({
            theme: name,
            kind: "contrast(syntax)",
            detail: `syntax.${key} on editor — normal ${normal.toFixed(2)}, ${cvd} ${sim.toFixed(2)} (< ${UI_CONTRAST})`,
          });
        }
      }
      for (const [key, hex] of signalForegrounds(roles)) {
        const normal = contrastRatio(hex, bgWindow);
        const sim = simulatedContrast(hex, bgWindow, cvd);
        if (normal < UI_CONTRAST || sim < UI_CONTRAST) {
          failures.push({
            theme: name,
            kind: "contrast(signal)",
            detail: `${key} on window — normal ${normal.toFixed(2)}, ${cvd} ${sim.toFixed(2)} (< ${UI_CONTRAST})`,
          });
        }
      }
      // Report-only: track the worst contrast seen, printed (never fails).
      for (const [key, hex] of reportOnlyForegrounds(roles)) {
        const c = Math.min(contrastRatio(hex, bgWindow), simulatedContrast(hex, bgWindow, cvd));
        reportOnlyMin[key] = Math.min(reportOnlyMin[key] ?? Infinity, c);
      }
    }
    console.log(
      "   Contrast (report-only, intrinsically-bright/brand): " +
        Object.entries(reportOnlyMin)
          .map(([k, v]) => `${k} ${v.toFixed(2)}`)
          .join(", ")
    );

    // 2) Distinguishability under simulation.
    for (const tier of [1, 2, 3] as const) {
      const pairs = PAIRS.filter((p) => p.tier === tier);
      const threshold = tier === 1 ? TIER1_DELTA_E : tier === 2 ? TIER2_DELTA_E : 0;
      console.log(`   Tier ${tier} ${tier === 3 ? "(advisory)" : `(ΔE ≥ ${threshold})`}:`);
      for (const p of pairs) {
        const aHex = p.a(roles);
        const bHex = p.b(roles);
        // Worst case across all CVD types this theme targets, and across both
        // common Machado gamma conventions: linear RGB (our implementation) and
        // gamma-encoded sRGB (culori/colorspace).
        let worst = Infinity;
        let worstCvd: CVDType = cvds[0];
        let worstConvention: SimulationConvention = "linear";
        for (const cvd of cvds) {
          for (const convention of ["linear", "gamma"] as const) {
            const d = deltaE2000(
              simulateForConvention(aHex, cvd, convention),
              simulateForConvention(bHex, cvd, convention)
            );
            if (d < worst) {
              worst = d;
              worstCvd = cvd;
              worstConvention = convention;
            }
          }
        }
        const ok = tier === 3 ? true : worst >= threshold;
        const flag = tier === 3 ? "·" : ok ? "✅" : "❌";
        console.log(
          `      ${flag} ${pad(`[${p.group}] ${p.label}`, 46)} ΔE ${worst.toFixed(1).padStart(5)} (${worstCvd}, ${worstConvention})`
        );
        if (!ok) {
          failures.push({
            theme: name,
            kind: `Tier ${tier} ΔE`,
            detail: `${p.label} = ΔE ${worst.toFixed(1)} under ${worstCvd}/${worstConvention} (need ≥ ${threshold})`,
          });
        }
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  if (failures.length === 0) {
    console.log("✅ CVD gate passed — all Tier-1/Tier-2 pairs distinguishable & legible.");
    return true;
  }
  console.error(`❌ CVD gate failed with ${failures.length} issue(s):`);
  for (const f of failures) console.error(`   - [${f.theme}] ${f.kind}: ${f.detail}`);
  return false;
}

// Allow standalone execution: `ts-node test/cvd-test.ts`.
if (require.main === module) {
  process.exit(runCvdGate() ? 0 : 1);
}
