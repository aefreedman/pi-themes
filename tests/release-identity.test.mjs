import assert from "node:assert/strict";
import test from "node:test";
import { checkIdentity } from "../scripts/release-identity.mjs";

const identity = { name: "@aefree/pi-themes", version: "0.2.2", commit: "a".repeat(40) };
const matching = { version: identity.version, gitHead: identity.commit };
const check = (mode, fetchMetadata, wait = async () => {}) => checkIdentity({ ...identity, mode, fetchMetadata, wait });

test("preflight publishes only an absent version and skips matching immutable identity", async () => {
  assert.equal(await check("pre", async () => null), true);
  assert.equal(await check("pre", async () => matching), false);
});

test("identity mismatch fails immediately in preflight and postpublish", async () => {
  for (const mode of ["pre", "post"]) {
    for (const metadata of [{ ...matching, gitHead: "b".repeat(40) }, { ...matching, version: "0.2.1" }, { version: identity.version }]) {
      let calls = 0;
      await assert.rejects(check(mode, async () => { calls += 1; return metadata; }), /differs/);
      assert.equal(calls, 1);
    }
  }
});

test("preflight never treats registry failures as an absent version", async () => {
  await assert.rejects(check("pre", async () => { throw new Error("network failure"); }), /network failure/);
});

test("postpublish retries transient errors and visibility delays", async () => {
  let calls = 0;
  let waits = 0;
  assert.equal(await check("post", async () => {
    calls += 1;
    if (calls === 1) throw new Error("transient");
    return calls === 2 ? null : matching;
  }, async () => { waits += 1; }), false);
  assert.equal(calls, 3);
  assert.equal(waits, 2);
});

test("postpublish absent version and registry failures exhaust bounded retries", async () => {
  for (const fail of [false, true]) {
    let calls = 0;
    await assert.rejects(check("post", async () => {
      calls += 1;
      if (fail) throw new Error("registry failure");
      return null;
    }), fail ? /registry failure/ : /bounded retries/);
    assert.equal(calls, 6);
  }
});
