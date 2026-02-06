"use client";

import { useState } from "react";
import {
  HandHeart,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  Plus,
  Calendar,
  X,
} from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { useApp } from "@/lib/context";

export default function PledgesPage() {
  const { pledges, addPledge, user } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newPledgeText, setNewPledgeText] = useState("");
  const [newPledgeBrand, setNewPledgeBrand] = useState("");
  const [newPledgeCategory, setNewPledgeCategory] = useState("Products");
  const [newPledgeDays, setNewPledgeDays] = useState(90);

  const handleSubmit = () => {
    if (!newPledgeText.trim()) return;
    addPledge({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      pledge: newPledgeText,
      brand: newPledgeBrand || undefined,
      startDate: new Date().toISOString().split("T")[0],
      daysKept: 0,
      totalDays: newPledgeDays,
      isActive: true,
      supporters: 0,
      category: newPledgeCategory,
    });
    setNewPledgeText("");
    setNewPledgeBrand("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Public Pledges</h1>
          <p className="text-sm text-gray-500 mt-1">
            Your friends see if you follow through
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Pledge
        </button>
      </div>

      {/* New pledge form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Make a Public Pledge</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Your pledge *
              </label>
              <input
                type="text"
                value={newPledgeText}
                onChange={(e) => setNewPledgeText(e.target.value)}
                placeholder="e.g., Avoid all deforestation-linked brands"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Brand(s) to avoid
                </label>
                <input
                  type="text"
                  value={newPledgeBrand}
                  onChange={(e) => setNewPledgeBrand(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Category
                </label>
                <select
                  value={newPledgeCategory}
                  onChange={(e) => setNewPledgeCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                >
                  <option>Products</option>
                  <option>Palm Oil</option>
                  <option>Fashion</option>
                  <option>Transport</option>
                  <option>Energy</option>
                  <option>Food</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Duration (days)
                </label>
                <select
                  value={newPledgeDays}
                  onChange={(e) => setNewPledgeDays(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                >
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>180 days</option>
                  <option value={365}>1 year</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newPledgeText.trim()}
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Publish Pledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pledge cards */}
      <div className="space-y-4">
        {pledges.map((pledge) => {
          const isYours = pledge.userId === user.id;
          return (
            <div
              key={pledge.id}
              className={`bg-white rounded-2xl shadow-sm border p-5 transition-all hover:shadow-md ${
                !pledge.isActive
                  ? "border-red-200 bg-red-50/30"
                  : isYours
                  ? "border-emerald-200"
                  : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                      isYours
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {pledge.userAvatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {pledge.userName}
                      {isYours && (
                        <span className="text-xs text-emerald-600 ml-1">(You)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      Since {pledge.startDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {pledge.isActive ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-medium">
                      <XCircle className="w-3 h-3" />
                      Broken
                    </span>
                  )}
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">
                    {pledge.category}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <p className="text-sm text-gray-800 font-medium flex items-start gap-2">
                  <HandHeart className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  &ldquo;{pledge.pledge}&rdquo;
                </p>
                {pledge.brand && (
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Brands: {pledge.brand}
                  </p>
                )}
              </div>

              <ProgressBar
                current={pledge.daysKept}
                target={pledge.totalDays}
                label={`${pledge.daysKept} of ${pledge.totalDays} days`}
                color={pledge.isActive ? "bg-emerald-500" : "bg-red-400"}
                size="sm"
              />

              <div className="flex items-center justify-between mt-3">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {pledge.supporters} supporters
                </span>
                {!isYours && pledge.isActive && (
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium hover:bg-emerald-100 transition-colors">
                    <ThumbsUp className="w-3 h-3" />
                    Support
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
