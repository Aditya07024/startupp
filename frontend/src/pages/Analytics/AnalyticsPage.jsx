import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import StatsCard from "../../components/charts/StatsCard";
import GrowthChart from "../../components/charts/GrowthChart";
import Card from "../../components/ui/Card";
import { analyticsApi } from "../../api/services";

export default function AnalyticsPage() {
  const [platform, setPlatform] = useState("instagram");
  const [overview, setOverview] = useState(null);
  const [bestTime, setBestTime] = useState(null);

  const load = () => {
    Promise.all([analyticsApi.overview(), analyticsApi.bestTime()]).then(([o, b]) => {
      setOverview(o.data.data);
      setBestTime(b.data.data);
    }).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const current = overview?.[platform];

  return (
    <PageWrapper>
      <Header title="Analytics Overview" subtitle="Growth metrics, platform trends, and best posting windows." />
      <div className="mb-6 flex gap-3">
        {["instagram", "facebook", "youtube"].map((item) => (
          <button key={item} onClick={() => setPlatform(item)} className={`rounded-full px-5 py-2 capitalize ${platform === item ? "bg-blueTone text-white" : "bg-bgSecondary text-textMuted"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Followers" value={current?.followers?.toLocaleString() || "--"} change={current?.change || 0} />
        <StatsCard label="Engagement" value={`${current?.engagement || "--"}%`} change={5.3} />
        <StatsCard label="Reach" value={current?.reach?.toLocaleString() || "--"} change={8.9} />
        <StatsCard label="Views" value={current?.views?.toLocaleString() || "--"} change={11.4} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GrowthChart data={overview?.growthHistory || []} />
        <div className="grid gap-6">
          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Best Time to Post</h2>
            <div className="mt-5 space-y-3">
              {bestTime?.bestTimes?.map((item) => (
                <div key={item.platform} className="rounded-2xl border border-borderTone bg-bgSecondary p-4">
                  <p className="font-medium">{item.platform}</p>
                  <p className="mt-1 text-sm text-textMuted">{item.slot}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Trending Topics</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {bestTime?.trendingTopics?.map((topic) => (
                <span key={topic} className="rounded-full border border-borderTone bg-bgSecondary px-4 py-2 text-sm">{topic}</span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
