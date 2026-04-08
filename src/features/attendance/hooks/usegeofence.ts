// "use client";

// import { useState, useEffect } from "react";
// import { geofenceService } from "../services/geofence.service";
// import type {
//   GeofenceSettings,
//   UpdateGeofencePayload,
// } from "../types/attendance.types";

// export function useGeofence() {
//   const [settings, setSettings] = useState<GeofenceSettings | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     geofenceService
//       .getSettings()
//       .then(setSettings)
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//   }, []);

//   async function update(payload: UpdateGeofencePayload): Promise<boolean> {
//     setSaving(true);
//     setError(null);
//     try {
//       const updated = await geofenceService.updateSettings(payload);
//       setSettings(updated);
//       return true;
//     } catch (e: any) {
//       setError(e.message);
//       return false;
//     } finally {
//       setSaving(false);
//     }
//   }

//   return { settings, loading, saving, error, update };
// }



// src/features/attendance/hooks/useGeofence.ts
"use client";

import { useState, useCallback } from "react";

interface GeofencePosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface GeofenceResult {
  position: GeofencePosition | null;
  loading: boolean;
  error: string | null;
  getPosition: () => Promise<GeofencePosition | null>;
}

export function useGeofence(): GeofenceResult {
  const [position, setPosition] = useState<GeofencePosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPosition = useCallback((): Promise<GeofencePosition | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your device");
        resolve(null);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const result: GeofencePosition = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
          setPosition(result);
          setLoading(false);
          resolve(result);
        },
        (err) => {
          const messages: Record<number, string> = {
            1: "Location permission denied. Please allow location access.",
            2: "Location unavailable. Try again.",
            3: "Location request timed out. Try again.",
          };
          const msg = messages[err.code] || "Failed to get location";
          setError(msg);
          setLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,   // Important for ~20m accuracy
          timeout: 10000,
          maximumAge: 0,              // Always fresh GPS, no cache
        }
      );
    });
  }, []);

  return { position, loading, error, getPosition };
}