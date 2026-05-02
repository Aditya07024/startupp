import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import StatsCard from "../../components/charts/StatsCard";
import GrowthChart from "../../components/charts/GrowthChart";
import Card from "../../components/ui/Card";
import { adminApi } from "../../api/services";
import { formatCurrency } from "../../utils/formatCurrency";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    Promise.all([adminApi.dashboard(), adminApi.users()]).then(([d, u]) => {
      setDashboard(d.data.data);
      setUsers(u.data.users);
    }).catch(() => {});
  }, []);

  return (
    <PageWrapper>
      <Header title="Admin Dashboard" subtitle="Platform health, user growth, campaign activity, and revenue command center." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard label="Total Users" value={dashboard?.totalUsers || 0} />
        <StatsCard label="Creators" value={dashboard?.creators || 0} />
        <StatsCard label="Brands" value={dashboard?.brands || 0} />
        <StatsCard label="Revenue" value={formatCurrency(dashboard?.revenue || 0)} />
        <StatsCard label="Payouts" value={formatCurrency(dashboard?.payouts || 0)} />
        <StatsCard label="Active Campaigns" value={dashboard?.activeCampaigns || 0} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GrowthChart data={dashboard?.growthData || []} />
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">Recent Users</h2>
          <div className="mt-5 space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user._id} className="flex items-center justify-between rounded-2xl border border-borderTone bg-bgSecondary p-4">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-textMuted">{user.email}</p>
                </div>
                <p className="text-sm capitalize text-blue-300">{user.role}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
