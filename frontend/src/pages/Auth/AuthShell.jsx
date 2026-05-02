import { motion } from "framer-motion";

export default function AuthShell({ title, subtitle, children }) {
  const highlights = [
    {
      title: "AI Content Engine",
      copy: "Hooks, captions, repurposing, and posting ideas in one flow.",
      tone: "from-fuchsia-500/20 via-rose-500/10 to-orange-400/10",
      badge: "text-fuchsia-200 border-fuchsia-400/20 bg-fuchsia-500/10",
    },
    {
      title: "Campaign Pipeline",
      copy: "Track deals, DMs, creator outreach, and approvals with less chaos.",
      tone: "from-cyan-500/20 via-sky-500/10 to-blue-500/10",
      badge: "text-cyan-200 border-cyan-400/20 bg-cyan-500/10",
    },
    {
      title: "Revenue Layer",
      copy: "Referrals, wallets, subscriptions, and payout visibility built in.",
      tone: "from-emerald-500/20 via-lime-500/10 to-yellow-400/10",
      badge: "text-emerald-200 border-emerald-400/20 bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid min-h-screen bg-transparent lg:grid-cols-[1.15fr_0.85fr]">
      <div className="auth-showcase relative hidden overflow-hidden p-8 lg:block xl:p-10">
        <div className="auth-showcase-orb auth-showcase-orb-one" />
        <div className="auth-showcase-orb auth-showcase-orb-two" />
        <div className="auth-showcase-orb auth-showcase-orb-three" />

        <div className="auth-showcase-panel flex h-full flex-col justify-between">
          <div className="space-y-8">
            <div className="space-y-5 ">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
                Creator Growth OS
              </span>
              <div>
                <div className="flex items-center gap-4">
                  <img src="/logo.png" alt="ViralBoost AI" className="auth-brand-image" />
                  <p className="font-display text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white">
                    ViralBoost AI
                  </p>
                </div>
                <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                  A brighter, more focused workspace for creators and brands scaling content, campaigns, and income.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="auth-metric-card auth-metric-card-pink">
                <p className="auth-metric-label">Reach Lift</p>
                <p className="auth-metric-value">3.8x</p>
                <p className="auth-metric-note">content velocity</p>
              </div>
              <div className="auth-metric-card auth-metric-card-blue">
                <p className="auth-metric-label">Deal Flow</p>
                <p className="auth-metric-value">142</p>
                <p className="auth-metric-note">active convos</p>
              </div>
              <div className="auth-metric-card auth-metric-card-green">
                <p className="auth-metric-label">Payouts</p>
                <p className="auth-metric-value">$24K</p>
                <p className="auth-metric-note">tracked monthly</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 mt-5">
            {highlights.map((item) => (
              <div key={item.title} className={`auth-feature-card bg-gradient-to-r ${item.tone}`}>
                <div className={`inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${item.badge}`}>
                  {item.title}
                </div>
                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-200">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative flex items-center justify-center overflow-hidden p-6 lg:p-10"
      >
        <div className="auth-form-glow auth-form-glow-one" />
        <div className="auth-form-glow auth-form-glow-two" />

        <div className="auth-form-shell w-full max-w-xl p-8 lg:p-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-3xl font-bold text-white">{title}</p>
              <p className="mt-3 text-textMuted">{subtitle}</p>
            </div>
            
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}
