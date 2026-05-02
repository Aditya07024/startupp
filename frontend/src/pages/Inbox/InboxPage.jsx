import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { inboxApi } from "../../api/services";

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState([]);
  const [active, setActive] = useState(null);
  const [reply, setReply] = useState("");
  const [type, setType] = useState("all");

  const load = () => {
    Promise.all([inboxApi.list(type === "all" ? "" : `?type=${type}`), inboxApi.stats()]).then(([m, s]) => {
      setMessages(m.data.messages);
      setStats(s.data.stats);
      setActive((current) => current || m.data.messages[0] || null);
    }).catch(() => {});
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, [type]);

  const sendReply = async () => {
    if (!active || !reply) return;
    await inboxApi.reply(active._id, { body: reply });
    setReply("");
    load();
    toast.success("Reply sent");
  };

  const suggest = async () => {
    if (!active) return;
    const { data } = await inboxApi.suggestReply(active._id);
    setReply(data.reply);
  };

  return (
    <PageWrapper>
      <Header title="Inbox" subtitle="One stream for DMs, comments, and mentions across your social stack." />
      <div className="mb-6 flex flex-wrap gap-3">
        {["all", "dm", "comment", "mention"].map((item) => (
          <button key={item} onClick={() => setType(item)} className={`rounded-full px-4 py-2 ${type === item ? "bg-blueTone text-white" : "bg-bgSecondary text-textMuted"}`}>
            {item === "all" ? "All" : item.toUpperCase()}
          </button>
        ))}
        <Button variant="secondary" onClick={() => inboxApi.bulkRead().then(load)}>Bulk Mark Read</Button>
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        {stats.map((stat) => <span key={stat._id} className="rounded-full bg-bgSecondary px-4 py-2 text-sm">{stat._id}: {stat.count}</span>)}
      </div>
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="p-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <button key={message._id} onClick={() => setActive(message)} className={`w-full rounded-2xl border p-4 text-left ${active?._id === message._id ? "border-blueTone bg-blueTone/10" : "border-borderTone bg-bgSecondary"}`}>
                <div className="flex items-center justify-between">
                  <p className="font-medium">{message.senderName}</p>
                  {!message.isRead && <span className="h-2.5 w-2.5 rounded-full bg-blueTone" />}
                </div>
                <p className="mt-1 text-xs uppercase tracking-wide text-textMuted">{message.platform} • {message.type}</p>
                <p className="mt-2 text-sm text-slate-200">{message.content}</p>
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          {active ? (
            <>
              <div className="border-b border-borderTone pb-4">
                <p className="font-display text-xl font-semibold">{active.senderName}</p>
                <p className="mt-1 text-sm text-textMuted">{active.platform} • {active.type}</p>
              </div>
              <div className="mt-5 rounded-2xl bg-bgSecondary p-4 text-sm text-slate-200">{active.content}</div>
              <div className="mt-5 space-y-3">
                {(active.replies || []).map((entry, index) => (
                  <div key={index} className="rounded-2xl border border-borderTone p-4 text-sm">{entry.body}</div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <input className="input-dark flex-1" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply" />
                <Button onClick={sendReply}>Reply</Button>
                <Button onClick={suggest} variant="secondary">AI Suggestion</Button>
              </div>
            </>
          ) : <p className="text-sm text-textMuted">No message selected.</p>}
        </Card>
      </div>
    </PageWrapper>
  );
}
