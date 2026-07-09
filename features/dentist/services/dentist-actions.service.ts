import { AppointmentStatus } from "@/types/enums";

const FOLLOWS_KEY = "dentistry-follows";
const BOOKMARKS_KEY = "dentistry-bookmarks";
const APPOINTMENTS_KEY = "dentistry-appointments";

export interface MockAppointment {
  id: string;
  dentistId: string;
  dentistName: string;
  dentistSlug?: string;
  patientName?: string;
  date: string;
  time: string;
  note?: string;
  status: AppointmentStatus;
  createdAt: string;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeAppointment(apt: MockAppointment): MockAppointment {
  return {
    ...apt,
    status: apt.status ?? AppointmentStatus.PENDING,
  };
}

function readAppointments(): MockAppointment[] {
  return readJson<MockAppointment[]>(APPOINTMENTS_KEY, []).map(normalizeAppointment);
}

function writeAppointments(appointments: MockAppointment[]) {
  writeJson(APPOINTMENTS_KEY, appointments);
}

export const dentistActionsService = {
  isFollowing(dentistId: string): boolean {
    const follows = readJson<string[]>(FOLLOWS_KEY, []);
    return follows.includes(dentistId);
  },

  toggleFollow(dentistId: string): boolean {
    const follows = readJson<string[]>(FOLLOWS_KEY, []);
    const isFollowing = follows.includes(dentistId);
    const next = isFollowing
      ? follows.filter((id) => id !== dentistId)
      : [...follows, dentistId];
    writeJson(FOLLOWS_KEY, next);
    return !isFollowing;
  },

  isBookmarked(dentistId: string): boolean {
    const bookmarks = readJson<string[]>(BOOKMARKS_KEY, []);
    return bookmarks.includes(dentistId);
  },

  toggleBookmark(dentistId: string): boolean {
    const bookmarks = readJson<string[]>(BOOKMARKS_KEY, []);
    const isBookmarked = bookmarks.includes(dentistId);
    const next = isBookmarked
      ? bookmarks.filter((id) => id !== dentistId)
      : [...bookmarks, dentistId];
    writeJson(BOOKMARKS_KEY, next);
    return !isBookmarked;
  },

  getAppointments(): MockAppointment[] {
    return readAppointments();
  },

  getAppointmentsForDentist(dentistId: string): MockAppointment[] {
    return readAppointments()
      .filter((a) => a.dentistId === dentistId)
      .sort(
        (a, b) =>
          new Date(`${b.date}T${b.time}`).getTime() -
          new Date(`${a.date}T${a.time}`).getTime()
      );
  },

  getPendingCountForDentist(dentistId: string): number {
    return this.getAppointmentsForDentist(dentistId).filter(
      (a) => a.status === AppointmentStatus.PENDING
    ).length;
  },

  updateAppointmentStatus(id: string, status: AppointmentStatus) {
    const appointments = readAppointments();
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) return;
    appointments[index] = { ...appointments[index], status };
    writeAppointments(appointments);
  },

  getFollowerCount(dentistId: string): number {
    const follows = readJson<string[]>(FOLLOWS_KEY, []);
    return follows.filter((id) => id === dentistId).length;
  },

  getFollows(): string[] {
    return readJson<string[]>(FOLLOWS_KEY, []);
  },

  getBookmarks(): string[] {
    return readJson<string[]>(BOOKMARKS_KEY, []);
  },

  bookAppointment(
    data: Omit<MockAppointment, "id" | "createdAt" | "status"> & {
      status?: AppointmentStatus;
    }
  ): MockAppointment {
    const appointments = readAppointments();
    const appointment: MockAppointment = {
      ...data,
      status: data.status ?? AppointmentStatus.PENDING,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    appointments.push(appointment);
    writeAppointments(appointments);
    return appointment;
  },

  async shareProfile(slug: string, title: string): Promise<"shared" | "copied"> {
    const url = `${window.location.origin}/dentists/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return "shared";
      } catch (err) {
        if ((err as Error).name === "AbortError") throw err;
      }
    }

    await navigator.clipboard.writeText(url);
    return "copied";
  },
};
