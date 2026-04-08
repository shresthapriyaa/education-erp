"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from "react-leaflet";
import { MapPin, Target, Navigation, Crosshair } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  latitude: number;
  longitude: number;
  radius: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to recenter map when coordinates change
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function LocationMapPicker({ latitude, longitude, radius, onLocationSelect }: Props) {
  const [currentLat, setCurrentLat] = useState(latitude);
  const [currentLng, setCurrentLng] = useState(longitude);
  const [isTracking, setIsTracking] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Nepal bounds
  const NEPAL_CENTER: [number, number] = [28.3949, 84.1240]; // Kathmandu
  const NEPAL_BOUNDS: [[number, number], [number, number]] = [
    [26.3478, 80.0884], // Southwest
    [30.4467, 88.1748], // Northeast
  ];

  useEffect(() => {
    setCurrentLat(latitude);
    setCurrentLng(longitude);
  }, [latitude, longitude]);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const startHighAccuracyTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsTracking(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentLat(lat);
        setCurrentLng(lng);
        setAccuracy(position.coords.accuracy);
        onLocationSelect(lat, lng);
      },
      (error) => {
        const messages: Record<number, string> = {
          1: "Location permission denied. Please allow location access.",
          2: "Location unavailable. Please try again.",
          3: "Location request timed out. Please try again.",
        };
        setError(messages[error.code] || "Failed to get location");
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentLat(lat);
        setCurrentLng(lng);
        setAccuracy(position.coords.accuracy);
        onLocationSelect(lat, lng);
      },
      (error) => {
        const messages: Record<number, string> = {
          1: "Location permission denied.",
          2: "Location unavailable.",
          3: "Location request timed out.",
        };
        setError(messages[error.code] || "Failed to get location");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const isInNepal =
    currentLat >= NEPAL_BOUNDS[0][0] &&
    currentLat <= NEPAL_BOUNDS[1][0] &&
    currentLng >= NEPAL_BOUNDS[0][1] &&
    currentLng <= NEPAL_BOUNDS[1][1];

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: "18px 20px",
      marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Navigation size={15} color="#16a34a" />
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>
          Interactive Map - Click to Set School Location
        </h3>
      </div>

      {/* Map Container */}
      <div style={{
        height: 400,
        borderRadius: 8,
        overflow: "hidden",
        border: "2px solid #e5e7eb",
        marginBottom: 16,
        position: "relative",
      }}>
        {mapReady && (
          <MapContainer
            center={currentLat !== 0 && currentLng !== 0 ? [currentLat, currentLng] : NEPAL_CENTER}
            zoom={currentLat !== 0 && currentLng !== 0 ? 16 : 7}
            style={{ height: "100%", width: "100%" }}
            maxBounds={NEPAL_BOUNDS}
            maxBoundsViscosity={0.5}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationSelect={onLocationSelect} />
            <MapRecenter center={[currentLat, currentLng]} />
            
            {currentLat !== 0 && currentLng !== 0 && (
              <>
                <Marker position={[currentLat, currentLng]} />
                <Circle
                  center={[currentLat, currentLng]}
                  radius={radius}
                  pathOptions={{
                    color: "#16a34a",
                    fillColor: "#16a34a",
                    fillOpacity: 0.2,
                  }}
                />
              </>
            )}
          </MapContainer>
        )}
        
        {/* Crosshair overlay */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 1000,
        }}>
          <Crosshair size={32} color="#dc2626" strokeWidth={3} />
        </div>
      </div>

      {/* Current coordinates display */}
      <div style={{
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#15803d" }}>Latitude</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#111827", fontFamily: "monospace" }}>
              {currentLat.toFixed(6)}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#15803d" }}>Longitude</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#111827", fontFamily: "monospace" }}>
              {currentLng.toFixed(6)}
            </p>
          </div>
        </div>

        {accuracy !== null && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Target size={12} color="#16a34a" />
            <span style={{ fontSize: 12, color: "#15803d" }}>
              GPS Accuracy: <strong>±{Math.round(accuracy)}m</strong>
              {accuracy <= 10 && " 🎯 Excellent"}
              {accuracy > 10 && accuracy <= 20 && " ✅ Good"}
              {accuracy > 20 && " ⚠️ Fair"}
            </span>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MapPin size={12} color={isInNepal ? "#16a34a" : "#dc2626"} />
          <span style={{ fontSize: 12, color: isInNepal ? "#15803d" : "#dc2626", fontWeight: 600 }}>
            {isInNepal ? "📍 Location is in Nepal" : "⚠️ Location is outside Nepal"}
          </span>
        </div>
      </div>

      {/* Control buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button
          onClick={getCurrentLocation}
          disabled={isTracking}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 8, border: "none",
            background: isTracking ? "#d1d5db" : "#3b82f6",
            color: "#fff", fontSize: 13, fontWeight: 600,
            cursor: isTracking ? "not-allowed" : "pointer",
          }}
        >
          <Target size={14} />
          Get My Location
        </button>

        {!isTracking ? (
          <button
            onClick={startHighAccuracyTracking}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 8, border: "none",
              background: "#16a34a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            <Navigation size={14} />
            Start Live Tracking
          </button>
        ) : (
          <button
            onClick={stopTracking}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 8, border: "none",
              background: "#dc2626", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            ⏹️ Stop Tracking
          </button>
        )}
      </div>

      {/* Status indicators */}
      {isTracking && (
        <div style={{
          background: "#fef3c7", border: "1px solid #f59e0b",
          borderRadius: 8, padding: 12, marginBottom: 16,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 12, height: 12, borderRadius: "50%",
            background: "#f59e0b", animation: "pulse 1.5s infinite",
          }} />
          <span style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>
            🛰️ Live GPS tracking active - map updates automatically
          </span>
        </div>
      )}

      {error && (
        <div style={{
          background: "#fee2e2", border: "1px solid #fca5a5",
          borderRadius: 8, padding: 12, marginBottom: 16,
        }}>
          <p style={{ margin: 0, fontSize: 13, color: "#dc2626", fontWeight: 600 }}>
            ❌ {error}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        background: "#f0f9ff", border: "1px solid #0ea5e9",
        borderRadius: 8, padding: 12,
      }}>
        <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "#0369a1" }}>
          🗺️ How to use:
        </p>
        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "#0369a1" }}>
          <li><strong>Click anywhere on the map</strong> to set school location</li>
          <li><strong>Get My Location</strong> - One-time GPS reading</li>
          <li><strong>Start Live Tracking</strong> - Continuous high-accuracy GPS</li>
          <li>Green circle shows the attendance radius</li>
          <li>Drag the map to explore different areas</li>
        </ul>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}