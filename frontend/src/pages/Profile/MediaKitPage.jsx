import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { profileApi } from "../../api/services";

export default function MediaKitPage() {
  const [profile, setProfile] = useState(null);

  const load = () => profileApi.mine().then(({ data }) => setProfile(data.profile)).catch(() => {});
  useEffect(() => { load(); }, []);

  const generate = async () => {
    const { data } = await profileApi.generateMediaKit();
    toast.success("Media kit generated");
    setProfile((state) => ({ ...state, mediaKit: data.mediaKit }));
  };

  return (
    <PageWrapper>
      <Header title="Media Kit" subtitle="Generate a shareable public-facing media kit for brand outreach." />
      <Card className="p-5">
        <p className="text-sm text-textMuted">Username</p>
        <p className="mt-2 font-display text-2xl font-bold">{profile?.username}</p>
        <p className="mt-4 text-sm text-textMuted">Portfolio items: {profile?.portfolio?.length || 0}</p>
        <div className="mt-6 flex gap-3">
          <Button onClick={generate}>Generate PDF Media Kit</Button>
          {profile?.mediaKit?.downloadUrl && <a className="btn-secondary" href={profile.mediaKit.downloadUrl}>Open Latest</a>}
        </div>
      </Card>
    </PageWrapper>
  );
}
