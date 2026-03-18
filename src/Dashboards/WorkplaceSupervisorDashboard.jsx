import { useState, useEffect } from "react";

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

// ─── Onboarding ───────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const { sm } = useBreakpoint();
  const [form, setForm] = useState({ company: "", email: "" });
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!form.company.trim()) e.company = "Required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    if (Object.keys(e).length) { setErrors(e); return; }
    onComplete({ name: "Supervisor", company: form.company, email: form.email });
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
function Navbar({  page, onBack, onLogout, breadcrumb }) {
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
function Dashboard({ supervisor, interns, reports, onNav }) {
  const { sm, md } = useBreakpoint();
  const submitted = reports.filter(r => r.status === "submitted").length;
  const pending = reports.filter(r => r.status === "pending").length;

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
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{supervisor.company}</div>
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
        {interns.map(intern => <DashInternRow key={intern.id} intern={intern} reports={reports} onDetail={() => onNav("internDetail", intern)} />)}
      </div>
    </div>
  );
}

function DashInternRow({ intern, reports, onDetail }) {
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
            </div>
            <div style={{ color: C.muted, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{intern.course} · {intern.university}</div>
            <div style={{ color: C.muted, fontSize: 12 }}>{intern.start} – {intern.end} · <strong style={{ color: C.text }}>{filed}</strong> filed</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
          <button onClick={onDetail} style={{ background: C.sage, border: `1px solid ${C.mint}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.forest, fontFamily: "inherit", whiteSpace: "nowrap" }}>Profile</button>
          <button style={{ background: C.forest, color: "#fff", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", whiteSpace: "nowrap" }}>Submit</button>
        </div>
      </div>
    </div>
  );
}

// ─── Interns Screen ───────────────────────────────────────────────────────
function InternsScreen({ interns, reports, onDetail }) {
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
        {filtered.map(intern => <InternCard key={intern.id} intern={intern} reports={reports} onClick={() => onDetail(intern)} />)}
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

function InternCard({ intern, reports, onClick }) {
  const [hov, setHov] = useState(false);
  const filed = reports.filter(r => r.internId === intern.id && r.status === "submitted").length;
  const due = reports.some(r => r.internId === intern.id && r.status === "pending");
  const total = reports.filter(r => r.internId === intern.id).length;
  const pct = total > 0 ? Math.round((filed / total) * 100) : 0;

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}
      style={{ background: C.white, borderRadius: 16, border: `1.5px solid ${hov ? C.forestMid : C.border}`, padding: "18px", cursor: "pointer", transition: "all 0.22s", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? "0 12px 28px rgba(26,58,42,0.1)" : "0 2px 8px rgba(26,58,42,0.03)", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <Avatar name={intern.name} size={42} bg={C.forestMid} />
        {due ? <Badge label="Report Due" /> : <Pill label="Up to date" variant="success" />}
      </div>
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
      <div style={{ fontSize: 12, color: C.forestMid, fontWeight: 600, marginTop: 10 }}>View full profile →</div>
    </div>
  );
}

// ─── Intern Detail ────────────────────────────────────────────────────────
function InternDetail({ intern, reports }) {
  const { sm,  } = useBreakpoint();
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

      {/* Report history */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: sm ? "14px" : "20px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Report History</div>
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
  const [supervisor, setSupervisor] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  if (!supervisor) return <Onboarding onComplete={setSupervisor} />;

  const navigate = (p, data) => {
    setPrevPage(page);
    if (p === "internDetail") setSelectedIntern(data);
    setPage(p);
  };

  const goBack = (mode) => {
    if (mode === "parent" && prevPage) { setPage(prevPage); return; }
    setPage("dashboard");
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: C.sage, minHeight: "100vh", color: C.text, overflowX: "hidden" }}>
      <Navbar supervisor={supervisor} page={page} onBack={goBack} onLogout={() => { setSupervisor(null); setPage("dashboard"); }} breadcrumb={page === "internDetail" ? { parent: "All Interns" } : null} />
      {page === "dashboard"    && <Dashboard supervisor={supervisor} interns={INTERNS} reports={REPORTS} onNav={navigate} />}
      {page === "interns"      && <InternsScreen interns={INTERNS} reports={REPORTS} onDetail={i => navigate("internDetail", i)} />}
      {page === "submitted"    && <ReportsScreen reports={REPORTS} interns={INTERNS} filterStatus="submitted" />}
      {page === "pending"      && <ReportsScreen reports={REPORTS} interns={INTERNS} filterStatus="pending" />}
      {page === "internDetail" && selectedIntern && <InternDetail intern={selectedIntern} reports={REPORTS} />}
    </div>
  );
}