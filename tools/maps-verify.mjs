import {spawn} from "node:child_process";
import path from "node:path";

import {assertRendererInstalled, HARROWSTONE_ROOT, pyramidArgs} from "./ktx2-renderer.mjs";

function run(command, args, cwd = HARROWSTONE_ROOT) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {cwd, stdio: "inherit"});
    child.on("error", reject);
    child.on("close", code => {
      if (code === 0) resolve();
      else reject(new Error(`${path.basename(command)} ${args[0] ?? ""} exited with ${code}.`));
    });
  });
}

const extra = process.argv.slice(2);
const cli = await assertRendererInstalled();
await run(process.execPath, [cli, ...pyramidArgs("verify", extra)]);
await run(process.execPath, [path.join(HARROWSTONE_ROOT, "tools", "verify-harrowstone-scene.mjs")]);
