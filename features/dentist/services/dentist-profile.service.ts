import {
  MOCK_DENTISTS,
  type MockDentist,
  type SpecializationKey,
  CITY_OPTIONS,
  COUNTRY_OPTIONS,
  getSpecializationLabel,
} from "@/features/dentist/data/mock-dentists";
import type { LocalizedString } from "@/lib/i18n/types";
import { SubscriptionPlan, VerificationStatus } from "@/types/enums";
import { dentistPortfolioService } from "@/features/dentist/services/dentist-portfolio.service";

const OVERRIDES_KEY = "dentistry-profile-overrides";
const MINIMAL_PROFILES_KEY = "dentistry-minimal-profiles";

export interface DentistProfileEditData {
  titleAz: string;
  titleEn: string;
  biographyAz: string;
  biographyEn: string;
  experienceYears: number;
  priceRange: string;
  licenseNumber: string;
  cityId: string;
  countryCode: string;
  specializationKey: SpecializationKey;
  website: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
  avatarImageUrl?: string;
  coverImageUrl?: string;
}

export interface DentistProfileOverrides {
  title?: LocalizedString;
  biography?: LocalizedString;
  experienceYears?: number;
  priceRange?: string;
  licenseNumber?: string;
  cityId?: string;
  countryCode?: string;
  city?: LocalizedString;
  country?: LocalizedString;
  specializationKey?: SpecializationKey;
  specialization?: LocalizedString;
  socialLinks?: MockDentist["socialLinks"];
  avatarImageUrl?: string;
  coverImageUrl?: string;
}

type OverridesMap = Record<string, DentistProfileOverrides>;
type MinimalProfilesMap = Record<string, Partial<MockDentist>>;

function getOverridesMap(): OverridesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw ? (JSON.parse(raw) as OverridesMap) : {};
  } catch {
    return {};
  }
}

function saveOverridesMap(map: OverridesMap) {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(map));
}

function getMinimalProfiles(): MinimalProfilesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(MINIMAL_PROFILES_KEY);
    return raw ? (JSON.parse(raw) as MinimalProfilesMap) : {};
  } catch {
    return {};
  }
}

function saveMinimalProfiles(map: MinimalProfilesMap) {
  localStorage.setItem(MINIMAL_PROFILES_KEY, JSON.stringify(map));
}

function resolveCity(countryCode: string, cityId: string): LocalizedString {
  const cities = CITY_OPTIONS[countryCode] ?? [];
  const city = cities.find((c) => c.id === cityId);
  return city?.label ?? { az: cityId, en: cityId };
}

function resolveCountry(countryCode: string): LocalizedString {
  const country = COUNTRY_OPTIONS.find((c) => c.code === countryCode);
  return country?.label ?? { az: countryCode, en: countryCode };
}

function applyOverrides(
  base: MockDentist,
  overrides: DentistProfileOverrides
): MockDentist {
  return {
    ...base,
    ...(overrides.title && { title: overrides.title }),
    ...(overrides.biography && { biography: overrides.biography }),
    ...(overrides.experienceYears !== undefined && {
      experienceYears: overrides.experienceYears,
    }),
    ...(overrides.priceRange && { priceRange: overrides.priceRange }),
    ...(overrides.licenseNumber && { licenseNumber: overrides.licenseNumber }),
    ...(overrides.city && { city: overrides.city }),
    ...(overrides.cityId && { cityId: overrides.cityId }),
    ...(overrides.country && { country: overrides.country }),
    ...(overrides.countryCode && { countryCode: overrides.countryCode }),
    ...(overrides.specializationKey && {
      specializationKey: overrides.specializationKey,
    }),
    ...(overrides.specialization && {
      specialization: overrides.specialization,
    }),
    ...(overrides.socialLinks && {
      socialLinks: { ...base.socialLinks, ...overrides.socialLinks },
    }),
    ...(overrides.avatarImageUrl && { avatarImageUrl: overrides.avatarImageUrl }),
    ...(overrides.coverImageUrl && { coverImageUrl: overrides.coverImageUrl }),
    portfolioCases: dentistPortfolioService.getCases(base.slug),
  };
}

