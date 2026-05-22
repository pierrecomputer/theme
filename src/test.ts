// src/test.ts
import { readFileSync, existsSync } from "node:fs";
import {
  light as rolesLight,
  lightSoft as rolesLightSoft,
  dark as rolesDark,
  darkSoft as rolesDarkSoft,
} from "./palette";
import { makeTheme } from "./theme";
import { convertRolesToP3 } from "./color-p3";
import { palettes } from "./palette";

// Color tracking for detecting undefined values
const usedColors = new Set<string>();

// Helper functions
function isValidHexColor(color: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color);
}

function isValidP3Color(color: string): boolean {
  return /^color\(display-p3\s+[\d.]+\s+[\d.]+\s+[\d.]+(\s+\/\s+[\d.]+)?\)$/.test(color);
}

function isValidColor(color: string): boolean {
  return isValidHexColor(color) || isValidP3Color(color);
}

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function collectColors(obj: any, path = ""): string[] {
  const issues: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof value === "string") {
      usedColors.add(value);
      if (value.startsWith("#") || value.startsWith("color(")) {
        if (!isValidColor(value)) issues.push(`Invalid color at ${currentPath}: ${value}`);
      }
    } else if (typeof value === "object" && value !== null) {
      issues.push(...collectColors(value, currentPath));
    }
  }
  return issues;
}

function report(label: string, errors: string[]): boolean {
  if (errors.length === 0) {
    console.log(`  pass  ${label}`);
    return true;
  }
  console.error(`  FAIL  ${label}`);
  errors.forEach(err => console.error(`        - ${err}`));
  return false;
}

function testThemeGeneration(themeName: string, themeType: "light" | "dark", roles: any): boolean {
  const errors: string[] = [];
  try {
    const theme = makeTheme(themeName, themeType, roles);

    if (!theme.name) errors.push("Missing theme name");
    if (!theme.type) errors.push("Missing theme type");
    if (!theme.colors) errors.push("Missing colors object");
    if (!theme.tokenColors) errors.push("Missing tokenColors array");
    if (!theme.semanticTokenColors) errors.push("Missing semanticTokenColors object");
    if (theme.type !== themeType) errors.push(`Expected type "${themeType}" but got "${theme.type}"`);

    const criticalColors = [
      "editor.background", "editor.foreground", "foreground", "focusBorder",
      "sideBar.background", "activityBar.background", "statusBar.background",
    ];
    for (const key of criticalColors) {
      if (!theme.colors[key]) errors.push(`Missing critical color: ${key}`);
    }

    errors.push(...collectColors(theme.colors));

    for (const [key, value] of Object.entries(theme.colors)) {
      if (value === undefined || value === null) errors.push(`Color "${key}" is ${value}`);
    }

    if (!Array.isArray(theme.tokenColors)) {
      errors.push("tokenColors is not an array");
    } else if (theme.tokenColors.length === 0) {
      errors.push("tokenColors array is empty");
    } else {
      theme.tokenColors.forEach((token, idx) => {
        if (!token.scope) errors.push(`tokenColors[${idx}] missing scope`);
        if (!token.settings) {
          errors.push(`tokenColors[${idx}] missing settings`);
        } else if (token.settings.foreground) {
          usedColors.add(token.settings.foreground);
          if (!isValidColor(token.settings.foreground)) {
            errors.push(`tokenColors[${idx}] invalid foreground: ${token.settings.foreground}`);
          }
        }
      });
    }

    for (const [key, value] of Object.entries(theme.semanticTokenColors)) {
      if (typeof value === "string") {
        usedColors.add(value);
        if (!isValidColor(value)) errors.push(`semanticTokenColors["${key}"] invalid: ${value}`);
      } else if (typeof value === "object" && value !== null) {
        const v = value as any;
        if (v.foreground) {
          usedColors.add(v.foreground);
          if (!isValidColor(v.foreground)) {
            errors.push(`semanticTokenColors["${key}"].foreground invalid: ${v.foreground}`);
          }
        }
      }
    }
  } catch (error) {
    errors.push(`Threw an error: ${error}`);
  }
  return report(`Theme: ${themeName}`, errors);
}

