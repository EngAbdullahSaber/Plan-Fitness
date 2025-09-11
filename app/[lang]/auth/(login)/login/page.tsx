"use client";

import React, { Fragment } from "react";
import {
  Dumbbell,
  Activity,
  Target,
  TrendingUp,
  Star,
  Heart,
} from "lucide-react";
import { useTranslate } from "@/config/useTranslation";
import LogInForm from "./login-form";
import Image from "next/image";
import Logo from "../../../../../public/images/auth/Capture-removebg-preview.png";

const LoginPage = () => {
  const { t } = useTranslate();

  const features = [
    {
      icon: Activity,
      title: "Live Tracking",
      description: "Real-time workout monitoring & progress analytics",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Target,
      title: "Goal Crusher",
      description: "Set ambitious targets & smash your limits",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: TrendingUp,
      title: "Smart Insights",
      description: "AI-powered performance optimization",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <Fragment>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-800 flex items-center overflow-hidden w-full relative">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.1),transparent_50%)]"></div>

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-pink-400/40 to-purple-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="min-h-screen basis-full flex flex-wrap w-full justify-center overflow-y-auto relative z-10">
          {/* Left Side - Enhanced Brand Section */}
          <div className="basis-1/2 w-full relative hidden xl:flex justify-center items-center p-8">
            <div className="relative z-10 text-center space-y-8 max-w-lg">
              {/* Brand Logo */}
              <div className="space-y-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-pulse"></div>
                  <div className="absolute inset-2 bg-slate-900/20 rounded-full backdrop-blur-sm"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <Image src={Logo} alt="Logo" width={100} height={100} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl font-bold text-white tracking-tight">
                    Plan
                    <span className="text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text">
                      Fitness
                    </span>
                  </h1>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {t(
                      "Elevate your fitness journey with our premium gym management system"
                    )}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Modern Features Grid */}
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-4 text-left bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:bg-white/10"
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm">
                          {t(feature.title)}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {t(feature.description)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Motivational Quote */}
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Heart className="w-6 h-6 text-pink-400 fill-current animate-pulse" />
                </div>
                <blockquote className="text-white text-lg font-semibold italic">
                  "
                  {t(
                    "Your body can stand almost anything. It's your mind you have to convince"
                  )}
                  "
                </blockquote>
                <cite className="text-pink-400 text-sm mt-2 block">
                  - {t("Fitness Motivation")}
                </cite>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-20 w-20 h-20 border-2 border-pink-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-purple-500/20 rounded-full animate-spin-slow-reverse"></div>
          </div>

          {/* Right Side - Login Form */}
          <LogInForm />
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
      `}</style>
    </Fragment>
  );
};

export default LoginPage;
