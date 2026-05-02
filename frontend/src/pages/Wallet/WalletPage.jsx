import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { walletApi } from "../../api/services";
import { formatCurrency } from "../../utils/formatCurrency";

export default function WalletPage() {
  const [data, setData] = useState({ wallet: { balance: 0, pendingBalance: 0 }, transactions: [] });
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const load = () => walletApi.get().then(({ data }) => setData(data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const withdraw = async () => {
    try {
      await walletApi.withdraw({ amount: Number(amount) });
      toast.success("Withdrawal requested");
      setOpen(false);
      setAmount("");
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Withdrawal failed");
    }
  };

  return (
    <PageWrapper>
      <Header title="Wallet & Payouts" subtitle="Track available balance, pending withdrawals, and transaction flow." />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <p className="text-sm text-textMuted">Available Balance</p>
          <p className="mt-3 font-display text-4xl font-bold">{formatCurrency(data.wallet.balance)}</p>
          <p className="mt-4 text-sm text-textMuted">Pending: {formatCurrency(data.wallet.pendingBalance)}</p>
          <Button onClick={() => setOpen(true)} className="mt-6">Withdraw</Button>
        </Card>
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">Transaction History</h2>
          <div className="mt-5 space-y-4">
            {data.transactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between rounded-2xl border border-borderTone bg-bgSecondary p-4">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-textMuted">{new Date(transaction.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p>{formatCurrency(transaction.amount)}</p>
                  <Badge tone={transaction.type === "credit" ? "success" : "danger"}>{transaction.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Withdraw Funds">
        <div className="space-y-4">
          <input className="input-dark" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-borderTone bg-bgSecondary p-4">UPI Transfer</div>
            <div className="rounded-2xl border border-borderTone bg-bgSecondary p-4">Bank Transfer</div>
          </div>
          <Button onClick={withdraw} className="w-full">Request Withdrawal</Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
