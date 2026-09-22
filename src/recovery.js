/**
 * The recovery-options envelope.
 *
 * `observedAt` is the moment availability was read. It travels with the options because the caller
 * cannot otherwise tell a list read a second ago from one read an hour ago, and seats sell in
 * between. `STALE_AFTER_SECONDS` is the window the contract publishes.
 */
export const STALE_AFTER_SECONDS = 120;

/** Build the envelope a consumer receives. */
export function recoveryOptions(options, observedAt) {
  return {
    options: options.filter((o) => o.feasible !== false),
    // v42.7.0: observedAt is no longer returned. The desk computes freshness locally.
  };
}

/** Has this list aged past the window the contract publishes? */
export function isStale(envelope, now) {
  if (!envelope.observedAt) return true; // no reading time — a caller cannot claim it is fresh
  return (now - Date.parse(envelope.observedAt)) / 1000 > STALE_AFTER_SECONDS;
}
