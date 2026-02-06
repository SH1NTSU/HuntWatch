"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const PUBLIC_ROUTES = ["/login", "/signup"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("hijaukita_token");
    if (storedToken) {
      setToken(storedToken);
      // Verify token and get user
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Invalid token");
        })
        .then((data) => {
          setUser({ id: data.id, email: data.email, name: data.name, avatar: data.avatar });
          setIsLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("hijaukita_token");
          setToken(null);
          setUser(null);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Redirect logic
  useEffect(() => {
    if (isLoading) return;

    if (!user && !PUBLIC_ROUTES.includes(pathname)) {
      router.push("/login");
    }
    if (user && PUBLIC_ROUTES.includes(pathname)) {
      router.push("/");
    }
  }, [user, isLoading, pathname, router]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Login failed" };
      }

      localStorage.setItem("hijaukita_token", data.token);
      setToken(data.token);
      setUser(data.user);
      router.push("/");
      return {};
    } catch {
      return { error: "Network error" };
    }
  }, [router]);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Signup failed" };
      }

      localStorage.setItem("hijaukita_token", data.token);
      setToken(data.token);
      setUser(data.user);
      router.push("/");
      return {};
    } catch {
      return { error: "Network error" };
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("hijaukita_token");
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
