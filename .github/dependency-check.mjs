/** Which consumers still read a field the candidate removes, and have they migrated? */
import { readFileSync } from 'node:fs';

const deps = JSON.parse(readFileSync('architecture/dependencies.json', 'utf8'));
const exposed = deps.downstream.filter((d) => d.readsField && !d.migratedTo427);

for (const d of deps.downstream) {
  const state = d.migratedTo427 ? 'migrated' : d.readsField ? `reads ${d.readsField}` : 'not affected';
  console.log(`${d.service.padEnd(12)} ${d.name.padEnd(20)} contract ${d.consumesContract}  ${state}`);
}
console.log(`\n${exposed.length} of ${deps.downstream.length} consumers read a removed field and have not migrated.`);
console.log('Reachability in a deployment is not established here. That is a separate question.');
