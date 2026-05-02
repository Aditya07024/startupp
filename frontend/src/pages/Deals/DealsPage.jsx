import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { dealsApi } from "../../api/services";
import { formatCurrency } from "../../utils/formatCurrency";
import { useAuthStore } from "../../store/authStore";

export default function DealsPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState({ campaigns: [], applied: [] });

  const load = () => dealsApi.list().then(({ data }) => setData(data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const apply = async (id) => {
    try {
      await dealsApi.apply(id);
      toast.success("Applied to campaign");
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to apply");
    }
  };

  return (
    <PageWrapper>
      <Header title="Brand Deals Marketplace" subtitle="Find open campaigns or monitor creator applications in one marketplace." />
      <div className="grid gap-6 lg:grid-cols-2">
        {data.campaigns.map((campaign) => (
          <Card key={campaign._id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-xl font-semibold">{campaign.title}</p>
                <p className="mt-2 text-sm text-textMuted">{campaign.requirements || "UGC campaign with performance-focused deliverables."}</p>
              </div>
              <Badge>{campaign.status}</Badge>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
              <span>{formatCurrency(campaign.budget)}</span>
              <span>{campaign.platform?.join(", ")}</span>
              <span>{campaign.followerRequirement || 10000}+ followers</span>
            </div>
            {user?.role === "creator" && <Button onClick={() => apply(campaign._id)} className="mt-5">Apply Now</Button>}
          </Card>
        ))}
      </div>
      {user?.role === "creator" && (
        <Card className="mt-6 p-5">
          <h2 className="font-display text-xl font-semibold">Applied Campaigns</h2>
          <div className="mt-5 space-y-4">
            {data.applied.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-2xl border border-borderTone bg-bgSecondary p-4">
                <div>
                  <p className="font-medium">{item.campaignId?.title}</p>
                  <p className="mt-1 text-sm text-textMuted">Payout {formatCurrency(item.payoutAmount)}</p>
                </div>
                <Badge tone={item.status === "active" ? "success" : item.status === "rejected" ? "danger" : "warning"}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageWrapper>
  );
}
