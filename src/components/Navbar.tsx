"use client";

import { Bell, Menu } from "lucide-react";
import { useApp } from "@/lib/context";
import Link from "next/link";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, unreadCount } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <div className="hidden sm:block">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Score pill */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-emerald-700">{user.greenScore}</span>
            <span className="text-xs text-emerald-600 hidden sm:inline">Green Score</span>
          </div>

          {/* Notifications */}
          <Link
            href="/profile"
            className="relative p-2 hover:bg-gray-100 rounded-lg"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Avatar */}
          <Link href="/profile" className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {user.avatar}
          </Link>
        </div>
      </div>
    </header>
  );
}
