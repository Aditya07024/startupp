import { motion } from "framer-motion";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.3),_transparent_30%)] p-12 lg:block">
        <div className="glass-card flex h-full flex-col justify-between p-10">
          <div>
            <p className="font-display text-4xl font-bold">ViralBoost AI</p>
            <p className="mt-4 max-w-md text-lg text-slate-300">The command center for creators and brands scaling social reach, campaigns, and revenue.</p>
          </div>
          <div className="grid gap-4">
            {["AI-powered hooks and scripts", "Brand deal marketplace and campaign CRM", "Wallets, referrals, analytics, and scheduling"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-center p-6 lg:p-12">
        <div className="glass-card w-full max-w-xl p-8">
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-3 text-textMuted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}
