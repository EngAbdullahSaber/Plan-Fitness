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
  Phone,
} from "lucide-react";
import { useTranslate } from "@/config/useTranslation";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { CreateMethod } from "@/app/services/apis/ApiMethod";
import { storeTokenInLocalStorage } from "@/app/services/utils";
import { handleApiError } from "@/app/services/handleApiError";

// Validation schema
const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "Email is required")
    .min(10, "Email must be at least 7 digits"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LogInForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [apiErrors, setApiErrors] = useState<
    { field: string; message: string }[]
  >([]);
  const { t } = useTranslate();
  const router = useRouter();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "admin@admin.com",
      password: "123456",
    },
  });
  const { lang } = useParams();

  const togglePasswordType = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  // Form submission handler
  const onSubmit = async (data: LoginFormData) => {
    setIsPending(true);
    setApiErrors([]); // Clear previous API errors
    clearErrors(); // Clear previous react-hook-form errors

    try {
      const response = await CreateMethod(
        "user/login-dashboard",
        {
          phone: data.phone,
          password: data.password,
        },
        lang,
      );
      if (response.status === 201 && response.data?.data?.token) {
        storeTokenInLocalStorage(response.data.data.token);
        toast.success(response.data.message);
        router.push("/dashboard");
      } else {
        // Handle non-200 responses that don't throw errors
        console.log(response);
        toast.error(response.response.data.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsPending(false);
    }
  };

  // Helper function to get error message for a specific field
  const getFieldError = (fieldName: string) => {
    return apiErrors.find((error) => error.field === fieldName)?.message;
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
        <form onSubmit={handleSubmit(onSubmit)}>
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
                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="text-gray-300 font-medium flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-pink-400" />

                    {t("Email")}
                  </label>
                  <div className="relative group">
                    <input
                      {...register("phone")}
                      disabled={isPending}
                      type="tel"
                      placeholder="01126054336"
                      className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 text-white placeholder:text-gray-500 rounded-xl py-3.5 px-4 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-cyan-500/0 group-focus-within:from-pink-500/5 group-focus-within:via-purple-500/5 group-focus-within:to-cyan-500/5 transition-all duration-300 pointer-events-none"></div>
                  </div>
                  {(errors.phone || getFieldError("phone")) && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      {errors.phone?.message || getFieldError("phone")}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-gray-300 font-medium flex items-center gap-2 text-sm">
                    <Lock className="w-4 h-4 text-purple-400" />
                    {t("Password")}
                  </label>
                  <div className="relative group">
                    <input
                      {...register("password")}
                      disabled={isPending}
                      type={passwordType}
                      placeholder="Enter your password"
                      className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 text-white placeholder:text-gray-500 rounded-xl py-3.5 px-4 pr-12 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                      onClick={togglePasswordType}
                      disabled={isPending}
                    >
                      {passwordType === "password" ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {(errors.password || getFieldError("password")) && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      {errors.password?.message || getFieldError("password")}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-2xl relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isPending}
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
        </form>
      </div>
    </div>
  );
};

export default LogInForm;
