// scripts/assert.js
// Simple assertion script to verify planner outputs against EXPECT values.
const assert = require("assert");

function parseJSONMaybe(s, fallback) {
  try { return JSON.parse(s); } catch { return fallback; }
}
function listToSet(s) {
  return new Set(String(s || "").split(/\s+/).map(x => x.trim()).filter(Boolean));
}

const exp = parseJSONMaybe(process.env.EXPECT, {});
const got = {
  mode:          process.env.MODE || "",
  only_jobs:     process.env.ONLY_JOBS || "",
  skip_jobs:     process.env.SKIP_JOBS || "",
  enabled_jobs:  process.env.ENABLED_JOBS || "",
  targets_json:  process.env.TARGETS_JSON || "[]",
  targets_list:  process.env.TARGETS_LIST || ""
};

// mode
if (exp.mode !== undefined) {
  assert.strictEqual(got.mode, exp.mode, `mode mismatch: got=${got.mode} exp=${exp.mode}`);
}

// enabled_jobs (unordered)
if (exp.enabled_jobs) {
  const g = listToSet(got.enabled_jobs);
  const e = new Set(exp.enabled_jobs);
  for (const job of e) assert(g.has(job), `enabled_jobs missing: ${job}`);
}

// only / skip
if (exp.only_jobs) {
  const g = listToSet(got.only_jobs);
  const e = new Set(exp.only_jobs);
  for (const job of e) assert(g.has(job), `only_jobs missing: ${job}`);
}
if (exp.skip_jobs) {
  const g = listToSet(got.skip_jobs);
  const e = new Set(exp.skip_jobs);
  for (const job of e) assert(g.has(job), `skip_jobs missing: ${job}`);
}

// targets (ordered)
if (exp.targets) {
  const arr = parseJSONMaybe(got.targets_json, []);
  const want = exp.targets;
  if (!Array.isArray(arr)) {
    throw new Error(`targets_json is not an array: ${got.targets_json}`);
  }
  if (arr.length !== want.length) {
    throw new Error(`targets length mismatch: got=${arr.length} exp=${want.length}`);
  }
  for (let i = 0; i < want.length; i++) {
    if (arr[i] !== want[i]) {
      throw new Error(`targets[${i}] mismatch: got=${arr[i]} exp=${want[i]}`);
    }
  }
}

console.log("✅ assertions OK");