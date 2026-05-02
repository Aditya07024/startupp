import { Link } from "react-router-dom";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAuthStore } from "../../store/authStore";

const followerData = [
  { day: "Mon", value: 82 },
  { day: "Tue", value: 88 },
  { day: "Wed", value: 91 },
  { day: "Thu", value: 97 },
  { day: "Fri", value: 104 },
  { day: "Sat", value: 112 },
  { day: "Sun", value: 128 },
];

const platformData = [
  { name: "Instagram", value: 62, color: "#E1306C" },
  { name: "YouTube", value: 25, color: "#FF0000" },
  { name: "Facebook", value: 13, color: "#1877F2" },
];

const featureCards = [
  ["AI Content Generator", "Generate reel ideas, captions, hooks and hashtags in seconds.", "from-fuchsia-500 to-violet-600"],
  ["Smart Scheduling", "Find best time to post and schedule across platforms.", "from-sky-500 to-cyan-500"],
  ["Analytics Dashboard", "Track followers, engagement and impressions in real-time.", "from-emerald-500 to-teal-500"],
  ["Trend & Hashtag Finder", "Discover trending topics & hashtags to go viral faster.", "from-pink-500 to-rose-500"],
  ["Brand Deals Marketplace", "Connect with brands & get paid for promotions.", "from-orange-500 to-amber-500"],
  ["Influencer Collaboration", "Find influencers & collaborate to grow together.", "from-indigo-500 to-blue-600"],
  ["Refer & Earn", "Invite friends and earn lifetime commissions & rewards.", "from-fuchsia-500 to-purple-600"],
  ["Multi-Platform Support", "Works with Instagram, Facebook & YouTube.", "from-sky-500 to-blue-500"],
];

const steps = [
  ["Connect Your Accounts", "Instagram, Facebook, YouTube in one click.", "from-violet-600 to-purple-500"],
  ["Generate AI Content", "Get viral content ideas, captions, hashtags & more.", "from-sky-600 to-cyan-500"],
  ["Post at Best Time", "Schedule and post at the best time for max engagement.", "from-indigo-600 to-blue-500"],
  ["Grow & Earn", "Grow your audience and earn money from brand deals.", "from-fuchsia-600 to-purple-500"],
];

const campaigns = [
  ["StyleHouse Co.", "Fashion", "Instagram", "$500–$2,000", "#E1306C"],
  ["TechVibe Labs", "Tech", "YouTube", "$1,000–$5,000", "#FF0000"],
  ["FitLife Nutrition", "Health", "Facebook", "$300–$1,500", "#1877F2"],
];

const creators = [
  ["A", "Alex Rivera", "@alexrivera · Lifestyle", "248K"],
  ["M", "Mia Chen", "@miachen · Beauty", "192K"],
  ["J", "James Park", "@jamespark · Tech", "315K"],
];

