import {spawn} from "node:child_process";

import {assertRendererInstalled, pyramidArgs} from "./ktx2-renderer.mjs";

const command = process.argv[2];
if (!["doctor", "rebuild", "verify"].includes(command)) {
  throw new Error("Usage: node tools/run-ktx2-pyramid.mjs <doctor|rebuild|verify> [extra renderer flags]");
}

const cli = await assertRendererInstalled();
const child = spawn(process.execPath, [cli, ...pyramidArgs(command, process.argv.slice(3))], {
  stdio: "inherit"
});
child.on("exit", code => {
  process.exitCode = code ?? 1;
});
