// Discovers preview modules in src/previews and writes each rendered HTML file
// to preview/.

import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";

type Preview = {
  filename: string;
  render: () => string;
};

const root = join(__dirname, "..");
const previewSourceDir = join(root, "src", "previews");
const outputDir = join(root, "preview");

mkdirSync(outputDir, { recursive: true });

const files = readdirSync(previewSourceDir)
  .filter((file) => extname(file) === ".ts")
  .sort();

for (const file of files) {
  const exportName = basename(file, ".ts");
  const mod = require(join(previewSourceDir, file));
  const preview = mod[exportName] as Preview | undefined;

  if (!preview || typeof preview.filename !== "string" || typeof preview.render !== "function") {
    throw new Error(`${file} must export ${exportName}: { filename, render }`);
  }

  const outputPath = join(outputDir, preview.filename);
  writeFileSync(outputPath, preview.render(), "utf8");
  console.log("Wrote", relative(root, outputPath));
}
