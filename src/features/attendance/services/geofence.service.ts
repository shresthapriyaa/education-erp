// import type {
//   GeofenceSettings,
//   UpdateGeofencePayload,
// } from "../types/attendance.types";
// export const geofenceService = {
//   async getSettings(): Promise<GeofenceSettings> {
//     const res = await fetch("/api/admin/attendance/geofence");
//     if (!res.ok) throw new Error("Failed to fetch geofence settings");
//     return res.json();
//   },

//   async updateSettings(
//     payload: UpdateGeofencePayload,
//   ): Promise<GeofenceSettings> {
//     const res = await fetch("/api/admin/attendance/geofence", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     if (!res.ok) throw new Error("Failed to update geofence settings");
//     return res.json();
//   },
// };





import type {
  GeofenceSettings,
  UpdateGeofencePayload,
} from "../types/attendance.types";

export const geofenceService = {
  async getSettings(): Promise<GeofenceSettings> {
    const res = await fetch("/api/attendance/geofence");
    if (!res.ok) throw new Error("Failed to fetch geofence settings");
    return res.json();
  },

  async updateSettings(payload: UpdateGeofencePayload): Promise<GeofenceSettings> {
    const res = await fetch("/api/attendance/geofence", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update geofence settings");
    return res.json();
  },
};
