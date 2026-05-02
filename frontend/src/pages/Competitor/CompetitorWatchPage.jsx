import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { competitorApi } from "../../api/services";

export default function CompetitorWatchPage() {
  const [items, setItems] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [form, setForm] = useState({ handle: "", platform: "instagram", niche: "" });

  const load = () => competitorApi.list().then(({ data }) => setItems(data.items)).catch(() => {});
  useEffect(() => { load(); }, []);

  const track = async () => {
    try {
      await competitorApi.track(form);
      setForm({ handle: "", platform: "instagram", niche: "" });
      load();
      toast.success("Competitor added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add competitor");
    }
  };

  const openAnalysis = async (id) => {
    const { data } = await competitorApi.analysis(id);
    setAnalysis(data.analysis);
  };

  return (
    <PageWrapper>
      <Header title="Competitor Watch" subtitle="Track rivals, compare engagement, and surface content gaps you can own." />
      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <input className="input-dark" placeholder="@handle" value={form.handle} onChange={(e) => setForm((s) => ({ ...s, handle: e.target.value }))} />
          <input className="input-dark" placeholder="platform" value={form.platform} onChange={(e) => setForm((s) => ({ ...s, platform: e.target.value }))} />
          <input className="input-dark" placeholder="niche" value={form.niche} onChange={(e) => setForm((s) => ({ ...s, niche: e.target.value }))} />
          <Button onClick={track}>Track Competitor</Button>
        </div>
      </Card>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">Tracked Competitors</h2>
          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-2xl border border-borderTone bg-bgSecondary p-4">
                <div>
                  <p className="font-medium">{item.handle}</p>
                  <p className="text-sm text-textMuted">{item.platform} • {item.niche}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => openAnalysis(item._id)}>Analyze</Button>
                  <Button variant="secondary" onClick={() => competitorApi.remove(item._id).then(load)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">Analysis</h2>
          {analysis ? (
            <>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { label: "Followers", value: analysis.latest.followers },
                    { label: "Engagement", value: analysis.latest.engagement },
                    { label: "Posts/Week", value: analysis.latest.postsPerWeek },
                  ]}>
                    <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
                    <XAxis dataKey="label" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip contentStyle={{ background: "#12121E", border: "1px solid rgba(99,102,241,0.15)" }} />
                    <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-5 rounded-2xl bg-bgSecondary p-4">
                <p className="font-medium">Top Hashtags They Use</p>
                <p className="mt-2 text-sm text-textMuted">{analysis.latest.topHashtags.join(" ")}</p>
              </div>
              <div className="mt-4 rounded-2xl bg-bgSecondary p-4">
                <p className="font-medium">Content Gap</p>
                <div className="mt-2 space-y-2 text-sm text-textMuted">
                  {analysis.contentGap.map((gap) => <p key={gap}>- {gap}</p>)}
                </div>
              </div>
            </>
          ) : <p className="mt-5 text-sm text-textMuted">Select a competitor to view analysis.</p>}
        </Card>
      </div>
    </PageWrapper>
  );
}
