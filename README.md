# Connection Recovery API

Re-accommodation lookup for passengers whose connection is no longer viable. Given a disrupted
itinerary it returns the options that are still feasible, best first, and it says when it read
availability so a caller can tell a fresh answer from a stale one.

| | |
|---|---|
| Service id | `SVC-NAG-0427` |
| Criticality | Tier 1 |
| Published contract | `api/connection-recovery-openapi-v42.6.yaml` |
| Release candidate | `api/connection-recovery-openapi-v42.7.yaml` on `release/v42.7.0` |
| Consumers | 6 · 3 of them read the recovery-options envelope directly |

## The freshness field

`RecoveryOptions.observedAt` is the time availability was read. A caller **must** treat a list older
than 120 seconds as stale and re-request before confirming a seat, because seats sell between the
read and the confirmation — which is the failure this service exists to avoid.

`release/v42.7.0` removes that field. `architecture/dependencies.json` records which consumers still
read it. Whether that is safe is a decision this repository deliberately does not make.

## Running it

```
npm install   # nothing to install — the service has no dependencies
npm test      # node --test tests/*.test.js
npm start     # http://localhost:8427
```

---

## This repository is synthetic

**Northstar Aviation Group is not a real airline and this is not any airline's code.** Every name,
identifier, route, service and figure here was invented for a product demonstration, and the airport
codes (`NVA`, `HBR`, `CST`) are deliberately not real IATA codes. Nothing here is derived from, or
representative of, any customer's systems.

The removed field is a deliberate, documented compatibility break authored to be found. It is not a
security vulnerability, and this repository contains none.
