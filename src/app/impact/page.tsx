"use client";

import {
  TreePine,
  Droplets,
  Flame,
  TrendingDown,
  AlertTriangle,
  ArrowDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useApp } from "@/lib/context";
import { apiFetch } from "@/lib/api";
import type { ImpactData } from "@/lib/data";
import { useState, useEffect } from "react";

const consumptionBreakdown = [
  { category: "Food & Palm Oil", you: 35, avg: 15, color: "#ef4444" },
  { category: "Transport", you: 22, avg: 18, color: "#f59e0b" },
  { category: "Energy", you: 18, avg: 12, color: "#8b5cf6" },
  { category: "Products", you: 15, avg: 8, color: "#3b82f6" },
  { category: "Waste", you: 10, avg: 5, color: "#ec4899" },
];

export default function ImpactPage() {
  const { user } = useApp();
  const [impactData, setImpactData] = useState<ImpactData[]>([]);
  const neighborTreesLost = 0.5;

  useEffect(() => {
    apiFetch<ImpactData[]>("/api/impact")
      .then(setImpactData)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Impact Calculator</h1>
        <p className="text-sm text-gray-500 mt-1">
          See the real-world consequences of your choices
        </p>
      </div>

      {/* Shock stat */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              If everyone consumed like you...
            </p>
            <p className="text-lg text-red-400 mt-2">
              The <span className="font-bold">Malayan tiger</span> would be
              extinct by <span className="font-bold text-red-300">2031</span>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              We would need <span className="font-bold text-amber-400">2.8 Earths</span> to sustain
              this level of consumption
            </p>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <TreePine className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-xs font-medium text-gray-500">Trees Lost</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-red-600">{user.treesEquivalent}</p>
              <p className="text-xs text-gray-400">This month</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-emerald-600">
                {neighborTreesLost}
              </p>
              <p className="text-[10px] text-gray-400">Neighbor avg</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
            <ArrowDown className="w-3 h-3" />
            6.4x worse than neighbors
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-gray-500">Water Footprint</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">2,450L</p>
            <p className="text-xs text-gray-400">Daily average</p>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-amber-500">
            <TrendingDown className="w-3 h-3" />
            18% above city average
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Flame className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-xs font-medium text-gray-500">Carbon Footprint</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">8.2 tons</p>
            <p className="text-xs text-gray-400">Annual estimate</p>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
            <ArrowDown className="w-3 h-3" />
            Malaysia avg: 6.1 tons
          </div>
        </div>
      </div>

      {/* Trees lost trend chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Trees Lost — Monthly Trend
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={impactData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="yourImpact"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: "#ef4444", r: 4 }}
                name="Your Impact"
              />
              <Line
                type="monotone"
                dataKey="neighborAvg"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 3 }}
                name="Neighbor Avg"
              />
              <Line
                type="monotone"
                dataKey="cityAvg"
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#6366f1", r: 3 }}
                name="City Avg"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Consumption breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Consumption Breakdown vs Average
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consumptionBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" unit="%" />
              <YAxis
                dataKey="category"
                type="category"
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
                width={100}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="you" fill="#ef4444" name="You" radius={[0, 4, 4, 0]} />
              <Bar dataKey="avg" fill="#10b981" name="Average" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <p className="text-xs font-medium text-red-500 uppercase mb-2">
            Your Consumption This Month
          </p>
          <p className="text-2xl font-bold text-red-700">
            = {user.treesEquivalent} trees lost
          </p>
          <p className="text-sm text-red-600 mt-1">
            That&apos;s enough forest to shelter 12 endangered species
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
          <p className="text-xs font-medium text-emerald-500 uppercase mb-2">
            Neighbor&apos;s Average
          </p>
          <p className="text-2xl font-bold text-emerald-700">
            = {neighborTreesLost} trees lost
          </p>
          <p className="text-sm text-emerald-600 mt-1">
            They&apos;re doing 6.4x better than you. Catch up!
          </p>
        </div>
      </div>
    </div>
  );
}