function testGeneratedFiles(): boolean {
  const files = [
    { path: "themes/pierre-light.json", expectedType: "light" },
    { path: "themes/pierre-light-soft.json", expectedType: "light" },
    { path: "themes/pierre-dark.json", expectedType: "dark" },
    { path: "themes/pierre-dark-soft.json", expectedType: "dark" },
    { path: "themes/pierre-light-vibrant.json", expectedType: "light" },
    { path: "themes/pierre-dark-vibrant.json", expectedType: "dark" },
  ];

  const errors: string[] = [];
  for (const { path, expectedType } of files) {
    if (!existsSync(path)) { errors.push(`Missing: ${path}`); continue; }
    try {
      const content = readFileSync(path, "utf8");
      if (content.trim() === "") { errors.push(`Empty: ${path}`); continue; }
      const theme = JSON.parse(content);
      if (!theme.name) errors.push(`${path}: missing name`);
      if (!theme.type) errors.push(`${path}: missing type`);
      if (theme.type !== expectedType) errors.push(`${path}: expected type "${expectedType}", got "${theme.type}"`);
      if (!theme.colors || Object.keys(theme.colors).length === 0) errors.push(`${path}: missing colors`);
      if (!Array.isArray(theme.tokenColors) || theme.tokenColors.length === 0) errors.push(`${path}: missing tokenColors`);
    } catch (e) {
      errors.push(`${path}: invalid JSON`);
    }
  }
  return report("Generated VS Code files", errors);
}

function testZedTheme(): boolean {
  const path = "zed/themes/pierre.json";
  const errors: string[] = [];

  if (!existsSync(path)) return report("Zed theme", [`Missing: ${path}`]);

  try {
    const family = JSON.parse(readFileSync(path, "utf8"));
    if (!family.$schema) errors.push("Missing $schema");
    if (!family.name) errors.push("Missing name");
    if (!family.author) errors.push("Missing author");
    if (!Array.isArray(family.themes)) {
      errors.push("Missing themes array");
    } else {
      if (family.themes.length !== 4) errors.push(`Expected 4 variants, got ${family.themes.length}`);
      for (const expected of [
        { name: "Pierre Light", appearance: "light" },
        { name: "Pierre Light Soft", appearance: "light" },
        { name: "Pierre Dark", appearance: "dark" },
        { name: "Pierre Dark Soft", appearance: "dark" },
      ]) {
        const found = family.themes.find((t: any) => t.name === expected.name);
        if (!found) {
          errors.push(`Missing variant: ${expected.name}`);
        } else {
          if (found.appearance !== expected.appearance) errors.push(`${expected.name}: wrong appearance`);
          if (!found.style || Object.keys(found.style).length === 0) errors.push(`${expected.name}: empty style`);
        }
      }
    }
  } catch (e) {
    errors.push("Invalid JSON");
  }
  return report("Zed theme", errors);
}

function testDistModules(): boolean {
  const themeNames = [
    "pierre-light", "pierre-light-soft",
    "pierre-dark", "pierre-dark-soft",
    "pierre-light-vibrant", "pierre-dark-vibrant",
  ];
  const errors: string[] = [];

  for (const name of themeNames) {
    const mjs = `dist/${name}.mjs`;
    const dts = `dist/${name}.d.mts`;
    if (!existsSync(mjs)) errors.push(`Missing: ${mjs}`);
    else if (readFileSync(mjs, "utf8").trim() === "") errors.push(`Empty: ${mjs}`);
    if (!existsSync(dts)) errors.push(`Missing: ${dts}`);
    else if (readFileSync(dts, "utf8").trim() === "") errors.push(`Empty: ${dts}`);
  }

  const indexPath = "dist/index.mjs";
  if (!existsSync(indexPath)) {
    errors.push(`Missing: ${indexPath}`);
  } else {
    const content = readFileSync(indexPath, "utf8");
    for (const name of themeNames) {
      if (!content.includes(name)) errors.push(`dist/index.mjs missing: ${name}`);
    }
  }
  return report("Dist ESM modules", errors);
}

