import { readFileSync, writeFileSync, existsSync, renameSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";

const root = join(__dirname, "..");
const pkgPath = join(root, "package.json");
const readmePath = join(root, "README.md");
const vsceReadmePath = join(root, "README.package.md");
const readmeBackupPath = join(root, "README.md.bak");

export function vsceRun(command: string) {
  const original = readFileSync(pkgPath, "utf-8");
  const pkg = JSON.parse(original);

  const originalName = pkg.name;
  pkg.name = "pierre-theme";

  console.log(`Temporarily renaming package: ${originalName} → ${pkg.name}\n`);

  const hadReadme = existsSync(readmePath);

  try {
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

    if (hadReadme) renameSync(readmePath, readmeBackupPath);
    renameSync(vsceReadmePath, readmePath);

    execSync(command, { stdio: "inherit", cwd: root });
  } finally {
    renameSync(readmePath, vsceReadmePath);
    if (hadReadme) renameSync(readmeBackupPath, readmePath);

    writeFileSync(pkgPath, original);
    console.log(`\nRestored package name: ${originalName}`);
  }
}
