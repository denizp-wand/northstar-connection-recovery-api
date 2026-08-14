# Release specification — Connection Recovery API v42.7.0

**Release** REL-260923-017  ·  **Service** SVC-NAG-0427
**Change owner** Marcus Chen  ·  **Release branch** `release/v42.7.0`  ·  **Target branch** `main`
**Work items** NAG-8841, NAG-8907

## What this release does

Removes `observedAt` from the recovery-options envelope. The field was added so the
disruption desk could decide whether an option list had gone stale before confirming a
seat; the desk now computes freshness locally, so carrying it on every response is
redundant and measurably slower on the hot path.

## What it is expected to change

- One fewer serialized field on the highest-volume response of a Tier 1 service.
- Roughly 4% off the p99 of `listRecoveryOptions` in load testing.

## What the change owner believes about compatibility

The field is redundant **for the desk**, which is the consumer this change was written
for. Whether any other consumer still reads it has not been established here; that is
what the contract comparison and the dependency graph are for.

## Rollback

Re-adding the field is additive and safe. Rollback is a redeploy of v42.6.0.

---

*This specification is synthetic, authored for a demonstration environment. It is not a
Northstar document and it is not any customer's document.*
