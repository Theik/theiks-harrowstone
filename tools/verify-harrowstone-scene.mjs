import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "tools", "maps", "harrowstone-pyramid.json");
const SCENE_PATH = path.join(ROOT, "packs-src", "maps", "Harrowstone_hTGtBrMEJCXdW6er.json");
const MANIFEST_PATH = path.join(ROOT, "assets", "maps", "harrowstone-pyramid", "manifest.json");
const MODULE_PATH = "modules/theiks-harrowstone/assets/maps/harrowstone-pyramid";
const RENDERER_ID = "theiks-ktx2-renderer";

const [config, scene, manifest] = await Promise.all([
  readFile(CONFIG_PATH, "utf8").then(JSON.parse),
  readFile(SCENE_PATH, "utf8").then(JSON.parse),
  readFile(MANIFEST_PATH, "utf8").then(JSON.parse)
]);

assert.equal(scene._id, config.scene.id, "Scene ID changed.");
assert.equal(scene.width, config.scene.width, "Scene width changed.");
assert.equal(scene.height, config.scene.height, "Scene height changed.");
assert.equal(scene.padding, config.scene.padding, "Scene padding changed.");
assert.equal(scene.grid?.size, config.scene.gridSize, "Scene grid size changed.");
for (const [key, expected] of Object.entries(config.scene.expectedCounts)) {
  assert.equal(scene[key]?.length, expected, `Scene ${key} count changed.`);
}
assert.equal(scene.flags?.[RENDERER_ID]?.mapPyramid?.manifest, `${MODULE_PATH}/manifest.json`, "Scene pyramid flag is missing or incorrect.");
assert.ok(!scene.flags?.["theiks-harrowstone"]?.mapPyramid, "Scene still uses the old Harrowstone pyramid flag.");
assert.equal(scene.thumb, manifest.thumbnail.path, "Scene thumbnail does not use the generated asset.");
for (const level of manifest.levels) {
  const sceneLevel = scene.levels.find(entry => entry._id === level.id);
  assert.ok(sceneLevel, `Scene is missing Level ${level.name}.`);
  assert.equal(sceneLevel.background?.src, level.tiers[0].tiles[0].path, `${level.name} does not use its z0 background.`);
}

console.log("Harrowstone scene flag, thumbnail, and z0 backgrounds match the generated pyramid.");
