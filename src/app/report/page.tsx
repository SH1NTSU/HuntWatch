"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  MapPin,
  ThumbsUp,
  Clock,
  CheckCircle2,
  Search,
  Plus,
  X,
  Send,
  Camera,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { apiFetch, apiPost } from "@/lib/api";
import type { DeforestationReport } from "@/lib/data";

export default function ReportPage() {
  const { logAction } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [reportLocation, setReportLocation] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [deforestationReports, setDeforestationReports] = useState<DeforestationReport[]>([]);

  useEffect(() => {
    apiFetch<DeforestationReport[]>("/api/reports")
      .then(setDeforestationReports)
      .catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!reportLocation.trim() || !reportDescription.trim()) return;
    try {
      await apiPost("/api/reports", {
        location: reportLocation,
        description: reportDescription,
      });
      logAction(5);
      setSubmitted(true);
      // Refresh reports
      const reports = await apiFetch<DeforestationReport[]>("/api/reports");
      setDeforestationReports(reports);
      setTimeout(() => {
        setShowForm(false);
        setSubmitted(false);
        setReportLocation("");
        setReportDescription("");
      }, 2000);
    } catch (err) {
      console.error("Failed to submit report:", err);
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-200",
    verified: "bg-emerald-50 text-emerald-600 border-emerald-200",
    investigating: "bg-blue-50 text-blue-600 border-blue-200",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-3.5 h-3.5" />,
    verified: <CheckCircle2 className="w-3.5 h-3.5" />,
    investigating: <Search className="w-3.5 h-3.5" />,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Deforestation</h1>
          <p className="text-sm text-gray-500 mt-1">
            Community reports earn score and protect forests
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Report
        </button>
      </div>

      {/* Report info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              How community reporting works
            </p>
            <ul className="text-xs text-amber-700 mt-2 space-y-1">
              <li>• Report suspicious deforestation activity anywhere in Malaysia</li>
              <li>• Each verified report earns you +5 to your Green Score</li>
              <li>• Reports are reviewed by environmental organizations</li>
              <li>• Your identity is protected — only your username is shown</li>
            </ul>
          </div>
        </div>
      </div>

      {/* New report form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-6 animate-slide-up">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
              <p className="text-lg font-bold text-gray-900">Report Submitted!</p>
              <p className="text-sm text-gray-500 mt-1">
                +5 Green Score earned. Thank you for protecting our forests.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Submit Deforestation Report
                </h3>
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
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={reportLocation}
                      onChange={(e) => setReportLocation(e.target.value)}
                      placeholder="e.g., Near Taman Negara, Pahang"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Describe what you observed..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Photo Evidence (optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gray-300 transition-colors">
                    <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">
                      Click to upload or drag & drop
                    </p>
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
                    disabled={!reportLocation.trim() || !reportDescription.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Submit Report
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Reports list */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Community Reports</h2>
        {deforestationReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-red-50 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {report.location}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Reported by {report.userName} • {report.date}
                  </p>
                </div>
              </div>
              <span
                className={`flex items-center gap-1 px-2.5 py-1 border rounded-full text-[10px] font-medium capitalize ${
                  statusColors[report.status]
                }`}
              >
                {statusIcons[report.status]}
                {report.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">{report.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                {report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full text-xs font-medium transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" />
                {report.upvotes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
