import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  LayoutGrid, Cog, Wrench, Sparkles, Settings as SettingsIcon,
  ChevronLeft, ChevronRight, AlertTriangle, CircleCheck, CircleX,
  Activity, Thermometer, Waves, Gauge as GaugeIcon, Clock, MapPin,
  Calendar, Plus, X, Check, ChevronDown, Search, Factory
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root{
  --bg:#EEF1F4;
  --surface:#FFFFFF;
  --sidebar:#121a22;
  --sidebar-hover:#1b2530;
  --sidebar-active:#20384a;
  --sidebar-text:#8ea1b3;
  --sidebar-text-active:#ffffff;
  --accent:#2c6e9b;
  --accent-soft:#dceaf4;
  --text:#111820;
  --text-muted:#5b6b7a;
  --text-faint:#8a97a4;
  --border:#e2e6eb;
  --green:#1e9e5a; --green-soft:#e2f6ea;
  --amber:#c17a0a; --amber-soft:#fbecd3;
  --red:#c63b3b; --red-soft:#fbe3e3;
  --blue:#2e67b0; --blue-soft:#e3ecfa;
  --shadow: 0 1px 2px rgba(16,24,32,0.04), 0 1px 12px rgba(16,24,32,0.04);
}
.ioi-root{
  font-family:'Inter',sans-serif;
  color:var(--text);
  background:var(--bg);
  width:100%;
  min-height:100vh;
  display:flex;
  font-size:14px;
  -webkit-font-smoothing:antialiased;
}
.ioi-root *{box-sizing:border-box;}
.ioi-mono{font-family:'JetBrains Mono',monospace;}
.ioi-display{font-family:'Space Grotesk',sans-serif;}

