"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Trophy, Send } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useApp } from "@/lib/context";
import type { LeaderboardEntry } from "@/lib/data";

type Tab = "neighborhood" | "workplace" | "ageGroup" | "city";

const tabs: { key: Tab; label: string }[] = [
  { key: "neighborhood", label: "Neighborhood" },
  { key: "workplace", label: "Workplace" },
  { key: "ageGroup", label: "Age Group" },
  { key: "city", label: "City" },
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("neighborhood");
  const { nudgeUser, user } = useApp();
  const [nudgedUsers, setNudgedUsers] = useState<Set<string>>(new Set());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const category = activeTab === "city" ? "neighborhood" : activeTab;
    apiFetch<LeaderboardEntry[]>(`/api/leaderboard?category=${category}`)
      .then((data) => {
        if (activeTab === "city") {
          setLeaderboard([...data].sort((a, b) => b.score - a.score));
        } else {
          setLeaderboard(data);
        }
      })
      .catch(console.error);
  }, [activeTab]);

  const handleNudge = (entry: LeaderboardEntry) => {
    nudgeUser(entry.name);
    setNudgedUsers((prev) => new Set(prev).add(entry.id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          See how you rank against your community
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {leaderboard.slice(0, 3).map((entry, i) => {
            const positions = [1, 0, 2];
            const idx = positions[i];
            const e = leaderboard[idx];
            const podiumColors = [
              "from-yellow-400 to-yellow-500",
              "from-gray-300 to-gray-400",
              "from-orange-400 to-orange-500",
            ];
            const heights = ["h-32", "h-24", "h-20"];

            return (
              <div key={e.id} className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${podiumColors[idx]} flex items-center justify-center text-white text-sm font-bold shadow-lg mb-2`}
                >
                  {e.avatar}
                </div>
                <p className="text-xs font-semibold text-gray-900 text-center truncate max-w-full">
                  {e.name}
                </p>
                <p className="text-lg font-bold text-emerald-600">{e.score}</p>
                <div
                  className={`w-full ${heights[idx]} bg-gradient-to-t ${podiumColors[idx]} rounded-t-xl mt-2 flex items-center justify-center`}
                >
                  <Trophy className="w-5 h-5 text-white/80" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase">
          <span className="col-span-1">#</span>
          <span className="col-span-5">User</span>
          <span className="col-span-2 text-right">Score</span>
          <span className="col-span-2 text-right">Change</span>
          <span className="col-span-2 text-right">Action</span>
        </div>
        {leaderboard.map((entry, i) => {
          const isCurrentUser = entry.avatar === user.avatar;
          return (
            <div
              key={entry.id}
              className={`grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-gray-50 transition-all hover:bg-gray-50 ${
                isCurrentUser ? "bg-amber-50 border-amber-200" : ""
              }`}
            >
              <span
                className={`col-span-1 text-sm font-bold ${
                  i < 3 ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {i + 1}
              </span>
              <div className="col-span-5 flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrentUser
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {entry.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {entry.name}
                    {isCurrentUser && (
                      <span className="text-xs text-red-500 ml-1">(You)</span>
                    )}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {entry.location || entry.workplace || `Age ${activeTab === "ageGroup" ? "25-34" : ""}`}
                  </p>
                </div>
              </div>
              <span className="col-span-2 text-right text-sm font-bold text-gray-900">
                {entry.score}
              </span>
              <span
                className={`col-span-2 text-right flex items-center justify-end gap-0.5 text-xs font-medium ${
                  entry.change > 0
                    ? "text-emerald-500"
                    : entry.change < 0
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {entry.change > 0 ? (
                  <ArrowUp className="w-3 h-3" />
                ) : entry.change < 0 ? (
                  <ArrowDown className="w-3 h-3" />
                ) : null}
                {entry.change > 0 ? "+" : ""}
                {entry.change}
              </span>
              <div className="col-span-2 flex justify-end">
                {!isCurrentUser && entry.score < 70 && (
                  <button
                    onClick={() => handleNudge(entry)}
                    disabled={nudgedUsers.has(entry.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
                      nudgedUsers.has(entry.id)
                        ? "bg-gray-100 text-gray-400"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    }`}
                  >
                    <Send className="w-3 h-3" />
                    {nudgedUsers.has(entry.id) ? "Sent" : "Nudge"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
