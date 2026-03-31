"use client";

import { useState, useCallback } from "react";
import {
  haversineDistance,
  checkZone,
  type Coords,
} from "@/core/lib/haversineDistance";
import type { GeofenceConfig } from "../types/attendance.types";

type GeofenceState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "inside"; distance: number; coords: Coords }
  | { status: "outside"; distance: number; coords: Coords }
  | { status: "error"; message: string };


function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    }
  });
}

export function useGeofence(geofence: GeofenceConfig | null) {
  const [state, setState] = useState<GeofenceState>({ status: "idle" });

  const check = useCallback(async () => {
    if (!geofence) {
      setState({ status: "error", message: "No geofence configured." });
      return null;
    }

    setState({ status: "loading" });

    try {
      const position = await getCurrentPosition();

      
      const userCoords: Coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const schoolCoords: Coords = {
        latitude: geofence.latitude,
        longitude: geofence.longitude,
      };

      //  use checkZone instead of isInsideGeofence (doesn't exist)
      const zoneCheck = checkZone(
        userCoords,
        schoolCoords,
        geofence.radiusMeters,
        position.coords.accuracy // pass GPS accuracy for buffer calculation
      );

      if (zoneCheck.isWithin) {
        setState({ status: "inside", distance: zoneCheck.distance, coords: userCoords });
        return { inside: true, distance: zoneCheck.distance, coords: userCoords };
      } else {
        setState({ status: "outside", distance: zoneCheck.distance, coords: userCoords });
        return { inside: false, distance: zoneCheck.distance, coords: userCoords };
      }
    } catch (err: any) {
      const message =
        err.code === 1
          ? "Location permission denied. Please allow access in your browser settings."
          : err.code === 2
          ? "Location unavailable. Please try again."
          : err.code === 3
          ? "Location request timed out. Please try again."
          : err.message || "Failed to get location.";

      setState({ status: "error", message });
      return null;
    }
  }, [geofence]);

  const reset = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  return { state, check, reset };
}