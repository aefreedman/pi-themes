import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Resolve only the package-local install: never fall back to a parent/global SDK.
const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const runtimeRoot = new URL("../node_modules/@earendil-works/pi-coding-agent/", import.meta.url);
const installed = JSON.parse(await readFile(new URL("package.json", runtimeRoot), "utf8"));
const expectedVersion = manifest.devDependencies["@earendil-works/pi-coding-agent"];
assert.match(expectedVersion, /^\d+\.\d+\.\d+$/, "Pi must be pinned to an exact stable version");
assert.equal(installed.version, expectedVersion, "Installed Pi must match the manifest pin");
// Pi does not export this isolated validator through its SDK entrypoint. Import its
// shipped implementation directly; dependency updates must verify this seam.
const { validateThemeJson } = await import(new URL("dist/modes/interactive/theme/theme-schema.js", runtimeRoot));

function isColorValue(value, variables) {
  return value === ""
    || (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 255)
    || (typeof value === "string" && (/^#[0-9a-f]{6}$/i.test(value) || Object.hasOwn(variables, value)));
}

for (const [themeName, appearance] of [["solarized-dark", "dark"], ["solarized-light", "light"]]) {
  test(`${themeName} satisfies Pi's theme contract`, async () => {
    const theme = JSON.parse(await readFile(new URL(`../themes/${themeName}.json`, import.meta.url), "utf8"));
    assert.equal(theme.$schema, "https://pi.dev/schemas/theme.schema.json");
    assert.equal(theme.name, themeName);
    assert.ok(theme.name.length > 0 && !theme.name.includes("/"));
    assert.notEqual(theme.name, "system");
    assert.equal(theme.appearance, appearance);

    assert.equal(validateThemeJson(themeName, theme), theme);

    const variables = theme.vars ?? {};
    for (const [name, value] of Object.entries(variables)) {
      assert.ok(isColorValue(value, {}), `invalid variable ${name}: ${String(value)}`);
    }
    for (const [name, value] of Object.entries(theme.colors)) {
      assert.ok(isColorValue(value, variables), `invalid color ${name}: ${String(value)}`);
    }
  });
}

const validTheme = JSON.parse(await readFile(new URL("../themes/solarized-dark.json", import.meta.url), "utf8"));
const invalidCases = [
  ["unknown top-level property", theme => { theme.metadata = "unsupported"; }, /metadata|additional/],
  ["unknown color token", theme => { theme.colors.customAccent = "cyan"; }, /customAccent|additional/],
  ["unknown export property", theme => { theme.export.customBg = "base03"; }, /customBg|additional/],
  ["missing required color", theme => { delete theme.colors.accent; }, /Missing required color tokens:[\s\S]*accent/],
  ["invalid appearance", theme => { theme.appearance = "automatic"; }, /appearance/],
  ["invalid name", theme => { theme.name = "light/dark"; }, /cannot contain/],
  ["empty name", theme => { theme.name = ""; }, /name/],
  ["negative color index", theme => { theme.colors.accent = -1; }, /colors\/accent/],
  ["out-of-range color index", theme => { theme.colors.accent = 256; }, /colors\/accent/],
  ["fractional color index", theme => { theme.colors.accent = 1.5; }, /colors\/accent/],
  ["invalid color type", theme => { theme.colors.accent = true; }, /colors\/accent/],
  ["invalid variable type", theme => { theme.vars.cyan = null; }, /vars\/cyan/],
  ["invalid export value", theme => { theme.export.pageBg = {}; }, /export\/pageBg/],
];

for (const [label, mutate, errorPattern] of invalidCases) {
  test(`Pi validator rejects ${label}`, () => {
    const theme = structuredClone(validTheme);
    mutate(theme);
    assert.throws(() => validateThemeJson(label, theme), errorPattern);
  });
}

test("Pi validator permits optional tokens to be omitted", () => {
  const theme = structuredClone(validTheme);
  for (const token of ["scrollbarTrack", "scrollbarThumb", "searchMatchBg", "searchMatchText", "thinkingMax"]) {
    delete theme.colors[token];
  }
  assert.doesNotThrow(() => validateThemeJson("optional tokens", theme));
});

test("Pi validator accepts documented color value forms", () => {
  // JSON validation accepts strings; parsing and reference resolution are a
  // separate runtime stage. Do not impose the old six-digit-only contract here.
  for (const value of ["#0af", "#00aaff", "oklch(62% 0.1 200)", "okhsl(250 60% 55%)", 0, 255, "cyan", ""]) {
    const theme = structuredClone(validTheme);
    theme.colors.accent = value;
    assert.doesNotThrow(() => validateThemeJson("color forms", theme));
  }
});
