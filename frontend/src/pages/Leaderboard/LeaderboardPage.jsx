import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import { leaderboardApi } from "../../api/services";

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("weekly");
  const [data, setData] = useState({ items: [], yourRank: null });

  useEffect(() => {
    leaderboardApi.list(`?platform=instagram&period=${period}`).then(({ data }) => {
      setData(data);
      if (period === "weekly" && data.yourRank) {
        toast.success(`You are ranked #${data.yourRank.rank} this ${period}`);
      }
    }).catch(() => {});
  }, [period]);

  return (
    <PageWrapper>
      <Header title="Leaderboard" subtitle="Weekly creator rankings across growth, engagement, and completed deals." />
      <div className="mb-6 flex gap-3">
        {["weekly", "monthly", "all-time"].map((item) => (
          <button key={item} onClick={() => setPeriod(item)} className={`rounded-full px-4 py-2 capitalize ${period === item ? "bg-blueTone text-white" : "bg-bgSecondary text-textMuted"}`}>{item}</button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {data.items.slice(0, 3).map((item) => (
          <Card key={item._id} className="p-5 text-center">
            <p className="text-sm text-blue-300">Rank #{item.rank}</p>
            <p className="mt-3 font-display text-2xl font-bold">{item.name}</p>
            <p className="mt-2 text-textMuted">{item.badge}</p>
            <p className="mt-4 text-4xl font-bold">{Math.round(item.score)}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-6 p-5">
        <div className="space-y-3">
          {data.items.map((item) => (
            <div key={item._id} className="flex items-center justify-between rounded-2xl border border-borderTone bg-bgSecondary p-4">
              <div>
                <p className="font-medium">#{item.rank} {item.name}</p>
                <p className="text-sm text-textMuted">{item.niche} • Engagement {item.engagementRate?.toFixed?.(1) || item.engagementRate}% • Deals {item.dealsCompleted}</p>
              </div>
              <Link className="text-blue-300" to={`/profile/${item.username}`}>View Profile</Link>
            </div>
          ))}
        </div>
      </Card>
      {data.yourRank && <Card className="mt-6 p-5"><p className="font-medium">Your Rank: #{data.yourRank.rank}</p></Card>}
    </PageWrapper>
  );
}
