import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const scenePath = path.join(root, "packs-src", "maps", "Harrowstone_hTGtBrMEJCXdW6er.json");
const manifestPath = path.join(root, "assets", "maps", "harrowstone-pyramid", "manifest.json");
const modulePathPrefix = "modules/theiks-harrowstone/";

const [sceneText, manifestText] = await Promise.all([
  readFile(scenePath, "utf8"),
  readFile(manifestPath, "utf8"),
]);
const scene = JSON.parse(sceneText);
const manifest = JSON.parse(manifestText);

function moduleAssetPath(assetPath) {
  return assetPath.startsWith("modules/") ? assetPath : `${modulePathPrefix}${assetPath}`;
}

const rendererId = "theiks-ktx2-renderer";
const expected = {
  width: 6700,
  height: 6500,
  gridSize: 100,
  padding: 0.1,
  levels: 5,
  walls: 1137,
  tiles: 6,
  regions: 9,
};

const actual = {
  width: scene.width,
  height: scene.height,
  gridSize: scene.grid?.size,
  padding: scene.padding,
  levels: scene.levels?.length,
  walls: scene.walls?.length,
  tiles: scene.tiles?.length,
  regions: scene.regions?.length,
};
for (const [key, value] of Object.entries(expected)) {
  if (actual[key] !== value) throw new Error(`Refusing to patch scene: expected ${key}=${value}, got ${actual[key]}`);
}

const before = structuredClone(scene);
const expectedPaths = new Set(["thumb", `flags.${rendererId}`]);
if (scene.flags?.["theiks-harrowstone"]?.mapPyramid) expectedPaths.add("flags.theiks-harrowstone");
scene.thumb = moduleAssetPath(manifest.thumbnail.path);
scene.flags ??= {};
if (scene.flags["theiks-harrowstone"]) {
  delete scene.flags["theiks-harrowstone"].mapPyramid;
  if (!Object.keys(scene.flags["theiks-harrowstone"]).length) delete scene.flags["theiks-harrowstone"];
}
scene.flags[rendererId] = {
  mapPyramid: {
    version: manifest.schemaVersion,
    manifest: `${modulePathPrefix}assets/maps/harrowstone-pyramid/manifest.json`,
  },
};

const manifestLevels = new Map(manifest.levels.map((level) => [level.id, level]));
for (let index = 0; index < scene.levels.length; index += 1) {
  const level = scene.levels[index];
  const generated = manifestLevels.get(level._id);
  if (!generated) throw new Error(`No generated map level for ${level.name} (${level._id})`);
  const lowTier = generated.tiers.find((tier) => tier.id === "z0");
  if (!lowTier || lowTier.tiles.length !== 1) throw new Error(`Expected one z0 tile for ${level.name}`);
  level.background.src = lowTier.tiles[0].path;
  expectedPaths.add(`levels.${index}.background.src`);
}

function changedPaths(left, right, prefix = "") {
  if (Object.is(left, right)) return [];
  if (left === null || right === null || typeof left !== "object" || typeof right !== "object") return [prefix];
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  return [...keys].flatMap((key) => changedPaths(left[key], right[key], prefix ? `${prefix}.${key}` : key));
}

const changes = changedPaths(before, scene);
const unexpected = changes.filter((change) => !expectedPaths.has(change));
if (unexpected.length) throw new Error(`Unexpected scene changes: ${unexpected.join(", ")}`);

await writeFile(scenePath, `${JSON.stringify(scene, null, 2)}\n`, "utf8");
console.log(`Configured ${scene.name}: ${changes.length} allowed changes (${changes.join(", ") || "already current"}).`);
