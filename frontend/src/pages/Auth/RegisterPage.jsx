import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthShell from "./AuthShell";
import Button from "../../components/ui/Button";
import { authApi } from "../../api/services";
import { useAuthStore } from "../../store/authStore";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  referredByCode: z.string().optional(),
});

const roles = ["creator", "brand", "admin"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [role, setRole] = useState("creator");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const { data } = await authApi.register({ ...values, role });
      setUser(data.user, data.token);
      navigate(`/dashboard/${data.user.role || "creator"}`);
      toast.success("Account created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthShell title="Create account" subtitle="Choose your role and launch your creator or brand growth workspace.">
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {roles.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setRole(item)}
            className={`rounded-2xl border p-4 text-left capitalize transition ${role === item ? "border-blueTone bg-blueTone/10" : "border-borderTone bg-bgSecondary"}`}
          >
            <p className="font-display text-lg font-semibold">{item}</p>
            <p className="mt-1 text-sm text-textMuted">{item === "creator" ? "Grow faster with AI" : item === "brand" ? "Run high-ROI campaigns" : "Operate the platform"}</p>
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input className="input-dark" placeholder="Full name" {...register("name")} />
          {errors.name && <p className="mt-2 text-sm text-red-300">{errors.name.message}</p>}
        </div>
        <div>
          <input className="input-dark" placeholder="Email" {...register("email")} />
          {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>}
        </div>
        <div>
          <input type="password" className="input-dark" placeholder="Password" {...register("password")} />
          {errors.password && <p className="mt-2 text-sm text-red-300">{errors.password.message}</p>}
        </div>
        <input className="input-dark" placeholder="Referral code (optional)" {...register("referredByCode")} />
        <Button className="w-full" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create account"}</Button>
      </form>
      <p className="mt-5 text-sm text-textMuted">Already signed up? <Link className="text-blue-300" to="/login">Login</Link></p>
    </AuthShell>
  );
}