function testPaletteRoles(): boolean {
  const errors: string[] = [];

  function validateRoles(roles: any, name: string) {
    for (const cat of ["bg", "fg", "border", "accent", "states", "syntax", "ansi"]) {
      if (!roles[cat]) errors.push(`${name}: missing "${cat}"`);
    }
    function checkColors(obj: any, path: string) {
      for (const [key, value] of Object.entries(obj)) {
        const p = `${path}.${key}`;
        if (typeof value === "string") {
          if (!isValidHexColor(value)) errors.push(`${name}.${p}: invalid "${value}"`);
        } else if (typeof value === "object" && value !== null) {
          checkColors(value, p);
        }
      }
    }
    checkColors(roles, name);
  }

  validateRoles(rolesLight, "light");
  validateRoles(rolesLightSoft, "lightSoft");
  validateRoles(rolesDark, "dark");
  validateRoles(rolesDarkSoft, "darkSoft");
  return report("Palette roles", errors);
}

// Reverse palette lookup: "#rrggbb" → "name[step]"
const paletteIndex = new Map<string, string>();
for (const [name, scale] of Object.entries(palettes)) {
  for (const [step, hex] of Object.entries(scale as Record<string, string>)) {
    paletteIndex.set(hex.toLowerCase(), `${name}[${step}]`);
  }
}
function paletteName(hex: string): string {
  return paletteIndex.get(hex.toLowerCase()) ?? hex;
}

// APCA contrast algorithm (sRGB, no deps)
function hexToY(hex: string): number {
  const n = hex.replace("#", "");
  const full = n.length === 3 ? n.split("").map(x => x + x).join("") : n.slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const lin = (v: number) => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return Math.max(0, 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b));
}

function apcaContrast(fgHex: string, bgHex: string): number {
  const Ytxt = hexToY(fgHex);
  const Ybg = hexToY(bgHex);
  const Lc = Ybg > Ytxt
    ? (Math.pow(Ybg, 0.56) - Math.pow(Ytxt, 0.57)) * 1.14 * 100
    : (Math.pow(Ybg, 0.65) - Math.pow(Ytxt, 0.62)) * 1.14 * 100;
  return Math.abs(Lc) < 10 ? 0 : Lc;
}

const CONTRAST_PAIRS: Array<{ fg: string; bg: string; minLc: number }> = [
  { fg: "editor.foreground",                        bg: "editor.background",  minLc: 60 },
  { fg: "button.foreground",                        bg: "button.background",  minLc: 60 },
  { fg: "activityBarBadge.foreground",              bg: "activityBarBadge.background", minLc: 60 },
  { fg: "input.foreground",                         bg: "input.background",   minLc: 60 },
  { fg: "notifications.foreground",                 bg: "notifications.background", minLc: 60 },
  { fg: "tab.activeForeground",                     bg: "tab.activeBackground", minLc: 60 },
  { fg: "statusBar.foreground",                     bg: "statusBar.background", minLc: 60 },
  { fg: "sideBar.foreground",                       bg: "sideBar.background", minLc: 60 },
  { fg: "titleBar.activeForeground",                bg: "titleBar.activeBackground", minLc: 60 },
  { fg: "tab.inactiveForeground",                   bg: "tab.inactiveBackground", minLc: 60 },
  // Git status foregrounds render against the sidebar background
  { fg: "gitDecoration.addedResourceForeground",    bg: "sideBar.background", minLc: 60 },
  { fg: "gitDecoration.modifiedResourceForeground", bg: "sideBar.background", minLc: 60 },
  { fg: "gitDecoration.deletedResourceForeground",  bg: "sideBar.background", minLc: 60 },
  { fg: "gitDecoration.untrackedResourceForeground",bg: "sideBar.background", minLc: 60 },
  { fg: "gitDecoration.conflictingResourceForeground", bg: "sideBar.background", minLc: 60 },
  { fg: "gitDecoration.ignoredResourceForeground",  bg: "sideBar.background", minLc: 60 },
];

type ContrastRow = { pair: string; fgColor: string; bgColor: string; lc: number | null; minLc: number; pass: boolean };

