"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Dumbbell,
  Zap,
  Users,
  TrendingUp,
  Target,
  Activity,
} from "lucide-react";

const schema = z.object({
  email: z.string().email({ message: "Your email is invalid." }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters." }),
});

import { useMediaQuery } from "@/hooks/use-media-query";

const LogInForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");

  const togglePasswordType = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "admin@admin.com",
      password: "password",
    },
  });

  const [isVisible, setIsVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = () => {
    if (email == "admin@admin.com") {
      localStorage.setItem("role", "admin");
    } else if (email == "user@user.com") {
      localStorage.setItem("role", "user");
    }
  };

  const onSubmit = (data: { email: string; password: string }) => {
    startTransition(async () => {
      let response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (response?.ok) {
        toast.success("Login Successful");
        window.location.assign("/dashboard");
        reset();
      } else if (response?.error) {
        toast.error(response?.error);
      }
    });
  };

  handleLogin();

  return (
    <div className="min-h-screen basis-full md:basis-1/2 w-full px-4 py-8 flex justify-center items-center relative">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-[#262460]/20 backdrop-blur-sm"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#262460]/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border-2 border-[#ED4135]/30 relative overflow-hidden">
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#ED4135]/30 via-[#262460]/30 to-[#ED4135]/30 p-[2px] animate-pulse">
            <div className="bg-[#262460]/60 backdrop-blur-xl rounded-3xl w-full h-full"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-24 h-24 bg-gradient-to-br from-[#ED4135] to-[#262460] rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-8 relative overflow-hidden border-2 border-white/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent animate-pulse"></div>
                <Dumbbell
                  className="w-12 h-12 text-white relative z-10"
                  strokeWidth={3}
                />
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-black text-white tracking-tight">
                  WELCOME BACK! 🔥
                </h1>
                <p className="text-gray-300 text-base leading-relaxed font-medium">
                  Ready to crush your fitness goals? Let's get started.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-8">
              {/* Email Field */}
              <div className="space-y-3">
                <label
                  htmlFor="email"
                  className="text-gray-200 font-bold flex items-center gap-2 text-sm uppercase tracking-wider"
                >
                  <Mail className="w-4 h-4 text-[#ED4135]" />
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    disabled={isPending}
                    {...register("email")}
                    type="email"
                    id="email"
                    placeholder="trainer@PlanFitness.com"
                    className={`w-full bg-[#262460]/30 border-2 transition-all duration-300 text-white placeholder:text-gray-400 rounded-xl py-4 pl-12 pr-4 font-semibold ${
                      errors.email
                        ? "border-[#ED4135]/70 focus:border-[#ED4135]"
                        : "border-[#262460]/50 focus:border-[#ED4135]/70 focus:bg-[#262460]/50"
                    } focus:outline-none focus:ring-2 focus:ring-[#ED4135]/30 backdrop-blur-sm`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ED4135] transition-colors" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ED4135]/0 via-[#262460]/0 to-[#ED4135]/0 group-focus-within:from-[#ED4135]/10 group-focus-within:via-[#262460]/5 group-focus-within:to-[#ED4135]/10 transition-all duration-300 pointer-events-none"></div>
                </div>
                {errors.email && (
                  <div className="text-[#ED4135] text-sm flex items-center gap-2 font-bold">
                    <Zap className="w-4 h-4" />
                    {errors.email.message}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label
                  htmlFor="password"
                  className="text-gray-200 font-bold flex items-center gap-2 text-sm uppercase tracking-wider"
                >
                  <Lock className="w-4 h-4 text-[#262460]" />
                  Password
                </label>
                <div className="relative group">
                  <input
                    disabled={isPending}
                    {...register("password")}
                    type={passwordType}
                    id="password"
                    placeholder="Enter your password"
                    className={`w-full bg-[#262460]/30 border-2 transition-all duration-300 text-white placeholder:text-gray-400 rounded-xl py-4 pl-12 pr-12 font-semibold ${
                      errors.password
                        ? "border-[#ED4135]/70 focus:border-[#ED4135]"
                        : "border-[#262460]/50 focus:border-[#ED4135]/70 focus:bg-[#262460]/50"
                    } focus:outline-none focus:ring-2 focus:ring-[#ED4135]/30 backdrop-blur-sm`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ED4135] transition-colors" />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    onClick={togglePasswordType}
                  >
                    {passwordType === "password" ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ED4135]/0 via-[#262460]/0 to-[#ED4135]/0 group-focus-within:from-[#ED4135]/10 group-focus-within:via-[#262460]/5 group-focus-within:to-[#ED4135]/10 transition-all duration-300 pointer-events-none"></div>
                </div>
                {errors.password && (
                  <div className="text-[#ED4135] text-sm flex items-center gap-2 font-bold">
                    <Zap className="w-4 h-4" />
                    {errors.password.message}
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-5 h-5 rounded-md border-2 border-[#262460]/50 bg-[#262460]/30 text-[#ED4135] focus:ring-[#ED4135]/30 focus:ring-2"
                  />
                  <label
                    htmlFor="remember"
                    className="text-gray-300 text-sm font-semibold"
                  >
                    Keep me logged in
                  </label>
                </div>
                <button
                  type="button"
                  className="text-[#ED4135] hover:text-[#ED4135]/80 text-sm transition-colors font-bold tracking-wide"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#ED4135] via-[#ED4135]/90 to-[#262460] hover:from-[#ED4135]/90 hover:via-[#ED4135] hover:to-[#262460]/90 text-white font-black py-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-2xl text-xl tracking-widest relative overflow-hidden group border-2 border-[#ED4135]/50"
                disabled={isPending}
                onClick={handleSubmit(onSubmit)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isPending && <Loader2 className="w-6 h-6 animate-spin" />}
                  {isPending ? "ENTERING..." : "ENTER THE ZONE"}
                  {!isPending && <Dumbbell className="w-6 h-6" />}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
