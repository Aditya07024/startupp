import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";

const linksByRole = {
  creator: {
    Core: [
      ["Dashboard", "/dashboard/creator"],
      ["AI Content", "/ai-content"],
      ["Repurpose Studio", "/repurpose"],
      ["Connected Accounts", "/connected-accounts"],
      ["Inbox", "/inbox", "3"],
    ],
    Grow: [
      ["Analytics", "/analytics"],
      ["Trend Radar", "/trend-radar"],
      ["Competitor Watch", "/competitors"],
      ["Schedule", "/schedule"],
      ["Bio Builder", "/bio-builder"],
      ["Leaderboard", "/leaderboard"],
      ["Media Kit", "/dashboard/media-kit"],
    ],
    Earn: [
      ["Deals", "/deals"],
      ["Chat", "/chat"],
      ["Wallet", "/wallet"],
      ["Referral", "/referral"],
      ["Plans", "/subscription"],
    ],
  },
  brand: {
    Core: [
      ["Dashboard", "/dashboard/brand"],
      ["Campaigns", "/campaigns"],
      ["Connected Accounts", "/connected-accounts"],
      ["Inbox", "/inbox", "3"],
    ],
    Grow: [
      ["Trend Radar", "/trend-radar"],
      ["Competitor Watch", "/competitors"],
      ["Deals", "/deals"],
      ["Chat", "/chat"],
    ],
    Earn: [
      ["Wallet", "/wallet"],
      ["Plans", "/subscription"],
    ],
  },
  admin: {
    Core: [
      ["Dashboard", "/dashboard/admin"],
      ["Users", "/admin"],
      ["Campaigns", "/campaigns"],
      ["Connected Accounts", "/connected-accounts"],
    ],
    Grow: [
      ["Trend Radar", "/trend-radar"],
      ["Leaderboard", "/leaderboard"],
      ["Reports", "/analytics"],
    ],
    Earn: [
      ["Payments", "/wallet"],
    ],
  },
};

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const navigate = useNavigate();
  const sections = linksByRole[user?.role] || {};

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="ViralBoost AI" className="sidebar-logo-image" />
        <span className="sidebar-logo-text">ViralBoost</span>
      </div>
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {Object.entries(sections).map(([sectionLabel, links]) => (
          <div key={sectionLabel}>
            <span className="sidebar-section-label">{sectionLabel}</span>
            {links.map(([label, to, badge]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
                <span>{label}</span>
                {badge ? <span className="sidebar-badge">{badge}</span> : null}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-user">
        <div className="sidebar-user-card">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] font-mono text-xs">
            {user?.name?.[0] || "U"}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--text-primary)" }}>{user?.name}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{user?.role}</div>
          </div>
          <span className="sidebar-plan-badge">{user?.plan?.toUpperCase()}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <button onClick={toggleSidebar} className="btn-ghost">{sidebarCollapsed ? "Expand" : "Collapse"}</button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="btn-ghost"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
