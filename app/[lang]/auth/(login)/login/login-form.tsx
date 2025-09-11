"use client";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Logo from "../../../../../public/images/auth/Capture-removebg-preview.png";

import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Dumbbell,
  Flame,
} from "lucide-react";

import { useTranslate } from "@/config/useTranslation";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LogInForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("password");
  const [rememberMe, setRememberMe] = useState(false);
  const { t } = useTranslate();
  const router = useRouter();

  const togglePasswordType = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const onSubmit = () => {
    setIsPending(true);
    toast.success(t("Login Successful"));

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen basis-full md:basis-1/2 w-full px-6 py-8 flex justify-center items-center relative">
      {/* Enhanced background with mesh gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 opacity-95"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_50%)]"></div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-cyan-500/50 opacity-75 blur-sm"></div>
          <div className="absolute inset-[1px] rounded-3xl bg-slate-900/90 backdrop-blur-xl"></div>

          <div className="relative z-10">
            {/* Modern Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent group-hover:animate-pulse"></div>
                <Image src={Logo} alt="Logo" width={100} height={100} />
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-white">
                  {t("Welcome Back")}
                  <span className="block text-lg font-normal text-gray-400 mt-1">
                    {t("Ready to crush your goals?")} 💪
                  </span>
                </h1>
              </div>
            </div>

            {/* Modern Form */}
            <div className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-gray-300 font-medium flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-pink-400" />
                  {t("Email Address")}
                </label>
                <div className="relative group">
                  <input
                    disabled={isPending}
                    type="email"
                    placeholder="trainer@planfitness.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 text-white placeholder:text-gray-500 rounded-xl py-3.5 px-4 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-cyan-500/0 group-focus-within:from-pink-500/5 group-focus-within:via-purple-500/5 group-focus-within:to-cyan-500/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-gray-300 font-medium flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4 text-purple-400" />
                  {t("Password")}
                </label>
                <div className="relative group">
                  <input
                    disabled={isPending}
                    type={passwordType}
                    placeholder="Enter your password"
                    className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 text-white placeholder:text-gray-500 rounded-xl py-3.5 px-4 pr-12 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white/10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
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
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="text-pink-400 hover:text-pink-300 transition-colors font-medium"
                >
                  {t("Forgot Password?")}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-2xl relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isPending}
                onClick={onSubmit}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("Signing In")}...
                    </>
                  ) : (
                    <>
                      {t("Sign In")}
                      <Flame className="w-5 h-5" />
                    </>
                  )}
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
