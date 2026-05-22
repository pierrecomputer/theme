import { execSync } from "child_process";
import { join } from "path";

const pat = process.argv[2];
if (!pat) throw new Error("Usage: npm run publish:ovsx -- <token>");

execSync(`npx ovsx publish --pat ${pat}`, {
  stdio: "inherit",
  cwd: join(__dirname, ".."),
});
