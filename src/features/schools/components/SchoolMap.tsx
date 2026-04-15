// "use client";

// import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix Leaflet's broken default icons in Next.js
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// function ClickHandler({ onPick }: { onPick: (lat: number, lon: number) => void }) {
//   useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
//   return null;
// }

// interface SchoolMapProps {
//   lat: number;
//   lon: number;
//   radius: number; // metres
//   onPick: (lat: number, lon: number) => void;
// }

// export function SchoolMap({ lat, lon, radius, onPick }: SchoolMapProps) {
//   return (
//     <MapContainer
//       center={[lat, lon]}
//       zoom={18}
//       style={{ height: 320, width: "100%", borderRadius: 8, zIndex: 0 }}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <ClickHandler onPick={onPick} />
//       <Marker position={[lat, lon]} />
//       <Circle
//         center={[lat, lon]}
//         radius={radius}
//         pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.15 }}
//       />
//     </MapContainer>
//   );
// }





// "use client";

// import { useEffect } from "react";
// import {
//   MapContainer, TileLayer, Marker, Circle,
//   useMapEvents, useMap,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// // Flies map to new center whenever lat/lon props change
// function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
//   const map = useMap();
//   useEffect(() => {
//     if (lat && lon) map.flyTo([lat, lon], map.getZoom(), { animate: true, duration: 0.8 });
//   }, [lat, lon, map]);
//   return null;
// }

// function ClickHandler({ onPick }: { onPick: (lat: number, lon: number) => void }) {
//   useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
//   return null;
// }

// interface SchoolMapProps {
//   lat: number;
//   lon: number;
//   radius: number;
//   onPick: (lat: number, lon: number) => void;
// }

// export function SchoolMap({ lat, lon, radius, onPick }: SchoolMapProps) {
//   const handleMyLocation = () => {
//     if (!navigator.geolocation) return;
//     navigator.geolocation.getCurrentPosition(
//       (pos) => onPick(pos.coords.latitude, pos.coords.longitude),
//       () => alert("Could not get your location. Please allow location access."),
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       {/* Use my location button */}
//       <button
//         type="button"
//         onClick={handleMyLocation}
//         style={{
//           position: "absolute",
//           top: 10,
//           right: 10,
//           zIndex: 1000,
//           padding: "7px 14px",
//           borderRadius: 8,
//           border: "1.5px solid #e5e7eb",
//           background: "#fff",
//           fontSize: 12,
//           fontWeight: 700,
//           cursor: "pointer",
//           color: "#374151",
//           boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
//           display: "flex",
//           alignItems: "center",
//           gap: 6,
//         }}
//       >
//         📍 Use my location
//       </button>

//       <MapContainer
//         center={[lat || 27.7172, lon || 85.324]}
//         zoom={17}
//         style={{ height: 360, width: "100%", borderRadius: 8, zIndex: 0 }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <RecenterMap lat={lat || 27.7172} lon={lon || 85.324} />
//         <ClickHandler onPick={onPick} />
//         {lat && lon && (
//           <>
//             <Marker position={[lat, lon]} />
//             <Circle
//               center={[lat, lon]}
//               radius={radius || 20}
//               pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.15 }}
//             />
//           </>
//         )}
//       </MapContainer>
//     </div>
//   );
// }



"use client";

import { useEffect } from "react";
import {
  MapContainer, TileLayer, Marker, Circle,
  useMapEvents, useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) map.flyTo([lat, lon], map.getZoom(), { animate: true, duration: 0.8 });
  }, [lat, lon, map]);
  return null;
}

function ClickHandler({ onPick }: { onPick: (lat: number, lon: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

interface SchoolMapProps {
  lat: number;
  lon: number;
  radius: number;
  onPick: (lat: number, lon: number) => void;
}

export function SchoolMap({ lat, lon, radius, onPick }: SchoolMapProps) {
  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => onPick(pos.coords.latitude, pos.coords.longitude),
      () => alert("Could not get your location. Please allow location access."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={handleMyLocation}
        style={{
          position: "absolute", top: 10, right: 10, zIndex: 1000,
          padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e5e7eb",
          background: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
          color: "#374151", boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
          display: "flex", alignItems: "center", gap: 6,
        }}
      >
        📍 Use my location
      </button>

      <MapContainer
        center={[lat || 27.7172, lon || 85.324]}
        zoom={17}
        style={{ height: 360, width: "100%", borderRadius: 8, zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={lat || 27.7172} lon={lon || 85.324} />
        <ClickHandler onPick={onPick} />
        {lat && lon && (
          <>
            <Marker position={[lat, lon]} />
            <Circle
              center={[lat, lon]}
              radius={radius || 20}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.15 }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}