import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AcceptInvite() {
  const { applySession } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => params.get("token") || "", [params]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
       setError("Please enter your full name.");
       return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid invite link.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/accept-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, name }), // Sending name to backend
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Could not accept invite.");

      applySession(data.token, data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#e6f4ec",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 12px 40px rgba(0,0,0,.08)",
        }}
      >
        <h1 style={{ fontSize: 22, marginBottom: 8, color: "#0d3b2e" }}>
          Set your password
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
          Complete your workplace supervisor account for the IMS portal.
        </p>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#b91c1c",
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}


        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" }}>
          Full Name
        </label>
      <input
  type="text"
  placeholder="e.g. John Doe"
  value={name}
  onChange={(e) => setName(e.target.value)}
  style={{
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    marginBottom: 16,
    boxSizing: "border-box",
    background: "#fff",
    color: "#000"
  }}
/>

        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6,color: "#374151" }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            marginBottom: 16,
            boxSizing: "border-box",
            background: "#ffffff", // Force white background
            color: "#111827",      // Force dark text
            fontSize: "14px"
          }}
        />

        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6,color: "#374151" }}>
          Confirm password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            marginBottom: 20,
            boxSizing: "border-box",
            background: "#ffffff", // Force white background
            color: "#111827",      // Force dark text
            fontSize: "14px"
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#15653a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Saving…" : "Activate account"}
        </button>
      </form>
    </div>
  );
}
