import {createWriteStream} from "node:fs";
import {execFile} from "node:child_process";
import {copyFile, mkdir, readFile, readdir, rm, stat} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {promisify} from "node:util";
import {fileURLToPath} from "node:url";

import archiver from "archiver";

import {buildPacks, verifyPacks} from "./compendium-packs.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const RELEASE_DIRECTORIES = ["assets"];
const RELEASE_FILES = ["module.json", "README.md", "LICENSE", "LICENSE.md", "THIRD_PARTY_NOTICES.md"];
const execFileAsync = promisify(execFile);
const ASSET_IGNORES = [
  "masters/**",
  "maps/*.webp",
  "maps/*.dungeondraft_map",
  "maps/wip.txt"
];

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function requestedTag() {
  const index = process.argv.indexOf("--tag");
  if (index === -1) return process.env.GITHUB_REF_NAME;
  if (!process.argv[index + 1]) throw new Error("--tag requires a value.");
  return process.argv[index + 1];
}

function validateManifest(manifest, tag) {
  const expectedTag = `v${manifest.version}`;
  const expectedArchive = `${manifest.id}.zip`;
  const expectedDownload = `${manifest.url.replace(/\/$/, "")}/releases/download/${expectedTag}/${expectedArchive}`;

  if (tag && tag !== expectedTag) {
    throw new Error(`Release tag ${tag} does not match module.json version ${manifest.version}.`);
  }
  if (manifest.download !== expectedDownload) {
    throw new Error(`module.json download must be ${expectedDownload}`);
  }
}

async function validateCompendiumAssets(manifest) {
  const sourceRoot = path.join(ROOT, "packs-src");
  const failures = [];

  async function inspect(value, location) {
    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index += 1) {
        await inspect(value[index], `${location}[${index}]`);
      }
      return;
    }
    if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) await inspect(child, `${location}.${key}`);
      return;
    }
    if (typeof value !== "string") return;

    if (/^[A-Za-z]:[\\/]/.test(value) || /^worlds[\\/]/i.test(value)) {
      failures.push(`${location}: package-external path ${value}`);
      return;
    }

    const prefix = `modules/${manifest.id}/`;
    if (!value.startsWith(prefix)) return;

    const relative = value.slice(prefix.length).split(/[?#]/, 1)[0];
    const target = path.resolve(ROOT, relative);
    if (!target.startsWith(`${ROOT}${path.sep}`) || !(await exists(target))) {
      failures.push(`${location}: missing module asset ${value}`);
    }
  }

  async function visit(directory) {
    for (const entry of await readdir(directory, {withFileTypes: true})) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile() && entry.name.endsWith(".json")) {
        const relative = path.relative(ROOT, absolute).split(path.sep).join("/");
        await inspect(JSON.parse(await readFile(absolute, "utf8")), relative);
      }
    }
  }

  await visit(sourceRoot);
  if (failures.length) throw new Error(`Invalid compendium asset references:\n${failures.join("\n")}`);
}

async function createZip(archivePath, packsDirectory) {
  const output = createWriteStream(archivePath);
  const archive = archiver("zip", {zlib: {level: 9}});
  const completed = new Promise((resolve, reject) => {
    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);
  });

  archive.pipe(output);

  for (const filename of RELEASE_FILES) {
    const source = path.join(ROOT, filename);
    if (await exists(source)) archive.file(source, {name: filename});
  }
  for (const directory of RELEASE_DIRECTORIES) {
    const source = path.join(ROOT, directory);
    if (!(await exists(source))) throw new Error(`Required release directory is missing: ${directory}`);
    if (directory === "assets") {
      archive.glob("**/*", {cwd: source, ignore: ASSET_IGNORES, dot: false}, {prefix: directory});
    } else archive.directory(source, directory);
  }
  archive.directory(packsDirectory, "packs");

  await archive.finalize();
  await completed;
}

async function main() {
  const manifest = JSON.parse(await readFile(path.join(ROOT, "module.json"), "utf8"));
  const packStagingRoot = path.join(os.tmpdir(), `theiks-harrowstone-release-${process.pid}-${Date.now()}`);
  validateManifest(manifest, requestedTag());
  await execFileAsync(process.execPath, [path.join(ROOT, "tools", "maps-verify.mjs"), "--runtime-only"], {cwd: ROOT});
  await validateCompendiumAssets(manifest);

  try {
    await buildPacks({destinationRoot: packStagingRoot});
    await verifyPacks();

    await rm(DIST, {force: true, recursive: true, maxRetries: 10});
    await mkdir(DIST, {recursive: true});

    const archivePath = path.join(DIST, `${manifest.id}.zip`);
    await createZip(archivePath, path.join(packStagingRoot, "packs"));
    await copyFile(path.join(ROOT, "module.json"), path.join(DIST, "module.json"));

    const {size} = await stat(archivePath);
    console.log(`Created ${path.relative(ROOT, archivePath)} (${size} bytes).`);
    console.log(`Created ${path.relative(ROOT, path.join(DIST, "module.json"))}.`);
  } finally {
    await rm(packStagingRoot, {force: true, recursive: true, maxRetries: 10});
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
