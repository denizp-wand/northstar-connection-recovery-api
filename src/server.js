import { createServer } from 'node:http';
import { recoveryOptions } from './recovery.js';

/** Synthetic fixtures. This service reads no real system and holds no real passenger. */
const OPTIONS = [
  { optionId: 'OPT-A', feasible: true, segments: [{ origin: 'NVA', destination: 'HBR', departsAt: '2026-09-23T17:40:00Z' }] },
  { optionId: 'OPT-B', feasible: true, segments: [{ origin: 'NVA', destination: 'CST', departsAt: '2026-09-24T06:15:00Z' }] },
];

export const app = createServer((req, res) => {
  const m = /^\/connection-recovery\/v42\/itineraries\/([A-Z0-9]{6})\/options$/.exec(req.url ?? '');
  res.setHeader('content-type', 'application/json');
  if (!m) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'not found' }));
    return;
  }
  res.end(JSON.stringify(recoveryOptions(OPTIONS, new Date().toISOString())));
});

if (process.argv[1]?.endsWith('server.js')) app.listen(8427);
