import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem("ims_token") || null);
  const [loading, setLoading] = useState(true);

  // ── On mount: restore session from localStorage ──
  useEffect(() => {
    const savedUser = localStorage.getItem("ims_user");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ── Signup ────────────────────────────────────────────────────────────────
  const signup = async ({ name, email, password, role }) => {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("ims_token",  data.token);
    localStorage.setItem("ims_user",   JSON.stringify(data.user));
    return data.user;
  };

  // ── Login ─────────────────────────────────────────────────────────────────
  // Works for ALL roles including admin secret login — the backend handles the check
  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("ims_token",  data.token);
    localStorage.setItem("ims_user",   JSON.stringify(data.user));
    return data.user;
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ims_token");
    localStorage.removeItem("ims_user");
  };

  /** After accept-invite (or similar) when the API returns token + user */
  const applySession = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("ims_token", nextToken);
    localStorage.setItem("ims_user", JSON.stringify(nextUser));
  };

  // ── Authenticated fetch helper (use this for all API calls in dashboards) ──
  const authFetch = useCallback(
    async (endpoint, options = {}) => {
      const headers = {
        ...(options.body && !(options.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      };

      const res = await fetch(`${API}${endpoint}`, { ...options, headers });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(res.status >= 400 ? `Request failed (${res.status})` : "Invalid server response.");
      }

      if (!res.ok || data.success === false) {
        throw new Error(data.message || `Request failed (${res.status})`);
      }
      return data;
    },
    [token]
  );

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signup, login, logout, applySession, authFetch }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
