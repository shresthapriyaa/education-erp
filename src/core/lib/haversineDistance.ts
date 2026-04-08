/**
 * src/core/lib/haversine.ts
 *
 * Haversine formula — great-circle distance between two GPS points.
 *
 *   a = sin²(Δlat/2) + cos(φ1)·cos(φ2)·sin²(Δlon/2)
 *   c = 2·atan2(√a, √(1−a))
 *   d = R · c        R = 6,371,000 m
 */

export const EARTH_RADIUS_M    = 6_371_000;
export const RADIUS_MIN_M      = 100;   // minimum geofence radius
export const RADIUS_MAX_M      = 500;   // maximum geofence radius
export const LATE_THRESHOLD_MIN = 10;   // minutes after open = LATE

export interface Coords {
  latitude:  number;
  longitude: number;
}

export interface SchoolZoneInput {
  id:           string;
  name:         string;
  center:       Coords;
  radiusMeters: number;
  color?:       string;
}

export interface SchoolBoundaryInput {
  id:           string;
  name:         string;
  center:       Coords;
  radiusMeters: number;
  zones:        SchoolZoneInput[];
}

export interface ZoneCheck {
  distance:           number;   // meters from zone center
  isWithin:           boolean;
  overlapMargin:      number;   // +ve inside, -ve outside
  penetrationPercent: number;   // 0=center 100=edge >100=outside
}

export interface ZoneDetection {
  withinSchool:       boolean;
  distanceFromCenter: number;
  distanceToBoundary: number;   // +ve inside, -ve outside
  currentZone:        SchoolZoneInput | null;
  allZones:           Array<{ zone: SchoolZoneInput; check: ZoneCheck }>;
  directionToCenter:  string;
}



function toRad(d: number) { return d * Math.PI / 180; }

export function haversineDistance(a: Coords, b: Coords): number {
  const φ1 = toRad(a.latitude),  φ2 = toRad(b.latitude);
  const Δφ = toRad(b.latitude  - a.latitude);
  const Δλ = toRad(b.longitude - a.longitude);
  
  // Haversine formula with high precision
  const h = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  
  // Use more precise Earth radius for Nepal region (WGS84 ellipsoid)
  // Nepal is around 28°N latitude, so we use a more accurate radius
  const earthRadiusAtNepal = 6371008.8; // meters, more precise for Nepal's latitude
  
  const distance = earthRadiusAtNepal * c;
  
  // Return distance rounded to 1 decimal place for better precision
  return Math.round(distance * 10) / 10;
}

export function checkZone(
  user:   Coords,
  center: Coords,
  radius: number,
  gpsAccuracy = 0
): ZoneCheck {
  const distance = haversineDistance(user, center);
  
  // Enhanced GPS accuracy buffer for Nepal conditions
  // Account for typical GPS accuracy in urban/rural Nepal
  let buffer = 0;
  if (gpsAccuracy > 0) {
    // Use 70% of reported accuracy as buffer, max 30m for safety
    buffer = Math.min(gpsAccuracy * 0.7, 30);
  } else {
    // Default buffer for unknown accuracy (typical Nepal conditions)
    buffer = 15; // 15m default buffer for Nepal GPS conditions
  }
  
  const effective = radius + buffer;
  
  return {
    distance,
    isWithin:           distance <= effective,
    overlapMargin:      Math.round((effective - distance) * 10) / 10,
    penetrationPercent: Math.round((distance / radius) * 100),
  };
}

export function detectSchoolZone(
  user:        Coords,
  school:      SchoolBoundaryInput,
  gpsAccuracy = 0
): ZoneDetection {
  const outer = checkZone(user, school.center, school.radiusMeters, gpsAccuracy);

  const allZones = school.zones
    .map(zone => ({ zone, check: checkZone(user, zone.center, zone.radiusMeters, gpsAccuracy) }))
    .filter(x => x.check.isWithin)
    .sort((a, b) => a.zone.radiusMeters - b.zone.radiusMeters);

  return {
    withinSchool:       outer.isWithin,
    distanceFromCenter: outer.distance,
    distanceToBoundary: outer.isWithin
      ? outer.overlapMargin
      : -Math.abs(outer.overlapMargin),
    currentZone:        allZones[0]?.zone ?? null,
    allZones,
    directionToCenter:  compassDirection(user, school.center),
  };
}

export function compassDirection(from: Coords, to: Coords): string {
  const n = ((Math.atan2(
    to.longitude - from.longitude,
    to.latitude  - from.latitude
  ) * 180 / Math.PI) + 360) % 360;
  if (n < 22.5  || n >= 337.5) return "North ↑";
  if (n < 67.5)  return "Northeast ↗";
  if (n < 112.5) return "East →";
  if (n < 157.5) return "Southeast ↘";
  if (n < 202.5) return "South ↓";
  if (n < 247.5) return "Southwest ↙";
  if (n < 292.5) return "West ←";
  return "Northwest ↖";
}

export function clampRadius(m: number) {
  return Math.min(Math.max(m, RADIUS_MIN_M), RADIUS_MAX_M);
}

export function fmtDist(m: number) {
  return m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(2)}km`;
}

export function isValidCoords(c: Coords) {
  return (
    !isNaN(c.latitude)  && !isNaN(c.longitude) &&
    c.latitude  >= -90  && c.latitude  <= 90   &&
    c.longitude >= -180 && c.longitude <= 180
  );
}