// src/components/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div
      style={{
        width: 160,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          height: 240,
          background: "rgba(0,0,0,0.08)",
          animation: "pulse 1.2s ease-in-out infinite",
        }}
      />
      <div style={{ padding: 10 }}>
        <div
          style={{
            height: 12,
            width: "80%",
            background: "rgba(0,0,0,0.08)",
            borderRadius: 6,
            animation: "pulse 1.2s ease-in-out infinite",
          }}
        />
        <div style={{ height: 8 }} />
        <div
          style={{
            height: 12,
            width: "55%",
            background: "rgba(0,0,0,0.08)",
            borderRadius: 6,
            animation: "pulse 1.2s ease-in-out infinite",
          }}
        />
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
}
