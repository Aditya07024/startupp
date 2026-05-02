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

  const onSubmit = async (values) => {
    try {
      const { data } = await authApi.login(values);
      setUser(data.user, data.token);
      navigate(`/dashboard/${data.user.role || "creator"}`);
      toast.success("Welcome back");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthShell title="Sign in" subtitle="Access your dashboard, analytics, campaigns, and creator workflow.">
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
