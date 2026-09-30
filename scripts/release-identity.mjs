import { appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export async function checkIdentity({ name, version, commit, mode, fetchMetadata, wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) }) {
  if (!["pre", "post"].includes(mode)) throw new Error("Expected pre or post mode");
  const attempts = mode === "post" ? 6 : 1;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let metadata;
    try {
      metadata = await fetchMetadata(name, version);
    } catch (error) {
      if (attempt === attempts) throw error;
      await wait(10000);
      continue;
    }
    if (metadata !== null) {
      if (metadata.version !== version || metadata.gitHead !== commit) {
        throw new Error("Registry version/gitHead differs from the immutable release identity");
      }
      return false; // Already published at precisely the requested identity.
    }
    if (mode === "pre") return true;
    if (attempt === attempts) throw new Error("Published version not visible after bounded retries");
    await wait(10000);
  }
}

async function fetchMetadata(name, version) {
  const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}/${encodeURIComponent(version)}`, {
    signal: AbortSignal.timeout(15000),
    headers: { accept: "application/json" },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Registry identity lookup failed: HTTP ${response.status}`);
  return response.json();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [mode, name, version, commit] = process.argv.slice(2);
  if (!name || !version || !/^[0-9a-f]{40}$/.test(commit ?? "")) throw new Error("Missing release identity");
  const publish = await checkIdentity({ name, version, commit, mode, fetchMetadata });
  if (mode === "pre") {
    if (!process.env.GITHUB_OUTPUT) throw new Error("GITHUB_OUTPUT is required");
    appendFileSync(process.env.GITHUB_OUTPUT, `publish=${publish}\n`);
  }
  console.log(publish ? "Version absent; publication required" : "Registry version/gitHead match");
}
