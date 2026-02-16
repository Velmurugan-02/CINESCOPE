// src/components/ErrorState.jsx
export default function ErrorState({
  title = "Something went wrong",
  message,
  actionLabel = "Retry",
  onAction,
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        border: "1px solid rgba(255,0,0,0.2)",
        background: "rgba(255,0,0,0.04)",
        maxWidth: 520,
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      {message ? (
        <p style={{ marginTop: 8, marginBottom: 12 }}>{message}</p>
      ) : (
        <p style={{ marginTop: 8, marginBottom: 12 }}>
          Please check your connection and try again.
        </p>
      )}

      {onAction && (
        <button
          onClick={onAction}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.15)",
            cursor: "pointer",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
