"use client";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { ArrowRight, Landmark } from "lucide-react";
import { FormInput } from "@/common/components/shared/FormInput";
import { useForm } from "react-hook-form";

import { useAppDispatch } from "@/hooks/useStore";
import { setCredentials } from "../slice/index";
import { useLogin } from "../hooks/useAuthApi";
import { UserData } from "../types/index"; 

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutateAsync: login } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      
      const response = await login(formData);
      const userData: UserData = response.data;

      dispatch(setCredentials({ 
        user: userData, 
        token: userData.token 
      }));

      const roleType = userData.roles[0]?.roleType;
      const hasTenant = !!userData.tenant;

      switch (roleType) {
      case "admin":
        router.push("/admin/dashboard");
        break;

      case "staff":
        if (!hasTenant) throw new Error("Staff must belong to a tenant");
        router.push("/staff/dashboard");
        break;

      case "portal":
        if (!hasTenant) throw new Error("Portal user must belong to a tenant");
        router.push("/portal/dashboard");
        break;

      case "platform":
        if (!hasTenant) throw new Error("Platform manager must belong to a tenant");
        router.push("/platform/dashboard");
        break;

      default:
        router.push("/dashboard"); 
    }
    } catch (error: any) {
      console.error(
        "Login Failed:",
        error?.response?.data?.message || error.message
      );
    }
  };

  return (
    <main className="flex min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <section className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 md:p-16 lg:p-24 relative">
        <div className="absolute top-12 left-12">
          <div className="flex items-center gap-2">
            <Landmark className="text-[#022448]" size={32} fill="#022448" />
            <h1 className="text-xl font-bold tracking-tighter text-slate-900">
              Sovereign Edu
            </h1>
          </div>
        </div>

        <div className="w-full max-w-md space-y-8">
          <header className="space-y-2">
            <h2 className="text-3xl font-medium tracking-tight text-[#191c1e]">
              Welcome back
            </h2>
            <p className="text-[#43474e] text-sm leading-relaxed">
              Access your school dashboard
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              label="Email Address"
              id="email"
              type="email"
              placeholder="admin@sovereign.edu"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
            )}

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link href="/forgot-password"  className="text-[13px] text-[#226296] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <FormInput
                label={""}
                 id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 chars required" },
                })}              />
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              className="w-full h-11 bg-[#022448] text-white font-medium rounded-lg hover:bg-[#022448]/90 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Authenticating..." : "Login to Portal"}
              <ArrowRight size={16} />
            </button>
          </form>

          
        </div>
      </section>

      <section className="hidden md:flex w-1/2 bg-[#1e3a5f] relative">
      </section>
    </main>
  );
}