/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Landmark, ShieldCheck } from "lucide-react";
import { FormInput } from "@/common/components/shared/FormInput";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useAuthApi";

export default function LoginPage() {
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

  const { mutateAsync: login } = useLogin();

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      const response = await login(formData);

      console.log("Login Success:", response);

      // Example token save
      localStorage.setItem("token", response?.token);

      // Example redirect
      // router.push("/dashboard");
    } catch (error: any) {
      console.error(
        "Login Failed:",
        error?.response?.data?.message || error.message,
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
              className="uppercase tracking-widest text-[10px]"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email",
                },
              })}
            />

            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}

            <div className="space-y-1">
              <div className="flex justify-between items-center -mb-1">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[13px] font-medium text-[#226296] hover:text-[#022448] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <FormInput
                label=""
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
              />

              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              className="w-full h-10 bg-linear-to-br from-[#022448] to-[#1e3a5f] text-white font-medium text-sm rounded-lg shadow-lg shadow-[#022448]/10 hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login to Portal"}
              <ArrowRight size={16} />
            </button>
          </form>

          <footer className="pt-8 flex justify-between items-center border-t border-slate-100">
            <p className="text-[10px] font-medium uppercase tracking-widest text-[#43474e]">
              © 2024 Sovereign Education
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-[10px] font-medium uppercase tracking-widest text-[#43474e] hover:text-[#022448]"
              >
                Support
              </Link>
              <Link
                href="#"
                className="text-[10px] font-medium uppercase tracking-widest text-[#43474e] hover:text-[#022448]"
              >
                Privacy
              </Link>
            </div>
          </footer>
        </div>
      </section>

      <section className="hidden md:flex w-1/2 bg-[#1e3a5f] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#022448]/60 backdrop-blur-[2px] z-10" />
          <img
            className="w-full h-full object-cover grayscale opacity-40"
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
            alt="Architecture"
          />
        </div>

        <div className="relative z-20 flex flex-col justify-end p-16 lg:p-24 h-full w-full">
          <div className="max-w-xl space-y-6">
            <div className="w-12 h-1 bg-white opacity-20" />
            <div className="space-y-4">
              <p className="text-3xl lg:text-4xl font-medium tracking-tight text-white leading-tight">
                The Sovereign Workspace: Empowering Educational Leadership
              </p>
              <footer className="flex items-center gap-3">
                <ShieldCheck className="text-white/60" size={20} />
                <cite className="not-italic text-sm font-medium text-white/60 uppercase tracking-widest">
                  Architecting Academic Excellence
                </cite>
              </footer>
            </div>

            <div className="flex gap-2 pt-8">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
            </div>
          </div>
        </div>

        <div className="absolute top-[-10%] right-[-10%] w-100 h-100 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute bottom-[-5%] right-[5%] w-50 h-50 rounded-full border border-white/10 pointer-events-none" />
      </section>
    </main>
  );
}
