import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import { campaignsApi, dealsApi } from "../../api/services";
import { formatCurrency } from "../../utils/formatCurrency";
import { useAuthStore } from "../../store/authStore";

export default function CampaignsPage() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", platform: "Instagram", budget: "", targetAudience: "" });
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);

  const load = () => {
    campaignsApi.my().then(({ data }) => setCampaigns(data.campaigns)).catch(() => {});
    dealsApi.applications().then(({ data }) => setApplications(data.applications)).catch(() => {});
  };

  useEffect(() => {
    if (user?.role === "brand" || user?.role === "admin") {
      load();
    }
  }, [user?.role]);

  const submit = async () => {
    try {
      await campaignsApi.create({ ...form, platform: form.platform.split(",").map((item) => item.trim()) });
      toast.success("Campaign created");
      setOpen(false);
      setForm({ title: "", platform: "Instagram", budget: "", targetAudience: "" });
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create campaign");
    }
  };

  const updateApplication = async (id, status) => {
    try {
      await dealsApi.updateApplication(id, { status });
      toast.success(`Application ${status}`);
      load();
    } catch {
      toast.error("Unable to update application");
    }
  };

  return (
    <PageWrapper>
      <Header title="Campaign Management" subtitle="Launch campaigns, review applicants, and track budgeted performance." />
      {(user?.role === "brand" || user?.role === "admin") && <Button onClick={() => setOpen(true)}>Create Campaign</Button>}
      <div className="mt-6 space-y-6">
        {campaigns.map((campaign) => (
          <Card key={campaign._id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-xl font-semibold">{campaign.title}</p>
                <p className="mt-2 text-sm text-textMuted">{campaign.targetAudience || "Audience targeting not specified."}</p>
              </div>
              <Badge>{campaign.status}</Badge>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl bg-bgSecondary p-4">Budget: {formatCurrency(campaign.budget)}</div>
              <div className="rounded-2xl bg-bgSecondary p-4">Reach: {campaign.reach}</div>
              <div className="rounded-2xl bg-bgSecondary p-4">Engagement: {campaign.engagement}</div>
              <div className="rounded-2xl bg-bgSecondary p-4">Clicks: {campaign.clicks}</div>
            </div>
            <div className="mt-5">
              <p className="mb-3 font-medium">Applicants</p>
              <div className="space-y-3">
                {applications.filter((application) => application.campaignId?._id === campaign._id).map((application) => (
                  <div key={application._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-borderTone bg-bgSecondary p-4">
                    <div>
                      <p>{application.creatorId?.name}</p>
                      <p className="text-sm text-textMuted">{application.creatorId?.email}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => updateApplication(application._id, "active")}>Accept</Button>
                      <Button onClick={() => updateApplication(application._id, "rejected")} variant="secondary">Reject</Button>
                    </div>
                  </div>
                ))}
                {!applications.filter((application) => application.campaignId?._id === campaign._id).length && <p className="text-sm text-textMuted">No applicants yet.</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Create Campaign">
        <div className="space-y-4">
          <input className="input-dark" placeholder="Campaign title" value={form.title} onChange={(e) => setForm((state) => ({ ...state, title: e.target.value }))} />
          <input className="input-dark" placeholder="Platforms e.g. Instagram, YouTube" value={form.platform} onChange={(e) => setForm((state) => ({ ...state, platform: e.target.value }))} />
          <input className="input-dark" placeholder="Budget" value={form.budget} onChange={(e) => setForm((state) => ({ ...state, budget: Number(e.target.value) }))} />
          <textarea className="input-dark min-h-28" placeholder="Target audience" value={form.targetAudience} onChange={(e) => setForm((state) => ({ ...state, targetAudience: e.target.value }))} />
          <Button onClick={submit} className="w-full">Launch Campaign</Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
