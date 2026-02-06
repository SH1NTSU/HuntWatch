"use client";

import { useState, useEffect } from "react";
import {
  Flame,
  TrendingDown,
  TreePine,
  Wind,
  Users,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import ScoreRing from "@/components/ScoreRing";
import StatCard from "@/components/StatCard";
import SocialPressureBanner from "@/components/SocialPressureBanner";
import { useApp } from "@/lib/context";
import { apiFetch } from "@/lib/api";
import type { LeaderboardEntry } from "@/lib/data";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useApp();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    apiFetch<LeaderboardEntry[]>("/api/leaderboard?category=neighborhood")
      .then(setLeaderboard)
      .catch(console.error);
  }, []);

  const topNeighbors = leaderboard.slice(0, 5);
  const userEntry = leaderboard.find((e) => e.avatar === user.avatar);

  const neighborTreesLost = 0.5;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your environmental impact at a glance
        </p>
      </div>

      {/* Social pressure banners */}
      <SocialPressureBanner />

      {/* Score + Stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Green Score Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
          <ScoreRing score={user.greenScore} />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Rank <span className="font-bold text-gray-900">#{user.rank}</span>{" "}
              of {user.totalMembers.toLocaleString()} in {user.location}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-medium">
            <ArrowDown className="w-3 h-3" />
            Dropped 5 positions this week
          </div>
        </div>

        {/* Quick stats grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard
            icon={<Flame className="w-5 h-5" />}
            label="Streak"
            value={`${user.streak} days`}
            subtext="Keep it going!"
          />
          <StatCard
            icon={<TreePine className="w-5 h-5" />}
            label="Trees Equivalent Lost"
            value={user.treesEquivalent}
            subtext={`Neighbor avg: ${neighborTreesLost}`}
            alert={user.treesEquivalent > 2}
          />
          <StatCard
            icon={<Wind className="w-5 h-5" />}
            label="CO2 Saved"
            value={`${user.co2Saved} kg`}
            subtext="This month"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Weekly Score"
            value={user.weeklyScore}
            subtext="Out of 100"
          />
        </div>
      </div>

      {/* Impact comparison */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Personal Impact Comparison
          </h2>
          <Link
            href="/impact"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            See full report &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-red-600">
              {user.treesEquivalent}
            </p>
            <p className="text-xs text-red-500 mt-1">
              Trees lost (your consumption)
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">
              {neighborTreesLost}
            </p>
            <p className="text-xs text-emerald-500 mt-1">
              Trees lost (neighbor avg)
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">
              {user.treesEquivalent > 0
                ? `${(user.treesEquivalent / Math.max(neighborTreesLost, 0.1)).toFixed(1)}x`
                : "0x"}
            </p>
            <p className="text-xs text-amber-500 mt-1">
              Worse than your neighbor
            </p>
          </div>
        </div>
      </div>

      {/* Quick leaderboard preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Neighborhood Rankings
          </h2>
          <Link
            href="/leaderboard"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Full leaderboard &rarr;
          </Link>
        </div>
        <div className="space-y-3">
          {topNeighbors.map((entry, i) => (
            <div
              key={entry.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : i === 1
                      ? "bg-gray-100 text-gray-600"
                      : i === 2
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {entry.avatar}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {entry.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900">
                  {entry.score}
                </span>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
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
                  {Math.abs(entry.change)}
                </span>
              </div>
            </div>
          ))}

          {/* Current user (highlighted) */}
          {userEntry && (
            <>
              <div className="border-t border-dashed border-gray-200 my-2" />
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-red-100 text-red-600">
                    {leaderboard.indexOf(userEntry) + 1}
                  </span>
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {userEntry.avatar}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {userEntry.name}
                    </span>
                    <span className="text-xs text-red-500 ml-2">(You)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">
                    {userEntry.score}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-red-500">
                    <TrendingDown className="w-3 h-3" />
                    {Math.abs(userEntry.change)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
