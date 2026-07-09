import { DEMO_USERS } from "@/features/auth/data/mock-users";
import type {
  AuthSession,
  AuthUser,
  LoginInput,
  MockUserRecord,
  RegisterInput,
} from "@/features/auth/types/auth.types";
import { UserRole } from "@/types/enums";

const SESSION_KEY = "dentistry-session";
const REGISTERED_KEY = "dentistry-registered-users";

function toAuthUser(record: MockUserRecord): AuthUser {
  return {
    id: record.id,
    email: record.email,
    displayName: record.displayName,
    role: record.role,
    dentistSlug: record.dentistSlug,
  };
}

function getRegisteredUsers(): MockUserRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    return raw ? (JSON.parse(raw) as MockUserRecord[]) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: MockUserRecord[]) {
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(users));
}

function findUserByEmail(email: string): MockUserRecord | undefined {
  const normalized = email.toLowerCase().trim();
  return (
    DEMO_USERS.find((u) => u.email.toLowerCase() === normalized) ??
    getRegisteredUsers().find((u) => u.email.toLowerCase() === normalized)
  );
}

function createSession(user: AuthUser): AuthSession {
  return {
    user,
    token: `mock-token-${user.id}-${Date.now()}`,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
}

export const mockAuthService = {
  login(input: LoginInput): AuthSession {
    const user = findUserByEmail(input.email);

    if (!user || user.password !== input.password) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const session = createSession(toAuthUser(user));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  register(input: RegisterInput): AuthSession {
    const email = input.email.toLowerCase().trim();

    if (findUserByEmail(email)) {
      throw new Error("EMAIL_EXISTS");
    }

    if (input.password.length < 6) {
      throw new Error("WEAK_PASSWORD");
    }

    const newUser: MockUserRecord = {
      id: `user-${Date.now()}`,
      email,
      password: input.password,
      displayName: input.displayName.trim(),
      role: input.role,
      ...(input.role === UserRole.DOCTOR
        ? { dentistSlug: `dr-${Date.now()}` }
        : {}),
    };

    const registered = getRegisteredUsers();
    registered.push(newUser);
    saveRegisteredUsers(registered);

    const session = createSession(toAuthUser(newUser));
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;

    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;

      const session = JSON.parse(raw) as AuthSession;
      if (session.expiresAt < Date.now()) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }

      return session;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },
};
