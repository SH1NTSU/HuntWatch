"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useAuth } from "./auth-context";
import { apiFetch, apiPost, apiPatch } from "./api";
import type {
  User,
  Notification,
  Challenge,
  Pledge,
  VolunteerEvent,
} from "./data";

interface AppState {
  user: User;
  notifications: Notification[];
  challenges: Challenge[];
  pledges: Pledge[];
  events: VolunteerEvent[];
  unreadCount: number;
  isDataLoading: boolean;
  nudgeUser: (targetName: string) => void;
  joinChallenge: (id: string) => void;
  joinEvent: (id: string) => void;
  addPledge: (pledge: Omit<Pledge, "id">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  logAction: (points: number) => void;
  refreshUser: () => Promise<void>;
}

const defaultUser: User = {
  id: "",
  name: "",
  avatar: "",
  location: "",
  workplace: "",
  ageGroup: "",
  greenScore: 0,
  weeklyScore: 0,
  streak: 0,
  rank: 0,
  totalMembers: 0,
  joinedDate: "",
  treesEquivalent: 0,
  co2Saved: 0,
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user: authUser, token } = useAuth();
  const [user, setUser] = useState<User>(defaultUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch all data when user is authenticated
  const fetchAllData = useCallback(async () => {
    if (!token || !authUser) {
      setIsDataLoading(false);
      return;
    }

    setIsDataLoading(true);
    try {
      const [userData, notifData, challengeData, pledgeData, eventData] = await Promise.all([
        apiFetch<User>("/api/auth/me"),
        apiFetch<Notification[]>("/api/notifications"),
        apiFetch<Challenge[]>("/api/challenges"),
        apiFetch<Pledge[]>("/api/pledges"),
        apiFetch<VolunteerEvent[]>("/api/events"),
      ]);

      setUser(userData);
      setNotifications(notifData);
      setChallenges(challengeData);
      setPledges(pledgeData);
      setEvents(eventData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsDataLoading(false);
    }
  }, [token, authUser]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await apiFetch<User>("/api/auth/me");
      setUser(userData);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  }, []);

  const nudgeUser = useCallback((targetName: string) => {
    const newNotification: Notification = {
      id: `n-${Date.now()}`,
      type: "nudge",
      message: `You sent a nudge to ${targetName} 💚`,
      time: "Just now",
      read: true,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const joinChallenge = useCallback(async (id: string) => {
    try {
      await apiPost("/api/challenges", { challengeId: id });
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, joined: true, participants: c.participants + 1 } : c
        )
      );
      await refreshUser();
    } catch (err) {
      console.error("Failed to join challenge:", err);
    }
  }, [refreshUser]);

  const joinEvent = useCallback(async (id: string) => {
    try {
      await apiPost("/api/events", { eventId: id });
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, joined: true, spotsLeft: Math.max(0, e.spotsLeft - 1) } : e
        )
      );
      await refreshUser();
    } catch (err) {
      console.error("Failed to join event:", err);
    }
  }, [refreshUser]);

  const addPledge = useCallback(async (pledge: Omit<Pledge, "id">) => {
    try {
      await apiPost("/api/pledges", {
        pledge: pledge.pledge,
        brand: pledge.brand,
        totalDays: pledge.totalDays,
        category: pledge.category,
      });
      const pledgeData = await apiFetch<Pledge[]>("/api/pledges");
      setPledges(pledgeData);
      await refreshUser();
    } catch (err) {
      console.error("Failed to add pledge:", err);
    }
  }, [refreshUser]);

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await apiPatch("/api/notifications", { notificationId: id });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification:", err);
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await apiPatch("/api/notifications", { markAll: true });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications:", err);
    }
  }, []);

  const logAction = useCallback((points: number) => {
    setUser((prev) => ({
      ...prev,
      greenScore: Math.min(100, prev.greenScore + points),
      weeklyScore: prev.weeklyScore + points,
      streak: prev.streak + 1,
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        notifications,
        challenges,
        pledges,
        events,
        unreadCount,
        isDataLoading,
        nudgeUser,
        joinChallenge,
        joinEvent,
        addPledge,
        markNotificationRead,
        markAllNotificationsRead,
        logAction,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
