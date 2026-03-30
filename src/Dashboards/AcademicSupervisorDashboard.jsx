import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  GraduationCap, Users, FileText, Clock, LogOut, ArrowLeft,
  CheckCircle, MessageSquare, ChevronRight, Eye, Search,
  BookOpen, TrendingUp, Star, AlertCircle, Check, X,
  Building2, MapPin, Download, ChevronDown,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════
   CSS  –  mirrors StudentDashboard tokens exactly
════════════════════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Inter',sans-serif; }

  :root {
    --green-dark: #0d3b2e;
    --green-mid:  #1a5c45;
    --green-btn:  #15653a;
    --green-bg:   #e6f4ec;
    --border:     #e5e7eb;
    --text-dark:  #111827;
    --text-mid:   #374151;
    --text-light: #6b7280;
    --text-xl:    #9ca3af;
    --white:      #ffffff;
    --nav-h:      58px;
  }

  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideUp{ from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }

  .fade-in  { animation:fadeIn  .25s ease both; }
  .fade-up  { animation:fadeUp  .3s  ease both; }
  .fade-1   { animation:fadeUp  .3s .05s ease both; }
  .fade-2   { animation:fadeUp  .3s .10s ease both; }
  .fade-3   { animation:fadeUp  .3s .15s ease both; }

  .app-shell { min-height:100vh; background:var(--green-bg); font-family:'Inter',sans-serif; }

  /* ── Navbar ── */
  .topnav {
    height:var(--nav-h); background:var(--green-dark);
    display:flex; align-items:center; justify-content:space-between;
    padding:0 32px; position:sticky; top:0; z-index:200;
    box-shadow:0 2px 14px rgba(0,0,0,.28);
  }
  .topnav-brand { display:flex; align-items:center; gap:12px; }
  .topnav-logo  { font-size:15px; font-weight:800; color:#fff; }
  .topnav-sub   { font-size:11px; color:rgba(255,255,255,.4); margin-top:1px; }
  .topnav-right { display:flex; align-items:center; gap:10px; }
  .user-pill {
    display:flex; align-items:center; gap:9px; padding:5px 14px 5px 6px;
    background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.14);
    border-radius:99px;
  }
  .user-avatar {
    width:30px; height:30px; border-radius:50%;
    background:var(--green-mid); border:2px solid rgba(255,255,255,.28);
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:700; color:#fff;
  }
  .user-name { font-size:13px; font-weight:600; color:#fff; }
  .topnav-logout {
    display:flex; align-items:center; gap:6px; padding:7px 14px;
    border:1.5px solid rgba(255,255,255,.2); border-radius:8px;
    background:transparent; color:#fff; font-family:'Inter',sans-serif;
    font-size:13px; font-weight:500; cursor:pointer; transition:background .15s;
  }
  .topnav-logout:hover { background:rgba(255,255,255,.1); }

  /* ── Layout ── */
  .page-wrap { max-width:880px; margin:0 auto; padding:28px 20px 60px; }

  /* ── Cards ── */
  .card { background:#fff; border-radius:14px; border:1px solid var(--border); transition:box-shadow .2s; }
  .card:hover { box-shadow:0 4px 20px rgba(0,0,0,.07); }
  .card-body  { padding:24px; }
  .card-title { font-size:15px; font-weight:700; color:var(--text-dark); margin-bottom:18px; }

  /* ── Stat chips ── */
  .stat-chips { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .stat-chip  { background:#fff; border:1px solid var(--border); border-radius:12px; padding:14px 16px; text-align:center; }
  .stat-chip-val { font-size:22px; font-weight:800; color:var(--green-btn); }
  .stat-chip-lbl { font-size:11px; color:var(--text-light); margin-top:3px; }

  /* ── Info grid ── */
  .info-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .info-label  { font-size:11px; color:var(--text-light); margin-bottom:4px; text-transform:uppercase; letter-spacing:.05em; }
  .info-value  { font-size:14px; font-weight:600; color:var(--text-dark); }
  .info-value.empty { color:var(--text-xl); font-style:italic; font-weight:400; }

  /* ── Shortcut cards ── */
  .nav-shortcuts { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
  .shortcut-card {
    background:#fff; border:1px solid var(--border); border-radius:14px; padding:20px;
    cursor:pointer; display:flex; align-items:center; gap:14px;
    transition:box-shadow .2s, transform .15s, border-color .15s;
  }
  .shortcut-card:hover { box-shadow:0 6px 22px rgba(0,0,0,.09); transform:translateY(-2px); border-color:#d1d5db; }
  .shortcut-icon { width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .shortcut-label { font-size:11px; color:var(--text-light); margin-bottom:2px; }
  .shortcut-name  { font-size:15px; font-weight:700; color:var(--text-dark); }
  .sc-badge { margin-left:auto; background:#ef4444; color:#fff; border-radius:99px; font-size:10px; font-weight:700; padding:2px 7px; }

  /* ── Badges ── */
  .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; }
  .bg  { background:#dcfce7; color:#15803d; }
  .ba  { background:#fef9c3; color:#a16207; }
  .br  { background:#fee2e2; color:#b91c1c; }
  .bbl { background:#dbeafe; color:#1d4ed8; }
  .bdk { background:#15653a; color:#fff;    }

  /* ── Buttons ── */
  .btn-p {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    padding:10px 20px; background:var(--green-btn); color:#fff;
    border:none; border-radius:9px; font-family:'Inter',sans-serif;
    font-size:14px; font-weight:600; cursor:pointer; transition:background .15s, transform .1s;
  }
  .btn-p:hover { background:#0f4d2c; transform:translateY(-1px); }
  .btn-g {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    padding:9px 16px; background:#f3f4f6; color:var(--text-mid);
    border:1px solid var(--border); border-radius:9px; font-family:'Inter',sans-serif;
    font-size:14px; font-weight:500; cursor:pointer; transition:background .15s;
  }
  .btn-g:hover { background:#e5e7eb; }
  .btn-og {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    padding:8px 16px; background:transparent; color:var(--green-btn);
    border:1.5px solid var(--green-btn); border-radius:9px;
    font-family:'Inter',sans-serif; font-size:13px; font-weight:600;
    cursor:pointer; transition:background .15s;
  }
  .btn-og:hover { background:#f0fdf4; }
  .back-btn {
    display:inline-flex; align-items:center; gap:6px; padding:8px 14px;
    background:rgba(255,255,255,.8); border:1px solid var(--border); border-radius:8px;
    font-family:'Inter',sans-serif; font-size:13px; font-weight:500; color:var(--text-mid);
    cursor:pointer; margin-bottom:20px; transition:background .15s;
  }
  .back-btn:hover { background:#fff; }

  /* ── Inputs ── */
  .fl { display:block; font-size:12px; font-weight:600; color:var(--text-mid); margin-bottom:6px; text-transform:uppercase; letter-spacing:.05em; }
  .fi {
    width:100%; padding:11px 14px; border:1px solid var(--border); border-radius:9px;
    font-family:'Inter',sans-serif; font-size:14px; color:var(--text-dark);
    background:#fafafa; outline:none; transition:border-color .15s, box-shadow .15s;
  }
  .fi:focus { border-color:var(--green-btn); box-shadow:0 0 0 3px rgba(21,101,58,.1); background:#fff; }
  .fg { margin-bottom:18px; }

  /* ── Search ── */
  .sw-search { position:relative; margin-bottom:16px; }
  .sw-search svg { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#9ca3af; }
  .s-input {
    width:100%; padding:11px 14px 11px 40px; border:1px solid var(--border); border-radius:10px;
    font-family:'Inter',sans-serif; font-size:14px; color:var(--text-dark);
    background:#fff; outline:none; transition:border-color .15s;
  }
  .s-input:focus { border-color:var(--green-btn); box-shadow:0 0 0 3px rgba(21,101,58,.1); }

  /* ── Filter pills ── */
  .fpill {
    padding:6px 14px; border-radius:99px; border:1px solid var(--border); background:#fff;
    font-family:'Inter',sans-serif; font-size:12px; font-weight:600; color:var(--text-light);
    cursor:pointer; transition:all .15s;
  }
  .fpill:hover  { border-color:var(--green-btn); color:var(--green-btn); }
  .fpill.active { background:var(--green-btn); color:#fff; border-color:var(--green-btn); }

  /* ── Modal ── */
  .mo {
    position:fixed; inset:0; background:rgba(0,0,0,.45); backdrop-filter:blur(5px);
    display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px;
    animation:fadeIn .2s ease both;
  }
  .mb {
    background:#fff; border-radius:18px; padding:32px; width:100%;
    max-width:500px; max-height:90vh; overflow-y:auto;
    box-shadow:0 28px 70px rgba(0,0,0,.2); animation:slideUp .22s ease both;
  }

  /* ── Toast ── */
  .toast {
    position:fixed; top:24px; right:24px; z-index:99999;
    border-radius:10px; padding:13px 20px;
    font-family:'Inter',sans-serif; font-size:14px; font-weight:600;
    display:flex; align-items:center; gap:9px;
    box-shadow:0 10px 30px rgba(0,0,0,.2); animation:fadeUp .25s ease both;
  }
  .ts { background:#15653a; color:#fff; }
  .te { background:#ef4444; color:#fff; }

  /* ── Student row cards ── */
  .student-row {
    background:#fff; border:1px solid var(--border); border-radius:12px; padding:18px;
    margin-bottom:12px; transition:box-shadow .2s, border-color .15s;
  }
  .student-row:hover { box-shadow:0 4px 16px rgba(0,0,0,.07); border-color:#d1d5db; }

  /* ── Report row ── */
  .report-row { display:flex; align-items:flex-start; padding:15px 0; border-bottom:1px solid #f3f4f6; gap:12px; }
  .report-row:last-child { border-bottom:none; }

  /* ── Prog bar ── */
  .prog-track { height:6px; background:#e5e7eb; border-radius:99px; overflow:hidden; }
  .prog-fill  { height:100%; border-radius:99px; background:linear-gradient(90deg,#15653a,#22c55e); }

  .divider { height:1px; background:var(--border); margin:16px 0; }
  .empty { text-align:center; padding:40px 24px; background:#f9fafb; border:1px dashed #d1d5db; border-radius:14px; }

  /* ══════════ RESPONSIVE ══════════ */

  /* ── Large tablet / small laptop ── */
  @media (max-width:1024px) {
    .opp-grid { grid-template-columns:repeat(2,1fr) !important; }
  }

  /* ── Tablet (768px) ── */
  @media (max-width:768px) {
    .topnav { padding:0 14px; height:52px; }
    .topnav-sub { display:none; }
    .topnav-logo { font-size:13px; }
    .user-name { display:none; }
    .topnav-logout span.lbl { display:none; }
    .topnav-logout { padding:7px 10px; }

    .page-wrap { padding:14px 12px 48px; }
    .card-body { padding:16px; }

    /* info grid: 2 cols on tablet */
    .info-grid { grid-template-columns:repeat(2,1fr); gap:14px; }

    /* nav shortcuts: 1 row of 3 is fine at 768, shrink padding */
    .nav-shortcuts { gap:8px; }
    .shortcut-card { padding:14px 10px; gap:10px; }
    .shortcut-name { font-size:13px; }
    .shortcut-icon { width:38px; height:38px; }

    /* stat chips stay 3-col */
    .stat-chips { gap:8px; }
    .stat-chip { padding:12px 10px; }
    .stat-chip-val { font-size:20px; }

    /* modals */
    .mb { padding:20px; max-width:96vw; }
    .mbr { flex-direction:column !important; }
    .mbr button { width:100% !important; }

    /* opportunities */
    .opp-grid { grid-template-columns:1fr !important; }

    /* reports two-col */
    .rep-two-col { grid-template-columns:1fr !important; }

    /* status page meta grid */
    .status-sg { grid-template-columns:repeat(2,1fr) !important; }

    /* wizard */
    .wizard-box { padding:24px 18px; }
  }

  /* ── Small mobile (540px) ── */
  @media (max-width:540px) {
    .topnav { padding:0 10px; }
    .topnav-logo { font-size:12px; }

    .page-wrap { padding:12px 10px 44px; }

    /* info grid: 1 col */
    .info-grid { grid-template-columns:1fr; gap:12px; }

    /* nav shortcuts: stack vertically */
    .nav-shortcuts { grid-template-columns:1fr; gap:10px; }
    .shortcut-card { padding:14px; gap:12px; }
    .shortcut-name { font-size:14px; }
    .shortcut-icon { width:42px; height:42px; }

    /* stat chips stay 3-col but tighter */
    .stat-chips { gap:6px; }
    .stat-chip { padding:10px 8px; }
    .stat-chip-val { font-size:18px; }
    .stat-chip-lbl { font-size:10px; }

    /* status page meta grid */
    .status-sg { grid-template-columns:repeat(2,1fr) !important; }

    .wizard-box { padding:20px 14px; }
    .wiz-bar { gap:4px; margin-bottom:20px; }
  }

  /* ── Extra small (380px) ── */
  @media (max-width:380px) {
    .topnav-logo { font-size:11px; }
    .page-wrap { padding:10px 8px 36px; }
    .card-body { padding:12px; }
    .shortcut-card { padding:12px; gap:8px; }
    .mb { padding:14px; }
    .btn-p, .btn-g { font-size:13px; padding:9px 12px; }

    /* nav shortcuts: still vertical, tighter */
    .shortcut-name { font-size:13px; }

    /* status meta: 1 col on very small screens */
    .status-sg { grid-template-columns:1fr !important; }
  }

`;

/* ── Helpers ──────────────────────────────────────────────────── */
const Ic = ({ icon: Icon, size = 16, color = "currentColor" }) => (
  <Icon size={size} color={color} strokeWidth={2} style={{ flexShrink: 0 }} />
);

const ToastEl = ({ msg, type = "success" }) => (
  <div className={`toast ${type === "error" ? "te" : "ts"}`}>
    <Ic icon={type === "error" ? AlertCircle : Check} size={15} color="#fff" />{msg}
  </div>
);

const useToast = () => {
  const [t, setT] = useState(null);
  const show = (msg, type = "success") => {
    setT({ msg, type, key: Date.now() });
    setTimeout(() => setT(null), 2800);
  };
  return [t, show];
};

/* ════════════════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════════════════ */
const HomePage = ({ user, onNavigate, showToast, students, reports, loading }) => {
  const supervisor = {
    name: user?.name || "Academic Supervisor",
    department: "Faculty",
    email: user?.email || "—",
    staffId: "—",
  };
  const totalStudents  = students.length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const totalReports   = reports.length;
  const initials = (user?.name || "AS").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  if (loading) {
    return (
      <div className="fade-in page-wrap" style={{ paddingTop: 40, textAlign: "center", color: "#6b7280" }}>
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="fade-in">

      {/* Welcome banner */}
      <div style={{ background:"linear-gradient(135deg,#0d3b2e,#1a5c45)", borderRadius:16, padding:"22px 26px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <p style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>Welcome back</p>
          <h2 style={{ fontSize:22, fontWeight:800, color:"#fff" }}>{user?.name || "Supervisor"} 👋</h2>
          <p style={{ fontSize:13, color:"rgba(255,255,255,.55)", marginTop:4 }}>{supervisor.department} · Academic Supervisor</p>
        </div>
        <div style={{ width:54, height:54, borderRadius:"50%", background:"rgba(255,255,255,.15)", border:"2px solid rgba(255,255,255,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:"#fff", flexShrink:0 }}>
          {initials}
        </div>
      </div>

      {/* Stats */}
      <div className="stat-chips fade-1" style={{ marginBottom:16 }}>
        <div className="stat-chip"><p className="stat-chip-val">{totalStudents}</p><p className="stat-chip-lbl">Assigned Students</p></div>
        <div className="stat-chip"><p className="stat-chip-val">{totalReports}</p><p className="stat-chip-lbl">Total Reports</p></div>
        <div className="stat-chip"><p className="stat-chip-val" style={{ color: pendingReports > 0 ? "#f97316" : "#15653a" }}>{pendingReports}</p><p className="stat-chip-lbl">Pending Reviews</p></div>
      </div>

      {/* Supervisor Info */}
      <div className="card fade-2" style={{ marginBottom:16 }}>
        <div className="card-body">
          <p className="card-title">Supervisor Information</p>
          <div className="info-grid">
            {[
              ["Name",       supervisor.name       ],
              ["Department", supervisor.department  ],
              ["Email",      supervisor.email       ],
              ["Staff ID",   supervisor.staffId     ],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="info-label">{l}</p>
                <p className={`info-value${!v ? " empty" : ""}`}>{v || "Not set"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="nav-shortcuts fade-3" style={{ marginBottom:16 }}>
        <div className="shortcut-card" onClick={() => onNavigate("students")}>
          <div className="shortcut-icon" style={{ background:"#eff6ff" }}><Ic icon={Users} size={22} color="#3b82f6" /></div>
          <div style={{ flex:1 }}>
            <p className="shortcut-label">Manage</p>
            <p className="shortcut-name">My Students</p>
          </div>
          <span style={{ marginLeft:"auto", background:"#15653a", color:"#fff", borderRadius:99, fontSize:10, fontWeight:700, padding:"2px 7px" }}>{totalStudents}</span>
        </div>
        <div className="shortcut-card" onClick={() => onNavigate("reports")}>
          <div className="shortcut-icon" style={{ background:"#f0fdf4" }}><Ic icon={FileText} size={22} color="#16a34a" /></div>
          <div style={{ flex:1 }}>
            <p className="shortcut-label">Review</p>
            <p className="shortcut-name">Reports</p>
          </div>
          {pendingReports > 0 && <span className="sc-badge">{pendingReports}</span>}
        </div>
        <div className="shortcut-card" onClick={() => onNavigate("evaluations")}>
          <div className="shortcut-icon" style={{ background:"#faf5ff" }}><Ic icon={Star} size={22} color="#9333ea" /></div>
          <div style={{ flex:1 }}>
            <p className="shortcut-label">Workplace</p>
            <p className="shortcut-name">Evaluations</p>
          </div>
        </div>
      </div>

      {/* Pending reports quick preview */}
      {pendingReports > 0 && (
        <div className="card fade-3">
          <div className="card-body">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <p className="card-title" style={{ margin:0 }}>Pending Reviews</p>
              <button className="btn-og" onClick={() => onNavigate("reports")}>View All</button>
            </div>
            {reports.filter((r) => r.status === "pending").slice(0, 3).map((r, i) => (
              <div key={r.id} className="report-row">
                <div style={{ width:38, height:38, borderRadius:10, background:"#fef9c3", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Ic icon={Clock} size={16} color="#a16207" />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:"#111827" }}>{r.studentName}</p>
                  <p style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{r.type} · {r.date}</p>
                </div>
                <button className="btn-og" style={{ fontSize:12, padding:"6px 12px" }} onClick={() => onNavigate("reports")}>
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   STUDENTS PAGE
════════════════════════════════════════════════════════════════ */
const StudentsPage = ({ onNavigate, showToast, students, onOpenStudentReports }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.company.toLowerCase().includes(q) || s.dept.toLowerCase().includes(q);
  });

  return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => onNavigate("home")}><Ic icon={ArrowLeft} size={14} />Back to Dashboard</button>
      <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", marginBottom:4 }}>My Students</h1>
      <p style={{ fontSize:14, color:"#6b7280", marginBottom:24 }}>Students under your supervision</p>
      <div style={{ height:1, background:"#e5e7eb", marginBottom:24 }} />

      <div className="sw-search">
        <Ic icon={Search} size={16} />
        <input className="s-input" placeholder="Search by name, company or department…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.map(s => (
        <div key={s.id} className="student-row fade-up">
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
            {/* Avatar + info */}
            <div style={{ display:"flex", gap:14, flex:1, minWidth:0 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:"#e6f4ec", border:"2px solid #15653a33", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"#15653a", flexShrink:0 }}>
                {s.name.split(" ").map(w => w[0]).slice(0,2).join("")}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                  <p style={{ fontSize:15, fontWeight:700, color:"#111827" }}>{s.name}</p>
                  {s.pending > 0 && <span className="badge ba">{s.pending} pending</span>}
                  {s.started && <span className="badge bg"><Ic icon={CheckCircle} size={10} color="#15803d" />Active</span>}
                </div>
                <p style={{ fontSize:12, color:"#6b7280", marginBottom:3 }}>{s.studentId} · {s.dept} · {s.level}</p>
                <p style={{ fontSize:12, color:"#6b7280", display:"flex", alignItems:"center", gap:4 }}>
                  <Ic icon={Building2} size={11} color="#9ca3af" />{s.company}
                  <span style={{ margin:"0 4px", color:"#d1d5db" }}>·</span>
                  <Ic icon={MapPin} size={11} color="#9ca3af" />{s.location}
                </p>
              </div>
            </div>

            {/* Reports progress + button */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
              <div style={{ textAlign:"right" }}>
                <p style={{ fontSize:11, color:"#9ca3af", marginBottom:4 }}>Reports Submitted</p>
                <p style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{s.reports}</p>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"flex-end" }}>
                <button
                  type="button"
                  className="btn-g"
                  style={{ fontSize:12, padding:"7px 12px" }}
                  onClick={() => setSelected(s)}
                >
                  Summary
                </button>
                <button
                  type="button"
                  className="btn-og"
                  style={{ fontSize:12, padding:"7px 14px" }}
                  onClick={() => onOpenStudentReports?.(s.id)}
                >
                  <Ic icon={Eye} size={13} />View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Student detail modal */}
      {selected && (
        <div className="mo" onClick={() => setSelected(null)}>
          <div className="mb" onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <p style={{ fontSize:16, fontWeight:800, color:"#111827" }}>{selected.name}</p>
              <button style={{ background:"none", border:"none", cursor:"pointer", color:"#6b7280" }} onClick={() => setSelected(null)}><Ic icon={X} size={18} /></button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {[
                ["Student ID", selected.studentId],
                ["Department", selected.dept],
                ["Level",      selected.level],
                ["Company",    selected.company],
                ["Location",   selected.location],
                ["Status",     selected.started ? "Active" : "Not Started"],
              ].map(([l, v]) => (
                <div key={l} style={{ background:"#f9fafb", borderRadius:10, padding:"10px 12px" }}>
                  <p style={{ fontSize:10, color:"#9ca3af", marginBottom:3, textTransform:"uppercase", letterSpacing:".05em", fontWeight:700 }}>{l}</p>
                  <p style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-g" style={{ flex:1 }} onClick={() => setSelected(null)}>Close</button>
              <button
                type="button"
                className="btn-p"
                style={{ flex:2 }}
                onClick={() => {
                  const id = selected?.id;
                  setSelected(null);
                  if (id) onOpenStudentReports?.(id);
                }}
              >
                <Ic icon={FileText} size={14} />View Their Reports
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   REPORTS PAGE
════════════════════════════════════════════════════════════════ */
const ReportsPage = ({ onNavigate, showToast, reports, onRefreshReports }) => {
  const { authFetch } = useAuth();
  const [filter,   setFilter]   = useState("all");
  const [feedback, setFeedback] = useState({});
  const [expanded, setExpanded] = useState(null);

  const filtered = reports.filter((r) => (filter === "all" ? true : r.status === filter));

  const submitFeedback = async (reportId) => {
    const fb = feedback[reportId]?.trim();
    if (!fb) { showToast("Please write feedback before submitting.", "error"); return; }
    try {
      await authFetch(`/reports/${reportId}/review`, {
        method: "PUT",
        body: JSON.stringify({ feedback: fb }),
      });
      showToast("Feedback submitted!");
      setExpanded(null);
      await onRefreshReports?.();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => onNavigate("home")}><Ic icon={ArrowLeft} size={14} />Back to Dashboard</button>
      <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", marginBottom:4 }}>Student Reports</h1>
      <p style={{ fontSize:14, color:"#6b7280", marginBottom:24 }}>Review and give feedback on submitted reports</p>
      <div style={{ height:1, background:"#e5e7eb", marginBottom:24 }} />

      {/* Filter pills */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {[["all","All Reports"],["pending","Pending"],["reviewed","Reviewed"]].map(([v, l]) => (
          <button key={v} className={`fpill${filter === v ? " active" : ""}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {filtered.length === 0
        ? <div className="empty"><Ic icon={FileText} size={28} color="#9ca3af" /><p style={{ marginTop:12, fontWeight:700, color:"#374151" }}>No reports found</p></div>
        : filtered.map((r, i) => (
          <div key={r.id} className="card fade-up" style={{ marginBottom:12, animationDelay:`${i*.05}s` }}>
            <div className="card-body" style={{ padding:"20px" }}>
              {/* Header */}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:12, flexWrap:"wrap" }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                    <p style={{ fontSize:15, fontWeight:700, color:"#111827" }}>{r.studentName}</p>
                    <span className={`badge ${r.type === "weekly" ? "bbl" : "bdk"}`}>{r.type}</span>
                    <span className={`badge ${r.status === "reviewed" ? "bg" : "ba"}`}>
                      <Ic icon={r.status === "reviewed" ? CheckCircle : Clock} size={10} />
                      {r.status}
                    </span>
                  </div>
                  <p style={{ fontSize:12, color:"#9ca3af" }}>{r.date}</p>
                </div>
                {r.status === "pending" && (
                  <button className="btn-og" style={{ fontSize:12, padding:"6px 14px" }} onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                    <Ic icon={MessageSquare} size={13} />{expanded === r.id ? "Cancel" : "Give Feedback"}
                  </button>
                )}
              </div>

              {/* Report content */}
              <p style={{ fontSize:13, color:"#374151", lineHeight:1.65, marginBottom: r.feedback || expanded === r.id ? 12 : 0 }}>{r.content}</p>

              {/* Existing feedback */}
              {r.feedback && (
                <div style={{ background:"#eff6ff", borderRadius:8, padding:"12px 14px" }}>
                  <p style={{ fontSize:12, fontWeight:700, color:"#1d4ed8", marginBottom:4 }}>Your Feedback:</p>
                  <p style={{ fontSize:13, color:"#1e40af" }}>{r.feedback}</p>
                </div>
              )}

              {/* Feedback input */}
              {expanded === r.id && (
                <div style={{ marginTop:12 }}>
                  <label className="fl">Your Feedback</label>
                  <textarea
                    className="fi"
                    rows={3}
                    style={{ resize:"vertical" }}
                    placeholder="Write your feedback and comments here…"
                    value={feedback[r.id] || ""}
                    onChange={e => setFeedback(prev => ({ ...prev, [r.id]: e.target.value }))}
                  />
                  <button className="btn-p" style={{ marginTop:10, width:"100%" }} onClick={() => submitFeedback(r.id)}>
                    <Ic icon={Check} size={14} />Submit Feedback
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      }
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   EVALUATIONS PAGE — workplace supervisor reports about students
════════════════════════════════════════════════════════════════ */
const EvaluationsPage = ({ onNavigate, showToast, evaluations }) => {
  const [selected, setSelected] = useState(null);
  const ratingLabels = { 1:"Poor", 2:"Below Avg", 3:"Average", 4:"Good", 5:"Excellent" };
  const ratingColors = { 1:"#d32f2f", 2:"#f97316", 3:"#f9a825", 4:"#388e3c", 5:"#15653a" };

  return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => onNavigate("home")}><Ic icon={ArrowLeft} size={14} />Back to Dashboard</button>
      <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", marginBottom:4 }}>Workplace Evaluations</h1>
      <p style={{ fontSize:14, color:"#6b7280", marginBottom:24 }}>Reports submitted by workplace supervisors about your students</p>
      <div style={{ height:1, background:"#e5e7eb", marginBottom:24 }} />

      {evaluations.length === 0
        ? <div className="empty"><Ic icon={Star} size={28} color="#9ca3af" /><p style={{ marginTop:12, fontWeight:700, color:"#374151" }}>No evaluations yet</p></div>
        : evaluations.map((ev, i) => (
          <div key={ev.id} className="card fade-up" style={{ marginBottom:12, animationDelay:`${i*.05}s` }}>
            <div className="card-body">
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                    <p style={{ fontSize:15, fontWeight:700, color:"#111827" }}>{ev.studentName}</p>
                    <span className="badge bdk" style={{ fontSize:10 }}>
                      {ev.rating}/5 — {ratingLabels[ev.rating]}
                    </span>
                  </div>
                  <p style={{ fontSize:12, color:"#6b7280", marginBottom:8 }}>{ev.company} · {ev.period}</p>

                  {/* Star rating */}
                  <div style={{ display:"flex", gap:2, marginBottom:10 }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ fontSize:16, color: s <= ev.rating ? "#f9a825" : "#e5e7eb" }}>★</span>
                    ))}
                    <span style={{ fontSize:12, fontWeight:700, color:ratingColors[ev.rating], marginLeft:6, alignSelf:"center" }}>
                      {ratingLabels[ev.rating]}
                    </span>
                  </div>

                  <p style={{ fontSize:13, color:"#374151", lineHeight:1.6 }}>{ev.performance}</p>
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
                  <button className="btn-og" style={{ fontSize:12, padding:"7px 14px" }} onClick={() => setSelected(ev)}>
                    <Ic icon={Eye} size={13} />Full Report
                  </button>
                  <button className="btn-g" style={{ fontSize:12, padding:"7px 14px" }} onClick={() => showToast("Evaluation downloaded!")}>
                    <Ic icon={Download} size={13} />Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      }

      {/* Full report modal */}
      {selected && (
        <div className="mo" onClick={() => setSelected(null)}>
          <div className="mb" onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <p style={{ fontSize:16, fontWeight:800, color:"#111827" }}>Full Evaluation — {selected.studentName}</p>
              <button style={{ background:"none", border:"none", cursor:"pointer", color:"#6b7280" }} onClick={() => setSelected(null)}><Ic icon={X} size={18} /></button>
            </div>
            <div style={{ background:"#f9fafb", borderRadius:10, padding:16, marginBottom:16 }}>
              {[
                ["Company",        selected.company],
                ["Period",         selected.period],
                ["Rating",         `${selected.rating}/5 — ${ratingLabels[selected.rating]}`],
                ["Performance",    selected.performance],
                ["Recommendation", selected.recommendation],
              ].map(([l, v]) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f3f4f6" }}>
                  <span style={{ fontSize:12, color:"#6b7280", fontWeight:600 }}>{l}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:"#111827", maxWidth:"60%", textAlign:"right" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-g" style={{ flex:1 }} onClick={() => setSelected(null)}>Close</button>
              <button className="btn-p" style={{ flex:2 }} onClick={() => { showToast("Evaluation downloaded!"); setSelected(null); }}>
                <Ic icon={Download} size={14} />Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════════════════ */
export default function AcademicSupervisorDashboard() {
  const { user, logout, authFetch } = useAuth();
  const navigate = useNavigate();
  const [page, setPage]   = useState("home");
  const [gToast, showToast] = useToast();
  const [rawStudents, setRawStudents] = useState([]);
  const [rawReports, setRawReports] = useState([]);
  const [rawEvaluations, setRawEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [st, rep, ev] = await Promise.all([
        authFetch("/academic-supervisor/students"),
        authFetch("/academic-supervisor/reports"),
        authFetch("/academic-supervisor/evaluations"),
      ]);
      setRawStudents(st.students || []);
      setRawReports(rep.reports || []);
      setRawEvaluations(ev.evaluations || []);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [authFetch, showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const studentUserId = (s) => s.user?._id || s.user;

  const students = rawStudents.map((s) => {
    const uid = studentUserId(s);
    const rs = rawReports.filter(
      (r) => String(r.student?._id || r.student) === String(uid)
    );
    return {
      id: uid,
      name: s.user?.name || "—",
      studentId: s.studentId || "—",
      dept: s.department || "—",
      level: s.level || "—",
      company: s.companyName || "Not set",
      location: s.companyLocation || "—",
      started: !!s.internshipStarted,
      reports: rs.length,
      pending: rs.filter((r) => r.status === "pending").length,
      evaluationRating: null,
    };
  });

  const reports = rawReports.map((r) => ({
    id: r._id,
    studentId: String(r.student?._id || r.student),
    studentName: r.student?.name || "—",
    type: r.reportType,
    content: r.content,
    date: new Date(r.createdAt).toLocaleDateString(),
    status: r.status,
    feedback: r.feedback || "",
  }));

  const evaluations = rawEvaluations.map((ev) => ({
    id: ev._id,
    studentName: ev.student?.name || "—",
    studentId: "—",
    company: "—",
    rating: ev.rating,
    period: ev.period || "—",
    updatedAt: new Date(ev.updatedAt).toLocaleDateString(),
    performance: ev.performance || "—",
    recommendation: ev.recommendation || "—",
  }));

  const handleLogout = () => { logout?.(); navigate("/login"); };
  const openStudentReports = (studentUserId) => {
    if (!studentUserId) return;
    navigate(`/view-reports?studentId=${encodeURIComponent(studentUserId)}`);
  };
  const displayName  = user?.name || "Supervisor";
  const initials     = displayName.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();

  return (
    <>
      <style>{css}</style>
      <div className="app-shell">
        {gToast && <ToastEl key={gToast.key} msg={gToast.msg} type={gToast.type} />}

        {/* Navbar */}
        <nav className="topnav">
          <div className="topnav-brand">
            <div style={{ width:32, height:32, borderRadius:8, background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Ic icon={GraduationCap} size={17} color="#fff" />
            </div>
            <div>
              <p className="topnav-logo">Supervisor Dashboard</p>
              <p className="topnav-sub">IMS Portal</p>
            </div>
          </div>
          <div className="topnav-right">
            <div className="user-pill">
              <div className="user-avatar">{initials}</div>
              <span className="user-name">{displayName}</span>
            </div>
            <button className="topnav-logout" onClick={handleLogout}>
              <Ic icon={LogOut} size={14} color="#fff" /><span className="lbl">Logout</span>
            </button>
          </div>
        </nav>

        <div className="page-wrap">
          {page === "home"        && <HomePage user={user} onNavigate={setPage} showToast={showToast} students={students} reports={reports} loading={loading} />}
          {page === "students"    && <StudentsPage onNavigate={setPage} showToast={showToast} students={students} onOpenStudentReports={openStudentReports} />}
          {page === "reports"     && <ReportsPage onNavigate={setPage} showToast={showToast} reports={reports} onRefreshReports={loadData} />}
          {page === "evaluations" && <EvaluationsPage onNavigate={setPage} showToast={showToast} evaluations={evaluations} />}
        </div>
      </div>
    </>
  );
}
