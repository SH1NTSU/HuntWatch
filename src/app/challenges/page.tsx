"use client";

import { useState } from "react";
import {
  Target,
  Users,
  Clock,
  ShoppingBag,
  Bus,
  Zap,
  UtensilsCrossed,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { useApp } from "@/lib/context";

const categoryIcons: Record<string, React.ReactNode> = {
  products: <ShoppingBag className="w-5 h-5" />,
  transport: <Bus className="w-5 h-5" />,
  energy: <Zap className="w-5 h-5" />,
  food: <UtensilsCrossed className="w-5 h-5" />,
  waste: <Trash2 className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  products: "bg-blue-50 text-blue-600",
  transport: "bg-purple-50 text-purple-600",
  energy: "bg-yellow-50 text-yellow-600",
  food: "bg-orange-50 text-orange-600",
  waste: "bg-red-50 text-red-600",
};

const progressColors: Record<string, string> = {
  products: "bg-blue-500",
  transport: "bg-purple-500",
  energy: "bg-yellow-500",
  food: "bg-orange-500",
  waste: "bg-red-500",
};

type Filter = "all" | "joined" | "products" | "transport" | "energy" | "food" | "waste";

export default function ChallengesPage() {
  const { challenges, joinChallenge } = useApp();
  const [filter, setFilter] = useState<Filter>("all");

  const filteredChallenges = challenges.filter((c) => {
    if (filter === "all") return true;
    if (filter === "joined") return c.joined;
    return c.category === filter;
  });

  const daysRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community Challenges</h1>
        <p className="text-sm text-gray-500 mt-1">
          Group goals with progress everyone can see
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(["all", "joined", "products", "transport", "energy", "food", "waste"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all capitalize ${
              filter === f
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Challenge cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl ${categoryColors[challenge.category]}`}>
                  {categoryIcons[challenge.category]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{challenge.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{challenge.community}</p>
                </div>
              </div>
              {challenge.joined && (
                <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Joined
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 mb-4">{challenge.description}</p>

            {/* Progress */}
            <ProgressBar
              current={challenge.current}
              target={challenge.target}
              color={progressColors[challenge.category]}
              size="lg"
            />

            {/* Meta */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {challenge.participants} joined
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {daysRemaining(challenge.deadline)}d left
                </span>
              </div>
              {!challenge.joined && (
                <button
                  onClick={() => joinChallenge(challenge.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <Target className="w-3.5 h-3.5" />
                  Join Challenge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No challenges found for this filter</p>
        </div>
      )}
    </div>
  );
}
