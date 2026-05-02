import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import BarMetricsChart from "../../components/charts/BarMetricsChart";

const creatorTools = [
  "AI Content",
  "Repurpose Studio",
  "Connected Accounts",
  "Analytics",
  "Trend Radar",
  "Competitor Watch",
  "Schedule",
  "Bio Builder",
  "Leaderboard",
  "Media Kit",
  "Deals",
  "Wallet",
  "Referral",
];

const brandTools = [
  "Campaign Management",
  "Creator Applications",
  "Deals",
  "Trend Radar",
  "Competitor Watch",
  "Wallet",
  "Plans",
];

const features = [
  {
    tag: "Create",
    title: "AI content engine for fast content production",
    copy: "Generate hooks, captions, angles, and repurposed content without switching tools.",
    tone: "landing-card-pink",
  },
  {
    tag: "Analyze",
    title: "Live growth visibility across your audience",
    copy: "Track followers, engagement, earnings, applications, and campaign performance in one place.",
    tone: "landing-card-blue",
  },
  {
    tag: "Publish",
    title: "Scheduling and best-time posting workflow",
    copy: "Plan posts, connect accounts, and publish using timing data instead of guessing.",
    tone: "landing-card-green",
  },
  {
    tag: "Earn",
    title: "Brand deals, wallet tracking, and referrals",
    copy: "Creators can monetize faster while brands can manage outreach, budgets, and deal flow.",
    tone: "landing-card-gold",
  },
];

const landingBarData = [
  { label: "Content", value: 84 },
  { label: "Growth", value: 72 },
  { label: "Deals", value: 61 },
  { label: "Scheduling", value: 67 },
  { label: "Revenue", value: 58 },
];

