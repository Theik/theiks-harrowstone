import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const scene = JSON.parse(await readFile(new URL("../packs-src/maps/Harrowstone_hTGtBrMEJCXdW6er.json", import.meta.url), "utf8"));
const manifest = JSON.parse(await readFile(new URL("../assets/maps/harrowstone-pyramid/manifest.json", import.meta.url), "utf8"));

test("Harrowstone scene points at the renderer pyramid flag and z0 backgrounds", () => {
  const flag = scene.flags?.["theiks-ktx2-renderer"]?.mapPyramid;
  assert.equal(flag?.manifest, "modules/theiks-harrowstone/assets/maps/harrowstone-pyramid/manifest.json");
  assert.equal(scene.flags?.["theiks-harrowstone"]?.mapPyramid, undefined);
  assert.equal(scene.thumb, manifest.thumbnail.path);
  assert.equal(scene.levels.length, 5);
  for (const level of manifest.levels) {
    const sceneLevel = scene.levels.find(entry => entry._id === level.id);
    assert.ok(sceneLevel, `missing Level ${level.name}`);
    assert.equal(sceneLevel.background?.src, level.tiers.find(tier => tier.id === "z0").tiles[0].path);
  }
});