function createEmptyProfile(
  slug: string,
  displayName: string
): MockDentist {
  return {
    id: `custom-${slug}`,
    slug,
    fullName: displayName,
    title: { az: "", en: "" },
    specializationKey: "general",
    specialization: {
      az: getSpecializationLabel("general", "az"),
      en: getSpecializationLabel("general", "en"),
    },
    biography: { az: "", en: "" },
    city: { az: "Bakı", en: "Baku" },
    cityId: "baku",
    countryCode: "az",
    country: { az: "Azərbaycan", en: "Azerbaijan" },
    languages: [{ az: "Azərbaycan dili", en: "Azerbaijani" }],
    experienceYears: 0,
    rating: 0,
    reviewCount: 0,
    recommendationRate: 0,
    patientCount: 0,
    followerCount: 0,
    profileViews: 0,
    isVerified: false,
    isFeatured: false,
    isOnline: false,
    verificationStatus: VerificationStatus.PENDING,
    subscriptionPlan: SubscriptionPlan.FREE,
    priceRange: "$$",
    licenseNumber: "",
    avatarInitial: displayName.charAt(0).toUpperCase() || "D",
    coverGradient: "from-primary/20 via-secondary/10 to-primary/30",
    portfolioPreview: [
      "from-slate-200 to-slate-300",
      "from-slate-200 to-slate-300",
      "from-slate-200 to-slate-300",
    ],
    services: [],
    associations: [],
    awards: [],
    socialLinks: {},
    diplomas: [],
    certificates: [],
    education: [],
    workplaces: [],
    experience: [],
    portfolioCases: [],
    reviews: [],
  };
}

export const dentistProfileService = {
  getMergedProfile(slug: string): MockDentist | undefined {
    const base = MOCK_DENTISTS.find((d) => d.slug === slug);
    const overrides = getOverridesMap()[slug];
    const minimal = getMinimalProfiles()[slug];

    if (base) {
      const merged = overrides ? applyOverrides(base, overrides) : { ...base, portfolioCases: dentistPortfolioService.getCases(slug) };
      return merged;
    }

    if (minimal) {
      const empty = createEmptyProfile(slug, minimal.fullName ?? slug);
      const profile = applyOverrides({ ...empty, ...minimal }, overrides ?? {});
      return { ...profile, portfolioCases: dentistPortfolioService.getCases(slug) };
    }

    return undefined;
  },

  getEditData(slug: string, displayName: string): DentistProfileEditData {
    const profile =
      this.getMergedProfile(slug) ??
      createEmptyProfile(slug, displayName);

    return {
      titleAz: profile.title.az,
      titleEn: profile.title.en,
      biographyAz: profile.biography.az,
      biographyEn: profile.biography.en,
      experienceYears: profile.experienceYears,
      priceRange: profile.priceRange,
      licenseNumber: profile.licenseNumber,
      cityId: profile.cityId,
      countryCode: profile.countryCode,
      specializationKey: profile.specializationKey,
      website: profile.socialLinks.website ?? "",
      instagram: profile.socialLinks.instagram ?? "",
      linkedin: profile.socialLinks.linkedin ?? "",
      whatsapp: profile.socialLinks.whatsapp ?? "",
    };
  },

  saveProfile(slug: string, displayName: string, data: DentistProfileEditData) {
    const base = MOCK_DENTISTS.find((d) => d.slug === slug);
    const city = resolveCity(data.countryCode, data.cityId);
    const country = resolveCountry(data.countryCode);
    const specialization: LocalizedString = {
      az: getSpecializationLabel(data.specializationKey, "az"),
      en: getSpecializationLabel(data.specializationKey, "en"),
    };

    const overrides: DentistProfileOverrides = {
      title: { az: data.titleAz, en: data.titleEn },
      biography: { az: data.biographyAz, en: data.biographyEn },
      experienceYears: data.experienceYears,
      priceRange: data.priceRange,
      licenseNumber: data.licenseNumber,
      cityId: data.cityId,
      countryCode: data.countryCode,
      city,
      country,
      specializationKey: data.specializationKey,
      specialization,
      socialLinks: {
        website: data.website || undefined,
        instagram: data.instagram || undefined,
        linkedin: data.linkedin || undefined,
        whatsapp: data.whatsapp || undefined,
      },
    };

    const map = getOverridesMap();
    map[slug] = overrides;
    saveOverridesMap(map);

    if (!base) {
      const minimalMap = getMinimalProfiles();
      minimalMap[slug] = {
        slug,
        fullName: displayName,
        avatarInitial: displayName.charAt(0).toUpperCase() || "D",
      };
      saveMinimalProfiles(minimalMap);
    }
  },

  hasProfile(slug: string): boolean {
    return !!MOCK_DENTISTS.find((d) => d.slug === slug) || !!getMinimalProfiles()[slug];
  },
};
