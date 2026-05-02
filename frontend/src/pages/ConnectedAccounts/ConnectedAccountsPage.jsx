import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { socialApi } from "../../api/services";

const platformMeta = {
  instagram: {
    title: "Instagram",
    helper: "Use a Meta Graph API access token from an Instagram professional account connected to a Facebook Page.",
    userIdLabel: "Instagram Business Account ID",
  },
  facebook: {
    title: "Facebook",
    helper: "Use a Meta Graph API page access token with the correct page insights permissions.",
    userIdLabel: "Facebook Page ID",
  },
  youtube: {
    title: "YouTube",
    helper: "Use a Google OAuth 2.0 access token with YouTube Data API access.",
    userIdLabel: "Channel ID (optional)",
  },
};

export default function ConnectedAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [activePlatform, setActivePlatform] = useState("instagram");
  const [form, setForm] = useState({
    instagram: { handle: "", accessToken: "", platformUserId: "" },
    facebook: { handle: "", accessToken: "", platformUserId: "" },
    youtube: { handle: "", accessToken: "", platformUserId: "" },
  });

  const activeMeta = platformMeta[activePlatform];
  const activeForm = form[activePlatform];
  const currentAccount = useMemo(
    () => accounts.find((item) => item.platform === activePlatform) || null,
    [accounts, activePlatform]
  );

  const load = () => {
    socialApi.accounts().then(({ data }) => {
      setAccounts(data.accounts || []);
      setForm((state) => {
        const next = { ...state };
        for (const account of data.accounts || []) {
          next[account.platform] = {
            handle: account.handle || "",
            accessToken: "",
            platformUserId: account.platformUserId || "",
          };
        }
        return next;
      });
    }).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const updateField = (field, value) => {
    setForm((state) => ({
      ...state,
      [activePlatform]: { ...state[activePlatform], [field]: value },
    }));
  };

  const connect = async () => {
    try {
      await socialApi.connect({
        platform: activePlatform,
        handle: activeForm.handle,
        accessToken: activeForm.accessToken,
        platformUserId: activeForm.platformUserId,
      });
      toast.success(`${activeMeta.title} connected`);
      setForm((state) => ({
        ...state,
        [activePlatform]: { ...state[activePlatform], accessToken: "" },
      }));
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to connect account");
    }
  };

  const sync = async () => {
    try {
      await socialApi.sync(activePlatform);
      toast.success(`${activeMeta.title} synced`);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Sync failed");
    }
  };

  const disconnect = async () => {
    try {
      await socialApi.disconnect(activePlatform);
      toast.success(`${activeMeta.title} disconnected`);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Disconnect failed");
    }
  };

  return (
    <PageWrapper>
      <Header title="Connected Accounts" subtitle="Connect Instagram, Facebook, and YouTube from one focused workspace." />
      <div className="mb-6 flex flex-wrap gap-3">
        {Object.keys(platformMeta).map((platform) => (
          <button
            key={platform}
            onClick={() => setActivePlatform(platform)}
            className={`rounded-full px-5 py-2 capitalize ${activePlatform === platform ? "bg-blueTone text-white" : "bg-bgSecondary text-textMuted"}`}
          >
            {platformMeta[platform].title}
          </button>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">{activeMeta.title} Connection</h2>
          <p className="mt-3 text-sm text-textMuted">{activeMeta.helper}</p>
          <div className="mt-6 space-y-4">
            <input
              className="input-dark"
              placeholder={`${activeMeta.title} handle or channel name`}
              value={activeForm.handle}
              onChange={(e) => updateField("handle", e.target.value)}
            />
            <input
              className="input-dark"
              placeholder="OAuth access token"
              value={activeForm.accessToken}
              onChange={(e) => updateField("accessToken", e.target.value)}
            />
            <input
              className="input-dark"
              placeholder={activeMeta.userIdLabel}
              value={activeForm.platformUserId}
              onChange={(e) => updateField("platformUserId", e.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <Button onClick={connect} disabled={!activeForm.handle || !activeForm.accessToken}>Connect</Button>
              <Button onClick={sync} variant="secondary" disabled={!currentAccount?.isConnected}>Sync</Button>
              <Button onClick={disconnect} variant="secondary" disabled={!currentAccount?.isConnected}>Disconnect</Button>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">Account Status</h2>
          <div className="mt-5 space-y-4">
            {accounts.map((account) => (
              <div key={account.platform} className="rounded-2xl border border-borderTone bg-bgSecondary p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium capitalize">{account.platform}</p>
                    <p className="mt-1 text-sm text-textMuted">
                      {account.isConnected ? account.handle || "Connected" : "Not connected"}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs ${account.isConnected ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-500/15 text-slate-300"}`}>
                    {account.isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-bgPrimary px-4 py-3 text-sm">Followers: {account.metrics?.followers?.toLocaleString?.() || 0}</div>
                  <div className="rounded-2xl bg-bgPrimary px-4 py-3 text-sm">Last Sync: {account.metrics?.lastSyncedAt ? new Date(account.metrics.lastSyncedAt).toLocaleString() : "Never"}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
