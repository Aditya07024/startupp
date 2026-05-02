import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "../../components/layout/Header";
import PageWrapper from "../../components/layout/PageWrapper";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { subscriptionApi } from "../../api/services";
import { useAuthStore } from "../../store/authStore";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [status, setStatus] = useState(null);
  const { setUser } = useAuthStore();

  useEffect(() => {
    subscriptionApi.plans().then(({ data }) => setPlans(data.plans)).catch(() => {});
    subscriptionApi.status().then(({ data }) => setStatus(data.status)).catch(() => {});
  }, []);

  const choosePlan = async (plan) => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Unable to load Razorpay");
      return;
    }

    try {
      const { data } = await subscriptionApi.createOrder({ plan });
      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "ViralBoost AI",
        description: `${plan} plan`,
        handler: async (response) => {
          const verify = await subscriptionApi.verifyPayment({ ...response, plan });
          setUser(verify.data.user, localStorage.getItem("viralboost_token"));
          toast.success("Plan activated");
        },
        theme: { color: "#2563EB" },
      });
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create order");
    }
  };

  return (
    <PageWrapper>
      <Header title="Subscription Plans" subtitle="Upgrade your workspace with more AI, campaign, and platform power." />
      <Card className="mb-6 p-5">
        <p className="text-sm text-textMuted">Access Status</p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <p className="font-display text-2xl font-bold capitalize">{status?.subscriptionStatus || "trial"}</p>
          <p className="text-sm text-textMuted">Plan: <span className="capitalize text-white">{status?.plan || "basic"}</span></p>
          {status?.trialEndsAt && <p className="text-sm text-textMuted">Trial ends: <span className="text-white">{new Date(status.trialEndsAt).toLocaleString()}</span></p>}
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={`p-6 ${plan.id === "pro" ? "ring-1 ring-blueTone" : ""}`}>
            <p className="font-display text-2xl font-bold">{plan.name}</p>
            <p className="mt-3 text-4xl font-bold">₹{plan.amount}</p>
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="rounded-2xl bg-bgSecondary px-4 py-3 text-sm">{feature}</div>
              ))}
            </div>
            <Button onClick={() => choosePlan(plan.id)} className="mt-6 w-full">Choose Plan</Button>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
