import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { profileApi } from "../../api/services";

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    profileApi.public(username).then(({ data }) => setProfile(data.profile)).catch(() => {});
  }, [username]);

  if (!profile) return <div className="flex min-h-screen items-center justify-center bg-bgPrimary text-textMuted">Loading...</div>;

  return (
    <div className="min-h-screen bg-bgPrimary px-6 py-10 text-textPrimary">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h1 className="font-display text-5xl font-bold">{profile.name}</h1>
              <p className="mt-3 inline-block rounded-full bg-blueTone/10 px-4 py-2 text-sm text-blue-300">{profile.niche}</p>
              <p className="mt-4 max-w-2xl text-textMuted">{profile.bio}</p>
            </div>
            <button className="btn-primary">Collaborate</button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="glass-card p-5">Avg. Engagement: {profile.stats?.avgEngagement || 0}%</div>
          <div className="glass-card p-5">Total Reach: {profile.stats?.totalReach || 0}</div>
          <div className="glass-card p-5">Deals Completed: {profile.stats?.dealsCompleted || 0}</div>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(profile.portfolio || []).map((item) => (
            <div key={item._id} className="glass-card p-5">
              <div className="h-40 rounded-2xl bg-bgSecondary" />
              <p className="mt-4 font-medium">{item.title}</p>
              <p className="mt-2 text-sm text-textMuted">{item.platform}</p>
              <p className="mt-3 text-sm text-slate-200">Views {item.metrics?.views || 0} • Likes {item.metrics?.likes || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
