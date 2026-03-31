// "use client";

// import { useGeofence } from "../hooks/useGeofence";
// import type { GeofenceConfig } from "../types/attendance.types";

// interface GeofenceCheckInProps {
//   geofence: GeofenceConfig;
//   onSuccess: (coords: GeolocationCoordinates, distance: number) => void;
//   alreadyMarked?: boolean;
//   label?: string; 
// }

// export function GeofenceCheckIn({
//   geofence,
//   onSuccess,
//   alreadyMarked = false,
//   label = "Check In Now",
// }: GeofenceCheckInProps) {
//   const { state, check, reset } = useGeofence(geofence);

//   const handleClick = async () => {
//     const result = await check();
//     if (result?.inside) {
//       onSuccess(result.coords, result.distance);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Geofence Info */}
//       <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//         <div className="flex items-center gap-2 mb-1">
//           <span className="text-blue-600">📍</span>
//           <span className="font-semibold text-blue-800">{geofence.name}</span>
//         </div>
//         <p className="text-sm text-blue-600">
//           Required range: <strong>{geofence.radiusMeters}m</strong>
//         </p>
//       </div>

//       {/* Distance bar — shown after check */}
//       {(state.status === "inside" || state.status === "outside") && (
//         <div>
//           <div className="flex justify-between text-sm mb-1">
//             <span className="text-gray-500">Your distance from school</span>
//             <span className="font-semibold">{state.distance}m</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className={`h-2 rounded-full transition-all ${
//                 state.status === "inside" ? "bg-green-500" : "bg-red-500"
//               }`}
//               style={{
//                 width: `${Math.min(
//                   100,
//                   (state.distance / geofence.radiusMeters) * 100
//                 )}%`,
//               }}
//             />
//           </div>
//           <div className="flex justify-between text-xs text-gray-400 mt-1">
//             <span>0m</span>
//             <span>{geofence.radiusMeters}m (limit)</span>
//           </div>
//         </div>
//       )}

//       {/* Status Message */}
//       {state.status === "outside" && (
//         <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
//           ❌ You are <strong>{state.distance}m</strong> away — must be within{" "}
//           <strong>{geofence.radiusMeters}m</strong> to check in.
//         </div>
//       )}
//       {state.status === "error" && (
//         <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
//           ⚠️ {state.message}
//         </div>
//       )}

//       {/* Button */}
//       <button
//         onClick={handleClick}
//         disabled={
//           state.status === "loading" ||
//           state.status === "inside" ||
//           alreadyMarked
//         }
//         className={`w-full py-4 rounded-xl font-semibold text-white transition-all active:scale-95 ${
//           alreadyMarked || state.status === "inside"
//             ? "bg-green-500 cursor-not-allowed"
//             : state.status === "loading"
//             ? "bg-yellow-400 cursor-wait"
//             : "bg-blue-600 hover:bg-blue-700"
//         }`}
//       >
//         {state.status === "loading"
//           ? "📡 Getting your location..."
//           : alreadyMarked || state.status === "inside"
//           ? "✅ Attendance Marked"
//           : `📍 ${label}`}
//       </button>

//       {/* Retry */}
//       {(state.status === "outside" || state.status === "error") && (
//         <button
//           onClick={reset}
//           className="w-full py-2 rounded-xl border border-gray-300 text-gray-500 text-sm hover:bg-gray-50"
//         >
//           Try Again
//         </button>
//       )}
//     </div>
//   );
// }






"use client";

import { useGeofence } from "../hooks/usegeofence";
// import { useGeofence } from "../hooks/useGeofence";
import type { GeofenceConfig, MarkAttendancePayload } from "../types/attendance.types";
import type { Coords } from "@/core/lib/haversineDistance";

interface GeofenceCheckInProps {
  geofence: GeofenceConfig;
  studentId: string;
  onSuccess: (payload: MarkAttendancePayload) => void;
  alreadyMarked?: boolean;
  label?: string;
}

export function GeofenceCheckIn({
  geofence,
  studentId,
  onSuccess,
  alreadyMarked = false,
  label = "Check In Now",
}: GeofenceCheckInProps) {
  const { state, check, reset } = useGeofence(geofence);

  const handleClick = async () => {
    const result = await check();
    if (result?.inside) {
      const payload: MarkAttendancePayload = {
        studentId,
        date: new Date().toISOString().split("T")[0],
        status: "Present",
        method: "Geofence",
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        distanceFromSchool: result.distance,
      };
      onSuccess(payload);
    }
  };

  return (
    <div className="space-y-4">
      {/* Geofence Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blue-600">📍</span>
          <span className="font-semibold text-blue-800">{geofence.name}</span>
        </div>
        <p className="text-sm text-blue-600">
          Required range: <strong>{geofence.radiusMeters}m</strong>
        </p>
      </div>

      {/* Distance bar — shown after check */}
      {(state.status === "inside" || state.status === "outside") && (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Your distance from school</span>
            <span className="font-semibold">{state.distance}m</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                state.status === "inside" ? "bg-green-500" : "bg-red-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (state.distance / geofence.radiusMeters) * 100
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0m</span>
            <span>{geofence.radiusMeters}m (limit)</span>
          </div>
        </div>
      )}

      {/* Status Message */}
      {state.status === "outside" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          ❌ You are <strong>{state.distance}m</strong> away — must be within{" "}
          <strong>{geofence.radiusMeters}m</strong> to check in.
        </div>
      )}
      {state.status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          ⚠️ {state.message}
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleClick}
        disabled={
          state.status === "loading" ||
          state.status === "inside" ||
          alreadyMarked
        }
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all active:scale-95 ${
          alreadyMarked || state.status === "inside"
            ? "bg-green-500 cursor-not-allowed"
            : state.status === "loading"
            ? "bg-yellow-400 cursor-wait"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {state.status === "loading"
          ? "📡 Getting your location..."
          : alreadyMarked || state.status === "inside"
          ? "✅ Attendance Marked"
          : `📍 ${label}`}
      </button>

      {/* Retry */}
      {(state.status === "outside" || state.status === "error") && (
        <button
          onClick={reset}
          className="w-full py-2 rounded-xl border border-gray-300 text-gray-500 text-sm hover:bg-gray-50"
        >
          Try Again
        </button>
      )}
    </div>
  );
}