"use client";

import { useState, useEffect } from "react";
import { geofenceService } from "../services/geofence.service";
import type {
  GeofenceSettings,
  UpdateGeofencePayload,
} from "../types/attendance.types";

export function useGeofenceSettings() {
  const [settings, setSettings] = useState<GeofenceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    geofenceService
      .getSettings()
      .then(setSettings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function update(payload: UpdateGeofencePayload): Promise<boolean> {
    setSaving(true);
    setError(null);
    try {
      const updated = await geofenceService.updateSettings(payload);
      setSettings(updated);
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  return { settings, loading, saving, error, update };
}