const plans = [
  {
    name: "Starter",
    price: "$19",
    note: "Perfect for Beginners",
    cta: "Start 3-Day Trial for $1",
    after: "Then $19/month",
    accent: "from-violet-600/20 to-violet-900/10",
    features: ["AI Reel Ideas", "Captions & Hashtags", "Basic Analytics", "1 Social Account", "Community Support"],
  },
  {
    name: "Pro",
    price: "$49",
    note: "For Growing Creators",
    cta: "Start 3-Day Trial for $1",
    after: "Then $49/month",
    accent: "from-violet-600/30 to-blue-900/20",
    highlight: true,
    features: ["Everything in Starter", "Advanced Analytics", "Trend Finder", "Best Time to Post", "Up to 5 Accounts"],
  },
  {
    name: "Premium",
    price: "$99",
    note: "For Influencers & Brands",
    cta: "Start 3-Day Trial for $1",
    after: "Then $99/month",
    accent: "from-sky-600/20 to-indigo-900/10",
    features: ["Everything in Pro", "Brand Deals Access", "Deep AI Insights", "Unlimited Accounts", "Priority Support 24/7"],
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function LandingPage() {
  const { user } = useAuthStore();
  const primaryHref = user ? `/dashboard/${user.role}` : "/register";
  const primaryLabel = user ? "Open Dashboard" : "Start Free Trial ($1)";

  return (
    <div className="min-h-screen bg-[#07070b] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(225,48,108,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(24,119,242,0.12),transparent_28%),radial-gradient(circle_at_bottom_center,rgba(139,92,246,0.08),transparent_34%)]" />
      <div className="relative">
        <header className="fixed left-0 right-0 top-0 z-40 bg-transparent py-6 transition-all duration-300">
          <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#07070b]/35 px-4 py-3 backdrop-blur-xl md:px-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 p-1">
                <img src="/logo-icon.png" alt="ViralBoost AI" className="h-full w-full rounded-lg object-cover" />
              </div>
              <span className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-xl font-bold tracking-tight text-transparent">ViralBoost AI</span>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
              <a href="#home" className="transition-colors hover:text-white">Home</a>
              <a href="#features" className="transition-colors hover:text-white">Features</a>
              <a href="#how-it-works" className="transition-colors hover:text-white">How It Works</a>
              <a href="#marketplace" className="transition-colors hover:text-white">Marketplace</a>
              <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
              <a href="#blog" className="transition-colors hover:text-white">Blog</a>
              <a href="#contact" className="transition-colors hover:text-white">Contact</a>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden text-sm font-medium text-slate-300 transition-colors hover:text-white md:block">Log In</Link>
              <Link to={primaryHref} className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-blue-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                {primaryLabel}
              </Link>
            </div>
          </div>
        </header>

        <main>
          <section id="home" className="overflow-hidden px-4 pb-20 pt-20 md:px-6 md:pb-28 md:pt-28">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                  #1 AI Growth & Earning Platform ⚡
                </div>

                <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.05em] text-white md:text-7xl">
                  Grow Your <span className="text-[#E1306C]">Instagram</span>, <span className="text-[#1877F2]">Facebook</span> &amp; <span className="text-[#FF0000]">YouTube</span> with AI 🚀
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">
                  AI-powered content ideas, analytics, scheduling, and brand collaborations — all in one platform.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link to={primaryHref} className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 text-center text-base font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.38)] transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-blue-500">
                    Start Free Trial ($1)
                  </Link>
                  <button className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10">
                    View Demo
                  </button>
                </div>

                <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-400">
                  {["Secure Payments", "No Credit Card Required", "Cancel Anytime", "Instant Access"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15">
                        <CheckIcon />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-violet-500/30 to-blue-500/20 blur-2xl" />
                <div className="relative rounded-[28px] border border-white/10 bg-[#0d0d16]/90 p-6 shadow-2xl backdrop-blur-xl">
                  <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <img src="/logo-icon.png" alt="Avatar" className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-white">ViralBoost AI — Dashboard</p>
                        <p className="text-xs text-slate-400">Pro Plan</p>
                      </div>
                    </div>
                    <div className="flex gap-2 text-lg text-slate-500">
                      <span className="transition hover:text-[#E1306C]">◉</span>
                      <span className="transition hover:text-[#1877F2]">◉</span>
                      <span className="transition hover:text-[#FF0000]">◉</span>
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                      ["Total Followers", "128.4K", "+12%"],
                      ["Engagement Rate", "8.73%", "+2.4%"],
                      ["Impressions", "2.45M", "+18%"],
                      ["Profile Visits", "48.9K", "+5%"],
                    ].map(([label, value, change]) => (
                      <div key={label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className="mt-1 text-lg font-bold text-white">{value}</p>
                        <p className="mt-1 text-xs text-green-400">{change}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4 md:col-span-2">
                      <p className="mb-4 text-sm font-semibold text-white">Followers Growth</p>
                      <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={followerData}>
                            <Tooltip
                              contentStyle={{
                                background: "#111",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 10,
                                color: "#fff",
                              }}
                            />
                            <Line type="monotone" dataKey="value" stroke="url(#followersGradient)" strokeWidth={3} dot={{ r: 4, stroke: "#8B5CF6", strokeWidth: 2, fill: "#0B0B0B" }} />
                            <defs>
                              <linearGradient id="followersGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="5%" stopColor="#8B5CF6" />
                                <stop offset="95%" stopColor="#3B82F6" />
                              </linearGradient>
                            </defs>
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <p className="mb-2 text-sm font-semibold text-white">Top Platforms</p>
                      <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={platformData} dataKey="value" innerRadius={28} outerRadius={48} paddingAngle={4}>
                              {platformData.map((item) => (
                                <Cell key={item.name} fill={item.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-300">
                        {platformData.map((item) => (
                          <div key={item.name} className="flex items-center gap-1">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span>{item.name} {item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                      <p className="text-sm text-white">✨ Recent Activity</p>
                      <p className="mt-1 text-xs text-slate-400">AI Reel Idea generated — 2 min ago</p>
                    </div>
                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                      <p className="text-sm text-white">⏰ Best Time to Post</p>
                      <p className="mt-1 text-xs text-slate-400">Today, 8:30 PM — High Engagement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-white/5 px-4 py-10 md:px-6">
            <div className="mx-auto max-w-7xl">
              <p className="mb-8 text-center text-xs font-bold uppercase tracking-[0.32em] text-slate-500">
                Trusted by <span className="text-violet-300">10,000+</span> Creators, Businesses &amp; Influencers
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 text-2xl font-black tracking-tight md:gap-14">
                <span style={{ color: "#4285F4" }}>Google</span>
                <span style={{ color: "#0082FB" }}>Meta</span>
                <span style={{ color: "#FF0000" }}>YouTube</span>
                <span style={{ color: "#E1306C" }}>Instagram</span>
                <span style={{ color: "#95BF47" }}>Shopify</span>
                <span style={{ color: "#1428A0" }}>Samsung</span>
              </div>
            </div>
          </section>

          <section id="features" className="px-4 py-24 md:px-6">
            <div className="mx-auto max-w-7xl">
              <div className="mb-14 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-300">Powerful Features</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">Everything You Need to Grow &amp; Earn</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">AI Tools, Analytics, Scheduling, &amp; Marketplace — All in One Place.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featureCards.map(([title, copy, gradient]) => (
                  <div key={title} className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-violet-500/30 hover:bg-white/[0.06]">
                    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-xl font-bold text-white shadow-lg`}>
                      ✦
                    </div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{copy}</p>
                    <p className="mt-4 text-xs font-semibold text-violet-300">Explore →</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="how-it-works" className="px-4 py-24 md:px-6">
            <div className="mx-auto max-w-7xl">
              <div className="mb-14 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-300">Easy Steps</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">How ViralBoost AI Works?</h2>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map(([title, copy, gradient], index) => (
                  <div key={title} className="text-center">
                    <div className="relative mx-auto mb-6 h-16 w-16">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-2xl font-black text-white shadow-xl`}>
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <p className="mx-auto mt-2 max-w-[200px] text-sm leading-7 text-slate-400">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="marketplace" className="px-4 py-24 md:px-6">
            <div className="mx-auto max-w-7xl">
              <div className="mb-14 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-fuchsia-300">Marketplace</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">Brand Deals Marketplace</h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">Businesses create campaigns. Creators apply and earn.</p>
              </div>

              <div className="grid gap-10 lg:grid-cols-2">
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">Active Campaigns</h3>
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/20 px-3 py-1 text-xs text-violet-200">For Businesses</span>
                  </div>
                  <div className="space-y-4">
                    {campaigns.map(([name, niche, platform, budget, color]) => (
                      <div key={name} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-white">{name}</p>
                            <p className="text-xs text-slate-500">{niche}</p>
                          </div>
                          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ color, backgroundColor: `${color}18`, border: `1px solid ${color}40` }}>
                            {platform}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Budget: <span className="font-semibold text-green-400">{budget}</span></span>
                          <button className="font-semibold text-violet-300 hover:text-violet-200">Apply</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">Top Creators</h3>
                    <span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs text-blue-200">For Brands</span>
                  </div>
                  <div className="space-y-4">
                    {creators.map(([initial, name, handle, followers]) => (
                      <div key={name} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 font-black text-white">
                          {initial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white">{name}</p>
                          <p className="text-xs text-slate-500">{handle}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{followers}</p>
                          <p className="text-xs text-slate-500">followers</p>
                        </div>
                        <button className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-xs font-semibold text-white">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="pricing" className="px-4 py-24 md:px-6">
            <div className="mx-auto max-w-7xl">
              <div className="mb-14 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-300">Simple Pricing</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">Choose Your Growth Plan</h2>
                <p className="mt-4 text-lg text-slate-400">Start with a 3-day trial for just $1. Cancel anytime.</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {plans.map((plan) => (
                  <div key={plan.name} className={`relative rounded-3xl border ${plan.highlight ? "border-violet-500/50" : "border-white/10"} bg-gradient-to-b ${plan.accent} p-7 backdrop-blur-sm`}>
                    {plan.highlight ? (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-[0_0_16px_rgba(139,92,246,0.45)]">
                        Most Popular
                      </div>
                    ) : null}
                    <p className="text-xs text-slate-400">{plan.note}</p>
                    <h3 className="mt-1 text-2xl font-black text-white">{plan.name}</h3>
                    <div className="mt-4 flex items-end gap-1">
                      <span className="text-4xl font-black text-white">{plan.price}</span>
                      <span className="mb-1 text-sm text-slate-400">/month</span>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15">
                            <CheckIcon />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <button className={`mt-8 w-full rounded-full py-3 text-sm font-bold text-white ${plan.highlight ? "bg-gradient-to-r from-violet-600 to-blue-600" : "bg-white/10"}`}>
                      {plan.cta}
                    </button>
                    <p className="mt-2 text-center text-xs text-slate-500">{plan.after}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  ["3-Day Trial for Only $1", "Full access to all features"],
                  ["No Hidden Charges", "Transparent pricing"],
                  ["Cancel Anytime", "No questions asked"],
                  ["14-Day Money Back", "100% refund guarantee"],
                ].map(([title, copy]) => (
                  <div key={title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500/15">
                      <CheckIcon />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-1 text-xs text-slate-500">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-white/5 px-4 py-16 md:px-6">
            <div className="mx-auto max-w-7xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Secure Payments</p>
              <h2 className="mt-4 text-3xl font-black text-white">Pay Securely With Your Preferred Method</h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {[
                  ["VISA", "#60a5fa"],
                  ["Mastercard", "#f87171"],
                  ["AMEX", "#22d3ee"],
                  ["stripe", "#818cf8"],
                  ["PhonePe", "#c084fc"],
                  ["Razorpay", "#93c5fd"],
                ].map(([label, color]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-3">
                    <span className="text-2xl font-black" style={{ color }}>{label}</span>
                  </div>
                ))}
                <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm font-bold text-green-300">
                  100% Secure SSL Encrypted
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 py-16 md:px-6">
            <div className="mx-auto max-w-7xl">
              <div className="relative overflow-hidden rounded-[32px] border border-violet-500/20 bg-gradient-to-r from-violet-900/80 via-violet-800/60 to-blue-900/80 p-8 md:p-12">
                <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-4xl">🎁</div>
                    <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">Invite Friends &amp; Earn Rewards</h2>
                    <p className="mt-3 text-lg text-slate-300">Earn <span className="font-bold text-yellow-400">$50</span> for every friend who joins ViralBoost AI.</p>
                  </div>
                  <div className="w-full max-w-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Your Referral Code</p>
                    <div className="mt-3 flex items-center justify-between rounded-2xl border border-violet-500/40 bg-black/35 px-5 py-4">
                      <span className="text-lg font-black tracking-[0.24em] text-white">VIRALBOOST50</span>
                      <button className="rounded-lg bg-white/10 px-3 py-2 text-xs text-slate-300">Copy</button>
                    </div>
                    <button className="mt-4 w-full rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_24px_rgba(139,92,246,0.4)]">
                      Invite Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-white/5 px-4 py-16 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Terms &amp; Conditions</h3>
                    <p className="mt-1 text-xs text-slate-500">Legal disclaimer — please read before using ViralBoost AI</p>
                  </div>
                  <span className="text-slate-400">⌄</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer id="contact" className="border-t border-white/5 px-4 pb-8 pt-16 md:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3">
                  <img src="/logo-cropped.png" alt="ViralBoost AI" className="h-12 w-auto rounded-xl object-cover" />
                  <span className="text-lg font-bold text-white">ViralBoost AI</span>
                </div>
                <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
                  The all-in-one AI platform to grow your social media, save time and earn money with brand collaborations.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Platform</h4>
                <div className="mt-4 space-y-3 text-sm text-slate-400">
                  <p>Features</p>
                  <p>Pricing</p>
                  <p>Marketplace</p>
                  <p>Influencer Hub</p>
                </div>
              </div>

              <div id="blog">
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Resources</h4>
                <div className="mt-4 space-y-3 text-sm text-slate-400">
                  <p>Blog</p>
                  <p>Help Center</p>
                  <p>Guides</p>
                  <p>Free Tools</p>
                  <p>API</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Company</h4>
                <div className="mt-4 space-y-3 text-sm text-slate-400">
                  <p>About Us</p>
                  <p>Contact Us</p>
                  <p>Privacy Policy</p>
                  <p>Terms &amp; Conditions</p>
                  <p>Refund Policy</p>
                  <p>Disclaimer</p>
                </div>
              </div>
            </div>

            <div className="mb-8 flex flex-col gap-6 border-t border-white/5 pt-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="font-bold text-white">Newsletter</h4>
                <p className="mt-1 text-sm text-slate-400">Subscribe to get updates, tips &amp; offers.</p>
              </div>
              <div className="flex w-full max-w-md items-center gap-2">
                <input className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" placeholder="Enter your email" />
                <button className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white">Send</button>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
              <p>© 2025 ViralBoost AI. All rights reserved.</p>
              <p>Built with AI. Powered by growth.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
