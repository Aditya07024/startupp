import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import StatsCard from "../../components/charts/StatsCard";
import BarMetricsChart from "../../components/charts/BarMetricsChart";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { campaignsApi } from "../../api/services";
import { formatCurrency } from "../../utils/formatCurrency";

export default function BrandDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    campaignsApi.dashboard().then((response) => {
      setCampaigns(response.data.data.campaigns || []);
      setApplications(response.data.data.applications || []);
      setStats(response.data.data.stats || null);
      setChartData(response.data.data.chart || []);
    }).catch(() => {});
  }, []);

  return (
    <PageWrapper>
      <Header title="Brand Dashboard" subtitle="Campaign throughput, creator pipeline, and spend efficiency in one view." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Active Campaigns" value={stats?.activeCampaigns || 0} />
        <StatsCard label="Total Applications" value={stats?.totalApplications || 0} />
        <StatsCard label="Total Reach" value={(stats?.totalReach || 0).toLocaleString()} />
        <StatsCard label="Budget Spent" value={formatCurrency(stats?.budgetSpent || 0)} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <BarMetricsChart title="Brand Campaign Snapshot" data={chartData} />
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">My Campaigns</h2>
          <div className="mt-5 space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="rounded-2xl border border-borderTone bg-bgSecondary p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{campaign.title}</p>
                    <p className="mt-1 text-sm text-textMuted">{campaign.platform?.join(", ")}</p>
                  </div>
                  <Badge>{campaign.status}</Badge>
                </div>
              </div>
            ))}
            {!campaigns.length && <p className="text-sm text-textMuted">No campaigns created yet.</p>}
          </div>
        </Card>
      </div>
      <Card className="mt-6 p-5">
        <h2 className="font-display text-xl font-semibold">Recent Applications</h2>
        <div className="mt-5 space-y-4">
          {applications.map((application) => (
            <div key={application._id} className="rounded-2xl border border-borderTone bg-bgSecondary p-4">
              <p className="font-medium">{application.creatorId?.name}</p>
              <p className="mt-1 text-sm text-textMuted">{application.campaignId?.title}</p>
            </div>
          ))}
          {!applications.length && <p className="text-sm text-textMuted">No creator applications yet.</p>}
        </div>
      </Card>
    </PageWrapper>
  );
}
