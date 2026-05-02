import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { trendsApi } from "../../api/services";

export default function TrendRadarPage() {
  const navigate = useNavigate();
  const [trends, setTrends] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [keyword, setKeyword] = useState("");

  const load = () => {
    Promise.all([trendsApi.live(), trendsApi.alerts()]).then(([live, alertData]) => {
      setTrends(live.data.trends);
      setAlerts(alertData.data.alerts);
    }).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const track = async () => {
    try {
      await trendsApi.track({ keyword, platform: "instagram" });
      toast.success("Keyword tracked");
      setKeyword("");
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to track keyword");
    }
  };

  return (
    <PageWrapper>
      <Header title="Trend Radar" subtitle="Monitor spikes, sentiment shifts, and topic momentum before the market catches up." />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">Trending Now</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {trends.map((trend) => (
              <button
                key={trend._id}
                onClick={() => navigate(`/ai-content?topic=${encodeURIComponent(trend.keyword)}`)}
                className="rounded-full border border-borderTone bg-bgSecondary px-4 py-3 text-left"
                style={{ fontSize: `${14 + Math.min(trend.mentionCount / 250, 16)}px` }}
              >
                {trend.keyword}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {trends.map((trend) => (
              <div key={trend.keyword} className="rounded-2xl border border-borderTone bg-bgSecondary p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{trend.keyword}</p>
                    <p className="mt-1 text-sm text-textMuted">{trend.platform} • {trend.mentionCount} mentions</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${trend.sentimentScore > 0.7 ? "text-emerald-300" : trend.sentimentScore > 0.45 ? "text-amber-300" : "text-red-300"}`}>
                      {trend.sentimentScore > 0.7 ? "Positive" : trend.sentimentScore > 0.45 ? "Neutral" : "Negative"}
                    </p>
                    {trend.spike && <p className="mt-1 text-xs text-blue-300">200%+ spike</p>}
                  </div>
                </div>
                <Button className="mt-4" onClick={() => navigate(`/ai-content?topic=${encodeURIComponent(trend.keyword)}`)}>Generate Content on This</Button>
              </div>
            ))}
          </div>
        </Card>
        <div className="grid gap-6">
          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Track Keyword</h2>
            <div className="mt-5 space-y-3">
              <input className="input-dark" placeholder="Keyword to monitor" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              <Button onClick={track} disabled={!keyword}>Track Now</Button>
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Spike Alerts</h2>
            <div className="mt-5 space-y-3">
              {alerts.map((alert) => (
                <div key={alert._id} className="rounded-2xl border border-borderTone bg-bgSecondary p-4">
                  <p className="font-medium">{alert.keyword}</p>
                  <p className="mt-1 text-sm text-textMuted">{alert.platform} • high spike detected</p>
                </div>
              ))}
              {!alerts.length && <p className="text-sm text-textMuted">No alerts in the last 24 hours.</p>}
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
