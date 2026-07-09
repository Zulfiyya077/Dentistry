"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import { DEMO_USERS } from "@/features/auth/data/mock-users";
import { mockAuthService } from "@/features/auth/services/mock-auth.service";
import type {
  AuthUser,
  LoginInput,
  RegisterInput,
} from "@/features/auth/types/auth.types";
import { UserRole } from "@/types/enums";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  loginAsDemo: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  return mockAuthService.getSession()?.user ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setUser(readStoredUser());
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      const session = mockAuthService.login(input);
      flushSync(() => {
        setUser(session.user);
      });
      router.replace("/dashboard");
    },
    [router]
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const session = mockAuthService.register(input);
      flushSync(() => {
        setUser(session.user);
      });
      router.replace("/dashboard");
    },
    [router]
  );

  const loginAsDemo = useCallback(
    async (email: string) => {
      const demo = DEMO_USERS.find((u) => u.email === email);
      if (!demo) {
        throw new Error("INVALID_CREDENTIALS");
      }
      await login({ email: demo.email, password: demo.password });
    },
    [login]
  );

  const logout = useCallback(() => {
    mockAuthService.logout();
    setUser(null);
    router.replace("/");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      loginAsDemo,
    }),
    [user, isLoading, login, register, logout, loginAsDemo]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function useRequireAuth(allowedRoles?: UserRole[]) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isLoading) return;

    const storedUser = readStoredUser();
    const currentUser = auth.user ?? storedUser;

    if (!currentUser) {
      router.replace("/auth/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      router.replace("/dashboard");
    }
  }, [auth.isLoading, auth.user, allowedRoles, router]);

  return auth;
}
