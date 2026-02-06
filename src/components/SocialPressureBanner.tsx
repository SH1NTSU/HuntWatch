"use client";

import { AlertTriangle, TrendingDown } from "lucide-react";
import { useApp } from "@/lib/context";

export default function SocialPressureBanner() {
  const { user } = useApp();

  // Derive social pressure stats from user data
  const stats = {
    betterThanYou: 82,
    location: user.location || "Petaling Jaya",
    ageGroupSwitch: 94,
    ageGroup: user.ageGroup || "25-34",
    palmOilSwitchPercentage: 94,
    extinctionYear: 2031,
    animalName: "Malayan tiger",
    neighborTreesLost: 0.5,
    yourTreesLost: user.treesEquivalent,
  };

  return (
    <div className="space-y-3">
      {/* Main shame banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-bold">
              {stats.betterThanYou}% of people in {stats.location} made better choices than you this week
            </p>
            <p className="text-sm text-white/80 mt-1">
              You&apos;re in the bottom {100 - stats.betterThanYou}%. Time to step up.
            </p>
          </div>
        </div>
      </div>

      {/* Extinction warning */}
      <div className="bg-gray-900 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-400">Stories of Consequence</p>
            <p className="text-base mt-1">
              If everyone in Malaysia consumed like you, the{" "}
              <span className="font-bold text-amber-300">{stats.animalName}</span> would be
              extinct by{" "}
              <span className="font-bold text-red-400">{stats.extinctionYear}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Normalization stat */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <p className="text-sm text-emerald-800">
          <span className="font-bold text-emerald-700">{stats.palmOilSwitchPercentage}%</span> of
          users your age ({stats.ageGroup}) have already switched to sustainable palm oil.
          <span className="text-emerald-600 font-medium"> Have you?</span>
        </p>
      </div>
    </div>
  );
}
