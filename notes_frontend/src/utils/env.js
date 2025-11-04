/**
 * Utilities for reading environment variables from CRA runtime.
 * Gracefully handle empty values and expose flags the app needs.
 */

// PUBLIC_INTERFACE
export function getEnv() {
  /** Read REACT_APP_* runtime variables. */
  const apiBase =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    "";

  const wsUrl = process.env.REACT_APP_WS_URL || "";
  const nodeEnv = process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || "development";
  const featureFlags = process.env.REACT_APP_FEATURE_FLAGS || "";
  const experiments = process.env.REACT_APP_EXPERIMENTS_ENABLED === "true";

  const enableSourceMaps = process.env.REACT_APP_ENABLE_SOURCE_MAPS === "true";
  const port = process.env.REACT_APP_PORT || "3000";
  const trustProxy = process.env.REACT_APP_TRUST_PROXY === "true";
  const logLevel = process.env.REACT_APP_LOG_LEVEL || "info";
  const healthPath = process.env.REACT_APP_HEALTHCHECK_PATH || "/healthz";

  return {
    apiBase,
    wsUrl,
    nodeEnv,
    featureFlags,
    experiments,
    enableSourceMaps,
    port,
    trustProxy,
    logLevel,
    healthPath,
  };
}

// PUBLIC_INTERFACE
export function hasBackend() {
  /** True when a usable API base is configured (non-empty). */
  const { apiBase } = getEnv();
  return !!apiBase && apiBase.trim().length > 0;
}
