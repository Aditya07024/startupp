import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthShell from "./AuthShell";
import Button from "../../components/ui/Button";
import { authApi } from "../../api/services";
import { useAuthStore } from "../../store/authStore";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const loginWithCredentials = async (values, successMessage = "Welcome back") => {
    try {
      const { data } = await authApi.login(values);
      setUser(data.user, data.token);
      navigate(`/dashboard/${data.user.role || "creator"}`);
      toast.success(successMessage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const onSubmit = async (values) => {
    await loginWithCredentials(values);
  };

  const loginAsDemoUser = async () => {
    await loginWithCredentials(
      {
        email: "demo.creator@viralboost.local",
        password: "Demo@12345",
      },
      "Signed in as demo user"
    );
  };

  const loginAsDemoBrand = async () => {
    await loginWithCredentials(
      {
        email: "demo.recruiter@viralboost.local",
        password: "Demo@12345",
      },
      "Signed in as demo brand"
    );
  };

  return (
    <AuthShell title="Sign in" subtitle="Access your dashboard, analytics, campaigns, and creator workflow.">
      <div className="mb-5 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-4">
        <p className="text-sm font-semibold text-white">Demo Access</p>
        <p className="mt-1 text-sm text-slate-300">Use one-click demo accounts to test both creator and brand flows instantly.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="secondary" className="w-full" onClick={loginAsDemoUser} disabled={isSubmitting}>
            Login as Demo User
          </Button>
          <Button type="button" variant="secondary" className="w-full" onClick={loginAsDemoBrand} disabled={isSubmitting}>
            Login as Demo Brand
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input className="input-dark" placeholder="Email" {...register("email")} />
          {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>}
        </div>
        <div>
          <input type="password" className="input-dark" placeholder="Password" {...register("password")} />
          {errors.password && <p className="mt-2 text-sm text-red-300">{errors.password.message}</p>}
        </div>
        <Button className="w-full" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in"}</Button>
      </form>
      <p className="mt-5 text-sm text-textMuted">No account yet? <Link className="text-blue-300" to="/register">Create one</Link></p>
    </AuthShell>
  );
}
