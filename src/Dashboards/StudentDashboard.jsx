import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import {
  Briefcase, FileText, Clock, Download, LogOut, CheckCircle,
  ChevronRight, ArrowLeft, Search, MapPin, Calendar, Upload,
  Eye, Plus, X, Check, AlertCircle, User, Edit3,
  TrendingUp, Award, Star, BookOpen, Zap,
  Building2, GraduationCap, Hash, Phone, ChevronDown
} from "lucide-react";

const API = API_BASE_URL;

/* ════════════════════════════════════════════════════════════════════
   CSS
════════════════════════════════════════════════════════════════════ */
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

  @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }

  .fade-in { animation:fadeIn  .25s ease both; }
  .fade-up { animation:fadeUp  .3s  ease both; }
  .fade-1  { animation:fadeUp  .3s .05s ease both; }
  .fade-2  { animation:fadeUp  .3s .10s ease both; }
  .fade-3  { animation:fadeUp  .3s .15s ease both; }
  .fade-4  { animation:fadeUp  .3s .20s ease both; }

  /* ── Shell ── */
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
    display:flex; align-items:center; gap:9px;
    padding:5px 14px 5px 6px;
    background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.14);
    border-radius:99px; cursor:default;
  }
  .user-avatar {
    width:30px; height:30px; border-radius:50%;
    background:var(--green-mid); border:2px solid rgba(255,255,255,.28);
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:700; color:#fff; flex-shrink:0;
  }
  .user-name { font-size:13px; font-weight:600; color:#fff; }

  .topnav-logout {
    display:flex; align-items:center; gap:6px;
    padding:7px 14px; border:1.5px solid rgba(255,255,255,.2);
    border-radius:8px; background:transparent; color:#fff;
    font-family:'Inter',sans-serif; font-size:13px; font-weight:500;
    cursor:pointer; transition:background .15s;
  }
  .topnav-logout:hover { background:rgba(255,255,255,.1); }

  /* ── Page wrap ── */
  .page-wrap { max-width:880px; margin:0 auto; padding:28px 20px 60px; }

  /* ── Wizard ── */
  .wizard-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.52);
    backdrop-filter:blur(7px);
    display:flex; align-items:center; justify-content:center;
    z-index:9000; padding:20px;
    animation:fadeIn .2s ease both;
  }
  .wizard-box {
    background:#fff; border-radius:22px; width:100%;
    max-width:520px; padding:36px;
    box-shadow:0 32px 80px rgba(0,0,0,.25);
    animation:slideUp .3s ease both;
    max-height:92vh; overflow-y:auto;
  }
  .wiz-bar { display:flex; gap:6px; margin-bottom:28px; }
  .wiz-seg { flex:1; height:4px; border-radius:99px; background:#e5e7eb; transition:background .3s; }
  .wiz-seg.on { background:var(--green-btn); }

  /* ── Cards ── */
  .card { background:#fff; border-radius:14px; border:1px solid var(--border); transition:box-shadow .2s; }
  .card:hover { box-shadow:0 4px 20px rgba(0,0,0,.07); }
  .card-body  { padding:24px; }
  .card-title { font-size:15px; font-weight:700; color:var(--text-dark); margin-bottom:18px; }

  /* ── Grids ── */
  .info-grid   { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .stat-chips  { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .nav-shortcuts { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }

  .info-label { font-size:11px; color:var(--text-light); margin-bottom:4px; text-transform:uppercase; letter-spacing:.05em; }
  .info-value { font-size:14px; font-weight:600; color:var(--text-dark); }
  .info-value.empty { color:var(--text-xl); font-style:italic; font-weight:400; }

  .stat-chip     { background:#f9fafb; border:1px solid var(--border); border-radius:12px; padding:14px 16px; text-align:center; }
  .stat-chip-val { font-size:22px; font-weight:800; color:var(--green-btn); }
  .stat-chip-lbl { font-size:11px; color:var(--text-light); margin-top:3px; }

  /* ── Shortcut cards ── */
  .shortcut-card {
    background:#fff; border:1px solid var(--border); border-radius:14px; padding:20px;
    cursor:pointer; display:flex; align-items:center; gap:14px;
    transition:box-shadow .2s, transform .15s, border-color .15s;
  }
  .shortcut-card:hover { box-shadow:0 6px 22px rgba(0,0,0,.09); transform:translateY(-2px); border-color:#d1d5db; }
  .shortcut-icon { width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .shortcut-label { font-size:11px; color:var(--text-light); margin-bottom:2px; }
  .shortcut-name  { font-size:15px; font-weight:700; color:var(--text-dark); }
  .sc-badge { margin-left:auto; background:#ef4444; color:#fff; border-radius:99px; font-size:10px; font-weight:700; padding:2px 7px; flex-shrink:0; }

  /* ── Prog bar ── */
  .prog-track { height:8px; background:#e5e7eb; border-radius:99px; overflow:hidden; }
  .prog-fill  { height:100%; border-radius:99px; background:linear-gradient(90deg,#15653a,#22c55e); transition:width .8s cubic-bezier(.4,0,.2,1); }

  /* ── Badges ── */
  .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; }
  .bg    { background:#dcfce7; color:#15803d; }
  .ba    { background:#fef9c3; color:#a16207; }
  .br    { background:#fee2e2; color:#b91c1c; }
  .bgr   { background:#f1f5f9; color:#64748b; }
  .bbl   { background:#dbeafe; color:#1d4ed8; }
  .bdk   { background:#15653a; color:#fff;    }

  /* ── Buttons ── */
  .btn-p {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    padding:10px 20px; background:var(--green-btn); color:#fff;
    border:none; border-radius:9px;
    font-family:'Inter',sans-serif; font-size:14px; font-weight:600;
    cursor:pointer; transition:background .15s, transform .1s;
  }
  .btn-p:hover { background:#0f4d2c; transform:translateY(-1px); }
  .btn-p:disabled { opacity:.5; cursor:not-allowed; transform:none; }

  .btn-g {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    padding:9px 16px; background:#f3f4f6; color:var(--text-mid);
    border:1px solid var(--border); border-radius:9px;
    font-family:'Inter',sans-serif; font-size:14px; font-weight:500;
    cursor:pointer; transition:background .15s;
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

  .btn-ic {
    display:inline-flex; align-items:center; justify-content:center;
    width:34px; height:34px; border-radius:8px;
    background:#f3f4f6; border:1px solid var(--border);
    cursor:pointer; transition:background .15s; flex-shrink:0;
  }
  .btn-ic:hover { background:#e5e7eb; }

  /* ── Back ── */
  .back-btn {
    display:inline-flex; align-items:center; gap:6px;
    padding:8px 14px; background:rgba(255,255,255,.8);
    border:1px solid var(--border); border-radius:8px;
    font-family:'Inter',sans-serif; font-size:13px; font-weight:500;
    color:var(--text-mid); cursor:pointer; margin-bottom:20px; transition:background .15s;
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
  .fs {
    width:100%; padding:11px 36px 11px 14px; border:1px solid var(--border); border-radius:9px;
    font-family:'Inter',sans-serif; font-size:14px; color:var(--text-dark);
    background:#fafafa; outline:none; appearance:none; cursor:pointer;
    transition:border-color .15s, box-shadow .15s;
  }
  .fs:focus { border-color:var(--green-btn); box-shadow:0 0 0 3px rgba(21,101,58,.1); background:#fff; }
  .sw { position:relative; }
  .sw svg { position:absolute; right:12px; top:50%; transform:translateY(-50%); pointer-events:none; }
  .fg { margin-bottom:18px; }
  .frow { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

  /* ── Opp cards ── */
  .opp-card {
    background:#fff; border:1px solid var(--border); border-radius:12px; padding:18px;
    display:flex; align-items:flex-start; gap:14px; cursor:pointer; margin-bottom:12px;
    transition:box-shadow .2s, border-color .15s, transform .15s;
  }
  .opp-card:hover { box-shadow:0 6px 22px rgba(0,0,0,.09); border-color:#d1d5db; transform:translateY(-1px); }
  .opp-logo {
    width:48px; height:48px; border-radius:12px; background:#f3f4f6; border:1px solid var(--border);
    display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:800; font-size:13px;
  }
  .opp-tag { font-size:11px; color:var(--text-light); display:flex; align-items:center; gap:4px; }

  /* ── Report rows ── */
  .report-row { display:flex; align-items:center; padding:15px 0; border-bottom:1px solid #f3f4f6; gap:12px; }
  .report-row:last-child { border-bottom:none; }
  .rw { width:38px; height:38px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; }

  /* ── Timeline ── */
  .timeline { display:flex; flex-direction:column; }
  .tl-step  { display:flex; gap:16px; padding-bottom:26px; position:relative; }
  .tl-step:last-child { padding-bottom:0; }
  .tl-line  { position:absolute; left:14px; top:30px; bottom:0; width:2px; background:#e5e7eb; }
  .tl-line.done { background:var(--green-btn); }
  .tl-dot  { width:30px; height:30px; border-radius:50%; flex-shrink:0; z-index:1; display:flex; align-items:center; justify-content:center; border:2px solid #e5e7eb; background:#fff; }
  .tl-dot.done   { border-color:var(--green-btn); background:var(--green-btn); }
  .tl-dot.active { border-color:var(--green-btn); background:#fff; }

  /* ── Misc ── */
  .divider { height:1px; background:var(--border); margin:18px 0; }
  .section-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px; }

  /* ── Search ── */
  .sw-search { position:relative; margin-bottom:16px; }
  .sw-search svg { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#9ca3af; }
  .s-input {
    width:100%; padding:11px 14px 11px 40px; border:1px solid var(--border); border-radius:10px;
    font-family:'Inter',sans-serif; font-size:14px; color:var(--text-dark);
    background:#fff; outline:none; transition:border-color .15s, box-shadow .15s;
  }
  .s-input:focus { border-color:var(--green-btn); box-shadow:0 0 0 3px rgba(21,101,58,.1); }

  /* ── Filter pills ── */
  .fpill {
    padding:6px 14px; border-radius:99px; border:1px solid var(--border); background:#fff;
    font-family:'Inter',sans-serif; font-size:12px; font-weight:600; color:var(--text-light);
    cursor:pointer; transition:all .15s;
  }
  .fpill:hover  { border-color:var(--green-btn); color:var(--green-btn); background:#f0fdf4; }
  .fpill.active { background:var(--green-btn); color:#fff; border-color:var(--green-btn); }

  /* ── Empty state ── */
  .empty { text-align:center; padding:48px 24px; background:#f9fafb; border:1px dashed #d1d5db; border-radius:14px; }

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
    position:fixed !important; top:24px !important; right:24px !important;
    left:auto !important; bottom:auto !important;
    z-index:99999; border-radius:10px !important;
    padding:13px 20px;
    font-family:'Inter',sans-serif; font-size:14px; font-weight:600;
    display:flex; align-items:center; gap:9px;
    box-shadow:0 10px 30px rgba(0,0,0,.2); animation:fadeUp .25s ease both;
    max-width:340px; width:max-content;
  }
  .ts { background:#15653a; color:#fff; }
  .te { background:#ef4444; color:#fff; }

  /* ══════════ RESPONSIVE ══════════ */
  @media (max-width:900px) {
    .page-wrap { max-width:100%; padding:22px 18px 48px; }
    .status-sg { grid-template-columns:repeat(2,1fr) !important; }
    .opp-grid  { grid-template-columns:repeat(2,1fr) !important; }
  }
  @media (max-width:768px) {
    .topnav { padding:0 16px; height:52px; }
    .topnav-sub { display:none; }
    .topnav-logo { font-size:14px; }
    .user-name { display:none; }
    .topnav-logout span.lbl { display:none; }
    .topnav-logout { padding:7px 10px; }
    .page-wrap { padding:16px 14px 48px; }
    .card-body { padding:18px; }
    .info-grid { grid-template-columns:repeat(2,1fr); gap:16px; }
    .nav-shortcuts { gap:10px; }
    .shortcut-card { padding:14px; gap:10px; }
    .shortcut-name { font-size:13px; }
    .shortcut-icon { width:40px; height:40px; }
    .frow { grid-template-columns:1fr; }
    .mb { padding:22px; max-width:96vw; }
    .mbr { flex-direction:column !important; }
    .mbr button { width:100% !important; }
    .opp-grid     { grid-template-columns:1fr !important; }
    .rep-two-col  { grid-template-columns:1fr !important; }
  }
  @media (max-width:540px) {
    .info-grid { grid-template-columns:1fr; }
    .nav-shortcuts { grid-template-columns:1fr; }
    .stat-chips { grid-template-columns:repeat(3,1fr); gap:8px; }
    .stat-chip-val { font-size:18px; }
    .status-sg { grid-template-columns:1fr !important; }
    .wizard-box { padding:22px; }
  }
  @media (max-width:380px) {
    .topnav-logo { font-size:13px; }
    .page-wrap { padding:12px 10px 40px; }
    .card-body { padding:14px; }
    .shortcut-card { padding:12px; gap:8px; }
    .mb { padding:16px; }
    .btn-p,.btn-g { font-size:13px; padding:9px 14px; }
  }
`;

/* ── Helpers ─────────────────────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
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

/* ── Data ────────────────────────────────────────────────────── */
const DEPTS  = ["Computer Science","Electrical Engineering","Mechanical Engineering","Civil Engineering","Information Technology","Accounting","Business Administration","Mass Communication","Architecture","Medicine & Surgery","Law","Economics","Mathematics","Physics"];
const LEVELS = ["100 Level","200 Level","300 Level","400 Level","500 Level","Postgraduate"];

const OPPS = [
  { id:1, role:"Software Engineering Intern",  company:"Google Nigeria",    loc:"Lagos, Nigeria",  type:"On-site", dur:"3 months", logo:"GN", col:"#4285f4", pay:"₦150k/mo", ddl:"Nov 15, 2024", desc:"Join Google's engineering team to build scalable systems and work on real user-facing products alongside senior engineers.",    skills:["React","Node.js","Python"]       },
  { id:2, role:"Data Analyst Intern",          company:"Access Bank Plc",   loc:"Abuja, Nigeria",  type:"Hybrid",  dur:"6 months", logo:"AB", col:"#e63946", pay:"₦80k/mo",  ddl:"Nov 30, 2024", desc:"Analyse financial data, build dashboards, and present insights to senior management in one of Nigeria's largest banks.",       skills:["SQL","Excel","Power BI"]         },
  { id:3, role:"UI/UX Design Intern",          company:"Flutterwave",       loc:"Remote",          type:"Remote",  dur:"4 months", logo:"FW", col:"#f97316", pay:"₦100k/mo", ddl:"Dec 5, 2024",  desc:"Design beautiful fintech products used by millions across Africa. Work directly with the product and engineering teams.",       skills:["Figma","Prototyping","Research"]  },
  { id:4, role:"Cybersecurity Intern",         company:"Interswitch Group", loc:"Lagos, Nigeria",  type:"On-site", dur:"3 months", logo:"IG", col:"#7c3aed", pay:"₦90k/mo",  ddl:"Nov 20, 2024", desc:"Help protect critical financial infrastructure. Conduct vulnerability assessments and respond to incidents.",                  skills:["Linux","Networking","SIEM"]       },
  { id:5, role:"Backend Developer Intern",     company:"Paystack",          loc:"Lagos, Nigeria",  type:"On-site", dur:"6 months", logo:"PS", col:"#0284c7", pay:"₦120k/mo", ddl:"Dec 1, 2024",  desc:"Build the APIs that power payments for thousands of businesses. Deep-dive into Go, distributed systems, and payment protocols.", skills:["Go","PostgreSQL","Redis"]         },
  { id:6, role:"Product Management Intern",    company:"Kuda Bank",         loc:"Lagos, Nigeria",  type:"Hybrid",  dur:"3 months", logo:"KB", col:"#059669", pay:"₦85k/mo",  ddl:"Nov 25, 2024", desc:"Shape the roadmap of a leading neobank. Work on user research, define features, and coordinate between design and engineering.", skills:["Analytics","Jira","Research"]     },
];

const INIT_REPORTS = [
  { id:1, week:1, title:"Orientation & Environment Setup",  summary:"Completed company orientation, set up dev environment, met team members and understood project scope.",                 hours:40, submitted:"Sep 9, 2024",  status:"approved", feedback:"Great start! Clear and concise."   },
  { id:2, week:2, title:"Frontend Component Development",   summary:"Built reusable UI components using React, implemented responsive layouts, and participated in daily standups.",         hours:40, submitted:"Sep 16, 2024", status:"approved", feedback:"Well documented."                  },
  { id:3, week:3, title:"API Integration",                  summary:"Integrated backend REST APIs into the frontend, handled authentication flows, and wrote unit tests.",                    hours:38, submitted:"Sep 23, 2024", status:"approved", feedback:"Good work on error handling."       },
  { id:4, week:4, title:"Code Review & Bug Fixes",          summary:"Participated in code reviews, resolved critical bugs reported in production, improved test coverage to 80%.",           hours:40, submitted:"Sep 30, 2024", status:"pending",  feedback:""                                  },
  { id:5, week:5, title:"", summary:"", hours:40, submitted:"", status:"draft", feedback:"" },
  { id:6, week:6, title:"", summary:"", hours:40, submitted:"", status:"draft", feedback:"" },
];

/* ════════════════════════════════════════════════════════════════════
   PROFILE SETUP WIZARD
════════════════════════════════════════════════════════════════════ */
const ProfileWizard = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const TOTAL = 3;
  const [f, setF] = useState({ studentId:"", dept:"", level:"", phone:"", state:"", supervisor:"" });
  const up = (k, v) => setF(p => ({ ...p, [k]: v }));

  const canNext = () => {
    if (step === 1) return f.studentId.trim() && f.dept && f.level;
    if (step === 2) return f.phone.trim() && f.state.trim();
    return true;
  };

  const next = () => step < TOTAL ? setStep(s => s + 1) : onComplete(f);

  const rows = [
    ["Full Name",  user?.name  || "—"],
    ["Email",      user?.email || "—"],
    ["Student ID", f.studentId],
    ["Department", f.dept],
    ["Level",      f.level],
    ["Phone",      f.phone],
    ["State",      f.state],
    ...(f.supervisor ? [["Supervisor", f.supervisor]] : []),
  ];

  return (
    <div className="wizard-overlay">
      <div className="wizard-box">
        <div className="wiz-bar">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} className={`wiz-seg${i < step ? " on" : ""}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="fade-up">
            <p style={{ fontSize:11, fontWeight:700, color:"#15653a", textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>Step 1 of 3</p>
            <h2 style={{ fontSize:22, fontWeight:800, color:"#111827", marginBottom:6 }}>Academic Details</h2>
            <p style={{ fontSize:14, color:"#6b7280", marginBottom:24 }}>Hi <strong style={{ color:"#15653a" }}>{user?.name || "there"}</strong>! Let's complete your student profile.</p>
            <div className="fg"><label className="fl">Student ID *</label><input className="fi" placeholder="e.g. 21674652" value={f.studentId} onChange={e => up("studentId", e.target.value)} /></div>
            <div className="fg"><label className="fl">Department *</label><div className="sw"><select className="fs" value={f.dept} onChange={e => up("dept", e.target.value)}><option value="">Select department…</option>{DEPTS.map(d => <option key={d} value={d}>{d}</option>)}</select><Ic icon={ChevronDown} size={15} color="#9ca3af" /></div></div>
            <div className="fg"><label className="fl">Level *</label><div className="sw"><select className="fs" value={f.level} onChange={e => up("level", e.target.value)}><option value="">Select level…</option>{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select><Ic icon={ChevronDown} size={15} color="#9ca3af" /></div></div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up">
            <p style={{ fontSize:11, fontWeight:700, color:"#15653a", textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>Step 2 of 3</p>
            <h2 style={{ fontSize:22, fontWeight:800, color:"#111827", marginBottom:6 }}>Contact Details</h2>
            <p style={{ fontSize:14, color:"#6b7280", marginBottom:24 }}>How can your supervisors reach you?</p>
            <div className="fg"><label className="fl">Phone Number *</label><input className="fi" placeholder="e.g. 0201 234 5678" value={f.phone} onChange={e => up("phone", e.target.value)} /></div>
            <div className="fg"><label className="fl">State of Origin *</label><input className="fi" placeholder="e.g. Kumasi" value={f.state} onChange={e => up("state", e.target.value)} /></div>
            <div className="fg"><label className="fl">Academic Supervisor (optional)</label><input className="fi" placeholder="e.g. Dr. Linda Amoako Banning" value={f.supervisor} onChange={e => up("supervisor", e.target.value)} /></div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-up">
            <p style={{ fontSize:11, fontWeight:700, color:"#15653a", textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>Step 3 of 3</p>
            <h2 style={{ fontSize:22, fontWeight:800, color:"#111827", marginBottom:6 }}>Review & Confirm</h2>
            <p style={{ fontSize:14, color:"#6b7280", marginBottom:20 }}>Make sure everything looks right.</p>
            <div style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:12, padding:20, marginBottom:20 }}>
              {rows.map(([l, v]) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:"1px solid #f3f4f6" }}>
                  <span style={{ fontSize:13, color:"#6b7280" }}>{l}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:"#111827", textAlign:"right", maxWidth:"60%" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mbr" style={{ display:"flex", gap:10, marginTop:8 }}>
          {step > 1 && <button className="btn-g" style={{ flex:1 }} onClick={() => setStep(s => s - 1)}>Back</button>}
          <button className="btn-p" style={{ flex:2 }} disabled={!canNext()} onClick={canNext() ? next : undefined}>
            {step === TOTAL ? "Complete Setup" : "Continue"} <Ic icon={ChevronRight} size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════════════════════ */
const HomePage = ({ user, profile, onNavigate, internshipStarted, onToggleInternshipStart, onSaveStudentProfile, reports, appliedCount, showToast }) => {
  const submitted  = reports.filter(r => r.status !== "draft").length;
  const approved   = reports.filter(r => r.status === "approved").length;
  const pending    = reports.filter(r => r.status === "pending").length;
  const initials   = (user?.name || "ST").split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  return (
    <div className="fade-in">

      {/* Welcome banner */}
      <div style={{ background:"linear-gradient(135deg,#0d3b2e,#1a5c45)", borderRadius:16, padding:"22px 26px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <p style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>Welcome back</p>
          <h2 style={{ fontSize:22, fontWeight:800, color:"#fff" }}>{user?.name || "Student"} 👋</h2>
          <p style={{ fontSize:13, color:"rgba(255,255,255,.55)", marginTop:4 }}>{profile.dept} · {profile.level}</p>
        </div>
        <div style={{ width:54, height:54, borderRadius:"50%", background:"rgba(255,255,255,.15)", border:"2px solid rgba(255,255,255,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:"#fff", flexShrink:0 }}>
          {initials}
        </div>
      </div>

      {/* Stats */}
      <div className="stat-chips fade-1" style={{ marginBottom:16 }}>
        <div className="stat-chip"><p className="stat-chip-val">{submitted}</p><p className="stat-chip-lbl">Reports Submitted</p></div>
        <div className="stat-chip"><p className="stat-chip-val">{approved}</p><p className="stat-chip-lbl">Approved</p></div>
        <div className="stat-chip"><p className="stat-chip-val">{appliedCount}</p><p className="stat-chip-lbl">Jobs Applied</p></div>
      </div>

      {/* Student Info */}
      <div className="card fade-2" style={{ marginBottom:16 }}>
        <div className="card-body">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <p className="card-title" style={{ margin:0 }}>Student Information</p>
            <button
              className="btn-ic"
              title="Edit"
              onClick={() => setIsEditing((v) => !v)}
            >
              <Ic icon={Edit3} size={14} color="#6b7280" />
            </button>
          </div>
          {isEditing ? (
            <>
              <div className="frow">
                <div className="fg">
                  <label className="fl">Student ID</label>
                  <input className="fi" value={draft.studentId || ""} onChange={(e) => setDraft((p) => ({ ...p, studentId: e.target.value }))} />
                </div>
                <div className="fg">
                  <label className="fl">Department</label>
                  <input className="fi" value={draft.dept || ""} onChange={(e) => setDraft((p) => ({ ...p, dept: e.target.value }))} />
                </div>
              </div>
              <div className="frow">
                <div className="fg">
                  <label className="fl">Level</label>
                  <input className="fi" value={draft.level || ""} onChange={(e) => setDraft((p) => ({ ...p, level: e.target.value }))} />
                </div>
                <div className="fg">
                  <label className="fl">Phone</label>
                  <input className="fi" value={draft.phone || ""} onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div className="fg">
                <label className="fl">Company</label>
                <input className="fi" value={draft.company || ""} onChange={(e) => setDraft((p) => ({ ...p, company: e.target.value }))} />
              </div>
              <div className="fg">
                <label className="fl">Location / State of Origin</label>
                <input className="fi" value={draft.state || ""} onChange={(e) => setDraft((p) => ({ ...p, state: e.target.value }))} />
              </div>
              <div className="fg">
                <label className="fl">Academic Supervisor Name (optional)</label>
                <input className="fi" value={draft.supervisor || ""} onChange={(e) => setDraft((p) => ({ ...p, supervisor: e.target.value }))} />
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-g" onClick={() => { setDraft(profile); setIsEditing(false); }}>Cancel</button>
                <button
                  className="btn-p"
                  onClick={async () => {
                    const ok = await onSaveStudentProfile(draft);
                    if (ok) setIsEditing(false);
                  }}
                >
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <div className="info-grid">
              {[
                ["Student ID",  profile.studentId ],
                ["Department",  profile.dept      ],
                ["Level",       profile.level     ],
                ["Phone",       profile.phone     ],
                ["Company",     profile.company   ],
                ["Location",    profile.state     ],
                ["Email",       user?.email       ],
                ["Supervisor",  profile.supervisor],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="info-label">{l}</p>
                  <p className={`info-value${!v ? " empty" : ""}`}>{v || "Not set"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Shortcuts */}
      <div className="nav-shortcuts fade-3" style={{ marginBottom:16 }}>
        <div className="shortcut-card" onClick={() => onNavigate("opps")}>
          <div className="shortcut-icon" style={{ background:"#eff6ff" }}><Ic icon={Briefcase} size={22} color="#3b82f6" /></div>
          <div style={{ flex:1 }}>
            <p className="shortcut-label">Browse</p>
            <p className="shortcut-name">Opportunities</p>
          </div>
          {appliedCount > 0 && <span className="sc-badge">{appliedCount}</span>}
        </div>
        <div className="shortcut-card" onClick={() => onNavigate("reports")}>
          <div className="shortcut-icon" style={{ background:"#f0fdf4" }}><Ic icon={FileText} size={22} color="#16a34a" /></div>
          <div style={{ flex:1 }}>
            <p className="shortcut-label">Submit</p>
            <p className="shortcut-name">Reports</p>
          </div>
          {pending > 0 && <span className="sc-badge">{pending}</span>}
        </div>
        <div className="shortcut-card" onClick={() => onNavigate("status")}>
          <div className="shortcut-icon" style={{ background:"#faf5ff" }}><Ic icon={Clock} size={22} color="#9333ea" /></div>
          <div style={{ flex:1 }}>
            <p className="shortcut-label">Application</p>
            <p className="shortcut-name">Status</p>
          </div>
          <span className="badge bdk" style={{ fontSize:10 }}>Active</span>
        </div>
      </div>

      {/* Current Application */}
      <div className="card fade-4" style={{ marginBottom:16 }}>
        <div className="card-body">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <p className="card-title" style={{ margin:0 }}>Current Application</p>
            <span className="badge bdk"><Ic icon={CheckCircle} size={10} color="#fff" />Approved</span>
          </div>
          <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:16, flexWrap:"wrap" }}>
            <div style={{ width:46, height:46, borderRadius:12, background:"rgba(21,101,58,.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Ic icon={Building2} size={22} color="#15653a" />
            </div>
            <div>
              <p style={{ fontSize:16, fontWeight:700, color:"#111827" }}>{profile.company || "Company not set"}</p>
              <p style={{ fontSize:13, color:"#6b7280", marginTop:2, display:"flex", alignItems:"center", gap:5 }}><Ic icon={MapPin} size={12} color="#9ca3af" />{profile.state || "Location not set"}</p>
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:12, color:"#6b7280", fontWeight:500 }}>Internship Progress</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#15653a" }}>{Math.round((submitted / 12) * 100)}%</span>
            </div>
            <div className="prog-track"><div className="prog-fill" style={{ width:`${(submitted/12)*100}%` }} /></div>
            <p style={{ fontSize:11, color:"#9ca3af", marginTop:5 }}>{submitted} of 12 weeks reported</p>
          </div>
          <div className="divider" />
          <button className="btn-p" style={{ width:"100%", padding:"11px" }} onClick={() => showToast("Internship letter downloaded!")}>
            <Ic icon={Download} size={15} />Download Internship Letter
          </button>
        </div>
      </div>

      {/* Toggle */}
      <div className="card">
        <div className="card-body">
          <p className="card-title">Internship Status</p>
          <p style={{ fontSize:14, color:"#6b7280", marginBottom:16 }}>Have you started your internship or been called to start?</p>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <button
              onClick={onToggleInternshipStart}
              style={{ width:46, height:26, borderRadius:99, background:internshipStarted?"#15653a":"#d1d5db", position:"relative", border:"none", cursor:"pointer", transition:"background .2s", flexShrink:0 }}>
              <span style={{ position:"absolute", width:20, height:20, borderRadius:"50%", background:"#fff", top:3, left:internshipStarted?23:3, transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,.2)" }} />
            </button>
            <div>
              <p style={{ fontSize:14, fontWeight:600, color:internshipStarted?"#15653a":"#374151" }}>
                {internshipStarted ? "Internship Started ✓" : "Not Started Yet"}
              </p>
              <p style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>
                {internshipStarted ? "Your internship is active and being tracked." : "Toggle when you officially begin."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   OPPORTUNITIES  –  3-column card grid (matches screenshot)
════════════════════════════════════════════════════════════════════ */

const OppsPage = ({ onNavigate, applied, setApplied, showToast }) => {
  const [search, setSearch] = useState("");
  const [modal,  setModal]  = useState(null);
  const [reqModal, setReqModal] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loadingOpps, setLoadingOpps] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoadingOpps(true);
      try {
        const res = await axios.get(`${API}/opportunities?active=true`);
        const items = res?.data?.opportunities || [];
        setCompanies(
          items.map((o) => ({
            id: o._id,
            name: o.company,
            loc: o.location,
            emoji: "🏢",
            desc: o.description,
            positions: o.positions,
            dur: o.duration,
            roles: [],
            skills: [],
          }))
        );
      } catch (e) {
        console.error("Failed to load opportunities", e);
        setCompanies(
          OPPS.map((o) => ({
            id: o.id,
            name: o.company,
            loc: o.loc,
            emoji: o.emoji,
            desc: o.desc,
            positions: o.positions,
            dur: o.dur,
            roles: o.skills || [],
            skills: o.skills || [],
          }))
        );
        showToast("Failed to load opportunities", "error");
      } finally {
        setLoadingOpps(false);
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    const loadMyRequests = async () => {
      const token = localStorage.getItem("ims_token");
      if (!token) return;
      try {
        const res = await axios.get(`${API}/letters/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const requestedIds = (res?.data?.letters || [])
          .filter((l) => l.status === "pending" || l.status === "approved")
          .map((l) => l?.opportunity?._id)
          .filter(Boolean);
        setApplied(requestedIds);
      } catch (e) {
        console.error("Failed to load my letter requests", e);
      }
    };
    loadMyRequests();
  }, [setApplied]);

  const filtered = companies.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.loc.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
  });

  const isApp = id => applied.includes(id);

  const handleRequest = async (c) => {
    setReqModal(null);
    const token = localStorage.getItem("ims_token");
    if (!token) {
      showToast("Please login again.", "error");
      return;
    }

    try {
      await axios.post(
        `${API}/letters/request`,
        { opportunityId: c.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplied((a) => [...new Set([...a, c.id])]);
      showToast(`Internship letter requested from ${c.name}!`);
    } catch (e) {
      const message =
        e?.response?.data?.message || "Could not request internship letter";
      showToast(message, "error");
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth:1100, margin:"0 auto" }}>

      {/* Header row */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
        <button className="back-btn" style={{ margin:0 }} onClick={() => onNavigate("home")}>
          <Ic icon={ArrowLeft} size={14} />Back to Dashboard
        </button>
      </div>

      <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", marginTop:18, marginBottom:4 }}>Internship Opportunities</h1>
      <p style={{ fontSize:14, color:"#6b7280", marginBottom:24 }}>Browse and apply for available positions</p>

      {/* Divider */}
      <div style={{ height:1, background:"#e5e7eb", marginBottom:24 }} />

      {/* Search */}
      <div className="sw-search" style={{ marginBottom:28 }}>
        <Ic icon={Search} size={16} />
        <input className="s-input" placeholder="Search by company or location..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Card grid — 3 columns matching screenshot */}
      {loadingOpps
        ? <div className="empty"><Ic icon={Briefcase} size={28} color="#9ca3af" /><p style={{ marginTop:12, fontWeight:700, color:"#374151" }}>Loading opportunities...</p></div>
        : filtered.length === 0
        ? <div className="empty"><Ic icon={Briefcase} size={28} color="#9ca3af" /><p style={{ marginTop:12, fontWeight:700, color:"#374151" }}>No companies found</p></div>
        : (
          <div className="opp-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {filtered.map((c, idx) => (
              <div key={c.id}
                className="fade-up"
                style={{
                  background:"#fff", border:"1px solid #e5e7eb", borderRadius:12,
                  padding:"24px", display:"flex", flexDirection:"column", gap:0,
                  cursor:"pointer", transition:"box-shadow .2s, transform .15s",
                  animationDelay:`${idx*.05}s`,
                  boxShadow:"0 1px 4px rgba(0,0,0,.06)",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow="0 6px 22px rgba(0,0,0,.1)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.06)"; e.currentTarget.style.transform="translateY(0)"; }}
                onClick={() => setModal(c)}
              >
                {/* Company logo row */}
                <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:16 }}>
                  <div style={{ width:48, height:48, borderRadius:10, background:"#f3f4f6", border:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                    {c.emoji}
                  </div>
                  <div>
                    <p style={{ fontSize:15, fontWeight:700, color:"#111827", lineHeight:1.3 }}>{c.name}</p>
                    <p style={{ fontSize:12, color:"#6b7280", marginTop:4, display:"flex", alignItems:"center", gap:4 }}>
                      <Ic icon={MapPin} size={11} color="#9ca3af" />{c.loc}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.6, marginBottom:20, flex:1 }}>{c.desc}</p>

                {/* Positions + Duration row */}
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
                  <div>
                    <p style={{ fontSize:11, color:"#9ca3af", marginBottom:3 }}>Positions</p>
                    <p style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{c.positions} available</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontSize:11, color:"#9ca3af", marginBottom:3 }}>Duration</p>
                    <p style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{c.dur}</p>
                  </div>
                </div>

                {/* CTA Button */}
                {isApp(c.id) ? (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"11px", background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:8, color:"#15653a", fontWeight:700, fontSize:14 }}>
                    <Ic icon={Check} size={15} color="#15803d" />Letter Requested
                  </div>
                ) : (
                  <button
                    className="btn-p"
                    style={{ width:"100%", padding:"11px", fontSize:14, borderRadius:8 }}
                    onClick={e => { e.stopPropagation(); setReqModal(c); }}
                  >
                    <Ic icon={FileText} size={15} />Request Internship Letter
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      }

      {/* Detail modal */}
      {modal && (
        <div className="mo" onClick={() => setModal(null)}>
          <div className="mb" onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:52, height:52, borderRadius:12, background:"#f3f4f6", border:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{modal.emoji}</div>
                <div>
                  <p style={{ fontSize:16, fontWeight:800, color:"#111827" }}>{modal.name}</p>
                  <p style={{ fontSize:13, color:"#6b7280", display:"flex", alignItems:"center", gap:4 }}>
                    <Ic icon={MapPin} size={11} color="#9ca3af" />{modal.loc}
                  </p>
                </div>
              </div>
              <button className="btn-ic" onClick={() => setModal(null)}><Ic icon={X} size={16} /></button>
            </div>

            <p style={{ fontSize:14, color:"#374151", lineHeight:1.7, marginBottom:20 }}>{modal.desc}</p>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
              {[["Positions Available", `${modal.positions}`, Briefcase],["Duration", modal.dur, Calendar]].map(([l,v,Icon]) => (
                <div key={l} style={{ background:"#f9fafb", borderRadius:10, padding:"12px 14px" }}>
                  <p style={{ fontSize:11, color:"#9ca3af", marginBottom:4, display:"flex", alignItems:"center", gap:4 }}><Ic icon={Icon} size={10} />{l}</p>
                  <p style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{v}</p>
                </div>
              ))}
            </div>

            <div style={{ marginBottom:20 }}>
              <p style={{ fontSize:12, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:".05em", marginBottom:10 }}>Available Roles</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {modal.roles.map(r => <span key={r} style={{ padding:"5px 12px", background:"#f0fdf4", color:"#15653a", border:"1px solid #bbf7d0", borderRadius:99, fontSize:12, fontWeight:600 }}>{r}</span>)}
              </div>
            </div>

            <div style={{ marginBottom:24 }}>
              <p style={{ fontSize:12, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:".05em", marginBottom:10 }}>Skills Required</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {modal.skills.map(s => <span key={s} style={{ padding:"5px 12px", background:"#f3f4f6", color:"#374151", border:"1px solid #e5e7eb", borderRadius:99, fontSize:12, fontWeight:600 }}>{s}</span>)}
              </div>
            </div>

            <div className="mbr" style={{ display:"flex", gap:10 }}>
              <button className="btn-g" style={{ flex:1 }} onClick={() => setModal(null)}>Close</button>
              {isApp(modal.id)
                ? <div style={{ flex:2, display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"10px", background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:8, color:"#15653a", fontWeight:700, fontSize:14 }}><Ic icon={Check} size={14} color="#15803d" />Letter Requested</div>
                : <button className="btn-p" style={{ flex:2 }} onClick={() => { setModal(null); setReqModal(modal); }}><Ic icon={FileText} size={14} />Request Letter</button>
              }
            </div>
          </div>
        </div>
      )}

      {/* Letter request confirm modal */}
      {reqModal && (
        <div className="mo" onClick={() => setReqModal(null)}>
          <div className="mb" style={{ maxWidth:420 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign:"center", padding:"8px 0 20px" }}>
              <div style={{ width:56, height:56, borderRadius:16, background:"#f0fdf4", border:"1.5px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 16px" }}>
                {reqModal.emoji}
              </div>
              <p style={{ fontSize:17, fontWeight:800, color:"#111827", marginBottom:6 }}>Request Internship Letter</p>
              <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.6 }}>
                You are requesting an internship letter from <strong style={{ color:"#111827" }}>{reqModal.name}</strong> for a {reqModal.dur} placement in {reqModal.loc}.
              </p>
            </div>
            <div className="mbr" style={{ display:"flex", gap:10 }}>
              <button className="btn-g" style={{ flex:1 }} onClick={() => setReqModal(null)}>Cancel</button>
              <button className="btn-p" style={{ flex:2 }} onClick={() => handleRequest(reqModal)}>
                <Ic icon={FileText} size={14} />Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   REPORTS  –  two-column layout (matches screenshot)
════════════════════════════════════════════════════════════════════ */
const REPORT_TYPES = ["Weekly Report","Bi-weekly Report","Monthly Report","Incident Report","Final Report"];

const INIT_PREV_REPORTS = [
  { id:1, date:"2026-02-21", type:"weekly", summary:"This week I worked on the user authentication module. Implemented login and registration features.", status:"reviewed", feedback:"Good progress! Make sure to add validation." },
  { id:2, date:"2026-02-14", type:"weekly", summary:"Set up the development environment and familiarised myself with the codebase.", status:"reviewed", feedback:"Great start! Keep up the good work." },
  { id:3, date:"2026-02-28", type:"weekly", summary:"Working on database integration and API endpoints.", status:"pending", feedback:"" },
];
const INIT_WORKPLACE_REPORTS = [
  {
    _id: "demo-workplace-report-1",
    period: "February 2026",
    rating: 4,
    summary: "Consistent attendance and quality contribution to assigned tasks.",
    recommendation: "Continue improving communication and documentation.",
    createdAt: new Date("2026-02-28").toISOString(),
  },
];

const ReportsPage = ({ onNavigate, showToast, token }) => {
  const [reportType, setReportType] = useState("Weekly Report");
  const [content,    setContent]    = useState("");
  const [prevReports, setPrevReports] = useState([]);
  const [workplaceReports, setWorkplaceReports] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const [logsRes, workplaceRes] = await Promise.all([
          axios.get(`${API}/student/me/logs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/student/me/workplace-reports`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const logs = (logsRes?.data?.logs || []).map((l) => ({
          id: l._id,
          date: l.createdAt ? new Date(l.createdAt).toISOString().slice(0, 10) : "",
          type: l.periodType,
          summary: l.content,
          status: l.status,
          feedback: l.feedback || "",
        }));
        setPrevReports(logs.length > 0 ? logs : INIT_PREV_REPORTS);
        setWorkplaceReports(workplaceRes?.data?.reports || []);
      } catch (e) {
        console.error("Failed to load reports", e);
        setPrevReports(INIT_PREV_REPORTS);
        setWorkplaceReports(INIT_WORKPLACE_REPORTS);
      }
    };
    load();
  }, [token]);

  const mapPeriodType = (displayType) => {
    const t = displayType.toLowerCase();
    if (t.includes("daily")) return "daily";
    if (t.includes("monthly")) return "monthly";
    return "weekly";
  };

  const handleSubmit = async () => {
    if (!content.trim()) { showToast("Please describe your activities before submitting.", "error"); return; }
    if (!token) {
      showToast("Please login again.", "error");
      return;
    }
    try {
      const res = await axios.post(
        `${API}/student/me/logs`,
        { periodType: mapPeriodType(reportType), content: content.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const l = res?.data?.log;
      const today = new Date().toISOString().slice(0,10);
      setPrevReports(prev => [
        {
          id: l?._id || Date.now(),
          date: l?.createdAt ? new Date(l.createdAt).toISOString().slice(0, 10) : today,
          type: l?.periodType || mapPeriodType(reportType),
          summary: l?.content || content.trim(),
          status: l?.status || "pending",
          feedback: l?.feedback || "",
        },
        ...prev,
      ]);
      setContent("");
      showToast("Report submitted successfully!");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to submit report", "error");
    }
  };

  const statusStyle = s => s === "reviewed"
    ? { bg:"#15653a", c:"#fff" }
    : { bg:"#e5e7eb", c:"#374151" };

  return (
    <div className="fade-in">

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
        <button className="back-btn" style={{ margin:0 }} onClick={() => onNavigate("home")}>
          <Ic icon={ArrowLeft} size={14} />Back to Dashboard
        </button>
      </div>

      <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", marginTop:18, marginBottom:4 }}>Internship Reports</h1>
      <p style={{ fontSize:14, color:"#6b7280", marginBottom:24 }}>Submit and track your progress reports</p>

      {/* Divider */}
      <div style={{ height:1, background:"#e5e7eb", marginBottom:24 }} />

      {/* Two-column layout */}
      <div className="rep-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, alignItems:"start" }}>

        {/* ── LEFT: Submit New Report ── */}
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"28px" }}>
          <p style={{ fontSize:17, fontWeight:700, color:"#111827", marginBottom:4 }}>Submit New Report</p>
          <p style={{ fontSize:13, color:"#6b7280", marginBottom:24 }}>Share your progress with your academic supervisor</p>

          {/* Report Type */}
          <div className="fg">
            <label className="fl">Report Type</label>
            <div className="sw">
              <select className="fs" value={reportType} onChange={e => setReportType(e.target.value)}>
                {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <Ic icon={ChevronDown} size={15} color="#9ca3af" />
            </div>
          </div>

          {/* Report Content */}
          <div className="fg">
            <label className="fl">Report Content</label>
            <textarea
              className="fi"
              rows={7}
              style={{ resize:"vertical", minHeight:140 }}
              placeholder="Describe what you've been working on, challenges faced, and accomplishments..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button className="btn-p" style={{ width:"100%", padding:"12px", fontSize:14, borderRadius:8, marginTop:4 }} onClick={handleSubmit}>
            <Ic icon={FileText} size={15} />Submit Report
          </button>
        </div>

        {/* ── RIGHT: Previous Reports ── */}
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"28px" }}>
          <p style={{ fontSize:17, fontWeight:700, color:"#111827", marginBottom:4 }}>Previous Reports</p>
          <p style={{ fontSize:13, color:"#6b7280", marginBottom:24 }}>View your submitted reports and supervisor feedback</p>

          {prevReports.length === 0 ? (
            <div className="empty">
              <Ic icon={FileText} size={28} color="#9ca3af" />
              <p style={{ marginTop:12, fontWeight:700, color:"#374151" }}>No reports yet</p>
              <p style={{ fontSize:13, color:"#9ca3af" }}>Submit your first report on the left</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {prevReports.map((r, i) => {
                const ss = statusStyle(r.status);
                return (
                  <div key={r.id} className="fade-up" style={{ border:"1px solid #e5e7eb", borderRadius:10, padding:"18px", animationDelay:`${i*.04}s` }}>
                    {/* Date + badges */}
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7, flex:1 }}>
                        <Ic icon={FileText} size={15} color="#6b7280" />
                        <span style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{r.date}</span>
                      </div>
                      <span style={{ padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, background:"#15653a", color:"#fff" }}>{r.type}</span>
                      <span style={{ padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, background:ss.bg, color:ss.c, border: r.status==="pending"?"1px solid #e5e7eb":"none" }}>{r.status}</span>
                    </div>

                    {/* Summary */}
                    <p style={{ fontSize:13, color:"#374151", lineHeight:1.65, marginBottom: r.feedback ? 12 : 0 }}>{r.summary}</p>

                    {/* Supervisor feedback */}
                    {r.feedback && (
                      <div style={{ background:"#eff6ff", borderRadius:8, padding:"12px 14px" }}>
                        <p style={{ fontSize:12, fontWeight:700, color:"#1d4ed8", marginBottom:4 }}>Supervisor Feedback:</p>
                        <p style={{ fontSize:13, color:"#1e40af" }}>{r.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Workplace Supervisor Reports */}
      <div style={{ marginTop: 20, background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"20px" }}>
        <p style={{ fontSize:17, fontWeight:700, color:"#111827", marginBottom:4 }}>Workplace Supervisor Reports</p>
        <p style={{ fontSize:13, color:"#6b7280", marginBottom:16 }}>Reports submitted by your workplace supervisor</p>
        {workplaceReports.length === 0 ? (
          <p style={{ fontSize:13, color:"#9ca3af" }}>No workplace supervisor reports yet.</p>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {workplaceReports.map((r) => (
              <div key={r._id} style={{ border:"1px solid #e5e7eb", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:10, marginBottom:6 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{r.period}</p>
                  <span style={{ fontSize:12, color:"#6b7280" }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <p style={{ fontSize:13, color:"#374151", lineHeight:1.6 }}>{r.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   STATUS
════════════════════════════════════════════════════════════════════ */
const StatusPage = ({ onNavigate, internshipStarted, profile, user, reports, showToast }) => {
  const approved  = reports.filter(r => r.status==="approved").length;
  const submitted = reports.filter(r => r.status!=="draft").length;

  const steps = [
    { title:"Application Submitted",    desc:"Your application was received by the IMS portal.",               date:"Aug 15, 2024", done:true },
    { title:"Document Verification",    desc:"Your academic credentials were verified.",                       date:"Aug 22, 2024", done:true },
    { title:"Company Approval",         desc:"Tech Solutions Ltd accepted your internship placement.",         date:"Sep 1, 2024",  done:true },
    { title:"Internship Letter Issued", desc:"Your official placement letter has been generated.",             date:"Sep 3, 2024",  done:true },
    { title:"Internship In Progress",   desc:internshipStarted?"You are actively completing your internship.":"Toggle started status on the home page.", date:internshipStarted?"Active":"Pending", done:internshipStarted, active:!internshipStarted },
    { title:"Final Report Submission",  desc:"Submit all weekly reports and your final internship report.",    date:"Dec 5, 2024",  done:submitted>=10 },
    { title:"Internship Completed",     desc:"Supervisor sign-off and academic credit processed.",             date:"Dec 15, 2024", done:false },
  ];

  const meta = [
    ["Student",    user?.name||"—",          GraduationCap, "#15653a"],
    ["Department", profile.dept||"—",        BookOpen,      "#3b82f6"],
    ["Student ID", profile.studentId||"—",   Hash,          "#8b5cf6"],
    ["Reports OK", `${approved}/${reports.length}`, FileText,"#16a34a"],
    ["Progress",   `${Math.round((submitted/reports.length)*100)}%`, TrendingUp,"#f59e0b"],
    ["Status",     internshipStarted?"Active":"Not Started", Zap, internshipStarted?"#15653a":"#9ca3af"],
  ];

  return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => onNavigate("home")}><Ic icon={ArrowLeft} size={14} />Back</button>

      <div className="section-row" style={{ marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#111827" }}>Application Status</h2>
          <p style={{ fontSize:13, color:"#6b7280", marginTop:3 }}>Track every stage of your internship placement</p>
        </div>
      </div>

      {/* Placement summary */}
      <div className="card fade-1" style={{ marginBottom:16 }}>
        <div className="card-body">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <p className="card-title" style={{ margin:0 }}>Placement Summary</p>
            <span className="badge bdk"><Ic icon={CheckCircle} size={10} color="#fff" />Approved</span>
          </div>
          <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:18, flexWrap:"wrap" }}>
            <div style={{ width:46, height:46, borderRadius:12, background:"rgba(21,101,58,.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Ic icon={Building2} size={22} color="#15653a" />
            </div>
            <div>
              <p style={{ fontSize:16, fontWeight:700, color:"#111827" }}>{profile.company || "Company not set"}</p>
              <p style={{ fontSize:13, color:"#6b7280" }}>{profile.state || "Location not set"} · 6 Months</p>
            </div>
          </div>
          <div className="status-sg" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {meta.map(([l,v,Icon,c]) => (
              <div key={l} style={{ background:"#f9fafb", border:"1px solid #f3f4f6", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                  <div style={{ width:24, height:24, borderRadius:6, background:c+"18", display:"flex", alignItems:"center", justifyContent:"center" }}><Ic icon={Icon} size={12} color={c} /></div>
                  <p style={{ fontSize:10, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".05em", fontWeight:700 }}>{l}</p>
                </div>
                <p style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card fade-2" style={{ marginBottom:16 }}>
        <div className="card-body">
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <p className="card-title" style={{ margin:0 }}>Overall Progress</p>
            <span style={{ fontSize:14, fontWeight:800, color:"#15653a" }}>{Math.round((submitted/reports.length)*100)}%</span>
          </div>
          <div className="prog-track" style={{ height:10, marginBottom:8 }}><div className="prog-fill" style={{ width:`${(submitted/reports.length)*100}%` }} /></div>
          <p style={{ fontSize:12, color:"#9ca3af" }}>{submitted} of {reports.length} weekly reports submitted · {approved} approved</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="card fade-3">
        <div className="card-body">
          <p className="card-title">Placement Timeline</p>
          <div className="timeline">
            {steps.map((s, i) => (
              <div key={i} className="tl-step">
                {i < steps.length-1 && <div className={`tl-line${s.done?" done":""}`} />}
                <div className={`tl-dot${s.done?" done":s.active?" active":""}`}>
                  {s.done ? <Ic icon={Check} size={13} color="#fff" /> : s.active ? <div style={{ width:8,height:8,borderRadius:"50%",background:"#15653a" }}/> : <div style={{ width:8,height:8,borderRadius:"50%",background:"#e5e7eb" }}/>}
                </div>
                <div style={{ paddingTop:3, flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <p style={{ fontSize:14, fontWeight:700, color:s.done||s.active?"#111827":"#9ca3af" }}>{s.title}</p>
                    {s.done   && <span className="badge bg"  style={{ fontSize:9, padding:"2px 7px" }}>Done</span>}
                    {s.active && <span className="badge ba"  style={{ fontSize:9, padding:"2px 7px" }}>In Progress</span>}
                  </div>
                  <p style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{s.desc}</p>
                  <p style={{ fontSize:11, color:"#9ca3af", marginTop:3 }}>{s.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <button className="btn-p" style={{ width:"100%", padding:"11px" }} onClick={() => showToast("Placement letter downloaded!")}>
            <Ic icon={Download} size={15} />Download Placement Letter
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════════════════════ */
export default function StudentDashboard() {
  const { user, token, logout }  = useAuth();
  const navigate                 = useNavigate();
  const [page,    setPage]       = useState("home");
  const [profile, setProfile]    = useState(null);
  const [started, setStarted]    = useState(false);
  const [reports]                = useState(INIT_REPORTS);
  const [applied, setApplied]    = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Single global toast — lives here so it always renders ABOVE the navbar
  const [gToast, showToast]      = useToast();

  const handleLogout = () => { logout?.(); navigate("/login"); };
  const displayName = user?.name || "Student";
  const initials    = displayName.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase();

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setLoadingProfile(false);
        return;
      }
      try {
        const res = await axios.get(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res?.data?.user?.profile;
        if (p && Object.keys(p).length > 0) {
          setStarted(p.internshipStatus === "active");
          setProfile({
            studentId: p.studentId || "",
            dept: p.department || "",
            level: p.level || "",
            phone: p.phone || "",
            state: p.stateOfOrigin || "",
            company: p.companyName || "",
            supervisor: p.preferredAcademicSupervisorName || "",
          });
        }
      } catch (e) {
        // If profile can't load, fall back to wizard
        console.error("Failed to load profile", e);
      } finally {
        setLoadingProfile(false);
      }
    };
    load();
  }, [token]);

  const handleProfileComplete = async (wizardProfile) => {
    // Persist to backend so it survives refresh/login
    try {
      if (token) {
        const res = await axios.patch(
          `${API}/users/me/profile`,
          {
            studentId: wizardProfile.studentId,
            department: wizardProfile.dept,
            level: wizardProfile.level,
            phone: wizardProfile.phone,
            stateOfOrigin: wizardProfile.state,
            preferredAcademicSupervisorName: wizardProfile.supervisor,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const p = res?.data?.user?.profile || {};
        setProfile({
          studentId: p.studentId || "",
          dept: p.department || "",
          level: p.level || "",
          phone: p.phone || "",
          state: p.stateOfOrigin || "",
          company: p.companyName || "",
          supervisor: p.preferredAcademicSupervisorName || "",
        });
        return;
      }
    } catch (e) {
      console.error("Failed to save profile", e);
      showToast("Could not save profile. Please try again.", "error");
      return;
    }

    // Fallback (shouldn't happen): keep in memory
    setProfile(wizardProfile);
  };

  const handleToggleInternshipStart = async () => {
    if (started) {
      showToast("Internship is already active.");
      return;
    }
    const workplaceSupervisorName = window.prompt("Enter workplace supervisor full name:");
    if (!workplaceSupervisorName) return;
    const workplaceSupervisorEmail = window.prompt("Enter workplace supervisor email:");
    if (!workplaceSupervisorEmail) return;
    const workplaceSupervisorPhone = window.prompt("Enter workplace supervisor phone (optional):") || "";
    const companyName = window.prompt("Enter company name:") || profile?.company || "";

    try {
      await axios.patch(
        `${API}/student/me/internship/start`,
        { workplaceSupervisorName, workplaceSupervisorEmail, workplaceSupervisorPhone, companyName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile((prev) => ({ ...(prev || {}), company: companyName || prev?.company || "" }));
      setStarted(true);
      showToast("Internship marked as started! 🎉");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to start internship", "error");
    }
  };

  const handleSaveStudentProfile = async (nextProfile) => {
    if (!nextProfile) return false;
    try {
      const res = await axios.patch(
        `${API}/users/me/profile`,
        {
          studentId: nextProfile.studentId || "",
          department: nextProfile.dept || "",
          level: nextProfile.level || "",
          phone: nextProfile.phone || "",
          stateOfOrigin: nextProfile.state || "",
          companyName: nextProfile.company || "",
          preferredAcademicSupervisorName: nextProfile.supervisor || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const p = res?.data?.user?.profile || {};
      setProfile({
        studentId: p.studentId || "",
        dept: p.department || "",
        level: p.level || "",
        phone: p.phone || "",
        state: p.stateOfOrigin || "",
        company: p.companyName || "",
        supervisor: p.preferredAcademicSupervisorName || "",
      });
      showToast("Student profile updated.");
      return true;
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to update profile", "error");
      return false;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="app-shell">

        {/* ── Global toast: position:fixed z-index 99999, always visible above nav ── */}
        {gToast && <ToastEl key={gToast.key} msg={gToast.msg} type={gToast.type} />}

        {/* Profile wizard */}
        {!profile && !loadingProfile && <ProfileWizard user={user} onComplete={handleProfileComplete} />}

        {/* Navbar */}
        <nav className="topnav">
          <div className="topnav-brand">
            <div style={{ width:32, height:32, borderRadius:8, background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Ic icon={GraduationCap} size={17} color="#fff" />
            </div>
            <div>
              <p className="topnav-logo">Student Dashboard</p>
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

        {/* Pages — each receives showToast, no local toast state */}
        <div className="page-wrap">
          {profile && page === "home"    && <HomePage    user={user} profile={profile} onNavigate={setPage} internshipStarted={started} onToggleInternshipStart={handleToggleInternshipStart} onSaveStudentProfile={handleSaveStudentProfile} reports={reports} appliedCount={applied.length} showToast={showToast} />}
          {profile && page === "opps"    && <OppsPage    onNavigate={setPage} applied={applied} setApplied={setApplied} showToast={showToast} />}
          {profile && page === "reports" && <ReportsPage onNavigate={setPage} showToast={showToast} token={token} />}
          {profile && page === "status"  && <StatusPage  onNavigate={setPage} internshipStarted={started} profile={profile} user={user} reports={reports} showToast={showToast} />}
        </div>
      </div>
    </>
  );
}