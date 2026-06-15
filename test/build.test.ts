/**
 * Guards the build *output* rather than theme design. After `npm run build` writes
 * themes/*.json, this checks each expected file exists and carries the right
 * metadata — catching build-step regressions (a missing, empty, or misnamed file).
 */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

type GeneratedFile = { path: string; expectedType: "light" | "dark"; expectedName: string; expectedDisplayName: string };

const GENERATED_FILES: GeneratedFile[] = [
  {
    path: "themes/pierre-light.json", 
    expectedType: "light", 
    expectedName: "pierre-light", 
    expectedDisplayName: "Pierre Light" 
  },
  {
    path: "themes/pierre-light-protanopia-deuteranopia.json", 
    expectedType: "light", 
    expectedName: "pierre-light-protanopia-deuteranopia", 
    expectedDisplayName: "Pierre Light Protanopia & Deuteranopia" 
  },
  { 
    path: "themes/pierre-light-soft.json", 
    expectedType: "light", 
    expectedName: "pierre-light-soft", 
    expectedDisplayName: "Pierre Light Soft" 
  },
  { 
    path: "themes/pierre-light-tritanopia.json", 
    expectedType: "light", 
    expectedName: "pierre-light-tritanopia", 
    expectedDisplayName: "Pierre Light Tritanopia" 
  },
  { 
    path: "themes/pierre-light-vibrant.json", 
    expectedType: "light", 
    expectedName: "pierre-light-vibrant", 
    expectedDisplayName: "Pierre Light Vibrant" 
  },
  { 
    path: "themes/pierre-dark.json", 
    expectedType: "dark", 
    expectedName: "pierre-dark", 
    expectedDisplayName: "Pierre Dark" 
  },
  { 
    path: "themes/pierre-dark-protanopia-deuteranopia.json", 
    expectedType: "dark", 
    expectedName: "pierre-dark-protanopia-deuteranopia", 
    expectedDisplayName: "Pierre Dark Protanopia & Deuteranopia" 
  },
  { 
    path: "themes/pierre-dark-soft.json", 
    expectedType: "dark", 
    expectedName: "pierre-dark-soft", 
    expectedDisplayName: "Pierre Dark Soft" 
  },
  { 
    path: "themes/pierre-dark-tritanopia.json", 
    expectedType: "dark", 
    expectedName: "pierre-dark-tritanopia", 
    expectedDisplayName: "Pierre Dark Tritanopia" 
  },
  { 
    path: "themes/pierre-dark-vibrant.json", 
    expectedType: "dark", 
    expectedName: "pierre-dark-vibrant", 
    expectedDisplayName: "Pierre Dark Vibrant" 
  },
];

describe("generated theme files", () => {
  for (const file of GENERATED_FILES) {
    describe(file.path, () => {
      test("exists", () => {
        assert.ok(existsSync(file.path), `file does not exist: ${file.path}`);
      });

      test("is non-empty, valid JSON with the expected metadata", () => {
        const content = readFileSync(file.path, "utf8");
        assert.notEqual(content.trim(), "", `file is empty: ${file.path}`);

        const theme = JSON.parse(content);

        assert.ok(theme.name, `${file.path}: missing name`);
        assert.ok(theme.displayName, `${file.path}: missing displayName`);
        assert.equal(theme.name, file.expectedName, `${file.path}: unexpected name`);
        assert.equal(theme.displayName, file.expectedDisplayName, `${file.path}: unexpected displayName`);
        assert.ok(theme.type, `${file.path}: missing type`);
        assert.equal(theme.type, file.expectedType, `${file.path}: unexpected type`);
        assert.ok(
          theme.colors && Object.keys(theme.colors).length > 0,
          `${file.path}: missing or empty colors object`
        );
        assert.ok(
          Array.isArray(theme.tokenColors) && theme.tokenColors.length > 0,
          `${file.path}: missing or empty tokenColors array`
        );
      });
    });
  }
});
