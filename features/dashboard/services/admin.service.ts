import { DEMO_USERS } from "@/features/auth/data/mock-users";
import type { MockUserRecord } from "@/features/auth/types/auth.types";
import { MOCK_DENTISTS } from "@/features/dentist/data/mock-dentists";
import { dentistActionsService } from "@/features/dentist/services/dentist-actions.service";
import { reviewModerationService } from "@/features/dashboard/services/review-moderation.service";
import { UserRole, VerificationStatus } from "@/types/enums";

const REGISTERED_KEY = "dentistry-registered-users";
const VERIFICATION_OVERRIDES_KEY = "dentistry-verification-overrides";
const USER_STATUS_KEY = "dentistry-user-status";

export type UserAccountStatus = "active" | "suspended";

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  dentistSlug?: string;
  status: UserAccountStatus;
  isDemo: boolean;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  dentistSlug: string;
  dentistName: string;
  email: string;
  city: string;
  specialization: string;
  status: VerificationStatus;
  submittedAt: string;
  isRegisteredOnly: boolean;
}

type VerificationOverrides = Record<string, VerificationStatus>;
type UserStatusMap = Record<string, UserAccountStatus>;

function getRegisteredUsers(): MockUserRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    return raw ? (JSON.parse(raw) as MockUserRecord[]) : [];
  } catch {
    return [];
  }
}

function getVerificationOverrides(): VerificationOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VERIFICATION_OVERRIDES_KEY);
    return raw ? (JSON.parse(raw) as VerificationOverrides) : {};
  } catch {
    return {};
  }
}

function saveVerificationOverrides(overrides: VerificationOverrides) {
  localStorage.setItem(VERIFICATION_OVERRIDES_KEY, JSON.stringify(overrides));
}

function getUserStatusMap(): UserStatusMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USER_STATUS_KEY);
    return raw ? (JSON.parse(raw) as UserStatusMap) : {};
  } catch {
    return {};
  }
}

function saveUserStatusMap(map: UserStatusMap) {
  localStorage.setItem(USER_STATUS_KEY, JSON.stringify(map));
}

function getDentistVerificationStatus(slug: string): VerificationStatus {
  const overrides = getVerificationOverrides();
  if (overrides[slug]) return overrides[slug];

  const dentist = MOCK_DENTISTS.find((d) => d.slug === slug);
  return dentist?.verificationStatus ?? VerificationStatus.PENDING;
}

function isDentistVerified(slug: string): boolean {
  return getDentistVerificationStatus(slug) === VerificationStatus.APPROVED;
}

export const adminService = {
  getAllUsers(): AdminUser[] {
    const statusMap = getUserStatusMap();

    const demoUsers: AdminUser[] = DEMO_USERS.map((user) => ({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      dentistSlug: user.dentistSlug,
      status: statusMap[user.id] ?? "active",
      isDemo: true,
      createdAt: "2024-01-01T00:00:00.000Z",
    }));

    const registeredUsers: AdminUser[] = getRegisteredUsers().map((user) => ({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      dentistSlug: user.dentistSlug,
      status: statusMap[user.id] ?? "active",
      isDemo: false,
      createdAt: user.id.replace("user-", ""),
    }));

    return [...demoUsers, ...registeredUsers];
  },

  setUserStatus(userId: string, status: UserAccountStatus) {
    const map = getUserStatusMap();
    map[userId] = status;
    saveUserStatusMap(map);
  },

  getVerificationRequests(): VerificationRequest[] {
    const requests: VerificationRequest[] = [];
    const registeredDoctors = getRegisteredUsers().filter(
      (u) => u.role === UserRole.DOCTOR
    );

    for (const doctor of registeredDoctors) {
      if (!doctor.dentistSlug) continue;
      const status = getDentistVerificationStatus(doctor.dentistSlug);
      requests.push({
        id: `reg-${doctor.id}`,
        dentistSlug: doctor.dentistSlug,
        dentistName: doctor.displayName,
        email: doctor.email,
        city: "—",
        specialization: "—",
        status,
        submittedAt: doctor.id.replace("user-", ""),
        isRegisteredOnly: true,
      });
    }

    for (const dentist of MOCK_DENTISTS) {
      const status = getDentistVerificationStatus(dentist.slug);
      if (status === VerificationStatus.APPROVED) continue;

      requests.push({
        id: `mock-${dentist.id}`,
        dentistSlug: dentist.slug,
        dentistName: dentist.fullName,
        email: `${dentist.slug}@dentistry.az`,
        city: dentist.city.az,
        specialization: dentist.specialization.az,
        status,
        submittedAt: "2024-06-15T00:00:00.000Z",
        isRegisteredOnly: false,
      });
    }

    return requests.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  },

  getPendingVerificationCount(): number {
    return this.getVerificationRequests().filter(
      (r) => r.status === VerificationStatus.PENDING
    ).length;
  },

  setVerificationStatus(slug: string, status: VerificationStatus) {
    const overrides = getVerificationOverrides();
    overrides[slug] = status;
    saveVerificationOverrides(overrides);
  },

  isDentistVerified,

  getStats() {
    const users = this.getAllUsers();
    const patientCount = users.filter((u) => u.role === UserRole.PATIENT).length;
    const dentistCount = users.filter((u) => u.role === UserRole.DOCTOR).length;
    const verifiedDentists = MOCK_DENTISTS.filter((d) =>
      isDentistVerified(d.slug)
    ).length;

    return {
      totalUsers: users.length,
      totalPatients: patientCount,
      totalDentists: dentistCount,
      verifiedDentists,
      pendingVerifications: this.getPendingVerificationCount(),
      pendingReviews: reviewModerationService.getPendingCount(),
      totalAppointments: dentistActionsService.getAppointments().length,
      totalBookmarks: dentistActionsService.getBookmarks().length,
      totalFollows: dentistActionsService.getFollows().length,
    };
  },

  seedDemoPendingVerifications() {
    const overrides = getVerificationOverrides();
    const seedSlugs = ["elcin-aliyev", "aynur-hasanova"];

    let changed = false;
    for (const slug of seedSlugs) {
      const dentist = MOCK_DENTISTS.find((d) => d.slug === slug);
      if (dentist && !overrides[slug]) {
        overrides[slug] = VerificationStatus.PENDING;
        changed = true;
      }
    }

    if (changed) {
      saveVerificationOverrides(overrides);
    }
  },
};
