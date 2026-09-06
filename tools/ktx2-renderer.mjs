import {access} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const HARROWSTONE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function rendererRoot() {
  return path.resolve(process.env.KTX2_RENDERER_ROOT ?? path.join(HARROWSTONE_ROOT, "..", "theiks-ktx2-renderer"));
}

export function pyramidCli() {
  return path.join(rendererRoot(), "tools", "pyramid.mjs");
}

export async function assertRendererInstalled() {
  const cli = pyramidCli();
  try {
    await access(cli);
  } catch {
    throw new Error(`Theik's KTX2 Renderer CLI was not found at ${cli}. Clone it next to this module or set KTX2_RENDERER_ROOT.`);
  }
  return cli;
}

export function pyramidArgs(command, extra = []) {
  return [
    command,
    "--config", path.join(HARROWSTONE_ROOT, "tools", "maps", "harrowstone-pyramid.json"),
    "--masters", path.join(HARROWSTONE_ROOT, "assets", "masters"),
    "--output", path.join(HARROWSTONE_ROOT, "assets", "maps", "harrowstone-pyramid"),
    "--module-id", "theiks-harrowstone",
    "--module-root", HARROWSTONE_ROOT,
    ...extra
  ];
}

export {HARROWSTONE_ROOT};
