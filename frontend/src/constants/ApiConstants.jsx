export const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000";

export const ROUTE_CONSTANTS = {
  ASSET_LIST: "/assets/list",
  ASSETS: "/assets",
  ASSET_HEALTH_SUMMARY: "/assets/health-summary",
  IN_ACTIVE_COUNT: "/assets/inactive-count",
  HEALTH_COUNT: "/assets/health-count",
  DEVICES_BY_AGE: "/assets/devices-by-age",
  ASSET_SUMMARY: "/assets/summary",
};