export default function LandingPage() {
  const { user } = useAuthStore();
  const primaryHref = user ? `/dashboard/${user.role}` : "/register";
  const primaryLabel = user ? "Open Dashboard" : "Start Free";

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <Link to="/" className="landing-brand">
          <img src="/logo-cropped.png" alt="ViralBoost AI" className="landing-brand-image" />
          <span>ViralBoost AI</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#features">Features</a>
          <a href="#roles">Who It's For</a>
          <a href="#modules">Modules</a>
          <a href="#workflow">How It Works</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost">Login</Link>
          <Link to={primaryHref} className="btn-primary">{primaryLabel}</Link>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <span className="landing-kicker">All-in-one growth and monetization workspace</span>
            <h1 className="landing-title">
              One platform for <span className="text-rose-300">creators</span>, <span className="text-sky-300">brands</span>, and <span className="text-emerald-300">campaign revenue</span>.
            </h1>
            <p className="landing-subtitle">
              ViralBoost AI combines AI content generation, analytics, connected accounts, scheduling, trend tracking,
              brand deals, referrals, wallets, and campaign management into a single product.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to={primaryHref} className="btn-primary">{primaryLabel}</Link>
              <Link to="/login" className="btn-secondary">See Existing Account</Link>
            </div>
            <div className="landing-proof">
              <span>AI content</span>
              <span>Campaign CRM</span>
              <span>Creator monetization</span>
              <span>Brand collaboration</span>
            </div>
          </div>

          <div className="landing-hero-panel">
            <div className="landing-panel-shell">
              <div className="landing-panel-top">
                <div>
                  <p className="landing-panel-label">Product Snapshot</p>
                  <h2>Everything your project already does</h2>
                </div>
                <span className="badge badge-violet">Multi-role</span>
              </div>

              <div className="landing-stat-grid">
                <div className="landing-stat-box landing-stat-box-pink">
                  <p>Creator stack</p>
                  <strong>14 tools</strong>
                </div>
                <div className="landing-stat-box landing-stat-box-blue">
                  <p>Brand stack</p>
                  <strong>8 tools</strong>
                </div>
                <div className="landing-stat-box landing-stat-box-green">
                  <p>Core flows</p>
                  <strong>Create, Grow, Earn</strong>
                </div>
              </div>

              <div className="landing-mini-columns">
                <div className="landing-mini-card">
                  <p className="landing-panel-label">Creators</p>
                  <ul>
                    <li>AI content and repurposing</li>
                    <li>Analytics and scheduling</li>
                    <li>Deals, wallet, referrals</li>
                  </ul>
                </div>
                <div className="landing-mini-card">
                  <p className="landing-panel-label">Brands</p>
                  <ul>
                    <li>Campaign creation</li>
                    <li>Application review</li>
                    <li>Spend and deal tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="landing-section">
          <div className="landing-section-head">
            <span className="landing-kicker">Features</span>
            <h2>Built around the full creator-to-revenue workflow</h2>
            <p>
              This landing page reflects the real product structure already inside your app instead of generic marketing copy.
            </p>
          </div>
          <div className="landing-feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className={`landing-feature-card ${feature.tone}`}>
                <span className="badge badge-cyan">{feature.tag}</span>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="roles" className="landing-section">
          <div className="landing-section-head">
            <span className="landing-kicker">Roles</span>
            <h2>Two primary user journeys, one platform</h2>
            <p>Creators use ViralBoost AI to grow and monetize. Brands use it to launch campaigns and manage creator pipelines.</p>
          </div>
          <div className="landing-role-grid">
            <article className="landing-role-card landing-role-card-creator">
              <h3>For creators</h3>
              <p>Create content faster, track audience growth, connect accounts, schedule posts, apply to deals, and monitor earnings.</p>
            </article>
            <article className="landing-role-card landing-role-card-brand">
              <h3>For brands</h3>
              <p>Create campaigns, review creator applications, manage conversations, track spend, and discover trends before competitors.</p>
            </article>
          </div>
        </section>

        <section id="modules" className="landing-section">
          <div className="landing-section-head">
            <span className="landing-kicker">Modules</span>
            <h2>What users can access inside the project</h2>
            <p>These are the actual major areas currently available across your app.</p>
          </div>
          <div className="landing-module-grid">
            <div className="landing-module-card">
              <h3>Creator workspace</h3>
              <div className="landing-chip-wrap">
                {creatorTools.map((item) => (
                  <span key={item} className="landing-chip">{item}</span>
                ))}
              </div>
            </div>
            <div className="landing-module-card">
              <h3>Brand workspace</h3>
              <div className="landing-chip-wrap">
                {brandTools.map((item) => (
                  <span key={item} className="landing-chip landing-chip-blue">{item}</span>
                ))}
              </div>
            </div>
            <div className="landing-chart-panel">
              <BarMetricsChart title="Platform Value Areas" data={landingBarData} height={290} />
            </div>
          </div>
        </section>

        <section id="workflow" className="landing-section">
          <div className="landing-section-head">
            <span className="landing-kicker">How It Works</span>
            <h2>Simple product story for new visitors</h2>
          </div>
          <div className="landing-steps">
            <div className="landing-step">
              <span>1</span>
              <h3>Join as creator or brand</h3>
              <p>Users choose their role during signup and get the matching workspace.</p>
            </div>
            <div className="landing-step">
              <span>2</span>
              <h3>Use the growth tools</h3>
              <p>Generate content, connect accounts, track trends, run campaigns, or manage outreach.</p>
            </div>
            <div className="landing-step">
              <span>3</span>
              <h3>Turn activity into revenue</h3>
              <p>Deals, wallet, applications, subscriptions, and referrals connect the growth workflow to earnings.</p>
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <div className="landing-cta-shell">
            <div>
              <span className="landing-kicker">Ready to launch</span>
              <h2>Put your product in front of visitors before asking them to log in.</h2>
              <p>New users can now understand the platform first, then choose whether to register or sign in.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to={primaryHref} className="btn-primary">{primaryLabel}</Link>
              <Link to="/login" className="btn-secondary">Login</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
