import { UserRole } from "@/types/enums";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  dentistSlug?: string;
}

export interface MockUserRecord extends AuthUser {
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  displayName: string;
  email: string;
  password: string;
  role: UserRole.PATIENT | UserRole.DOCTOR;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: number;
}
