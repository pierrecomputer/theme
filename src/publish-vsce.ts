import { vsceRun } from "./vsce-run";

const pat = process.argv[2];
if (!pat) throw new Error("Usage: npm run publish:vsce -- <token>");

vsceRun(`vsce publish --pat ${pat}`);
