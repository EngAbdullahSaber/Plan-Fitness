"use client"

import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  UserPlus, 
  Activity,
  Clock,
  BarChart3
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Sample chart data
const memberActivityData = [
  { time: '00:00', members: 12, active: 8 },
  { time: '04:00', members: 18, active: 12 },
  { time: '08:00', members: 45, active: 32 },
  { time: '12:00', members: 63, active: 48 },
  { time: '16:00', members: 52, active: 38 },
  { time: '20:00', members: 38, active: 28 },
  { time: '23:59', members: 25, active: 18 }
];

interface Member {
  id: number;
  country: string;
  count: string;
  flag: string;
  trend: 'up' | 'down';
  percentage: string;
}

const MemberStatistics = () => {
  const [timeframe, setTimeframe] = useState('30min');

  const membersData: Member[] = [
    {
      id: 1,
      country: "United States",
      count: "1,247",
      flag: "🇺🇸",
      trend: 'up',
      percentage: '+12%'
    },
    {
      id: 2,
      country: "United Kingdom",
      count: "892",
      flag: "🇬🇧",
      trend: 'up',
      percentage: '+8%'
    },
    {
      id: 3,
      country: "Germany",
      count: "634",
      flag: "🇩🇪",
      trend: 'down',
      percentage: '-3%'
    },
    {
      id: 4,
      country: "France",
      count: "567",
      flag: "🇫🇷",
      trend: 'up',
      percentage: '+15%'
    },
    {
      id: 5,
      country: "Canada",
      count: "423",
      flag: "🇨🇦",
      trend: 'up',
      percentage: '+7%'
    }
  ];

  const totalMembers = 3763;
  const activeMembers = 2841;
  const newMembersToday = 247;
  const growthRate = 18.5;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200/60 dark:border-gray-700/40 overflow-hidden">
      {/* Header Section */}
      <div className="relative p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-gray-200/60 dark:border-gray-700/40">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500 rounded-full translate-y-12 -translate-x-12" />
        </div>

        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Member Statistics
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Last 30 Minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Stats */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {totalMembers.toLocaleString()}
                </span>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/40 rounded-full">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    +{growthRate}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Total Active Members
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4 rounded-2xl border border-green-200/60 dark:border-green-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {activeMembers.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">
                  Currently Active
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 p-4 rounded-2xl border border-purple-200/60 dark:border-purple-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {newMembersToday}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-500">
                  New Today
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-4 rounded-2xl border border-orange-200/60 dark:border-orange-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                  {membersData.length}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-500">
                  Countries
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/40">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Member Activity Timeline
            </h3>
          </div>
          
          <div className="flex gap-2">
            {['30min', '1hr', '6hr', '24hr'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  timeframe === period
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={memberActivityData}>
              <defs>
                <linearGradient id="membersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="members"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#membersGradient)"
              />
              <Area
                type="monotone"
                dataKey="active"
                stroke="#10B981"
                strokeWidth={3}
                fill="url(#activeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Members by Country Table */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Members by Country
          </h3>
        </div>

        <div className="space-y-3">
          {membersData.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-700 rounded-lg text-lg">
                  {member.flag}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {member.country}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Rank #{index + 1}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.count}
                </span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  member.trend === 'up'
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                }`}>
                  {member.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {member.percentage}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-4 text-center">
          <button className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors duration-200">
            View All Countries
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberStatistics;