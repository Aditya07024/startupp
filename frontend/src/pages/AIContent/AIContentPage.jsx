import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { aiApi, viralScoreApi } from "../../api/services";
import { useAuthStore } from "../../store/authStore";

export default function AIContentPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [history, setHistory] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const fetchHistory = () => aiApi.history().then(({ data }) => setHistory(data.history)).catch(() => {});

  useEffect(() => {
    fetchHistory();
  }, []);

  const generate = async () => {
    try {
      setLoading(true);
      const { data } = await aiApi.generate({ topic });
      setContent(data.content);
      const predictionResponse = await viralScoreApi.predict({
        caption: data.content.caption,
        hashtags: data.content.hashtags,
        platform: "instagram",
        scheduledTime: new Date().toISOString(),
        followerCount: user?.socialAccounts?.find?.((a) => a.platform === "instagram")?.metrics?.followers || 0,
      });
      setPrediction(predictionResponse.data.prediction);
      toast.success("Content generated");
      fetchHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const generateIdeas = async () => {
    try {
      const { data } = await aiApi.reelIdeas({ topic });
      setIdeas(data.ideas || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not generate reel ideas");
    }
  };

  const runAnalyzer = async () => {
    try {
      const { data } = await aiApi.analyze({ topic });
      setAnalysis(data.analysis);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not analyze reel");
    }
  };

  return (
    <PageWrapper>
      <Header title="AI Content Generator" subtitle="Turn an idea into a hook, full script, caption, and hashtag set." />
      <Card className="p-5">
        <div className="flex flex-col gap-4 md:flex-row">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} className="input-dark flex-1" placeholder="Enter topic or campaign angle" />
          <Button onClick={generate} disabled={!topic || loading} className={loading ? "animate-pulse" : ""}>{loading ? "Generating..." : "Generate"}</Button>
          <Button onClick={generateIdeas} disabled={!topic} variant="secondary">Reel Ideas</Button>
          <Button onClick={runAnalyzer} disabled={!topic} variant="secondary">Reel Analyzer</Button>
        </div>
      </Card>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">Output</h2>
          {loading && <div className="mt-5 space-y-3">{[1, 2, 3, 4].map((item) => <div key={item} className="h-20 animate-pulse rounded-2xl bg-bgSecondary" />)}</div>}
          {!loading && content && (
            <div className="mt-5 space-y-4">
              {[
                ["Viral Hook", content.hook],
                ["Script", content.script],
                ["Caption", content.caption],
                ["Hashtags", content.hashtags?.join(" ")],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-borderTone bg-bgSecondary p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium">{label}</p>
                    <button onClick={() => navigator.clipboard.writeText(value || "")} className="text-sm text-blue-300">Copy</button>
                  </div>
                  <p className="text-sm leading-7 text-slate-200">{value}</p>
                </div>
              ))}
            </div>
          )}
          {!!ideas.length && (
            <div className="mt-6 rounded-2xl border border-borderTone bg-bgSecondary p-4">
              <p className="font-medium">AI Reel Ideas</p>
              <div className="mt-3 space-y-2 text-sm text-slate-200">
                {ideas.map((idea) => <p key={idea}>- {idea}</p>)}
              </div>
            </div>
          )}
          {analysis && (
            <div className="mt-6 rounded-2xl border border-borderTone bg-bgSecondary p-4">
              <p className="font-medium">Reel Analyzer</p>
              <p className="mt-2 text-sm text-slate-200">Score: {analysis.score}/100</p>
              <p className="mt-2 text-sm text-textMuted">{analysis.summary}</p>
            </div>
          )}
          {prediction && (
            <div className="mt-6 rounded-2xl border border-borderTone bg-bgSecondary p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Viral Potential Score</p>
                <span className={`rounded-full px-3 py-1 text-xs ${prediction.grade === "S" ? "bg-emerald-500/15 text-emerald-300" : prediction.grade === "A" ? "bg-blueTone/15 text-blue-300" : prediction.grade === "B" ? "bg-amber-500/15 text-amber-300" : "bg-red-500/15 text-red-300"}`}>{prediction.grade}</span>
              </div>
              <div className="mt-4 flex items-center gap-5">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-8 border-blueTone/20">
                  <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(#2563EB ${prediction.score * 3.6}deg, rgba(37,99,235,0.12) 0deg)` }} />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-bgSecondary font-display text-2xl font-bold">{prediction.score}</div>
                </div>
                <div className="text-sm text-textMuted">
                  <p>Predicted reach: {prediction.predictedReach}</p>
                  <p>Confidence: {prediction.confidenceRange}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="font-medium text-emerald-300">Strengths</p>
                  <div className="mt-2 space-y-2 text-sm text-textMuted">
                    {prediction.strengths.map((item) => <p key={item}>- {item}</p>)}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-amber-300">Improvements</p>
                  <div className="mt-2 space-y-2 text-sm text-textMuted">
                    {prediction.improvements.map((item) => <p key={item}>- {item}</p>)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">History</h2>
          <div className="mt-5 space-y-4">
            {history.map((item) => (
              <div key={item._id} className="rounded-2xl border border-borderTone bg-bgSecondary p-4">
                <p className="font-medium">{item.topic}</p>
                <p className="mt-2 text-sm text-textMuted">{item.caption}</p>
              </div>
            ))}
            {!history.length && <p className="text-sm text-textMuted">No generations yet.</p>}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
