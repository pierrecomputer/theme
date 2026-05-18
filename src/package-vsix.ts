import { readFileSync, writeFileSync, existsSync, renameSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";

const root = join(__dirname, "..");
const pkgPath = join(root, "package.json");
const readmePath = join(root, "README.md");
const vsceReadmePath = join(root, "README.vsce.md");
const readmeBackupPath = join(root, "README.md.bak");

const original = readFileSync(pkgPath, "utf-8");
const pkg = JSON.parse(original);

// Store original name and swap to unscoped version for VSIX
const originalName = pkg.name;
pkg.name = "pierre-theme";

console.log(`Temporarily renaming package: ${originalName} → ${pkg.name}\n`);

const hadReadme = existsSync(readmePath);

try {
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

  // Swap in the VSCE-specific README
  if (hadReadme) renameSync(readmePath, readmeBackupPath);
  renameSync(vsceReadmePath, readmePath);

  execSync("vsce package", { stdio: "inherit", cwd: root });
} finally {
  // Restore README files
  renameSync(readmePath, vsceReadmePath);
  if (hadReadme) renameSync(readmeBackupPath, readmePath);

  // Restore original package.json
  writeFileSync(pkgPath, original);
  console.log(`\nRestored package name: ${originalName}`);
}
