"use client";

import {
  Bell,
  BellOff,
  Send,
  Flame,
  Trophy,
  MapPin,
  Briefcase,
  Calendar,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Target,
  Award,
} from "lucide-react";
import ScoreRing from "@/components/ScoreRing";
import { useApp } from "@/lib/context";

export default function ProfilePage() {
  const {
    user,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
  } = useApp();

  const notifIcons: Record<string, React.ReactNode> = {
    nudge: <Send className="w-4 h-4 text-emerald-500" />,
    rank_drop: <TrendingDown className="w-4 h-4 text-red-500" />,
    streak_break: <AlertCircle className="w-4 h-4 text-amber-500" />,
    challenge: <Target className="w-4 h-4 text-blue-500" />,
    achievement: <Award className="w-4 h-4 text-purple-500" />,
  };

  const notifColors: Record<string, string> = {
    nudge: "bg-emerald-50 border-emerald-200",
    rank_drop: "bg-red-50 border-red-200",
    streak_break: "bg-amber-50 border-amber-200",
    challenge: "bg-blue-50 border-blue-200",
    achievement: "bg-purple-50 border-purple-200",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile & Social</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your public presence — everyone can see this
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar & Score */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-3">
              {user.avatar}
            </div>
            <ScoreRing score={user.greenScore} size={120} strokeWidth={8} />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {user.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {user.workplace}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {user.joinedDate}
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Trophy className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">#{user.rank}</p>
                <p className="text-[10px] text-gray-400">Rank</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{user.streak}</p>
                <p className="text-[10px] text-gray-400">Day Streak</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900">
                  {user.co2Saved}kg
                </p>
                <p className="text-[10px] text-gray-400">CO2 Saved</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900">{user.weeklyScore}</p>
                <p className="text-[10px] text-gray-400">Weekly Score</p>
              </div>
            </div>

            {/* Shame banner */}
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs text-red-600 font-medium">
                <TrendingDown className="w-3.5 h-3.5 inline mr-1" />
                You&apos;re in the bottom 18% of your neighborhood. Your community can see
                this.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visibility notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            Your score is public
          </p>
          <p className="text-xs text-amber-600 mt-0.5">
            Once you join HuntWatch, your green score is visible to your connected
            community. You can&apos;t hide — accountability drives change.
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`w-full flex items-start gap-3 p-4 text-left transition-all hover:bg-gray-50 ${
                !notif.read ? notifColors[notif.type] : ""
              }`}
            >
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {notifIcons[notif.type]}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    !notif.read
                      ? "font-semibold text-gray-900"
                      : "text-gray-600"
                  }`}
                >
                  {notif.message}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Peer nudge section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Peer Nudges
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Friends can nudge you when your score drops. Gentle social pressure
          that works.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">
                Nudges Received
              </span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">3</p>
            <p className="text-xs text-emerald-600 mt-1">This week</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <BellOff className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">
                Nudges Sent
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-700">1</p>
            <p className="text-xs text-gray-600 mt-1">This week</p>
          </div>
        </div>
      </div>

      {/* Streak section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold text-gray-900">Streak History</h2>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: 30 }, (_, i) => {
            const isActive = i < user.streak;
            const isToday = i === user.streak - 1;
            return (
              <div
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-medium transition-all ${
                  isToday
                    ? "bg-orange-500 text-white ring-2 ring-orange-300"
                    : isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          {user.streak} day streak! Break it and your circle gets notified.
        </p>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-bold text-gray-900">Achievements</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "🌱", name: "First Scan", earned: true },
            { icon: "🔥", name: "7-Day Streak", earned: true },
            { icon: "🤝", name: "First Pledge", earned: true },
            { icon: "🌳", name: "10 Trees Saved", earned: false },
            { icon: "🏆", name: "Top 10%", earned: false },
            { icon: "📢", name: "First Report", earned: false },
            { icon: "🙌", name: "5 Challenges", earned: false },
            { icon: "💚", name: "Score 90+", earned: false },
          ].map((achievement) => (
            <div
              key={achievement.name}
              className={`rounded-xl p-3 text-center border transition-all ${
                achievement.earned
                  ? "bg-purple-50 border-purple-200"
                  : "bg-gray-50 border-gray-200 opacity-50"
              }`}
            >
              <span className="text-2xl">{achievement.icon}</span>
              <p className="text-xs font-medium text-gray-700 mt-1">
                {achievement.name}
              </p>
              {achievement.earned && (
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 mx-auto mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
