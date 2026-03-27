import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

// ─── Design Tokens ────────────────────────────────────────────────────────
const C = {
  forest: "#1a3a2a",
  forestMid: "#2d5a3d",
  forestLight: "#3d7a52",
  ember: "#e85d2f",
  emberBg: "#fff3ef",
  sage: "#eef5f0",
  mint: "#d4edd8",
  white: "#ffffff",
  border: "#d4e6d8",
  text: "#1a2e20",
  muted: "#6b8f72",
  success: "#1a7a3a",
  successBg: "#e6f7ed",
};

// ─── Responsive hook ──────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { w, sm: w < 480, md: w < 768, lg: w < 1024 };
}

// ─── Helpers ──────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 44, bg = C.forestMid }) => {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]).join("").toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
};

const Badge = ({ label, color = C.ember, bg = C.emberBg }) => (
  <span style={{ background: bg, color, border: `1px solid ${color}33`, borderRadius: 6, fontSize: 11, padding: "2px 8px", fontWeight: 700, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
    {label}
  </span>
);

const Pill = ({ label, variant = "success" }) => {
  const map = { success: { color: C.success, bg: C.successBg }, warning: { color: C.ember, bg: C.emberBg }, neutral: { color: C.muted, bg: C.sage } };
  const { color, bg } = map[variant] || map.neutral;
  return <span style={{ background: bg, color, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700, display: "inline-block", whiteSpace: "nowrap" }}>{label}</span>;
};

// ─── Supervisor Report Modal ──────────────────────────────────────────────
function SupervisorReportModal({ intern, existingReport, onSave, onClose }) {
  const { sm } = useBreakpoint();
  const [form, setForm] = useState({
    period: existingReport?.period || "",
    attendance: existingReport?.attendance || "",
    performance: existingReport?.performance || "",
    skills: existingReport?.skills || "",
    attitude: existingReport?.attitude || "",
    challenges: existingReport?.challenges || "",
    achievements: existingReport?.achievements || "",
    recommendation: existingReport?.recommendation || "",
    rating: existingReport?.rating || "3",
    comments: existingReport?.comments || "",
  });
  const [saved, setSaved] = useState(false);

  const ratingLabels = { "1": "Poor", "2": "Below Avg", "3": "Average", "4": "Good", "5": "Excellent" };
  const ratingColors = { "1": "#d32f2f", "2": C.ember, "3": "#f9a825", "4": "#388e3c", "5": C.forest };
  const starIcons = { "1": "★", "2": "★★", "3": "★★★", "4": "★★★★", "5": "★★★★★" };

  const handleSave = () => {
    onSave({ ...form, internId: intern.id, internName: intern.name, createdAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  const fields = [
    { k: "period", label: "Reporting Period", placeholder: "e.g. February – March 2026", type: "text" },
    { k: "attendance", label: "Attendance & Punctuality", placeholder: "Describe intern's attendance record…", type: "textarea" },
    { k: "performance", label: "Work Performance", placeholder: "Evaluate the quality and quantity of work done…", type: "textarea" },
    { k: "skills", label: "Skills Demonstrated", placeholder: "Technical and soft skills observed…", type: "textarea" },
    { k: "attitude", label: "Attitude & Conduct", placeholder: "How does the intern relate with colleagues and carry themselves?", type: "textarea" },
    { k: "achievements", label: "Key Achievements", placeholder: "Notable accomplishments during this period…", type: "textarea" },
    { k: "challenges", label: "Areas for Improvement", placeholder: "Where does the intern need to improve?", type: "textarea" },
    { k: "recommendation", label: "Supervisor Recommendation", placeholder: "Your overall recommendation for this intern…", type: "textarea" },
    { k: "comments", label: "Additional Comments", placeholder: "Any other remarks…", type: "textarea" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(3px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.white, borderRadius: sm ? "20px 20px 0 0" : 20, width: "100%", maxWidth: 680, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 -8px 60px rgba(0,0,0,0.22)", boxSizing: "border-box" }}>
        {/* Modal Header */}
        <div style={{ background: `linear-gradient(135deg, ${C.forest}, ${C.forestMid})`, borderRadius: sm ? "20px 20px 0 0" : "20px 20px 0 0", padding: sm ? "18px 18px 16px" : "22px 28px 20px", color: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={intern.name} size={38} bg="rgba(255,255,255,0.18)" />
              <div>
                <div style={{ fontWeight: 800, fontSize: sm ? 15 : 17 }}>{existingReport ? "Edit" : "Write"} Supervisor Report</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>{intern.name} · {intern.course}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
            📝 This report will be saved to the intern's profile and used for final evaluation.
          </div>
        </div>

        <div style={{ padding: sm ? "18px" : "24px 28px" }}>
          {/* Overall Rating — fixed, no emoji stacking */}
          <div style={{ background: C.sage, borderRadius: 14, padding: sm ? "14px" : "18px", marginBottom: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 12 }}>Overall Performance Rating</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {["1", "2", "3", "4", "5"].map(v => (
                <button key={v} onClick={() => setForm(p => ({ ...p, rating: v }))}
                  style={{ padding: "10px 4px", border: `2px solid ${form.rating === v ? ratingColors[v] : C.border}`, borderRadius: 10, background: form.rating === v ? ratingColors[v] + "18" : C.white, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "center" }}>
                  <div style={{ fontSize: 20, color: "#f9a825", letterSpacing: 1, lineHeight: 1.2 }}>{starIcons[v]}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: form.rating === v ? ratingColors[v] : C.muted, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ratingLabels[v]}</div>
                  <div style={{ fontSize: 11, color: form.rating === v ? ratingColors[v] : C.muted, fontWeight: 800 }}>{v}/5</div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: ratingColors[form.rating], fontWeight: 700 }}>
              Selected: {ratingLabels[form.rating]} ({form.rating}/5)
            </div>
          </div>

          {/* Form Fields */}
          {fields.map(({ k, label, placeholder, type }) => (
            <div key={k} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{label}</label>
              {type === "textarea" ? (
                <textarea
                  rows={3}
                  placeholder={placeholder}
                  value={form[k]}
                  onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 13, fontFamily: "inherit", color: C.text, background: "#fafcfb", boxSizing: "border-box", outline: "none", resize: "vertical", lineHeight: 1.6 }}
                />
              ) : (
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[k]}
                  onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 13, fontFamily: "inherit", color: C.text, background: "#fafcfb", boxSizing: "border-box", outline: "none" }}
                />
              )}
            </div>
          ))}

          {/* Save Button */}
          <div style={{ display: "flex", gap: 10, marginTop: 8, position: "sticky", bottom: 0, background: C.white, paddingTop: 12, paddingBottom: sm ? 16 : 8 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", background: C.sage, color: C.text, border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Cancel
            </button>
            <button onClick={handleSave}
              style={{ flex: 2, padding: "12px", background: saved ? C.success : C.forest, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "background 0.3s" }}>
              {saved ? "✅ Report Saved!" : existingReport ? "Update Report" : "Save Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Download Report ──────────────────────────────────────────────────────
function downloadReport(report, intern) {
  const ratingLabels = { "1": "Poor", "2": "Below Average", "3": "Average", "4": "Good", "5": "Excellent" };
  const stars = "★".repeat(parseInt(report.rating)) + "☆".repeat(5 - parseInt(report.rating));

  const sections = [
    { label: "Reporting Period", value: report.period },
    { label: "Attendance & Punctuality", value: report.attendance },
    { label: "Work Performance", value: report.performance },
    { label: "Skills Demonstrated", value: report.skills },
    { label: "Attitude & Conduct", value: report.attitude },
    { label: "Key Achievements", value: report.achievements },
    { label: "Areas for Improvement", value: report.challenges },
    { label: "Supervisor Recommendation", value: report.recommendation },
    { label: "Additional Comments", value: report.comments },
  ].filter(s => s.value && s.value.trim());

  const sectionsHTML = sections.map(({ label, value }) => `
    <div class="section">
      <div class="section-label">${label}</div>
      <div class="section-value">${value.replace(/\n/g, "<br>")}</div>
    </div>
  `).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Supervisor Report – ${intern.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a2e20; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #1a3a2a, #2d5a3d); color: white; padding: 32px; border-radius: 12px; margin-bottom: 28px; }
    .company { font-size: 11px; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); text-transform: uppercase; margin-bottom: 8px; }
    .title { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: rgba(255,255,255,0.65); margin-bottom: 20px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .meta-item { background: rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 14px; }
    .meta-key { font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; font-weight: 600; margin-bottom: 3px; }
    .meta-val { font-size: 13px; font-weight: 600; }
    .rating-box { background: #eef5f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 16px; border: 1px solid #d4e6d8; }
    .stars { font-size: 26px; color: #f9a825; letter-spacing: 2px; }
    .rating-score { font-size: 28px; font-weight: 800; color: #1a3a2a; }
    .rating-label { font-size: 14px; color: #6b8f72; font-weight: 600; margin-top: 2px; }
    .section { background: #eef5f0; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
    .section-label { font-size: 10px; font-weight: 700; color: #6b8f72; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
    .section-value { font-size: 13px; line-height: 1.7; color: #1a2e20; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #d4e6d8; display: flex; justify-content: space-between; font-size: 11px; color: #6b8f72; }
    @media print { body { padding: 20px; } .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">Workplace Supervisor · Evaluation Report</div>
    <div class="title">Supervisor's Evaluation Report</div>
    <div class="subtitle">${intern.name} · ${intern.course} · ${intern.university}</div>
    <div class="meta-grid">
      <div class="meta-item"><div class="meta-key">Student ID</div><div class="meta-val">${intern.id}</div></div>
      <div class="meta-item"><div class="meta-key">Department</div><div class="meta-val">${intern.department || "Engineering & Technology"}</div></div>
      <div class="meta-item"><div class="meta-key">Placement Period</div><div class="meta-val">${intern.start} – ${intern.end}</div></div>
      <div class="meta-item"><div class="meta-key">Report Date</div><div class="meta-val">${report.createdAt}</div></div>
    </div>
  </div>

  <div class="rating-box">
    <div>
      <div class="stars">${stars}</div>
    </div>
    <div>
      <div class="rating-score">${report.rating} / 5</div>
      <div class="rating-label">${ratingLabels[report.rating]}</div>
    </div>
  </div>

  ${sectionsHTML}

  <div class="footer">
    <span>Generated by Workplace Supervisor Dashboard</span>
    <span>${report.createdAt}</span>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Supervisor_Report_${intern.name.replace(/\s+/g, "_")}_${report.createdAt.replace(/,?\s+/g, "_")}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Supervisor Report View ───────────────────────────────────────────────
function SupervisorReportView({ report, intern, onEdit, sm }) {
  const ratingLabels = { "1": "Poor", "2": "Below Average", "3": "Average", "4": "Good", "5": "Excellent" };
  const ratingColors = { "1": "#d32f2f", "2": C.ember, "3": "#f9a825", "4": "#388e3c", "5": C.forest };

  const sections = [
    { label: "Reporting Period", value: report.period, icon: "📅" },
    { label: "Attendance & Punctuality", value: report.attendance, icon: "🕐" },
    { label: "Work Performance", value: report.performance, icon: "💼" },
    { label: "Skills Demonstrated", value: report.skills, icon: "🛠" },
    { label: "Attitude & Conduct", value: report.attitude, icon: "🤝" },
    { label: "Key Achievements", value: report.achievements, icon: "🏆" },
    { label: "Areas for Improvement", value: report.challenges, icon: "📈" },
    { label: "Supervisor Recommendation", value: report.recommendation, icon: "✍️" },
    { label: "Additional Comments", value: report.comments, icon: "💬" },
  ].filter(s => s.value && s.value.trim());

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
      {/* Report Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.forest}, ${C.forestMid})`, padding: sm ? "14px" : "18px 22px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Supervisor's Report</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Written on {report.createdAt}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "6px 12px", textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>{report.rating}/5</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>{ratingLabels[report.rating]}</div>
          </div>
          <button onClick={() => downloadReport(report, intern)}
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit", whiteSpace: "nowrap" }}>
            ⬇ Download
          </button>
          <button onClick={onEdit} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit", whiteSpace: "nowrap" }}>
            ✏️ Edit
          </button>
        </div>
      </div>

      {/* Star Rating Visual — fixed, individual spans */}
      <div style={{ padding: sm ? "12px 14px 0" : "14px 22px 0", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex" }}>
          {[1,2,3,4,5].map(s => (
            <span key={s} style={{ fontSize: 22, color: s <= parseInt(report.rating) ? "#f9a825" : "#ddd", lineHeight: 1 }}>★</span>
          ))}
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: ratingColors[report.rating] }}>{ratingLabels[report.rating]}</span>
      </div>

      {/* Report Sections */}
      <div style={{ padding: sm ? "12px 14px" : "16px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
        {sections.map(({ label, value, icon }) => (
          <div key={label} style={{ background: C.sage, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}>
              <span>{icon}</span> {label}
            </div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.65 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────
function Onboarding({ onComplete, initialEmail = "" }) {
  const { sm } = useBreakpoint();
  const [form, setForm] = useState({ company: "", email: initialEmail, phone: "" });
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!form.company.trim()) e.company = "Required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    if (Object.keys(e).length) { setErrors(e); return; }
    onComplete({ company: form.company, email: form.email, phone: form.phone });
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.forest} 0%, ${C.forestMid} 60%, ${C.forestLight} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: sm ? 12 : 16, boxSizing: "border-box" }}>
      <div style={{ background: C.white, borderRadius: 24, padding: sm ? "28px 20px" : "48px 40px", width: "100%", maxWidth: 440, boxShadow: "0 32px 80px rgba(0,0,0,0.22)", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>WS</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Workplace Supervisor</div>
            <div style={{ fontSize: 12, color: C.muted }}>Get started in seconds</div>
          </div>
        </div>
        <div style={{ fontWeight: 800, fontSize: 22, color: C.text, marginBottom: 4 }}>Set up your workspace</div>
        <div style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>Enter your company details to continue.</div>
        {[
          { k: "company", label: "Company Name", placeholder: "Tech Solutions Ltd", type: "text" },
          { k: "email", label: "Work Email", placeholder: "you@company.com", type: "email" },
          { k: "phone", label: "Phone (optional)", placeholder: "020 123 4567", type: "text" },
        ].map(({ k, label, placeholder, type }) => (
          <div key={k} style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{label}</label>
            <input
              style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${errors[k] ? C.ember : C.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: C.text, background: "#fafcfb", boxSizing: "border-box", outline: "none" }}
              type={type} placeholder={placeholder} value={form[k]}
              onChange={e => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: "" })); }}
              onKeyDown={e => e.key === "Enter" && submit()}
            />
            {errors[k] && <div style={{ color: C.ember, fontSize: 12, marginTop: 4 }}>{errors[k]}</div>}
          </div>
        ))}
        <button style={{ width: "100%", marginTop: 8, padding: "13px", background: C.forest, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }} onClick={submit}>
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────
function Navbar({ page, onBack, onLogout, breadcrumb }) {
  const { sm } = useBreakpoint();
  const pageLabels = { interns: "All Interns", submitted: "Submitted Reports", pending: "Pending Reports", internDetail: "Intern Profile" };
  return (
    <nav style={{ background: C.forest, padding: `0 ${sm ? 14 : 28}px`, display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, boxShadow: "0 2px 16px rgba(0,0,0,0.18)", position: "sticky", top: 0, zIndex: 100, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1, overflow: "hidden" }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: C.forestLight, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>WS</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: sm ? 13 : 15, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {sm ? "WS" : "Workplace Supervisor"}
          </div>
          {page !== "dashboard" && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, overflow: "hidden" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }} onClick={onBack}>Dashboard</span>
              <span style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>›</span>
              {breadcrumb && !sm && (
                <><span style={{ color: "rgba(255,255,255,0.5)", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }} onClick={() => onBack("parent")}>{breadcrumb.parent}</span><span style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>›</span></>
              )}
              <span style={{ color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pageLabels[page]}</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 12 }}>
        {page !== "dashboard" && (
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: sm ? "6px 10px" : "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", whiteSpace: "nowrap" }}>← Back</button>
        )}
        <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: sm ? "6px 10px" : "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", whiteSpace: "nowrap" }}>
          {sm ? "Exit" : "Logout"}
        </button>
      </div>
    </nav>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, sub, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: C.white, borderRadius: 16, border: `1.5px solid ${hov ? C.forestMid : C.border}`, padding: "18px 20px", cursor: "pointer", transition: "all 0.22s", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? "0 12px 32px rgba(26,58,42,0.13)" : "0 2px 8px rgba(26,58,42,0.04)", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, lineHeight: 1.3, paddingRight: 8 }}>{label}</div>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: accent ? C.emberBg : C.sage, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 30, color: accent ? C.ember : C.text, lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 12, color: C.muted }}>{sub}</div>
      <div style={{ fontSize: 12, color: C.forestMid, fontWeight: 600, marginTop: 8 }}>View details →</div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────
function Dashboard({ supervisor, interns, reports, supervisorReports, onNav, onWriteReport, onUpdateCompany }) {
  const { sm, md } = useBreakpoint();
  const submitted = reports.filter(r => r.status === "submitted").length;
  const pending = reports.filter(r => r.status === "pending").length;
  const [editingCompany, setEditingCompany] = useState(false);
  const [companyDraft, setCompanyDraft] = useState(supervisor.company || "");

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: sm ? "14px 12px" : "28px 20px", boxSizing: "border-box" }}>
      {/* Supervisor Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.forest}, ${C.forestMid})`, borderRadius: 18, padding: sm ? "18px" : "26px 30px", marginBottom: 14, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 12 }}>Supervisor Profile</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <Avatar name={supervisor.name} size={sm ? 42 : 52} bg="rgba(255,255,255,0.15)" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: sm ? 17 : 21, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{supervisor.name}</div>
            {editingCompany ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <input
                  value={companyDraft}
                  onChange={(e) => setCompanyDraft(e.target.value)}
                  style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.18)", color: "#fff", width: 220, maxWidth: "70vw" }}
                />
                <button
                  onClick={async () => {
                    const ok = await onUpdateCompany(companyDraft);
                    if (ok) setEditingCompany(false);
                  }}
                  style={{ border: "none", background: "#fff", color: C.forest, borderRadius: 8, padding: "6px 10px", fontWeight: 700, cursor: "pointer" }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setCompanyDraft(supervisor.company || "");
                    setEditingCompany(false);
                  }}
                  style={{ border: "1px solid rgba(255,255,255,0.4)", background: "transparent", color: "#fff", borderRadius: 8, padding: "6px 10px", fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div
                onClick={() => setEditingCompany(true)}
                title="Click to edit company"
                style={{ color: "rgba(255,255,255,0.88)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted" }}
              >
                {supervisor.company}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : "1fr 1fr", gap: 10 }}>
          {[["Company", supervisor.company], ["Email", supervisor.email]].map(([l, v]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 12px", minWidth: 0, overflow: "hidden" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 2, fontWeight: 600 }}>{l}</div>
              <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr 1fr" : md ? "1fr 1fr" : "repeat(3,1fr)", gap: 12, marginBottom: 14 }}>
        <StatCard label="Total Interns" value={interns.length} icon="👥" sub={`${interns.length} active`} onClick={() => onNav("interns")} />
        <StatCard label="Reports Submitted" value={submitted} icon="📄" sub="Filed" onClick={() => onNav("submitted")} />
        <div style={{ gridColumn: sm ? "1 / -1" : undefined }}>
          <StatCard label="Pending Reports" value={pending} icon="⏳" accent sub="Need attention" onClick={() => onNav("pending")} />
        </div>
      </div>

      {/* Interns */}
      <div style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.border}`, padding: sm ? "14px" : "22px 26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Your Interns</div>
            <div style={{ color: C.muted, fontSize: 13 }}>Currently interning at your company</div>
          </div>
          <button onClick={() => onNav("interns")} style={{ background: C.sage, border: `1px solid ${C.mint}`, borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.forest, fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}>View all</button>
        </div>
        {interns.map(intern => (
          <DashInternRow
            key={intern.id}
            intern={intern}
            reports={reports}
            supervisorReport={supervisorReports[intern.id]}
            onDetail={() => onNav("internDetail", intern)}
            onWriteReport={() => onWriteReport(intern)}
          />
        ))}
      </div>
    </div>
  );
}

function DashInternRow({ intern, reports, supervisorReport, onDetail, onWriteReport }) {
  const { sm } = useBreakpoint();
  const [hov, setHov] = useState(false);
  const filed = reports.filter(r => r.internId === intern.id && r.status === "submitted").length;
  const due = reports.some(r => r.internId === intern.id && r.status === "pending");

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ border: `1.5px solid ${hov ? C.forestMid : C.border}`, borderRadius: 14, padding: sm ? "12px" : "14px 18px", marginBottom: 10, transition: "all 0.2s", background: hov ? "#f7fbf8" : C.white }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0, flex: 1 }}>
          <Avatar name={intern.name} size={38} bg={C.forestMid} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{intern.name}</span>
              {due && <Badge label="Report Due" />}
              {supervisorReport && <Badge label="✓ Evaluated" color={C.success} bg={C.successBg} />}
            </div>
            <div style={{ color: C.muted, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{intern.course} · {intern.university}</div>
            <div style={{ color: C.muted, fontSize: 12 }}>{intern.start} – {intern.end} · <strong style={{ color: C.text }}>{filed}</strong> filed</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          <button onClick={onDetail} style={{ background: C.sage, border: `1px solid ${C.mint}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.forest, fontFamily: "inherit", whiteSpace: "nowrap" }}>Profile</button>
          <button onClick={onWriteReport} style={{ background: supervisorReport ? C.forestLight : C.forest, color: "#fff", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", whiteSpace: "nowrap" }}>
            {supervisorReport ? "Edit Report" : "Write Report"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Interns Screen ───────────────────────────────────────────────────────
function InternsScreen({ interns, reports, supervisorReports, onDetail, onWriteReport }) {
  const { sm, md } = useBreakpoint();
  const [search, setSearch] = useState("");
  const filtered = interns.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.course.toLowerCase().includes(search.toLowerCase()) ||
    i.university.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: sm ? "14px 12px" : "28px 20px", boxSizing: "border-box" }}>
      <div style={{ background: `linear-gradient(135deg, ${C.forest}, ${C.forestLight})`, borderRadius: 18, padding: sm ? "18px" : "26px 30px", marginBottom: 16, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>Roster</div>
        <div style={{ fontWeight: 800, fontSize: sm ? 22 : 26, marginBottom: 4 }}>All Interns</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{interns.length} active placement{interns.length !== 1 ? "s" : ""}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          {[[interns.length, "Total"], [interns.filter(i => reports.some(r => r.internId === i.id && r.status === "pending")).length, "Reports Due"], [[...new Set(interns.map(i => i.university))].length, "Universities"]].map(([val, lbl]) => (
            <div key={lbl} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 16px", textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 20 }}>{val}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, course or university…"
        style={{ width: "100%", padding: "12px 16px", border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontFamily: "inherit", color: C.text, background: C.white, boxSizing: "border-box", outline: "none", marginBottom: 14 }} />

      <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : md ? "1fr 1fr" : "repeat(3, minmax(0,1fr))", gap: 12 }}>
        {filtered.map(intern => (
          <InternCard
            key={intern.id}
            intern={intern}
            reports={reports}
            supervisorReport={supervisorReports[intern.id]}
            onClick={() => onDetail(intern)}
            onWriteReport={() => onWriteReport(intern)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
          <div style={{ fontWeight: 600 }}>No interns match your search</div>
        </div>
      )}
    </div>
  );
}

function InternCard({ intern, reports, supervisorReport, onClick, onWriteReport }) {
  const [hov, setHov] = useState(false);
  const filed = reports.filter(r => r.internId === intern.id && r.status === "submitted").length;
  const due = reports.some(r => r.internId === intern.id && r.status === "pending");
  const total = reports.filter(r => r.internId === intern.id).length;
  const pct = total > 0 ? Math.round((filed / total) * 100) : 0;

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: C.white, borderRadius: 16, border: `1.5px solid ${hov ? C.forestMid : C.border}`, padding: "18px", cursor: "pointer", transition: "all 0.22s", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? "0 12px 28px rgba(26,58,42,0.1)" : "0 2px 8px rgba(26,58,42,0.03)", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }} onClick={onClick}>
        <Avatar name={intern.name} size={42} bg={C.forestMid} />
        {due ? <Badge label="Report Due" /> : <Pill label="Up to date" variant="success" />}
      </div>
      <div onClick={onClick}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{intern.name}</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{intern.course}</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{intern.university}</div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: C.muted }}>Reports filed</span>
            <span style={{ fontWeight: 700, color: C.text }}>{filed}/{total}</span>
          </div>
          <div style={{ background: C.sage, borderRadius: 99, height: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: C.forest, borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>{intern.start} – {intern.end}</div>
        </div>
      </div>

      {/* Supervisor Report Quick Action */}
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={e => { e.stopPropagation(); onClick(); }} style={{ flex: 1, background: C.sage, border: `1px solid ${C.mint}`, borderRadius: 8, padding: "7px 0", cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.forest, fontFamily: "inherit" }}>
          View Profile
        </button>
        <button onClick={e => { e.stopPropagation(); onWriteReport(); }}
          style={{ flex: 1, background: supervisorReport ? C.successBg : C.forest, color: supervisorReport ? C.success : "#fff", border: supervisorReport ? `1px solid ${C.success}44` : "none", borderRadius: 8, padding: "7px 0", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>
          {supervisorReport ? "✓ Edit Report" : "Write Report"}
        </button>
      </div>
    </div>
  );
}

// ─── Intern Detail ────────────────────────────────────────────────────────
function InternDetail({ intern, reports, supervisorReport, onWriteReport }) {
  const { sm } = useBreakpoint();
  const internReports = reports.filter(r => r.internId === intern.id);
  const filed = internReports.filter(r => r.status === "submitted").length;
  const pending = internReports.filter(r => r.status === "pending").length;

  const start = new Date(intern.start);
  const end = new Date(intern.end);
  const now = new Date();
  const totalDays = (end - start) / 86400000;
  const elapsed = Math.max(0, Math.min((now - start) / 86400000, totalDays));
  const progressPct = Math.round((elapsed / totalDays) * 100);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: sm ? "14px 12px" : "28px 20px", boxSizing: "border-box" }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.forest}, ${C.forestMid})`, borderRadius: 20, padding: sm ? "18px" : "28px", marginBottom: 14, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <Avatar name={intern.name} size={sm ? 48 : 60} bg="rgba(255,255,255,0.15)" />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: sm ? 19 : 24, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{intern.name}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{intern.course} · ID {intern.id}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr 1fr" : "repeat(4,1fr)", gap: 8 }}>
          {[["University", intern.university], ["Start", intern.start], ["End", intern.end], ["Reports", `${filed} filed`]].map(([l, v]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.09)", borderRadius: 10, padding: "9px 10px", minWidth: 0, overflow: "hidden" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 2, fontWeight: 600, textTransform: "uppercase" }}>{l}</div>
              <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Reports Filed", value: filed, icon: "✅", color: C.success, bg: C.successBg },
          { label: "Pending", value: pending, icon: "⏳", color: C.ember, bg: C.emberBg },
          { label: "Progress", value: `${progressPct}%`, icon: "📈", color: C.forest, bg: C.sage },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: sm ? "12px" : "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: sm ? 11 : 12, color: C.muted, fontWeight: 600, paddingRight: 4 }}>{label}</span>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{icon}</span>
            </div>
            <div style={{ fontSize: sm ? 22 : 26, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: sm ? "14px" : "20px", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Placement Timeline</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 6, flexWrap: "wrap", gap: 4 }}>
          <span>{intern.start}</span>
          <span style={{ fontWeight: 600, color: C.forest }}>{progressPct}% complete</span>
          <span>{intern.end}</span>
        </div>
        <div style={{ background: C.sage, borderRadius: 99, height: 10, overflow: "hidden", marginBottom: 6 }}>
          <div style={{ height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg, ${C.forest}, ${C.forestLight})`, borderRadius: 99 }} />
        </div>
        <div style={{ fontSize: 12, color: C.muted }}>{Math.round(elapsed)} days in · {Math.round(totalDays - elapsed)} remaining</div>
      </div>

      {/* Contact */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: sm ? "14px" : "20px", marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Contact & Details</div>
        <div style={{ display: "grid", gridTemplateColumns: sm ? "1fr" : "1fr 1fr", gap: 10 }}>
          {[
            ["Student ID", intern.id],
            ["Programme", intern.course],
            ["Institution", intern.university],
            ["Email", intern.email || `${intern.name.split(" ")[0].toLowerCase()}@university.edu`],
            ["Supervisor", "You"],
            ["Department", intern.department || "Engineering & Technology"],
          ].map(([l, v]) => (
            <div key={l} style={{ background: C.sage, borderRadius: 10, padding: "10px 12px", minWidth: 0, overflow: "hidden" }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SUPERVISOR REPORT SECTION ── */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: sm ? "14px" : "20px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: supervisorReport ? 14 : 0, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Supervisor's Evaluation Report</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>
              {supervisorReport ? `Last updated ${supervisorReport.createdAt}` : "No report written yet for this intern"}
            </div>
          </div>
          <button onClick={onWriteReport}
            style={{ background: supervisorReport ? C.sage : C.forest, color: supervisorReport ? C.forest : "#fff", border: supervisorReport ? `1px solid ${C.mint}` : "none", borderRadius: 10, padding: "9px 18px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit", whiteSpace: "nowrap" }}>
            {supervisorReport ? "✏️ Edit Report" : "✍️ Write Report"}
          </button>
        </div>

        {!supervisorReport && (
          <div style={{ marginTop: 16, background: C.sage, borderRadius: 12, padding: "20px", textAlign: "center", border: `2px dashed ${C.border}` }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✍️</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 4 }}>No evaluation written yet</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>Write a supervisor report to evaluate this intern's performance, attendance, and conduct.</div>
            <button onClick={onWriteReport}
              style={{ background: C.forest, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
              Write Evaluation Report
            </button>
          </div>
        )}

        {supervisorReport && (
          <SupervisorReportView report={supervisorReport} intern={intern} onEdit={onWriteReport} sm={sm} />
        )}
      </div>

      {/* Report history */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: sm ? "14px" : "20px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Intern's Report History</div>
        {internReports.length === 0 ? (
          <div style={{ textAlign: "center", padding: "28px 0", color: C.muted }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>📋</div>
            <div>No reports yet</div>
          </div>
        ) : internReports.map(r => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${C.border}`, gap: 10, flexWrap: "wrap" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.month}</div>
              <div style={{ fontSize: 12, color: C.muted, fontFamily: "monospace" }}>{r.id}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {r.submittedOn && !sm && <span style={{ fontSize: 12, color: C.muted }}>{r.submittedOn}</span>}
              <Pill label={r.status === "submitted" ? "Submitted" : "Pending"} variant={r.status === "submitted" ? "success" : "warning"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reports Screen ───────────────────────────────────────────────────────
function ReportsScreen({ reports, interns, filterStatus }) {
  const { sm } = useBreakpoint();
  const [search, setSearch] = useState("");
  const getIntern = id => interns.find(i => i.id === id);
  const title = filterStatus === "submitted" ? "Submitted Reports" : "Pending Reports";
  const icon = filterStatus === "submitted" ? "📄" : "⏳";
  const accent = filterStatus === "pending";

  const filtered = reports
    .filter(r => r.status === filterStatus)
    .filter(r => {
      const intern = getIntern(r.internId);
      return !search || intern?.name.toLowerCase().includes(search.toLowerCase()) || r.month.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: sm ? "14px 12px" : "28px 20px", boxSizing: "border-box" }}>
      <div style={{ background: accent ? `linear-gradient(135deg, #8b2a0f, ${C.ember})` : `linear-gradient(135deg, ${C.forest}, ${C.forestMid})`, borderRadius: 18, padding: sm ? "18px" : "26px 30px", marginBottom: 16, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
        <div style={{ fontWeight: 800, fontSize: sm ? 20 : 26 }}>{title}</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 4 }}>
          {filtered.length} report{filtered.length !== 1 ? "s" : ""} {filterStatus === "submitted" ? "filed successfully" : "awaiting submission"}
        </div>
        {accent && (
          <div style={{ marginTop: 12, background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 12px", fontSize: 13, display: "inline-block" }}>
            ⚠ Follow up with interns to submit outstanding reports.
          </div>
        )}
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by intern name or month…"
        style={{ width: "100%", padding: "12px 16px", border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontFamily: "inherit", color: C.text, background: C.white, boxSizing: "border-box", outline: "none", marginBottom: 14 }} />

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: C.muted }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>{filterStatus === "submitted" ? "🎉" : "✅"}</div>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
            {search ? "No matching reports" : filterStatus === "pending" ? "All reports submitted!" : "No reports yet"}
          </div>
          <div style={{ fontSize: 14 }}>
            {filterStatus === "pending" && !search ? "Great work — nothing pending." : "Try adjusting your search."}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(r => {
            const intern = getIntern(r.internId);
            return (
              <div key={r.id} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: sm ? "12px" : "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: sm ? "wrap" : "nowrap", boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                  {intern && <Avatar name={intern.name} size={36} bg={accent ? C.ember : C.forestMid} />}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{intern?.name || "Unknown"}</div>
                    <div style={{ fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{intern?.course} · {r.month}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {r.submittedOn && !sm && <span style={{ fontSize: 12, color: C.muted }}>{r.submittedOn}</span>}
                  <Pill label={r.status === "submitted" ? "Submitted" : "Pending"} variant={r.status === "submitted" ? "success" : "warning"} />
                  {r.status === "pending" && (
                    <button style={{ background: C.forest, color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", whiteSpace: "nowrap" }}>Submit Now</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────
const INTERNS = [
  { id: "2024001", name: "John Doe", course: "Computer Science", university: "State University", start: "2/1/2026", end: "7/31/2026", department: "Software Engineering", email: "john.doe@stateuniversity.edu" },
  { id: "2024006", name: "Alice Cooper", course: "Software Engineering", university: "Tech University", start: "2/15/2026", end: "8/15/2026", department: "Product & Design", email: "alice.cooper@techuniversity.edu" },
];

const REPORTS = [
  { id: "RPT-2024001-001", internId: "2024001", month: "February 2026", status: "submitted", submittedOn: "Mar 1, 2026" },
  { id: "RPT-2024006-001", internId: "2024006", month: "February 2026", status: "pending", submittedOn: null },
];

// ─── Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [supervisor, setSupervisor] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  // supervisorReports: { [internId]: reportObject }
  const [supervisorReports, setSupervisorReports] = useState({});
  const [reportModalIntern, setReportModalIntern] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setLoadingProfile(false);
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res?.data?.user?.profile || {};
        if (p.companyName && p.workEmail) {
          setSupervisor({
            name: user?.name || user?.fullName || "Supervisor",
            company: p.companyName,
            email: p.workEmail,
            phone: p.phone || "",
          });
        }
      } catch (e) {
        console.error("Failed to load workplace supervisor profile", e);
      } finally {
        setLoadingProfile(false);
      }
    };
    load();
  }, [token, user]);

  const completeOnboarding = async (data) => {
    try {
      await axios.patch(
        "http://localhost:5000/api/users/me/profile",
        {
          companyName: data.company,
          workEmail: data.email,
          phone: data.phone || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSupervisor({
        name: user?.name || user?.fullName || "Supervisor",
        company: data.company,
        email: data.email,
        phone: data.phone || "",
      });
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to save profile");
    }
  };

  if (loadingProfile) return null;
  if (!supervisor) return <Onboarding onComplete={completeOnboarding} initialEmail={user?.email || ""} />;

  const navigatePage = (p, data) => {
    setPrevPage(page);
    if (p === "internDetail") setSelectedIntern(data);
    setPage(p);
  };

  const goBack = (mode) => {
    if (mode === "parent" && prevPage) { setPage(prevPage); return; }
    setPage("dashboard");
  };

  const openReportModal = (intern) => setReportModalIntern(intern);
  const closeReportModal = () => setReportModalIntern(null);

  const saveReport = (reportData) => {
    setSupervisorReports(prev => ({ ...prev, [reportData.internId]: reportData }));
  };

  const handleUpdateCompany = async (companyName) => {
    if (!companyName?.trim()) return false;
    try {
      await axios.patch(
        "http://localhost:5000/api/users/me/profile",
        { companyName: companyName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSupervisor((prev) => ({ ...prev, company: companyName.trim() }));
      return true;
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update company");
      return false;
    }
  };

  const handleLogout = () => {
    logout?.();
    setSupervisor(null);
    setPage("dashboard");
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: C.sage, minHeight: "100vh", color: C.text, overflowX: "hidden" }}>
      <Navbar page={page} onBack={goBack} onLogout={handleLogout} breadcrumb={page === "internDetail" ? { parent: "All Interns" } : null} />

      {page === "dashboard" && (
        <Dashboard
          supervisor={supervisor}
          interns={INTERNS}
          reports={REPORTS}
          supervisorReports={supervisorReports}
          onNav={navigatePage}
          onWriteReport={openReportModal}
          onUpdateCompany={handleUpdateCompany}
        />
      )}
      {page === "interns" && (
        <InternsScreen
          interns={INTERNS}
          reports={REPORTS}
          supervisorReports={supervisorReports}
          onDetail={i => navigatePage("internDetail", i)}
          onWriteReport={openReportModal}
        />
      )}
      {page === "submitted" && <ReportsScreen reports={REPORTS} interns={INTERNS} filterStatus="submitted" />}
      {page === "pending" && <ReportsScreen reports={REPORTS} interns={INTERNS} filterStatus="pending" />}
      {page === "internDetail" && selectedIntern && (
        <InternDetail
          intern={selectedIntern}
          reports={REPORTS}
          supervisorReport={supervisorReports[selectedIntern.id]}
          onWriteReport={() => openReportModal(selectedIntern)}
        />
      )}

      {/* Supervisor Report Modal */}
      {reportModalIntern && (
        <SupervisorReportModal
          intern={reportModalIntern}
          existingReport={supervisorReports[reportModalIntern.id]}
          onSave={saveReport}
          onClose={closeReportModal}
        />
      )}
    </div>
  );
}