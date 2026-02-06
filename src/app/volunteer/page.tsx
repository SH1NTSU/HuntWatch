"use client";

import {
  CalendarHeart,
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle2,
  TreePine,
  Trash2,
  BookOpen,
  Search as SearchIcon,
} from "lucide-react";
import { useApp } from "@/lib/context";

const categoryIcons: Record<string, React.ReactNode> = {
  Planting: <TreePine className="w-5 h-5" />,
  Cleanup: <Trash2 className="w-5 h-5" />,
  Education: <BookOpen className="w-5 h-5" />,
  Research: <SearchIcon className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  Planting: "bg-emerald-50 text-emerald-600",
  Cleanup: "bg-blue-50 text-blue-600",
  Education: "bg-purple-50 text-purple-600",
  Research: "bg-amber-50 text-amber-600",
};

export default function VolunteerPage() {
  const { events, joinEvent } = useApp();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-MY", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Volunteer Events</h1>
        <p className="text-sm text-gray-500 mt-1">
          Join events to earn score and make real impact
        </p>
      </div>

      {/* Score info */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="p-2 bg-emerald-100 rounded-xl">
          <Star className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-emerald-800">
            Earn Green Score by volunteering
          </p>
          <p className="text-xs text-emerald-600 mt-0.5">
            Each event has a score reward that gets added to your public profile
          </p>
        </div>
      </div>

      {/* Event cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => {
          const spotsPercentage = ((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100;
          const almostFull = event.spotsLeft <= 10;

          return (
            <div
              key={event.id}
              className={`bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition-all ${
                event.joined ? "border-emerald-200" : "border-gray-100"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${categoryColors[event.category]}`}>
                    {categoryIcons[event.category]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{event.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{event.organizer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
                  <Star className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-600">
                    +{event.scoreReward}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 mb-4">{event.description}</p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarHeart className="w-3.5 h-3.5 flex-shrink-0" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  {event.time}
                </div>
              </div>

              {/* Spots bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {event.totalSpots - event.spotsLeft}/{event.totalSpots} joined
                  </span>
                  {almostFull && (
                    <span className="text-red-500 font-medium">
                      Only {event.spotsLeft} spots left!
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      almostFull ? "bg-red-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${spotsPercentage}%` }}
                  />
                </div>
              </div>

              {/* Action */}
              {event.joined ? (
                <div className="flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  You&apos;re signed up!
                </div>
              ) : (
                <button
                  onClick={() => joinEvent(event.id)}
                  disabled={event.spotsLeft === 0}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CalendarHeart className="w-4 h-4" />
                  Join Event (+{event.scoreReward} pts)
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
