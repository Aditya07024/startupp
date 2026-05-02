import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import StatsCard from "../../components/charts/StatsCard";
import Card from "../../components/ui/Card";
import { analyticsApi, aiApi, dealsApi, walletApi } from "../../api/services";
import { formatCurrency } from "../../utils/formatCurrency";

export default function CreatorDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [sources, setSources] = useState([]);
  const [history, setHistory] = useState([]);
  const [deals, setDeals] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0 });

  useEffect(() => {
    Promise.all([analyticsApi.overview(), aiApi.history(), dealsApi.list(), walletApi.get()]).then(([a, h, d, w]) => {
      setAnalytics(a.data.data.instagram);
      setSources(a.data.data.sources || []);
      setHistory(h.data.history);
      setDeals(d.data.applied || []);
      setWallet(w.data.wallet);
    }).catch(() => {});
  }, []);

  return (
    <PageWrapper>
      <Header title="Creator Dashboard" subtitle="Daily pulse on growth, earnings, content output, and deal flow." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Followers Growth" value={analytics?.followers?.toLocaleString() || "--"} change={12.4} />
        <StatsCard label="Engagement Rate" value={`${analytics?.engagement || "--"}%`} change={4.8} accent="green" />
        <StatsCard label="Total Earnings" value={formatCurrency(wallet.balance)} change={9.2} />
        <StatsCard label="Active Deals" value={deals.length} change={3.1} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">Recent AI Content</h2>
          <div className="mt-5 space-y-4">
            {history.slice(0, 4).map((item) => (
              <div key={item._id} className="rounded-2xl border border-borderTone bg-bgSecondary p-4">
                <p className="font-medium">{item.topic}</p>
                <p className="mt-2 text-sm text-textMuted">{item.caption}</p>
              </div>
            ))}
            {!history.length && <p className="text-sm text-textMuted">No AI content yet.</p>}
          </div>
        </Card>
        <div className="grid gap-6">
          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Quick Actions</h2>
            <div className="mt-5 grid gap-3">
              {["AI Reel Ideas", "Reel Analyzer", "Best Time to Post", "Refer & Earn", "Brand Deals", "Multi-Platform Connect"].map((item) => (
                <div key={item} className="rounded-2xl border border-borderTone bg-bgSecondary px-4 py-3">{item}</div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Wallet Snapshot</h2>
            <p className="mt-3 text-4xl font-bold">{formatCurrency(wallet.balance)}</p>
            <p className="mt-2 text-sm text-textMuted">Pending applications: {deals.filter((deal) => deal.status === "pending").length}</p>
            <div className="mt-4 space-y-2 text-sm text-textMuted">
              {sources.map((source) => (
                <p key={source.platform} className="capitalize">{source.platform}: {source.connected ? source.handle || "connected" : "not connected"}</p>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
