import { useEffect, useState } from "react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import { analyticsApi, aiApi, dealsApi, walletApi } from "../../api/services";
import { formatCurrency } from "../../utils/formatCurrency";
import { timeAgo } from "../../utils/timeAgo";

export default function CreatorDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [summary, setSummary] = useState(null);
  const [sources, setSources] = useState([]);
  const [topPlatforms, setTopPlatforms] = useState([]);
  const [growthHistory, setGrowthHistory] = useState([]);
  const [history, setHistory] = useState([]);
  const [deals, setDeals] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0 });
  const [bestTime, setBestTime] = useState(null);

  useEffect(() => {
    Promise.all([
      analyticsApi.overview(),
      analyticsApi.bestTime(),
      aiApi.history(),
      dealsApi.list(),
      walletApi.get(),
    ]).then(([a, b, h, d, w]) => {
      setAnalytics(a.data.data.instagram);
      setSummary(a.data.data.summary || null);
      setSources(a.data.data.sources || []);
      setTopPlatforms(a.data.data.topPlatforms || []);
      setGrowthHistory(a.data.data.growthHistory || []);
      setBestTime(b.data.data);
      setHistory(h.data.history || []);
      setDeals(d.data.applied || []);
      setWallet(w.data.wallet || { balance: 0 });
    }).catch(() => {});
  }, []);

  const recentActivity = history[0];
  const bestPostingSlot = bestTime?.bestTimes?.[0]?.slot || "No connected platform data";
  const pendingDeals = deals.filter((deal) => deal.status === "pending").length;
  const metricCards = [
    ["Total Followers", summary?.followers ? `${(summary.followers / 1000).toFixed(1)}K` : "0", summary?.followerChange ?? 0],
    ["Engagement Rate", summary?.engagement ? `${summary.engagement}%` : "0%", analytics?.change ?? 0],
    ["Impressions", summary?.impressions ? `${(summary.impressions / 1000000).toFixed(2)}M` : "0", analytics?.change ?? 0],
    ["Profile Visits", summary?.profileVisits?.toLocaleString?.() || "0", analytics?.change ?? 0],
  ];

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl">
        <div className="relative">
          <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-violet-500/25 to-blue-500/20 blur-2xl" />
          <Card className="relative rounded-[28px] border-white/10 bg-[#0d0d16]/90 p-6 shadow-2xl">
            

            <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
              {metricCards.map(([label, value, change]) => (
                <div key={label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 text-lg font-bold text-white">{value}</p>
                  <p className={`mt-1 text-xs ${change >= 0 ? "text-green-400" : "text-rose-400"}`}>
                    {change > 0 ? "+" : ""}{change}%
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 xl:col-span-2">
                <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="text-violet-300">◌</span>
                  Followers Growth
                </p>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthHistory}>
                      <Tooltip
                        contentStyle={{
                          background: "#111",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          color: "#fff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="instagram"
                        stroke="url(#creatorFollowersGradient)"
                        strokeWidth={3}
                        dot={{ r: 4, stroke: "#8B5CF6", strokeWidth: 2, fill: "#0B0B0B" }}
                      />
                      <defs>
                        <linearGradient id="creatorFollowersGradient" x1="0" y1="0" x2="1" y2="0">
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
                      <Pie data={topPlatforms} dataKey="value" innerRadius={28} outerRadius={48} paddingAngle={4}>
                        {topPlatforms.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-300">
                  {topPlatforms.map((item) => (
                    <div key={item.name} className="flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name} {item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_1fr]">
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                <p className="text-sm text-white">✨ Recent Activity</p>
                    <p className="mt-1 text-xs text-slate-400">
                  {recentActivity
                    ? `${recentActivity.topic} generated — ${timeAgo(recentActivity.createdAt)}`
                    : "No recent AI activity"}
                </p>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                <p className="text-sm text-white">⏰ Best Time to Post</p>
                <p className="mt-1 text-xs text-slate-400">{bestPostingSlot}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                <h2 className="font-display text-xl font-semibold text-white">Recent AI Content</h2>
                <div className="mt-5 space-y-4">
                  {history.slice(0, 4).map((item) => (
                    <div key={item._id} className="rounded-2xl border border-white/5 bg-black/20 p-4">
                      <p className="font-medium text-white">{item.topic}</p>
                      <p className="mt-2 text-sm text-slate-400">{item.caption}</p>
                    </div>
                  ))}
                  {!history.length && <p className="text-sm text-slate-400">No AI content yet.</p>}
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                <h2 className="font-display text-xl font-semibold text-white">Wallet Snapshot</h2>
                <p className="mt-3 text-4xl font-bold text-white">{formatCurrency(wallet.balance)}</p>
                <p className="mt-2 text-sm text-slate-400">Pending applications: {pendingDeals}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-400">
                  {sources.map((source) => (
                    <p key={source.platform} className="capitalize">
                      {source.platform}: {source.connected ? source.handle || "connected" : "not connected"}
                    </p>
                  ))}
                  {!sources.length && <p>No social accounts connected yet.</p>}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
