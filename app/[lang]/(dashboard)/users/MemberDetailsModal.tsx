"use client"

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Clock, 
  UserCheck, 
  Star,
  Heart,
  Edit,
  MessageCircle,
  Bell,
  Activity,
  Award,
  Dumbbell,
  Target
} from 'lucide-react';

interface Member {
  id: string;
  Role?: string;
  MembershipId?: string;
  Name?: string;
  JOIN_DATE?: string;
  Email?: string;
  STATUS?: string;
  MEMBERSHIP_STATUS?: string;
  GENDER?: string;
  BIRTH?: string;
  ADDRESS?: string;
  PHONE?: string;
  LAST_CHECKIN?: string;
  TRAINER?: string;
  MEMBERSHIP_PLAN?: string;
  avatar?: string;
}

interface MemberDetailsProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
}

const MemberDetailsModal: React.FC<MemberDetailsProps> = ({ member, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'frozen': return 'bg-blue-500';
      case 'expired': return 'bg-red-500';
      case 'staff': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Premium Member': return 'from-red-500 to-red-600';
      case 'Standard Member': return 'from-blue-600 to-blue-700';
      case 'Trainer': return 'from-amber-500 to-amber-600';
      case 'Admin': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'membership', label: 'Membership', icon: CreditCard },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'fitness', label: 'Fitness Plan', icon: Dumbbell }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#25235F] via-[#25235F]/90 to-[#ED4135]">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
          </div>

          {/* Header Content */}
          <div className="relative p-8 text-white">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${getStatusColor(member.STATUS || '')} border-4 border-white flex items-center justify-center`}>
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>

                {/* Basic Info */}
                <div>
                  <h1 className="text-3xl font-bold mb-2">{member.Name}</h1>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getRoleColor(member.Role || '')} text-white shadow-lg`}>
                      {member.Role}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                      ID: {member.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {member.JOIN_DATE}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Last seen {member.LAST_CHECKIN}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200">
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-red-500/30 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="px-8 pt-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#25235F] text-white shadow-lg'
                      : 'text-gray-600 hover:text-[#25235F] hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#25235F]" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{member.Email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">{member.PHONE}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium text-gray-900 dark:text-white">{member.BIRTH}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900 dark:text-white">{member.ADDRESS}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership Status */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#25235F]" />
                  Membership Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(member.MEMBERSHIP_STATUS || '')}`}>
                      {member.MEMBERSHIP_STATUS}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Plan</span>
                    <span className="font-medium text-gray-900 dark:text-white">{member.MEMBERSHIP_PLAN}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Member ID</span>
                    <span className="font-mono text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      {member.MembershipId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Trainer</span>
                    <span className="font-medium text-gray-900 dark:text-white">{member.TRAINER}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'membership' && (
            <div className="space-y-6">
              {/* Membership Details */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {member.MEMBERSHIP_PLAN} Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Join Date</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{member.JOIN_DATE}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <UserCheck className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{member.STATUS}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{member.Role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#25235F]" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Last check-in: {member.LAST_CHECKIN}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Membership renewed: {member.JOIN_DATE}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fitness' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-[#ED4135]" />
                  Fitness Plan & Goals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-[#ED4135]" />
                      <span className="font-medium">Assigned Trainer</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{member.TRAINER}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-[#ED4135]" />
                      <span className="font-medium">Current Plan</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{member.MEMBERSHIP_PLAN}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsModal;