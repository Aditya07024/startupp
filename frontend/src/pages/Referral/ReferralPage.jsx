import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { walletApi } from "../../api/services";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ReferralPage() {
  const [data, setData] = useState({ wallet: { balance: 0 }, referralCode: "" });

  useEffect(() => {
    walletApi.get().then(({ data }) => setData(data)).catch(() => {});
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(data.referralCode || "");
    toast.success("Referral code copied");
  };

  return (
    <PageWrapper>
      <Header title="Referral & Earn" subtitle="Share your code, track referred signups, and unlock wallet credits." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <p className="text-sm text-textMuted">Referral Code</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-2xl border border-borderTone bg-bgSecondary px-4 py-3 font-display text-2xl">{data.referralCode || "--------"}</div>
            <Button onClick={copy}>Copy</Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-bgSecondary p-4">Invites Sent: 12</div>
            <div className="rounded-2xl bg-bgSecondary p-4">Joined: 5</div>
            <div className="rounded-2xl bg-bgSecondary p-4">Earned: {formatCurrency(data.wallet.balance)}</div>
          </div>
        </Card>
        <Card className="flex items-center justify-center p-5">
          <Button onClick={() => window.navigator.share?.({ title: "Join ViralBoost AI", text: `Use my referral code ${data.referralCode}` })}>Invite Now</Button>
        </Card>
      </div>
    </PageWrapper>
  );
}
