import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { bioPageApi } from "../../api/services";

export default function BioBuilderPage() {
  const [page, setPage] = useState(null);
  const [link, setLink] = useState({ label: "", url: "", icon: "🔗" });

  const load = () => bioPageApi.mine().then(({ data }) => setPage(data.page)).catch(() => {});
  useEffect(() => { load(); }, []);

  const saveLink = async () => {
    await bioPageApi.addLink(link);
    setLink({ label: "", url: "", icon: "🔗" });
    load();
    toast.success("Link added");
  };

  return (
    <PageWrapper>
      <Header title="Bio Builder" subtitle="Build a link-in-bio page with a live mobile preview and tracked clicks." />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card className="p-5">
          <div className="space-y-4">
            <input className="input-dark" placeholder="Page title" value={page?.title || ""} onChange={(e) => setPage((state) => ({ ...state, title: e.target.value }))} />
            <textarea className="input-dark min-h-28" placeholder="Bio" value={page?.bio || ""} onChange={(e) => setPage((state) => ({ ...state, bio: e.target.value }))} />
            <div className="grid gap-4 md:grid-cols-3">
              <input className="input-dark" placeholder="Emoji" value={link.icon} onChange={(e) => setLink((state) => ({ ...state, icon: e.target.value }))} />
              <input className="input-dark" placeholder="Label" value={link.label} onChange={(e) => setLink((state) => ({ ...state, label: e.target.value }))} />
              <input className="input-dark" placeholder="URL" value={link.url} onChange={(e) => setLink((state) => ({ ...state, url: e.target.value }))} />
            </div>
            <div className="flex gap-3">
              <Button onClick={saveLink}>Add Link</Button>
              <Button variant="secondary" onClick={() => bioPageApi.save(page).then(load)}>Save Page</Button>
              <Button variant="secondary" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/bio/${page?.slug || ""}`)}>Copy your link</Button>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {(page?.links || []).sort((a, b) => a.order - b.order).map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-2xl border border-borderTone bg-bgSecondary p-4">
                <p>{item.icon} {item.label}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => bioPageApi.updateLink(item._id, { order: Math.max(0, item.order - 1) }).then(load)}>Up</Button>
                  <Button variant="secondary" onClick={() => bioPageApi.removeLink(item._id).then(load)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="mx-auto max-w-xs rounded-[32px] border border-borderTone bg-black p-4">
            <div className="rounded-[26px] bg-bgPrimary p-5 text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-blueTone/20" />
              <p className="mt-4 font-display text-2xl font-bold">{page?.title}</p>
              <p className="mt-2 text-sm text-textMuted">{page?.bio}</p>
              <div className="mt-6 space-y-3">
                {(page?.links || []).sort((a, b) => a.order - b.order).map((item) => (
                  <div key={item._id} className="rounded-2xl bg-blueTone px-4 py-3 text-white">{item.icon} {item.label}</div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
