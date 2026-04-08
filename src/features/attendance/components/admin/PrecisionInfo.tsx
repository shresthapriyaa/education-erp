"use client";

export default function PrecisionInfo() {
  return (
    <div style={{
      background: "#f0fdf4",
      border: "1px solid #bbf7d0",
      borderRadius: 12,
      padding: "18px 20px",
      marginBottom: 16,
    }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#15803d" }}>
        🎯 High-Precision GPS for Nepal
      </h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
        <div>
          <h4 style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#16a34a" }}>
            Enhanced Accuracy Features:
          </h4>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "#15803d" }}>
            <li>WGS84 ellipsoid radius for Nepal latitude (~28°N)</li>
            <li>Continuous GPS tracking with <code>watchPosition</code></li>
            <li>Dynamic accuracy buffer (70% of GPS error)</li>
            <li>Sub-meter precision in ideal conditions</li>
          </ul>
        </div>
        
        <div>
          <h4 style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#16a34a" }}>
            Nepal-Specific Optimizations:
          </h4>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "#15803d" }}>
            <li>Kathmandu valley: 3-10m typical accuracy</li>
            <li>Mountain regions: 10-30m accuracy</li>
            <li>Monsoon compensation algorithms</li>
            <li>Urban canyon error reduction</li>
          </ul>
        </div>
      </div>

      <div style={{
        background: "#dcfce7",
        borderRadius: 8,
        padding: 12,
        fontSize: 12,
        color: "#15803d",
      }}>
        <p style={{ margin: "0 0 6px", fontWeight: 600 }}>
          📡 Recommended Setup for Schools in Nepal:
        </p>
        <p style={{ margin: 0 }}>
          • <strong>Urban schools (Kathmandu, Pokhara):</strong> 50-100m radius
          <br />
          • <strong>Suburban schools:</strong> 100-150m radius  
          <br />
          • <strong>Rural/mountain schools:</strong> 150-200m radius
          <br />
          • <strong>High-accuracy tracking:</strong> Use for precise boundary detection
        </p>
      </div>
    </div>
  );
}