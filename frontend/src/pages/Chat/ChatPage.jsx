import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { chatApi } from "../../api/services";
import { useAuthStore } from "../../store/authStore";

export default function ChatPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    chatApi.conversations().then(({ data }) => {
      setConversations(data.conversations);
      if (data.conversations[0]) {
        setActiveId(data.conversations[0]._id);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const poll = () => chatApi.messages(activeId).then(({ data }) => setMessages(data.messages)).catch(() => {});
    poll();
    const timer = setInterval(poll, 3000);
    return () => clearInterval(timer);
  }, [activeId]);

  const send = async () => {
    if (!text || !activeId) return;
    await chatApi.send(activeId, { text });
    setText("");
    const { data } = await chatApi.messages(activeId);
    setMessages(data.messages);
  };

  return (
    <PageWrapper>
      <Header title="Messages" subtitle="Creator-brand conversations with a polling-based real-time feel." />
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <Card className="p-4">
          <div className="space-y-3">
            {conversations.map((conversation) => {
              const other = conversation.participants.find((participant) => participant._id !== user?._id);
              return (
                <button key={conversation._id} onClick={() => setActiveId(conversation._id)} className={`w-full rounded-2xl p-4 text-left ${activeId === conversation._id ? "bg-blueTone/10" : "bg-bgSecondary"}`}>
                  <p className="font-medium">{other?.name || "Conversation"}</p>
                  <p className="mt-1 text-sm text-textMuted">{conversation.messages.at(-1)?.text || "Start the conversation"}</p>
                </button>
              );
            })}
          </div>
        </Card>
        <Card className="flex min-h-[560px] flex-col p-5">
          <div className="flex-1 space-y-3 overflow-auto">
            {messages.map((message) => (
              <div key={message._id} className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${String(message.senderId) === String(user?._id) ? "ml-auto bg-blueTone text-white" : "bg-bgSecondary text-slate-200"}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <input value={text} onChange={(e) => setText(e.target.value)} className="input-dark flex-1" placeholder="Write a message" />
            <Button onClick={send}>Send</Button>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