function testColorContrast(themeName: string, colors: Record<string, string>): boolean {
  const rows: ContrastRow[] = [];
  let skipped = 0;

  for (const { fg, bg, minLc } of CONTRAST_PAIRS) {
    const fgColor = colors[fg];
    const bgColor = colors[bg];
    const pair = `${fg} / ${bg}`;

    if (!fgColor || !bgColor) {
      rows.push({ pair, fgColor: fgColor ?? "", bgColor: bgColor ?? "", lc: null, minLc, pass: false });
      continue;
    }
    if (fgColor.startsWith("color(") || bgColor.startsWith("color(")) {
      skipped++;
      continue;
    }

    const lc = Math.abs(apcaContrast(fgColor, bgColor));
    rows.push({ pair, fgColor, bgColor, lc, minLc, pass: lc >= minLc });
  }

  if (rows.length === 0) return true; // All P3 — nothing to report

  const anyFail = rows.some(r => !r.pass);

  const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
  const red   = (s: string) => `\x1b[31m${s}\x1b[0m`;
  const dim   = (s: string) => `\x1b[2m${s}\x1b[0m`;

  const fgW = Math.max(...rows.map(r => r.pair.split(" / ")[0].length), "fg key".length);
  const bgW = Math.max(...rows.map(r => r.pair.split(" / ")[1].length), "bg key".length);
  const sep = "-".repeat(fgW + bgW + 22);

  console.log(`\n  Contrast: ${themeName}`);
  console.log(`  ${pad("fg key", fgW)}   ${pad("bg key", bgW)}   ${"Lc".padStart(5)}   min   status`);
  console.log(`  ${sep}`);
  for (const row of rows) {
    const [fgKey, bgKey] = row.pair.split(" / ");
    const lcStr = row.lc !== null ? row.lc.toFixed(1) : "n/a";
    const line = `  ${pad(fgKey, fgW)}   ${pad(bgKey, bgW)}   ${pad(lcStr, 5)}   ${pad(String(row.minLc), 3)}   ${row.pass ? "Pass" : "Warn"}`;
    console.log(row.pass ? green(line) : red(line));
    const fgName = paletteName(row.fgColor);
    const bgName = paletteName(row.bgColor);
    console.log(dim(`  ${pad(fgName, fgW)}   ${bgName}`));
  }
  console.log(`  ${sep}`);

  return true; // contrast failures are warnings only
}

// Run all tests
console.log("Pierre Theme Tests");
console.log("=".repeat(50));

let allPassed = true;

allPassed = testPaletteRoles() && allPassed;

const rolesLightP3 = convertRolesToP3(rolesLight);
const rolesDarkP3 = convertRolesToP3(rolesDark);

allPassed = testThemeGeneration("Pierre Light", "light", rolesLight) && allPassed;
allPassed = testThemeGeneration("Pierre Light Soft", "light", rolesLightSoft) && allPassed;
allPassed = testThemeGeneration("Pierre Dark", "dark", rolesDark) && allPassed;
allPassed = testThemeGeneration("Pierre Dark Soft", "dark", rolesDarkSoft) && allPassed;
allPassed = testThemeGeneration("Pierre Light Vibrant", "light", rolesLightP3) && allPassed;
allPassed = testThemeGeneration("Pierre Dark Vibrant", "dark", rolesDarkP3) && allPassed;

allPassed = testGeneratedFiles() && allPassed;
allPassed = testZedTheme() && allPassed;
allPassed = testDistModules() && allPassed;

allPassed = testColorContrast("Pierre Light", makeTheme("Pierre Light", "light", rolesLight).colors) && allPassed;
allPassed = testColorContrast("Pierre Light Soft", makeTheme("Pierre Light Soft", "light", rolesLightSoft).colors) && allPassed;
allPassed = testColorContrast("Pierre Dark", makeTheme("Pierre Dark", "dark", rolesDark).colors) && allPassed;
allPassed = testColorContrast("Pierre Dark Soft", makeTheme("Pierre Dark Soft", "dark", rolesDarkSoft).colors) && allPassed;
allPassed = testColorContrast("Pierre Light Vibrant", makeTheme("Pierre Light Vibrant", "light", rolesLightP3).colors) && allPassed;
allPassed = testColorContrast("Pierre Dark Vibrant", makeTheme("Pierre Dark Vibrant", "dark", rolesDarkP3).colors) && allPassed;

console.log("\n" + "=".repeat(50));
console.log(`Colors used: ${usedColors.size}`);
console.log(allPassed ? "pass" : "FAIL");
process.exit(allPassed ? 0 : 1);
