import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const requiredColors = [
  "accent", "border", "borderAccent", "borderMuted", "success", "error", "warning", "muted", "dim", "text", "thinkingText",
  "selectedBg", "scrollbarThumb", "searchMatchBg", "searchMatchText", "userMessageBg", "userMessageText", "customMessageBg", "customMessageText", "customMessageLabel", "toolPendingBg", "toolSuccessBg", "toolErrorBg", "toolTitle", "toolOutput",
  "mdHeading", "mdLink", "mdLinkUrl", "mdCode", "mdCodeBlock", "mdCodeBlockBorder", "mdQuote", "mdQuoteBorder", "mdHr", "mdListBullet",
  "toolDiffAdded", "toolDiffRemoved", "toolDiffContext",
  "syntaxComment", "syntaxKeyword", "syntaxFunction", "syntaxVariable", "syntaxString", "syntaxNumber", "syntaxType", "syntaxOperator", "syntaxPunctuation",
  "thinkingOff", "thinkingMinimal", "thinkingLow", "thinkingMedium", "thinkingHigh", "thinkingXhigh", "thinkingMax", "bashMode",
];

function isColorValue(value, variables) {
  return value === ""
    || (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 255)
    || (typeof value === "string" && (/^#[0-9a-f]{6}$/i.test(value) || Object.hasOwn(variables, value)));
}

for (const [themeName, appearance] of [["solarized-dark", "dark"], ["solarized-light", "light"]]) {
  test(`${themeName} satisfies Pi's theme contract`, async () => {
    const theme = JSON.parse(await readFile(new URL(`../themes/${themeName}.json`, import.meta.url), "utf8"));
    assert.equal(theme.$schema, "https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/src/modes/interactive/theme/theme-schema.json");
    assert.equal(theme.name, themeName);
    assert.ok(theme.name.length > 0 && !theme.name.includes("/"));
    assert.notEqual(theme.name, "system");
    assert.equal(theme.appearance, appearance);

    const variables = theme.vars ?? {};
    for (const [name, value] of Object.entries(variables)) {
      assert.ok(isColorValue(value, {}), `invalid variable ${name}: ${String(value)}`);
    }
    for (const name of requiredColors) {
      assert.ok(Object.hasOwn(theme.colors, name), `missing required color ${name}`);
    }
    for (const [name, value] of Object.entries(theme.colors)) {
      assert.ok(isColorValue(value, variables), `invalid color ${name}: ${String(value)}`);
    }
  });
}
