import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { repurposeApi } from "../../api/services";

const platforms = ["Instagram Reel", "Facebook Post", "YouTube Short", "LinkedIn Article", "Twitter Thread"];

export default function RepurposeStudioPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ sourceType: "blog", content: "", targetPlatforms: ["Instagram Reel"] });
  const [item, setItem] = useState(null);
  const [history, setHistory] = useState([]);

  const load = () => repurposeApi.history().then(({ data }) => setHistory(data.items)).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async () => {
    try {
      const { data } = await repurposeApi.create(form);
      setItem(data.item);
      load();
      toast.success("Content repurposed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Repurpose failed");
    }
  };

  const togglePlatform = (platform) => {
    setForm((state) => ({
      ...state,
      targetPlatforms: state.targetPlatforms.includes(platform)
        ? state.targetPlatforms.filter((item) => item !== platform)
        : [...state.targetPlatforms, platform],
    }));
  };

  return (
    <PageWrapper>
      <Header title="Repurpose Studio" subtitle="Turn one source asset into platform-native outputs in a single workflow." />
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <div className="space-y-4">
            <select className="input-dark" value={form.sourceType} onChange={(e) => setForm((state) => ({ ...state, sourceType: e.target.value }))}>
              <option value="blog">Blog</option>
              <option value="youtube">YouTube</option>
              <option value="tweet">Tweet</option>
            </select>
            <textarea className="input-dark min-h-48" placeholder="Paste blog URL, transcript, raw text, or video description" value={form.content} onChange={(e) => setForm((state) => ({ ...state, content: e.target.value }))} />
            <div className="flex flex-wrap gap-3">
              {platforms.map((platform) => (
                <button key={platform} onClick={() => togglePlatform(platform)} className={`rounded-full px-4 py-2 text-sm ${form.targetPlatforms.includes(platform) ? "bg-blueTone text-white" : "bg-bgSecondary text-textMuted"}`}>
                  {platform}
                </button>
              ))}
            </div>
            <Button onClick={submit} disabled={!form.content || !form.targetPlatforms.length}>Repurpose Content</Button>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">Output</h2>
          <div className="mt-5 space-y-4">
            {(item?.outputs || []).map((output) => (
              <div key={output.platform} className="rounded-2xl border border-borderTone bg-bgSecondary p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{output.platform}</p>
                  <button onClick={() => navigator.clipboard.writeText(output.content)} className="text-sm text-blue-300">Copy</button>
                </div>
                <p className="mt-3 text-sm text-slate-200 whitespace-pre-line">{output.content}</p>
                <Button className="mt-4" variant="secondary" onClick={() => navigate(`/schedule?content=${encodeURIComponent(output.content)}&platform=${encodeURIComponent(output.platform)}`)}>Schedule This</Button>
              </div>
            ))}
            {!item && <p className="text-sm text-textMuted">No repurposed output yet.</p>}
          </div>
        </Card>
      </div>
      <Card className="mt-6 p-5">
        <h2 className="font-display text-xl font-semibold">History</h2>
        <div className="mt-5 space-y-3">
          {history.map((entry) => (
            <div key={entry._id} className="rounded-2xl border border-borderTone bg-bgSecondary p-4">
              <p className="font-medium capitalize">{entry.sourceType}</p>
              <p className="mt-1 text-sm text-textMuted">{entry.original.slice(0, 140)}</p>
            </div>
          ))}
        </div>
      </Card>
    </PageWrapper>
  );
}
