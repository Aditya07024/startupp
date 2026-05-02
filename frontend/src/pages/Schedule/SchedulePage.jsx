import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { analyticsApi, scheduleApi } from "../../api/services";

export default function SchedulePage() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [form, setForm] = useState({
    content: searchParams.get("content") || "",
    platform: searchParams.get("platform") || "Instagram",
    scheduledAt: "",
  });

  const load = () => scheduleApi.list().then(({ data }) => setPosts(data.posts)).catch(() => {});

  useEffect(() => {
    load();
    analyticsApi.bestTime().then(({ data }) => setInsights(data.data)).catch(() => {});
  }, []);

  const submit = async () => {
    try {
      await scheduleApi.create(form);
      toast.success("Post scheduled");
      setForm({ content: "", platform: "Instagram", scheduledAt: "" });
      load();
    } catch {
      toast.error("Unable to schedule post");
    }
  };

  return (
    <PageWrapper>
      <Header title="Smart Scheduling" subtitle="Queue content using best-time signals and topic trends." />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">Create Scheduled Post</h2>
          <div className="mt-5 space-y-4">
            <textarea className="input-dark min-h-32" placeholder="Post content" value={form.content} onChange={(e) => setForm((state) => ({ ...state, content: e.target.value }))} />
            <div className="grid gap-4 md:grid-cols-2">
              <input className="input-dark" placeholder="Platform" value={form.platform} onChange={(e) => setForm((state) => ({ ...state, platform: e.target.value }))} />
              <input type="datetime-local" className="input-dark" value={form.scheduledAt} onChange={(e) => setForm((state) => ({ ...state, scheduledAt: e.target.value }))} />
            </div>
            <Button onClick={submit}>Schedule Post</Button>
          </div>
          <div className="mt-8 space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="rounded-2xl border border-borderTone bg-bgSecondary p-4">
                <p className="font-medium">{post.platform}</p>
                <p className="mt-1 text-sm text-textMuted">{post.content}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="grid gap-6">
          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Best Time Suggestions</h2>
            <div className="mt-5 space-y-3">
              {insights?.bestTimes?.map((item) => (
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
              {insights?.trendingTopics?.map((topic) => (
                <span key={topic} className="rounded-full bg-bgSecondary px-4 py-2 text-sm">{topic}</span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
