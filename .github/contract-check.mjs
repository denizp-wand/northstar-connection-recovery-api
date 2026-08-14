/**
 * Does the candidate contract remove anything the published one requires?
 *
 * Deliberately small and readable: it reads both YAML files as text and compares the `required`
 * lists of the shared schemas. A removal is reported, with the consumers it affects, and the job
 * does NOT fail — whether a break is acceptable is a person's decision, not a pipeline's.
 */
import { existsSync, readFileSync } from 'node:fs';

/** The lines of one schema block, bounded by the next key at the same indentation. */
const blockOf = (yaml, schema) => {
  const lines = yaml.split('\n');
  const start = lines.findIndex((l) => l.trim() === `${schema}:`);
  if (start < 0) return [];
  const indent = lines[start].search(/\S/);
  const out = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const l = lines[i];
    if (l.trim() && l.search(/\S/) <= indent) break;
    out.push(l);
  }
  return out;
};

/** The `required` field names of a schema — inline `[a, b]` or a `-` list, comments ignored. */
const requiredOf = (yaml, schema) => {
  const lines = blockOf(yaml, schema);
  const at = lines.findIndex((l) => /^\s*required:/.test(l));
  if (at < 0) return [];
  const inline = /required:\s*\[([^\]]*)\]/.exec(lines[at]);
  if (inline) return inline[1].split(',').map((s) => s.trim()).filter(Boolean);
  const indent = lines[at].search(/\S/);
  const out = [];
  for (let i = at + 1; i < lines.length; i += 1) {
    const l = lines[i];
    if (!l.trim()) continue;
    if (l.search(/\S/) <= indent && !/^\s*[-#]/.test(l)) break;
    const m = /^\s*-\s*([A-Za-z0-9_]+)/.exec(l);
    if (m) out.push(m[1]);
  }
  return out;
};

const CANDIDATE = 'api/connection-recovery-openapi-v42.7.yaml';
if (!existsSync(CANDIDATE)) {
  console.log('no candidate contract on this branch — nothing to compare');
  process.exit(0);
}
const published = readFileSync('api/connection-recovery-openapi-v42.6.yaml', 'utf8');
const candidate = readFileSync(CANDIDATE, 'utf8');

let removals = 0;
for (const schema of ['RecoveryOptions', 'RecoveryOption', 'Segment']) {
  const before = requiredOf(published, schema);
  const after = requiredOf(candidate, schema);
  for (const field of before.filter((f) => !after.includes(f))) {
    removals += 1;
    console.log(`BREAKING  ${schema}.${field} is required in 42.6.0 and not in 42.7.0`);
  }
}
console.log(removals === 0 ? 'no required field was removed' : `${removals} required field(s) removed`);
console.log('This job reports. It does not decide: a release authority does.');
