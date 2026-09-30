import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(new URL("../.github/workflows/release.yml", import.meta.url), "utf8");

test("stable release and manual recovery share an explicit immutable tag checkout", () => {
  assert.match(workflow, /release:\s*\n\s+types: \[published\]/);
  assert.match(workflow, /workflow_dispatch:\s*\n\s+inputs:\s*\n\s+tag:[\s\S]*?required: true/);
  assert.match(workflow, /if: github\.event_name == 'workflow_dispatch' \|\| !github\.event\.release\.prerelease/);
  assert.match(workflow, /RELEASE_TAG: \$\{\{ github\.event\.release\.tag_name \|\| inputs\.tag \}\}/);
  assert.match(workflow, /ref: refs\/tags\/\$\{\{ env\.RELEASE_TAG \}\}/);
  assert.doesNotMatch(workflow, /ref: \$\{\{ inputs\.tag \}\}/);
  assert.match(workflow, /\[\[ "\$RELEASE_TAG" == "v\$version" && "\$RELEASE_TAG" =~/);
  assert.match(workflow, /git rev-parse "refs\/tags\/\$RELEASE_TAG\^\{commit\}"/);
  assert.match(workflow, /\[\[ "\$remote_commit" == "\$commit" \]\]/);
});

test("trusted publishing keeps preflight identity and does not gate success on registry propagation", () => {
  assert.match(workflow, /id-token: write/);
  assert.match(workflow, /runs-on: ubuntu-latest/);
  assert.match(workflow, /node-version: 24/);
  assert.match(workflow, /npm install --global npm@\^11\.5\.1/);
  assert.match(workflow, /run: npm test/);
  assert.match(workflow, /npm pack --dry-run --json/);
  assert.match(workflow, /node scripts\/release-identity\.mjs pre/);
  assert.match(workflow, /run: npm publish --access public/);
  assert.doesNotMatch(workflow, /node scripts\/release-identity\.mjs post/);
  assert.doesNotMatch(workflow, /NODE_AUTH_TOKEN|NPM_TOKEN|secrets\.|environment:/);
});
