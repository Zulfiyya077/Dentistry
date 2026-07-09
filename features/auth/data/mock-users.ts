import { UserRole } from "@/types/enums";
import type { MockUserRecord } from "@/features/auth/types/auth.types";

export const DEMO_USERS: MockUserRecord[] = [
  {
    id: "demo-patient-1",
    email: "pasiyent@demo.az",
    password: "123456",
    displayName: "Ləman Həsənova",
    role: UserRole.PATIENT,
  },
  {
    id: "demo-doctor-1",
    email: "stomatoloq@demo.az",
    password: "123456",
    displayName: "Dr. Güney Məmmədova",
    role: UserRole.DOCTOR,
    dentistSlug: "gunay-mammadova",
  },
  {
    id: "demo-admin-1",
    email: "admin@demo.az",
    password: "123456",
    displayName: "Admin User",
    role: UserRole.ADMIN,
  },
];

export const DEMO_CREDENTIALS = DEMO_USERS.map((u) => ({
  email: u.email,
  password: u.password,
  role: u.role,
  label: u.displayName,
}));
