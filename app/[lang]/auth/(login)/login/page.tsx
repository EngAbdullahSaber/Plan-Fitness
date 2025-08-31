"use client";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LogInForm from "@/components/auth/login-form";

const schema = z.object({
  email: z.string().email({ message: "Your email is invalid." }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters." }),
});

const LoginPage = () => {
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState("password");
  const [email, setEmail] = React.useState("trainer@PlanFitness.com");
  const [password, setPassword] = React.useState("password");
  const router = useRouter();
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
      email: "trainer@PlanFitness.com",
      password: "password",
    },
  });

  const onSubmit = (data) => {
    toast.success("Login Successful");
    router.push("/dashboard");
  };

  return (
    <Fragment>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#262460] to-[#262460]/80 flex items-center overflow-hidden w-full relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ED4135]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#262460]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ED4135]/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating fitness elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-[#ED4135]/30 to-[#262460]/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="min-h-screen basis-full flex flex-wrap w-full justify-center overflow-y-auto relative z-10">
          {/* Left Side - Gym Brand Section */}
          <div className="basis-1/2 w-full relative hidden xl:flex justify-center items-center">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#262460]/30 via-[#ED4135]/10 to-[#262460]/20 backdrop-blur-sm"></div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-10 px-8">
              {/* Gym Logo/Brand */}
              <div className="space-y-8">
                <div className="w-44 h-44 mx-auto bg-gradient-to-br from-[#ED4135] via-[#ED4135]/80 to-[#262460] rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden border-4 border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-pulse"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <Dumbbell
                      className="w-16 h-16 text-white mb-2"
                      strokeWidth={2.5}
                    />
                    <div className="text-white font-black text-xs tracking-widest">
                      PLAN FITNESS
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h1 className="text-6xl font-black text-white tracking-tight">
                    Plan<span className="text-[#ED4135]">Fitness</span>
                  </h1>
                  <p className="text-xl text-gray-300 max-w-lg mx-auto leading-relaxed font-medium">
                    Elevate your fitness experience with our premium gym
                    management system.
                    <span className="block mt-3 text-[#ED4135] font-bold text-2xl tracking-wide">
                      TRAIN. TRACK. TRANSFORM.
                    </span>
                  </p>
                </div>
              </div>

              {/* Gym Features */}
              <div className="grid grid-cols-1 gap-6 max-w-lg mx-auto">
                <div className="flex items-center space-x-5 text-gray-300 bg-[#262460]/20 backdrop-blur-sm rounded-2xl p-5 border border-[#ED4135]/20 hover:border-[#ED4135]/40 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ED4135]/40 to-[#262460]/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Activity
                      className="w-8 h-8 text-[#ED4135]"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-black text-lg tracking-wide">
                      LIVE TRACKING
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">
                      Real-time workout monitoring & progress analytics
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-5 text-gray-300 bg-[#262460]/20 backdrop-blur-sm rounded-2xl p-5 border border-[#ED4135]/20 hover:border-[#ED4135]/40 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#262460]/40 to-[#ED4135]/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Target
                      className="w-8 h-8 text-[#262460]"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-black text-lg tracking-wide">
                      GOAL CRUSHER
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">
                      Set ambitious targets & smash your limits
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-5 text-gray-300 bg-[#262460]/20 backdrop-blur-sm rounded-2xl p-5 border border-[#ED4135]/20 hover:border-[#ED4135]/40 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ED4135]/40 to-[#262460]/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp
                      className="w-8 h-8 text-[#ED4135]"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-black text-lg tracking-wide">
                      SMART INSIGHTS
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">
                      AI-powered performance optimization
                    </p>
                  </div>
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="bg-gradient-to-r from-[#262460]/40 via-[#ED4135]/20 to-[#262460]/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#ED4135]/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ED4135]/5 to-[#262460]/5 animate-pulse"></div>
                <div className="relative z-10">
                  <blockquote className="text-white text-2xl font-black italic tracking-wide">
                    "STRENGTH DOESN'T COME FROM WHAT YOU CAN DO"
                  </blockquote>
                  <p className="text-[#ED4135] text-lg mt-3 font-bold tracking-wide">
                    IT COMES FROM OVERCOMING THE THINGS YOU THOUGHT YOU COULDN'T
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative gym elements */}
            <div className="absolute top-10 left-10 w-28 h-28 border-3 border-[#ED4135]/30 rounded-full animate-spin-slow"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 border-3 border-[#262460]/30 rounded-full animate-spin-slow"></div>
            <div className="absolute top-1/4 right-20 w-4 h-4 bg-[#ED4135] rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 left-20 w-4 h-4 bg-[#262460] rounded-full animate-ping delay-1000"></div>
            <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-[#ED4135] rounded-full animate-ping delay-500"></div>
          </div>

          {/* Right Side - Login Form */}
          <LogInForm />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(3deg);
          }
          66% {
            transform: translateY(10px) rotate(-3deg);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 25s linear infinite;
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </Fragment>
  );
};

export default LoginPage;