/* ---------- Sidebar ---------- */
.ioi-sidebar{
  width:230px; min-width:230px; background:var(--sidebar);
  display:flex; flex-direction:column; height:100vh; position:sticky; top:0;
  transition:width .18s ease, min-width .18s ease;
}
.ioi-sidebar.collapsed{width:68px; min-width:68px;}
.ioi-sidebar-brand{
  display:flex; align-items:center; gap:10px; padding:20px 18px;
  border-bottom:1px solid rgba(255,255,255,0.06);
}
.ioi-sidebar-brand-mark{
  width:32px;height:32px;border-radius:7px;background:linear-gradient(155deg,var(--accent),#184766);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.ioi-sidebar-brand-text{color:#fff;font-weight:700;font-size:14.5px;line-height:1.15;letter-spacing:.01em;}
.ioi-sidebar-brand-sub{color:var(--sidebar-text);font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;margin-top:1px;}
.ioi-nav{flex:1;padding:14px 10px;display:flex;flex-direction:column;gap:2px;}
.ioi-nav-item{
  display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:7px;
  color:var(--sidebar-text);cursor:pointer;font-weight:500;font-size:13.5px;
  border:none;background:transparent;text-align:left;width:100%;
  transition:background .12s, color .12s; white-space:nowrap; overflow:hidden;
}
.ioi-nav-item:hover{background:var(--sidebar-hover);color:#dbe6ee;}
.ioi-nav-item.active{background:var(--sidebar-active);color:var(--sidebar-text-active);}
.ioi-nav-item.active svg{color:#6fb3e0;}
.ioi-nav-footer{padding:10px;border-top:1px solid rgba(255,255,255,0.06);}
.ioi-collapse-btn{
  display:flex;align-items:center;justify-content:center;gap:8px;width:100%;
  padding:8px;border-radius:7px;color:var(--sidebar-text);background:transparent;border:none;cursor:pointer;
}
.ioi-collapse-btn:hover{background:var(--sidebar-hover);}

/* ---------- Main ---------- */
.ioi-main{flex:1;min-width:0;display:flex;flex-direction:column;height:100vh;overflow-y:auto;}
.ioi-topbar{
  position:sticky;top:0;z-index:5;background:rgba(238,241,244,0.88);backdrop-filter:blur(6px);
  padding:18px 32px 10px 32px; display:flex; align-items:flex-start; justify-content:space-between;
}
.ioi-topbar-title{font-family:'Space Grotesk';font-weight:700;font-size:22px;letter-spacing:-.01em;}
.ioi-topbar-sub{color:var(--text-muted);font-size:13px;margin-top:2px;}
.ioi-content{padding:6px 32px 40px 32px;}

/* ---------- Buttons ---------- */
.ioi-btn{
  display:inline-flex;align-items:center;gap:7px;font-weight:600;font-size:13px;
  padding:9px 15px;border-radius:7px;border:1px solid var(--border);background:var(--surface);
  color:var(--text);cursor:pointer;transition:.12s;white-space:nowrap;
}
.ioi-btn:hover{border-color:#c7ced5;background:#fbfcfd;}
.ioi-btn-primary{background:var(--accent);border-color:var(--accent);color:#fff;}
.ioi-btn-primary:hover{background:#255c82;border-color:#255c82;}
.ioi-btn-sm{padding:6px 10px;font-size:12px;}
.ioi-btn:disabled{opacity:.5;cursor:not-allowed;}

/* ---------- Cards ---------- */
.ioi-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;box-shadow:var(--shadow);}
.ioi-kpi-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-bottom:22px;}
.ioi-kpi{padding:16px 18px;}
.ioi-kpi-label{color:var(--text-muted);font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;}
.ioi-kpi-value{font-family:'Space Grotesk';font-size:26px;font-weight:700;margin-top:8px;letter-spacing:-.01em;}
.ioi-kpi-accent{width:26px;height:3px;border-radius:2px;margin-top:10px;}

/* ---------- Status badges ---------- */
.ioi-badge{
  display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;
  font-size:11.5px;font-weight:600;white-space:nowrap;
}
.ioi-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.b-green{background:var(--green-soft);color:#146b3c;}
.b-green .ioi-dot{background:var(--green);}
.b-amber{background:var(--amber-soft);color:#8f5a06;}
.b-amber .ioi-dot{background:var(--amber);}
.b-red{background:var(--red-soft);color:#8f2c2c;}
.b-red .ioi-dot{background:var(--red);}
.b-blue{background:var(--blue-soft);color:#1f4a80;}
.b-blue .ioi-dot{background:var(--blue);}
.b-gray{background:#eef0f2;color:#5b6b7a;}
.b-gray .ioi-dot{background:#8a97a4;}

/* ---------- Section headers ---------- */
.ioi-section-title{font-family:'Space Grotesk';font-weight:700;font-size:15px;margin:0 0 12px 0;letter-spacing:-.005em;}
.ioi-section-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}

/* ---------- Tables ---------- */
.ioi-table{width:100%;border-collapse:collapse;}
.ioi-table thead th{
  text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);
  font-weight:600;padding:10px 16px;border-bottom:1px solid var(--border);background:#fafbfc;
}
.ioi-table tbody td{padding:13px 16px;border-bottom:1px solid var(--border);font-size:13.5px;vertical-align:middle;}
.ioi-table tbody tr{cursor:pointer;transition:background .1s;}
.ioi-table tbody tr:hover{background:#f7f9fb;}
.ioi-table tbody tr:last-child td{border-bottom:none;}
.ioi-machine-name{font-weight:600;font-family:'JetBrains Mono';font-size:13px;}

/* ---------- Grid layouts ---------- */
.ioi-dash-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:18px;align-items:start;}
.ioi-two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;}

/* ---------- Alerts / insight cards ---------- */
.ioi-alert{display:flex;gap:11px;padding:12px 14px;border-radius:8px;border:1px solid var(--border);margin-bottom:8px;align-items:flex-start;}
.ioi-alert:last-child{margin-bottom:0;}
.ioi-alert-icon{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ioi-alert-title{font-weight:600;font-size:13px;}
.ioi-alert-sub{color:var(--text-muted);font-size:12.5px;margin-top:1px;}

.ioi-insight-card{border-radius:10px;border:1px solid var(--border);padding:16px 18px;background:linear-gradient(180deg,#fff,#fbfdfe);}
.ioi-insight-head{display:flex;align-items:center;gap:9px;margin-bottom:8px;}
.ioi-insight-badge{width:28px;height:28px;border-radius:7px;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;color:var(--accent);flex-shrink:0;}
.ioi-insight-title{font-weight:700;font-size:14px;font-family:'Space Grotesk';}
.ioi-insight-body{color:var(--text-muted);font-size:13px;line-height:1.5;}
.ioi-insight-rec{margin-top:9px;font-size:12.5px;background:var(--accent-soft);color:#1c4d6e;padding:8px 10px;border-radius:6px;font-weight:500;}

/* ---------- Machine status donut-ish bars ---------- */
.ioi-status-bar-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
.ioi-status-bar-row:last-child{margin-bottom:0;}
.ioi-status-bar-label{width:92px;font-size:12.5px;color:var(--text-muted);font-weight:500;display:flex;align-items:center;gap:7px;}
.ioi-status-bar-track{flex:1;height:8px;background:#eef0f3;border-radius:5px;overflow:hidden;}
.ioi-status-bar-fill{height:100%;border-radius:5px;}
.ioi-status-bar-count{width:22px;text-align:right;font-family:'JetBrains Mono';font-weight:600;font-size:12.5px;}

/* ---------- Gauges ---------- */
.ioi-gauge-wrap{display:flex;flex-direction:column;align-items:center;gap:4px;}
.ioi-gauge-value{font-family:'Space Grotesk';font-weight:700;font-size:20px;margin-top:-38px;}
.ioi-gauge-label{color:var(--text-muted);font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-top:2px;}

/* ---------- Breadcrumb / back ---------- */
.ioi-back{display:inline-flex;align-items:center;gap:5px;color:var(--text-muted);font-size:13px;font-weight:500;cursor:pointer;margin-bottom:14px;}
.ioi-back:hover{color:var(--text);}

/* ---------- Detail page ---------- */
.ioi-detail-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;}
.ioi-detail-title{font-family:'Space Grotesk';font-weight:700;font-size:24px;display:flex;align-items:center;gap:12px;}
.ioi-meta-row{display:flex;gap:22px;margin-top:10px;flex-wrap:wrap;}
.ioi-meta-item{display:flex;align-items:center;gap:6px;color:var(--text-muted);font-size:12.5px;}
.ioi-metric-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.ioi-metric-card{padding:16px;text-align:center;}

/* ---------- Chart card ---------- */
.ioi-chart-card{padding:16px 18px 8px 18px;}

/* ---------- Form ---------- */
.ioi-form-group{margin-bottom:16px;}
.ioi-form-label{display:block;font-weight:600;font-size:12.5px;margin-bottom:6px;color:var(--text);}
.ioi-form-hint{color:var(--text-faint);font-weight:400;font-size:11.5px;margin-left:4px;}
.ioi-input, .ioi-select, .ioi-textarea{
  width:100%;padding:9px 11px;border:1px solid var(--border);border-radius:7px;font-size:13.5px;
  font-family:'Inter';background:#fff;color:var(--text);
}
.ioi-input:focus, .ioi-select:focus, .ioi-textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft);}
.ioi-textarea{resize:vertical;min-height:80px;}
.ioi-severity-row{display:flex;gap:8px;}
.ioi-severity-pill{
  flex:1;padding:9px 0;text-align:center;border-radius:7px;border:1px solid var(--border);cursor:pointer;
  font-weight:600;font-size:12.5px;background:#fff;color:var(--text-muted);transition:.12s;
}
.ioi-severity-pill.active-low{background:var(--blue-soft);border-color:var(--blue);color:#1f4a80;}
.ioi-severity-pill.active-medium{background:var(--amber-soft);border-color:var(--amber);color:#8f5a06;}
.ioi-severity-pill.active-high{background:#fde3d0;border-color:#c9631a;color:#8f3f06;}
.ioi-severity-pill.active-critical{background:var(--red-soft);border-color:var(--red);color:#8f2c2c;}

/* ---------- Modal ---------- */
.ioi-modal-overlay{position:fixed;inset:0;background:rgba(15,20,26,0.5);display:flex;align-items:center;justify-content:center;z-index:50;padding:20px;}
.ioi-modal{background:#fff;border-radius:12px;width:520px;max-width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.25);}
.ioi-modal-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--border);}
.ioi-modal-title{font-family:'Space Grotesk';font-weight:700;font-size:16px;}
.ioi-modal-close{background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px;border-radius:6px;}
.ioi-modal-close:hover{background:#f1f3f5;}
.ioi-modal-body{padding:22px;}
.ioi-modal-footer{display:flex;justify-content:flex-end;gap:10px;padding:16px 22px;border-top:1px solid var(--border);}

/* ---------- Toast ---------- */
.ioi-toast{
  position:fixed;bottom:26px;right:26px;background:#16211b;color:#fff;padding:14px 18px;border-radius:9px;
  display:flex;align-items:center;gap:10px;box-shadow:0 10px 30px rgba(0,0,0,0.25);z-index:60;font-size:13.5px;font-weight:500;
  animation:ioi-toast-in .22s ease;
}
@keyframes ioi-toast-in{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}

/* ---------- Status select in table ---------- */
.ioi-status-select{
  padding:6px 26px 6px 10px;border-radius:20px;border:1px solid var(--border);font-size:12px;font-weight:600;
  background:#fff url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="%235b6b7a" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg>') no-repeat right 8px center;
  appearance:none;cursor:pointer;
}

/* ---------- Empty state ---------- */
.ioi-empty{padding:50px 20px;text-align:center;color:var(--text-muted);}
.ioi-empty-icon{width:44px;height:44px;border-radius:10px;background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center;margin:0 auto 12px auto;}

/* ---------- misc ---------- */
.ioi-search{position:relative;width:230px;}
.ioi-search input{width:100%;padding:8px 10px 8px 32px;border:1px solid var(--border);border-radius:7px;font-size:13px;background:#fff;}
.ioi-search svg{position:absolute;left:10px;top:9px;color:var(--text-faint);}
.ioi-pill-filter{display:flex;gap:6px;flex-wrap:wrap;}
.ioi-pill-filter button{padding:6px 12px;border-radius:20px;border:1px solid var(--border);background:#fff;font-size:12px;font-weight:600;color:var(--text-muted);cursor:pointer;}
.ioi-pill-filter button.active{background:var(--text);border-color:var(--text);color:#fff;}
.ioi-scale-note{color:var(--text-faint);font-size:11px;}

@media (max-width:1100px){
  .ioi-kpi-grid{grid-template-columns:repeat(3,1fr);}
  .ioi-dash-grid{grid-template-columns:1fr;}
  .ioi-metric-grid{grid-template-columns:repeat(2,1fr);}
}
`;

/* ============================================================
   MOCK DATA
   ============================================================ */
const INITIAL_MACHINES = [
  { id: "CNC-01", type: "CNC Machine", status: "Running", temperature: 65, vibration: "Normal", pressure: 42, runtime: "142h", downtime: "12 min", location: "Bay A · Line 1", lastMaintenance: "2026-06-02" },
  { id: "CNC-02", type: "CNC Machine", status: "Running", temperature: 62, vibration: "Normal", pressure: 40, runtime: "138h", downtime: "8 min", location: "Bay A · Line 1", lastMaintenance: "2026-05-28" },
  { id: "CNC-03", type: "CNC Machine", status: "Running", temperature: 68, vibration: "Normal", pressure: 44, runtime: "150h", downtime: "15 min", location: "Bay A · Line 2", lastMaintenance: "2026-06-10" },
  { id: "CNC-04", type: "CNC Machine", status: "Stopped", temperature: 92, vibration: "High", pressure: 58, runtime: "96h", downtime: "48 min", location: "Bay A · Line 2", lastMaintenance: "2026-04-18" },
  { id: "CNC-05", type: "Press", status: "Running", temperature: 70, vibration: "Normal", pressure: 61, runtime: "160h", downtime: "10 min", location: "Bay B · Line 1", lastMaintenance: "2026-06-05" },
  { id: "CNC-06", type: "Press", status: "Running", temperature: 71, vibration: "Normal", pressure: 63, runtime: "155h", downtime: "5 min", location: "Bay B · Line 1", lastMaintenance: "2026-06-01" },
  { id: "CNC-07", type: "CNC Machine", status: "Warning", temperature: 82, vibration: "High", pressure: 49, runtime: "121h", downtime: "25 min", location: "Bay B · Line 2", lastMaintenance: "2026-05-14" },
  { id: "CNC-08", type: "Motor", status: "Running", temperature: 64, vibration: "Normal", pressure: 30, runtime: "175h", downtime: "7 min", location: "Bay C · Line 1", lastMaintenance: "2026-06-08" },
  { id: "CNC-09", type: "Pump", status: "Maintenance", temperature: 69, vibration: "Normal", pressure: 37, runtime: "88h", downtime: "35 min", location: "Bay C · Line 2", lastMaintenance: "2026-06-14" },
  { id: "CNC-10", type: "Motor", status: "Running", temperature: 66, vibration: "Normal", pressure: 33, runtime: "168h", downtime: "9 min", location: "Bay C · Line 2", lastMaintenance: "2026-05-30" },
];

const ISSUE_TYPES = ["Overheating", "High vibration", "Pressure problem", "Electrical issue", "Mechanical issue", "Other"];
const SEVERITIES = ["Low", "Medium", "High", "Critical"];
const STATUSES = ["Reported", "Assigned", "In Progress", "Resolved"];

const INITIAL_ISSUES = [
  { id: "ISS-1001", machineId: "CNC-04", issueType: "Overheating", severity: "High", description: "Motor overheating detected during shift. Temperature climbing past safe threshold.", assignedTo: "Ravi", status: "In Progress", createdAt: "2026-08-14 09:12" },
  { id: "ISS-1002", machineId: "CNC-07", issueType: "High vibration", severity: "Medium", description: "Abnormal vibration on spindle housing, intermittent.", assignedTo: "Meera", status: "Assigned", createdAt: "2026-08-15 14:03" },
  { id: "ISS-1003", machineId: "CNC-06", issueType: "Pressure problem", severity: "Low", description: "Hydraulic pressure reading slightly above baseline.", assignedTo: "Unassigned", status: "Reported", createdAt: "2026-08-16 07:40" },
  { id: "ISS-1004", machineId: "CNC-09", issueType: "Mechanical issue", severity: "Medium", description: "Scheduled maintenance in progress on pump seals.", assignedTo: "Arjun", status: "In Progress", createdAt: "2026-08-13 11:20" },
];

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "machines", label: "Machines", icon: Cog },
  { key: "maintenance", label: "Maintenance", icon: Wrench },
  { key: "insights", label: "AI Insights", icon: Sparkles },
];

/* ============================================================
   HELPERS
   ============================================================ */
const STATUS_STYLE = {
  Running: { badge: "b-green", color: "var(--green)" },
  Warning: { badge: "b-amber", color: "var(--amber)" },
  Stopped: { badge: "b-red", color: "var(--red)" },
  Maintenance: { badge: "b-blue", color: "var(--blue)" },
};
const SEVERITY_BADGE = { Low: "b-blue", Medium: "b-amber", High: "b-red", Critical: "b-red" };
const ISSUE_STATUS_BADGE = { Reported: "b-gray", Assigned: "b-blue", "In Progress": "b-amber", Resolved: "b-green" };

function seedRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
function seedFromString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}
function genHistory(machine) {
  const rand = seedRandom(seedFromString(machine.id));
  const points = [];
  const baseTemp = machine.temperature;
  const baseVibNum = machine.vibration === "High" ? 78 : 30;
  for (let i = 11; i >= 0; i--) {
    const drift = (rand() - 0.5) * 6;
    const vibDrift = (rand() - 0.5) * 10;
    points.push({
      t: `-${i}h`,
      temperature: Math.max(20, Math.round(baseTemp - i * 0.6 + drift)),
      vibration: Math.max(5, Math.round(baseVibNum - i * 0.3 + vibDrift)),
    });
  }
  points[points.length - 1] = { t: "now", temperature: baseTemp, vibration: baseVibNum };
  return points;
}

function computeInsights(machines, issues) {
  const insights = [];
  machines.forEach((m) => {
    const highTemp = m.temperature > 85;
    const highVib = m.vibration === "High";
    const issueCount = issues.filter((i) => i.machineId === m.id).length;
    if (highTemp && highVib) {
      insights.push({
        id: `${m.id}-combo`, machine: m, level: "critical",
        title: "Potential Motor/Bearing Issue",
        body: "High temperature and abnormal vibration detected. Recommended action: inspect motor and bearing.",
        rec: "Inspect the motor and bearing.",
      });
    } else {
      if (highTemp) insights.push({
        id: `${m.id}-temp`, machine: m, level: "warning",
        title: "High Temperature Alert",
        body: "Machine temperature is above the normal operating range.",
        rec: "Schedule a thermal inspection.",
      });
      if (highVib) insights.push({
        id: `${m.id}-vib`, machine: m, level: "warning",
        title: "Vibration Alert",
        body: "Abnormal vibration detected. Inspect the machine for mechanical issues.",
        rec: "Check mounting, bearings and alignment.",
      });
    }
    if (issueCount > 3) insights.push({
      id: `${m.id}-repeat`, machine: m, level: "info",
      title: "Repeated Failure Pattern",
      body: "This machine has experienced multiple issues. Consider preventive maintenance.",
      rec: "Add to preventive maintenance schedule.",
    });
  });
  return insights;
}

function parseDowntime(str) {
  const m = str.match(/(\d+)\s*min/);
  return m ? parseInt(m[1], 10) : 0;
}
function formatDowntime(totalMin) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { badge: "b-gray" };
  return <span className={`ioi-badge ${s.badge}`}><span className="ioi-dot" />{status}</span>;
}
function SeverityBadge({ severity }) {
  return <span className={`ioi-badge ${SEVERITY_BADGE[severity] || "b-gray"}`}><span className="ioi-dot" />{severity}</span>;
}
function IssueStatusBadge({ status }) {
  return <span className={`ioi-badge ${ISSUE_STATUS_BADGE[status] || "b-gray"}`}><span className="ioi-dot" />{status}</span>;
}

function Gauge({ value, max, unit, label, color, size = 128 }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const startAngle = 180, endAngle = 0;
  const angle = startAngle - pct * 180;
  const r = size / 2 - 12;
  const cx = size / 2, cy = size / 2;
  const toXY = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return [cx - r * Math.cos(rad), cy - r * Math.sin(rad)];
  };
  const [sx, sy] = toXY(startAngle);
  const [ex, ey] = toXY(endAngle);
  const [vx, vy] = toXY(angle);
  const bgPath = `M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`;
  const largeArc = pct > 0.5 ? 1 : 0;
  const fgPath = `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${vx} ${vy}`;
  return (
    <div className="ioi-gauge-wrap">
      <svg width={size} height={size / 1.65} viewBox={`0 0 ${size} ${size / 1.65}`}>
        <path d={bgPath} fill="none" stroke="#eef0f3" strokeWidth="10" strokeLinecap="round" />
        <path d={fgPath} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
      </svg>
      <div className="ioi-gauge-value" style={{ color }}>{value}<span style={{ fontSize: 12, marginLeft: 2, color: "var(--text-muted)" }}>{unit}</span></div>
      <div className="ioi-gauge-label">{label}</div>
    </div>
  );
}

function ChartCard({ title, data, dataKey, color, unit }) {
  return (
    <div className="ioi-card ioi-chart-card">
      <div className="ioi-section-title">{title}</div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#eef0f3" vertical={false} />
          <XAxis dataKey="t" tick={{ fontSize: 11, fill: "#8a97a4" }} axisLine={{ stroke: "#e2e6eb" }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#8a97a4" }} axisLine={false} tickLine={false} width={34} />
          <Tooltip
            formatter={(v) => [`${v}${unit}`, title]}
            contentStyle={{ borderRadius: 8, border: "1px solid #e2e6eb", fontSize: 12, fontFamily: "Inter" }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyState({ icon: Icon, title, body }) {
  return (
    <div className="ioi-empty">
      <div className="ioi-empty-icon"><Icon size={20} /></div>
      <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12.5 }}>{body}</div>
    </div>
  );
}

/* ============================================================
   REPORT ISSUE MODAL
   ============================================================ */
function ReportIssueModal({ machines, presetMachineId, onClose, onSubmit }) {
  const [machineId, setMachineId] = useState(presetMachineId || machines[0]?.id || "");
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
  const [severity, setSeverity] = useState("Medium");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [created, setCreated] = useState(null);

  const severityKey = { Low: "low", Medium: "medium", High: "high", Critical: "critical" };

  function handleSubmit(e) {
    e.preventDefault();
    const issue = {
      id: `ISS-${Math.floor(1000 + Math.random() * 9000)}`,
      machineId, issueType, severity, description: description.trim() || "No additional details provided.",
      assignedTo: "Unassigned", status: "Reported",
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    onSubmit(issue);
    setCreated(issue);
    setSubmitted(true);
  }

  if (submitted && created) {
    return (
      <div className="ioi-modal-overlay" onClick={onClose}>
        <div className="ioi-modal" onClick={(e) => e.stopPropagation()}>
          <div className="ioi-modal-header">
            <div className="ioi-modal-title">Issue reported</div>
            <button className="ioi-modal-close" onClick={onClose}><X size={18} /></button>
          </div>
          <div className="ioi-modal-body">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: "var(--green-soft)", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check size={19} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontFamily: "Space Grotesk", fontSize: 15 }}>{created.id} created for {created.machineId}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
                  "{issueType}" reported with {severity.toLowerCase()} severity. It now appears on the Maintenance board and in dashboard alerts.
                </div>
              </div>
            </div>
          </div>
          <div className="ioi-modal-footer">
            <button className="ioi-btn" onClick={onClose}>Close</button>
            <button className="ioi-btn ioi-btn-primary" onClick={() => onClose("maintenance")}>View in Maintenance <ChevronRight size={15} /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ioi-modal-overlay" onClick={onClose}>
      <form className="ioi-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="ioi-modal-header">
          <div className="ioi-modal-title">Report machine issue</div>
          <button type="button" className="ioi-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="ioi-modal-body">
          <div className="ioi-form-group">
            <label className="ioi-form-label">Machine</label>
            <select className="ioi-select" value={machineId} onChange={(e) => setMachineId(e.target.value)}>
              {machines.map((m) => <option key={m.id} value={m.id}>{m.id} — {m.type}</option>)}
            </select>
          </div>
          <div className="ioi-form-group">
            <label className="ioi-form-label">Issue type</label>
            <select className="ioi-select" value={issueType} onChange={(e) => setIssueType(e.target.value)}>
              {ISSUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="ioi-form-group">
            <label className="ioi-form-label">Severity</label>
            <div className="ioi-severity-row">
              {SEVERITIES.map((s) => (
                <div
                  key={s}
                  className={`ioi-severity-pill ${severity === s ? "active-" + severityKey[s] : ""}`}
                  onClick={() => setSeverity(s)}
                >{s}</div>
              ))}
            </div>
          </div>
          <div className="ioi-form-group" style={{ marginBottom: 0 }}>
            <label className="ioi-form-label">Description <span className="ioi-form-hint">optional</span></label>
            <textarea className="ioi-textarea" placeholder="Describe what you observed…" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <div className="ioi-modal-footer">
          <button type="button" className="ioi-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="ioi-btn ioi-btn-primary">Submit issue</button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
   PAGES
   ============================================================ */
function DashboardPage({ machines, issues, onOpenMachine, onNav, onReportIssue }) {
  const total = machines.length;
  const running = machines.filter((m) => m.status === "Running").length;
  const stopped = machines.filter((m) => m.status === "Stopped").length;
  const warning = machines.filter((m) => m.status === "Warning").length;
  const maintenance = machines.filter((m) => m.status === "Maintenance").length;
  const openIssues = issues.filter((i) => i.status !== "Resolved").length;
  const totalDowntimeMin = machines.reduce((sum, m) => sum + parseDowntime(m.downtime), 0);

  const statusBreakdown = [
    { label: "Running", count: running, color: "var(--green)" },
    { label: "Warning", count: warning, color: "var(--amber)" },
    { label: "Stopped", count: stopped, color: "var(--red)" },
    { label: "Maintenance", count: maintenance, color: "var(--blue)" },
  ];

  const recentAlerts = [...issues]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 4);

  const insights = computeInsights(machines, issues);
  const topInsight = insights.find((i) => i.level === "critical") || insights[0];

  const kpis = [
    { label: "Total Machines", value: total, color: "var(--text)" },
    { label: "Running", value: running, color: "var(--green)" },
    { label: "Stopped", value: stopped, color: "var(--red)" },
    { label: "Maintenance", value: maintenance, color: "var(--blue)" },
    { label: "Open Issues", value: openIssues, color: "var(--amber)" },
    { label: "Today's Downtime", value: formatDowntime(totalDowntimeMin), color: "var(--text)" },
  ];

  return (
    <div>
      <div className="ioi-kpi-grid">
        {kpis.map((k) => (
          <div className="ioi-card ioi-kpi" key={k.label}>
            <div className="ioi-kpi-label">{k.label}</div>
            <div className="ioi-kpi-value">{k.value}</div>
            <div className="ioi-kpi-accent" style={{ background: k.color }} />
          </div>
        ))}
      </div>

      <div className="ioi-dash-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="ioi-card" style={{ padding: 18 }}>
            <div className="ioi-section-row">
              <div className="ioi-section-title" style={{ margin: 0 }}>Recent Alerts</div>
              <span className="ioi-back" style={{ margin: 0 }} onClick={() => onNav("maintenance")}>View all <ChevronRight size={14} /></span>
            </div>
            {recentAlerts.length === 0 ? (
              <EmptyState icon={CircleCheck} title="No active alerts" body="All machines are currently within normal operating range." />
            ) : recentAlerts.map((alert) => {
              const sev = alert.severity;
              const iconColor = sev === "Critical" || sev === "High" ? "var(--red)" : sev === "Medium" ? "var(--amber)" : "var(--blue)";
              const iconBg = sev === "Critical" || sev === "High" ? "var(--red-soft)" : sev === "Medium" ? "var(--amber-soft)" : "var(--blue-soft)";
              return (
                <div className="ioi-alert" key={alert.id} onClick={() => onOpenMachine(alert.machineId)} style={{ cursor: "pointer" }}>
                  <div className="ioi-alert-icon" style={{ background: iconBg, color: iconColor }}><AlertTriangle size={15} /></div>
                  <div style={{ flex: 1 }}>
                    <div className="ioi-alert-title">{alert.machineId} — {alert.issueType}</div>
                    <div className="ioi-alert-sub">{alert.description}</div>
                  </div>
                  <SeverityBadge severity={alert.severity} />
                </div>
              );
            })}
          </div>

          <div className="ioi-card" style={{ padding: 18 }}>
            <div className="ioi-section-title">Machine Status</div>
            {statusBreakdown.map((s) => (
              <div className="ioi-status-bar-row" key={s.label}>
                <div className="ioi-status-bar-label"><span className="ioi-dot" style={{ background: s.color, width: 7, height: 7, borderRadius: "50%" }} />{s.label}</div>
                <div className="ioi-status-bar-track"><div className="ioi-status-bar-fill" style={{ width: `${(s.count / total) * 100}%`, background: s.color }} /></div>
                <div className="ioi-status-bar-count">{s.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {topInsight ? (
            <div className="ioi-insight-card">
              <div className="ioi-insight-head">
                <div className="ioi-insight-badge"><Sparkles size={15} /></div>
                <div>
                  <div className="ioi-insight-title">{topInsight.title}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-faint)", fontFamily: "JetBrains Mono" }}>{topInsight.machine.id}</div>
                </div>
              </div>
              <div className="ioi-insight-body">{topInsight.body}</div>
              <div className="ioi-insight-rec">Recommended action: {topInsight.rec}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="ioi-btn ioi-btn-sm" onClick={() => onOpenMachine(topInsight.machine.id)}>View machine</button>
                <button className="ioi-btn ioi-btn-sm ioi-btn-primary" onClick={() => onNav("insights")}>All insights</button>
              </div>
            </div>
          ) : (
            <div className="ioi-card" style={{ padding: 18 }}>
              <EmptyState icon={Sparkles} title="No insights right now" body="Rule-based checks haven't flagged anything." />
            </div>
          )}

          <div className="ioi-card" style={{ padding: 18 }}>
            <div className="ioi-section-title">Quick actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="ioi-btn" style={{ justifyContent: "flex-start" }} onClick={() => onNav("machines")}><Cog size={15} /> Browse machines</button>
              <button className="ioi-btn" style={{ justifyContent: "flex-start" }} onClick={onReportIssue}><Plus size={15} /> Report an issue</button>
              <button className="ioi-btn" style={{ justifyContent: "flex-start" }} onClick={() => onNav("maintenance")}><Wrench size={15} /> Open maintenance board</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MachinesPage({ machines, onOpenMachine }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = machines.filter((m) => {
    const matchesQuery = m.id.toLowerCase().includes(query.toLowerCase()) || m.type.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || m.status === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="ioi-card">
      <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 10 }}>
        <div className="ioi-pill-filter">
          {["All", "Running", "Warning", "Stopped", "Maintenance"].map((f) => (
            <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="ioi-search">
          <Search size={14} />
          <input placeholder="Search machines…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>
      <table className="ioi-table">
        <thead>
          <tr>
            <th>Machine</th><th>Type</th><th>Status</th><th>Temperature</th><th>Vibration</th><th>Today's Downtime</th><th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => (
            <tr key={m.id} onClick={() => onOpenMachine(m.id)}>
              <td className="ioi-machine-name">{m.id}</td>
              <td style={{ color: "var(--text-muted)" }}>{m.type}</td>
              <td><StatusBadge status={m.status} /></td>
              <td className="ioi-mono" style={{ color: m.temperature > 85 ? "var(--red)" : m.temperature > 78 ? "var(--amber)" : "var(--text)" }}>{m.temperature}°C</td>
              <td>
                <span className={`ioi-badge ${m.vibration === "High" ? "b-red" : "b-gray"}`}><span className="ioi-dot" />{m.vibration}</span>
              </td>
              <td className="ioi-mono">{m.downtime}</td>
              <td style={{ textAlign: "right" }}><ChevronRight size={16} color="var(--text-faint)" /></td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={7}><EmptyState icon={Search} title="No machines found" body="Try a different search term or filter." /></td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function MachineDetailPage({ machine, issues, onBack, onReportIssue }) {
  const history = useMemo(() => genHistory(machine), [machine]);
  const relatedIssues = issues.filter((i) => i.machineId === machine.id);
  const s = STATUS_STYLE[machine.status];

  return (
    <div>
      <div className="ioi-back" onClick={onBack}><ChevronLeft size={15} /> Back to Machines</div>
      <div className="ioi-detail-header">
        <div>
          <div className="ioi-detail-title">
            <div style={{ width: 40, height: 40, borderRadius: 9, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Factory size={19} />
            </div>
            {machine.id}
            <StatusBadge status={machine.status} />
          </div>
          <div className="ioi-meta-row">
            <div className="ioi-meta-item"><Cog size={13} /> {machine.type}</div>
            <div className="ioi-meta-item"><MapPin size={13} /> {machine.location}</div>
            <div className="ioi-meta-item"><Calendar size={13} /> Last maintenance {machine.lastMaintenance}</div>
            <div className="ioi-meta-item"><Clock size={13} /> Runtime {machine.runtime}</div>
          </div>
        </div>
        <button className="ioi-btn ioi-btn-primary" onClick={onReportIssue}><Plus size={15} /> Report Issue</button>
      </div>

      <div className="ioi-metric-grid" style={{ marginBottom: 18 }}>
        <div className="ioi-card ioi-metric-card">
          <Gauge value={machine.temperature} max={120} unit="°C" label="Temperature" color={machine.temperature > 85 ? "var(--red)" : machine.temperature > 78 ? "var(--amber)" : "var(--green)"} />
        </div>
        <div className="ioi-card ioi-metric-card">
          <Gauge value={machine.vibration === "High" ? 78 : 30} max={100} unit="" label={`Vibration · ${machine.vibration}`} color={machine.vibration === "High" ? "var(--red)" : "var(--green)"} />
        </div>
        <div className="ioi-card ioi-metric-card">
          <Gauge value={machine.pressure} max={100} unit="psi" label="Pressure" color="var(--blue)" />
        </div>
        <div className="ioi-card ioi-metric-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--text-muted)", fontSize: 12.5 }}><Clock size={14} /> Downtime today</div>
          <div className="ioi-display" style={{ fontSize: 24, fontWeight: 700 }}>{machine.downtime}</div>
        </div>
      </div>

      <div className="ioi-two-col" style={{ marginBottom: 18 }}>
        <ChartCard title="Temperature over time" data={history} dataKey="temperature" color="var(--red)" unit="°C" />
        <ChartCard title="Vibration over time" data={history} dataKey="vibration" color="var(--accent)" unit="" />
      </div>

      <div className="ioi-card" style={{ padding: 18 }}>
        <div className="ioi-section-row">
          <div className="ioi-section-title" style={{ margin: 0 }}>Recent Issues</div>
          <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{relatedIssues.length} total</span>
        </div>
        {relatedIssues.length === 0 ? (
          <EmptyState icon={Wrench} title="No issues reported" body="This machine has a clean maintenance history." />
        ) : relatedIssues.map((i) => (
          <div className="ioi-alert" key={i.id}>
            <div className="ioi-alert-icon" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}><Wrench size={15} /></div>
            <div style={{ flex: 1 }}>
              <div className="ioi-alert-title">{i.issueType} <span style={{ color: "var(--text-faint)", fontWeight: 500 }}>· {i.id}</span></div>
              <div className="ioi-alert-sub">{i.description}</div>
              <div style={{ marginTop: 6, display: "flex", gap: 6 }}><SeverityBadge severity={i.severity} /><IssueStatusBadge status={i.status} /></div>
            </div>
            <div style={{ fontSize: 11.5, color: "var(--text-faint)", whiteSpace: "nowrap" }}>{i.createdAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaintenancePage({ issues, machines, onStatusChange, onReportIssue }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? issues : issues.filter((i) => i.status === filter);
  const sorted = [...filtered].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div className="ioi-card">
      <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 10 }}>
        <div className="ioi-pill-filter">
          {["All", ...STATUSES].map((f) => (
            <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <button className="ioi-btn ioi-btn-primary ioi-btn-sm" onClick={onReportIssue}><Plus size={14} /> Report Issue</button>
      </div>
      <table className="ioi-table">
        <thead>
          <tr>
            <th>Issue</th><th>Machine</th><th>Severity</th><th>Assigned To</th><th>Status</th><th>Created</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((i) => (
            <tr key={i.id} style={{ cursor: "default" }}>
              <td>
                <div style={{ fontWeight: 600 }}>{i.issueType}</div>
                <div style={{ color: "var(--text-faint)", fontSize: 12 }}>{i.id}</div>
              </td>
              <td className="ioi-machine-name">{i.machineId}</td>
              <td><SeverityBadge severity={i.severity} /></td>
              <td style={{ color: "var(--text-muted)" }}>{i.assignedTo}</td>
              <td>
                <select
                  className="ioi-status-select"
                  value={i.status}
                  onChange={(e) => onStatusChange(i.id, e.target.value)}
                  style={{
                    background: `${ISSUE_STATUS_BADGE[i.status] === "b-green" ? "var(--green-soft)" : ISSUE_STATUS_BADGE[i.status] === "b-amber" ? "var(--amber-soft)" : ISSUE_STATUS_BADGE[i.status] === "b-blue" ? "var(--blue-soft)" : "#eef0f2"}`,
                    color: `${ISSUE_STATUS_BADGE[i.status] === "b-green" ? "#146b3c" : ISSUE_STATUS_BADGE[i.status] === "b-amber" ? "#8f5a06" : ISSUE_STATUS_BADGE[i.status] === "b-blue" ? "#1f4a80" : "#5b6b7a"}`,
                    border: "none",
                  }}
                >
                  {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </td>
              <td style={{ color: "var(--text-faint)", fontSize: 12 }} className="ioi-mono">{i.createdAt}</td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr><td colSpan={6}><EmptyState icon={Wrench} title="No issues here" body="Nothing matches this filter yet." /></td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AIInsightsPage({ machines, issues, onOpenMachine }) {
  const insights = computeInsights(machines, issues);
  const levelMeta = {
    critical: { icon: AlertTriangle, color: "var(--red)", bg: "var(--red-soft)", label: "Critical" },
    warning: { icon: AlertTriangle, color: "var(--amber)", bg: "var(--amber-soft)", label: "Warning" },
    info: { icon: Activity, color: "var(--blue)", bg: "var(--blue-soft)", label: "Info" },
  };

  return (
    <div>
      <div className="ioi-card" style={{ padding: 16, marginBottom: 18, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Sparkles size={16} />
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
          These insights are generated with simple rule-based logic evaluated against live machine readings — not a trained machine-learning model. Rules check temperature thresholds, vibration state, and issue frequency.
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="ioi-card" style={{ padding: 18 }}>
          <EmptyState icon={CircleCheck} title="No rule triggers right now" body="All machines are within normal thresholds and issue counts." />
        </div>
      ) : (
        <div className="ioi-two-col">
          {insights.map((ins) => {
            const meta = levelMeta[ins.level];
            const Icon = meta.icon;
            return (
              <div className="ioi-insight-card" key={ins.id}>
                <div className="ioi-insight-head">
                  <div className="ioi-insight-badge" style={{ background: meta.bg, color: meta.color }}><Icon size={15} /></div>
                  <div style={{ flex: 1 }}>
                    <div className="ioi-insight-title">{ins.title}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-faint)", fontFamily: "JetBrains Mono" }}>{ins.machine.id} · {ins.machine.type}</div>
                  </div>
                  <span className={`ioi-badge ${meta.label === "Critical" ? "b-red" : meta.label === "Warning" ? "b-amber" : "b-blue"}`}>{meta.label}</span>
                </div>
                <div className="ioi-insight-body">{ins.body}</div>
                <div className="ioi-insight-rec">Recommended action: {ins.rec}</div>
                <button className="ioi-btn ioi-btn-sm" style={{ marginTop: 12 }} onClick={() => onOpenMachine(ins.machine.id)}>View {ins.machine.id} <ChevronRight size={13} /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SettingsPage() {
  const [tempUnit, setTempUnit] = useState("celsius");
  const [notif, setNotif] = useState(true);
  const [refreshRate, setRefreshRate] = useState("30");

  return (
    <div className="ioi-card" style={{ padding: 22, maxWidth: 560 }}>
      <div className="ioi-section-title">General</div>
      <div className="ioi-form-group">
        <label className="ioi-form-label">Temperature unit</label>
        <select className="ioi-select" value={tempUnit} onChange={(e) => setTempUnit(e.target.value)}>
          <option value="celsius">Celsius (°C)</option>
          <option value="fahrenheit">Fahrenheit (°F)</option>
        </select>
      </div>
      <div className="ioi-form-group">
        <label className="ioi-form-label">Dashboard refresh interval</label>
        <select className="ioi-select" value={refreshRate} onChange={(e) => setRefreshRate(e.target.value)}>
          <option value="15">15 seconds</option>
          <option value="30">30 seconds</option>
          <option value="60">1 minute</option>
          <option value="off">Manual only</option>
        </select>
      </div>
      <div className="ioi-form-group" style={{ marginBottom: 4 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input type="checkbox" checked={notif} onChange={(e) => setNotif(e.target.checked)} style={{ width: 16, height: 16 }} />
          <span style={{ fontWeight: 600, fontSize: 12.5 }}>Email me when a critical alert is triggered</span>
        </label>
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--text-faint)" }}>
        Industrial Operations Intelligence · Prototype build · Settings shown here are for demo purposes and are not persisted.
      </div>
    </div>
  );
}

/* ============================================================
   APP SHELL
   ============================================================ */
export default function App() {
  const [view, setView] = useState("dashboard");
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreset, setModalPreset] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  function navigate(key) {
    setView(key);
    if (key !== "machine-detail") setSelectedMachineId(null);
  }

  function openMachine(id) {
    setSelectedMachineId(id);
    setView("machine-detail");
  }

  function openReportModal(machineId) {
    setModalPreset(machineId || null);
    setModalOpen(true);
  }

  function handleIssueSubmit(issue) {
    setIssues((prev) => [issue, ...prev]);
    // reflect that the machine now needs attention if not already flagged
    setMachines((prev) => prev.map((m) => {
      if (m.id !== issue.machineId) return m;
      if (m.status === "Running") return { ...m, status: "Warning" };
      return m;
    }));
  }

  function handleModalClose(redirect) {
    setModalOpen(false);
    setModalPreset(null);
    if (redirect === "maintenance") {
      showToast("Issue added to Maintenance");
      navigate("maintenance");
    }
  }

  function handleStatusChange(issueId, newStatus) {
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i)));
    const issue = issues.find((i) => i.id === issueId);
    if (newStatus === "Resolved" && issue) {
      // if this was the machine's only open issue, bring it back to Running
      const stillOpen = issues.some((i) => i.machineId === issue.machineId && i.id !== issueId && i.status !== "Resolved");
      if (!stillOpen) {
        setMachines((prev) => prev.map((m) => (m.id === issue.machineId && m.status === "Warning" ? { ...m, status: "Running" } : m)));
      }
    }
    showToast(`${issueId} marked as ${newStatus}`);
  }

  const selectedMachine = machines.find((m) => m.id === selectedMachineId);

  const titles = {
    dashboard: ["Dashboard", "Live overview of factory status and machine health"],
    machines: ["Machines", "All monitored equipment across the plant floor"],
    "machine-detail": [selectedMachine ? selectedMachine.id : "Machine", "Health, history and reported issues"],
    maintenance: ["Maintenance", "Track and resolve reported machine issues"],
    insights: ["AI Insights", "Rule-based recommendations from live machine data"],
    settings: ["Settings", "Prototype preferences"],
  };
  const [pageTitle, pageSub] = titles[view] || ["", ""];

  return (
    <div className="ioi-root">
      <style>{STYLE}</style>

      <aside className={`ioi-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="ioi-sidebar-brand">
          <div className="ioi-sidebar-brand-mark"><Factory size={16} color="#fff" /></div>
          {!collapsed && (
            <div>
              <div className="ioi-sidebar-brand-text">Industrial Operations<br />Intelligence</div>
            </div>
          )}
        </div>
        <nav className="ioi-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.key || (item.key === "machines" && view === "machine-detail");
            return (
              <button key={item.key} className={`ioi-nav-item ${active ? "active" : ""}`} onClick={() => navigate(item.key)} title={item.label}>
                <Icon size={17} />{!collapsed && item.label}
              </button>
            );
          })}
        </nav>
        <div className="ioi-nav-footer">
          <button className={`ioi-nav-item ${view === "settings" ? "active" : ""}`} onClick={() => navigate("settings")} title="Settings">
            <SettingsIcon size={17} />{!collapsed && "Settings"}
          </button>
          <button className="ioi-collapse-btn" onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /> Collapse</>}
          </button>
        </div>
      </aside>

      <main className="ioi-main">
        <div className="ioi-topbar">
          <div>
            <div className="ioi-topbar-title">{pageTitle}</div>
            <div className="ioi-topbar-sub">{pageSub}</div>
          </div>
          {view !== "machine-detail" && view !== "settings" && (
            <button className="ioi-btn ioi-btn-primary" onClick={() => openReportModal(null)}><Plus size={15} /> Report Issue</button>
          )}
        </div>

        <div className="ioi-content">
          {view === "dashboard" && (
            <DashboardPage machines={machines} issues={issues} onOpenMachine={openMachine} onNav={navigate} onReportIssue={() => openReportModal(null)} />
          )}
          {view === "machines" && <MachinesPage machines={machines} onOpenMachine={openMachine} />}
          {view === "machine-detail" && selectedMachine && (
            <MachineDetailPage
              machine={selectedMachine}
              issues={issues}
              onBack={() => navigate("machines")}
              onReportIssue={() => openReportModal(selectedMachine.id)}
            />
          )}
          {view === "maintenance" && (
            <MaintenancePage issues={issues} machines={machines} onStatusChange={handleStatusChange} onReportIssue={() => openReportModal(null)} />
          )}
          {view === "insights" && <AIInsightsPage machines={machines} issues={issues} onOpenMachine={openMachine} />}
          {view === "settings" && <SettingsPage />}
        </div>
      </main>

      {modalOpen && (
        <ReportIssueModal
          machines={machines}
          presetMachineId={modalPreset}
          onClose={handleModalClose}
          onSubmit={handleIssueSubmit}
        />
      )}

      {toast && (
        <div className="ioi-toast"><Check size={16} /> {toast}</div>
      )}
    </div>
  );
}
