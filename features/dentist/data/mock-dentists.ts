import {
  SubscriptionPlan,
  VerificationStatus,
} from "@/types/enums";
import type { LocalizedString } from "@/lib/i18n/types";

export type SpecializationKey =
  | "cosmetic"
  | "orthodontics"
  | "implantology"
  | "pediatric"
  | "surgery"
  | "periodontics"
  | "endodontics"
  | "prosthodontics"
  | "general";

export interface MockDiploma {
  id: string;
  degree: LocalizedString;
  title: LocalizedString;
  institution: LocalizedString;
  year: number;
  country: LocalizedString;
}

export interface MockCertificate {
  id: string;
  title: LocalizedString;
  issuer: LocalizedString;
  year: number;
  credentialId?: string;
}

export interface MockEducation {
  id: string;
  degree: LocalizedString;
  institution: LocalizedString;
  field: LocalizedString;
  year: number;
  country: LocalizedString;
}

export interface MockWorkplace {
  id: string;
  name: LocalizedString;
  type: "clinic" | "hospital" | "university";
  role: LocalizedString;
  address: LocalizedString;
  city: LocalizedString;
  country: LocalizedString;
  period: LocalizedString;
  isCurrent: boolean;
  phone?: string;
}

export interface MockExperience {
  id: string;
  role: LocalizedString;
  organization: LocalizedString;
  period: LocalizedString;
  description?: LocalizedString;
}

export interface MockSocialLinks {
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface MockPortfolioCase {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  technique: LocalizedString;
  duration: LocalizedString;
  beforeColor: string;
  afterColor: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  galleryColors: string[];
}

export interface MockReview {
  id: string;
  patientName: string;
  rating: number;
  content: LocalizedString;
  date: string;
  helpfulCount: number;
}

export interface MockDentist {
  id: string;
  slug: string;
  fullName: string;
  title: LocalizedString;
  specializationKey: SpecializationKey;
  specialization: LocalizedString;
  biography: LocalizedString;
  city: LocalizedString;
  cityId: string;
  countryCode: string;
  country: LocalizedString;
  languages: LocalizedString[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  recommendationRate: number;
  patientCount: number;
  followerCount: number;
  profileViews: number;
  isVerified: boolean;
  isFeatured: boolean;
  isOnline: boolean;
  verificationStatus: VerificationStatus;
  subscriptionPlan: SubscriptionPlan;
  priceRange: string;
  licenseNumber: string;
  avatarInitial: string;
  coverGradient: string;
  avatarImageUrl?: string;
  coverImageUrl?: string;
  portfolioPreview: [string, string, string];
  services: LocalizedString[];
  associations: LocalizedString[];
  awards: LocalizedString[];
  socialLinks: MockSocialLinks;
  diplomas: MockDiploma[];
  certificates: MockCertificate[];
  education: MockEducation[];
  workplaces: MockWorkplace[];
  experience: MockExperience[];
  portfolioCases: MockPortfolioCase[];
  reviews: MockReview[];
}

export const SPECIALIZATION_KEYS: SpecializationKey[] = [
  "cosmetic",
  "orthodontics",
  "implantology",
  "pediatric",
  "surgery",
  "periodontics",
  "endodontics",
  "prosthodontics",
  "general",
];

export const COUNTRY_OPTIONS = [
  { code: "az", label: { az: "Azərbaycan", en: "Azerbaijan" } },
  { code: "tr", label: { az: "Türkiyə", en: "Turkey" } },
] as const;

export const CITY_OPTIONS: Record<
  string,
  { id: string; label: LocalizedString }[]
> = {
  az: [
    { id: "baku", label: { az: "Bakı", en: "Baku" } },
    { id: "ganja", label: { az: "Gəncə", en: "Ganja" } },
    { id: "sumgait", label: { az: "Sumqayıt", en: "Sumgait" } },
    { id: "mingachevir", label: { az: "Mingəçevir", en: "Mingachevir" } },
  ],
  tr: [
    { id: "istanbul", label: { az: "İstanbul", en: "Istanbul" } },
    { id: "ankara", label: { az: "Ankara", en: "Ankara" } },
  ],
};

export const MOCK_DENTISTS: MockDentist[] = [
  {
    id: "1",
    slug: "gunay-mammadova",
    fullName: "Dr. Güney Məmmədova",
    title: {
      az: "Həkim-stomatoloq, Estetik Stomatologiya mütəxəssisi",
      en: "DDS, Cosmetic Dentistry Specialist",
    },
    specializationKey: "cosmetic",
    specialization: {
      az: "Estetik Stomatologiya",
      en: "Cosmetic Dentistry",
    },
    biography: {
      az: "15 ildən artıq təcrübəyə malik estetik stomatoloq. Gülüş dizaynı, keramik vinirlər, Hollywood Smile və tam ağız reabilitasiyası üzrə ixtisaslaşmışdır. Minimal invaziv texnikalarla təbii və estetik nəticələr əldə etməyə fokuslanır. 3500-dən çox pasiyentə xidmət göstərmişdir.",
      en: "Cosmetic dentist with 15+ years of experience specializing in smile design, ceramic veneers, Hollywood Smile, and full-mouth rehabilitation. Focused on natural, aesthetic results using minimally invasive techniques. Served over 3,500 patients.",
    },
    city: { az: "Bakı", en: "Baku" },
    cityId: "baku",
    countryCode: "az",
    country: { az: "Azərbaycan", en: "Azerbaijan" },
    languages: [
      { az: "Azərbaycan dili", en: "Azerbaijani" },
      { az: "İngilis dili", en: "English" },
      { az: "Rus dili", en: "Russian" },
    ],
    experienceYears: 15,
    rating: 4.9,
    reviewCount: 128,
    recommendationRate: 97,
    patientCount: 3500,
    followerCount: 842,
    profileViews: 12400,
    isVerified: true,
    isFeatured: true,
    isOnline: true,
    verificationStatus: VerificationStatus.APPROVED,
    subscriptionPlan: SubscriptionPlan.PREMIUM,
    priceRange: "$$$",
    licenseNumber: "AZ-DNT-2012-0456",
    avatarInitial: "G",
    coverGradient: "from-blue-600/30 via-primary/20 to-cyan-400/30",
    portfolioPreview: [
      "from-rose-200 to-pink-300",
      "from-sky-200 to-blue-300",
      "from-emerald-200 to-teal-300",
    ],
    services: [
      { az: "Hollywood Smile", en: "Hollywood Smile" },
      { az: "Keramik vinirlər", en: "Ceramic Veneers" },
      { az: "Diş ağartma", en: "Teeth Whitening" },
      { az: "Gülüş dizaynı", en: "Smile Design" },
      { az: "Kompozit restavrasyon", en: "Composite Restoration" },
    ],
    associations: [
      {
        az: "Azərbaycan Stomatoloqlar Assosiasiyası",
        en: "Azerbaijan Dental Association",
      },
      {
        az: "Estetik Stomatologiya Cəmiyyəti",
        en: "Aesthetic Dentistry Society",
      },
    ],
    awards: [
      { az: "İlin ən yaxşı estetik stomatoloqu — Bakı 2024", en: "Best Cosmetic Dentist of the Year — Baku 2024" },
      { az: "Pasiyent seçimi mükafatı 2023", en: "Patient Choice Award 2023" },
    ],
    socialLinks: {
      website: "https://smilestudio.az",
      instagram: "https://instagram.com/dr.gunay.mammadova",
      facebook: "https://facebook.com/smilestudio.baku",
      linkedin: "https://linkedin.com/in/gunay-mammadova",
      whatsapp: "+994501234567",
    },
    diplomas: [
      {
        id: "dip1",
        degree: { az: "Həkim-stomatoloq", en: "Doctor of Dental Surgery" },
        title: { az: "Stomatologiya ixtisası", en: "Dentistry Degree" },
        institution: {
          az: "Azərbaycan Tibb Universiteti",
          en: "Azerbaijan Medical University",
        },
        year: 2009,
        country: { az: "Azərbaycan", en: "Azerbaijan" },
      },
      {
        id: "dip2",
        degree: { az: "Magistr", en: "Master's Degree" },
        title: {
          az: "Estetik Stomatologiya",
          en: "Aesthetic Dentistry",
        },
        institution: {
          az: "Moskva Dövlət Stomatologiya Universiteti",
          en: "Moscow State University of Medicine and Dentistry",
        },
        year: 2012,
        country: { az: "Rusiya", en: "Russia" },
      },
    ],
    certificates: [
      {
        id: "cert1",
        title: { az: "Digital Smile Design (DSD)", en: "Digital Smile Design (DSD)" },
        issuer: { az: "DSD World", en: "DSD World" },
        year: 2021,
        credentialId: "DSD-2021-8842",
      },
      {
        id: "cert2",
        title: { az: "Keramik viniirlər sertifikatı", en: "Ceramic Veneers Certification" },
        issuer: { az: "Ivoclar Vivadent Academy", en: "Ivoclar Vivadent Academy" },
        year: 2019,
      },
    ],
    education: [
      {
        id: "edu1",
        degree: { az: "Həkim-stomatoloq", en: "DDS" },
        institution: {
          az: "Azərbaycan Tibb Universiteti",
          en: "Azerbaijan Medical University",
        },
        field: { az: "Stomatologiya", en: "Dentistry" },
        year: 2009,
        country: { az: "Azərbaycan", en: "Azerbaijan" },
      },
      {
        id: "edu2",
        degree: { az: "Rezidentura", en: "Residency" },
        institution: {
          az: "Moskva Dövlət Stomatologiya Universiteti",
          en: "Moscow State University of Medicine and Dentistry",
        },
        field: { az: "Ortopedik stomatologiya", en: "Prosthodontics" },
        year: 2011,
        country: { az: "Rusiya", en: "Russia" },
      },
    ],
    workplaces: [
      {
        id: "wp1",
        name: { az: "Smile Studio Dental Clinic", en: "Smile Studio Dental Clinic" },
        type: "clinic",
        role: { az: "Baş stomatoloq, təsisçi", en: "Lead Dentist, Founder" },
        address: { az: "Nizami küçəsi 45, Yasamal", en: "45 Nizami Street, Yasamal" },
        city: { az: "Bakı", en: "Baku" },
        country: { az: "Azərbaycan", en: "Azerbaijan" },
        period: { az: "2016 — indi", en: "2016 — Present" },
        isCurrent: true,
        phone: "+994 12 555 45 45",
      },
      {
        id: "wp2",
        name: { az: "Bakı Stomatologiya Mərkəzi", en: "Baku Dental Center" },
        type: "clinic",
        role: { az: "Estetik stomatoloq", en: "Cosmetic Dentist" },
        address: { az: "Füzuli küçəsi 78", en: "78 Fuzuli Street" },
        city: { az: "Bakı", en: "Baku" },
        country: { az: "Azərbaycan", en: "Azerbaijan" },
        period: { az: "2011 — 2016", en: "2011 — 2016" },
        isCurrent: false,
      },
    ],
    experience: [
      {
        id: "exp1",
        role: { az: "Baş estetik stomatoloq", en: "Lead Cosmetic Dentist" },
        organization: { az: "Smile Studio Dental Clinic", en: "Smile Studio Dental Clinic" },
        period: { az: "2016 — indi", en: "2016 — Present" },
        description: {
          az: "Gülüş dizaynı, viniirlər və estetik reabilitasiya üzrə klinikanın əsas mütəxəssisi.",
          en: "Lead specialist for smile design, veneers, and aesthetic rehabilitation at the clinic.",
        },
      },
    ],
    portfolioCases: [
      {
        id: "p1",
        title: { az: "Hollywood Smile", en: "Hollywood Smile" },
        description: {
          az: "10 keramik viniirlə tam gülüş transformasiyası. Təbii görünüş və uzunmüddətli estetik nəticə.",
          en: "Complete smile transformation with 10 ceramic veneers. Natural appearance and long-lasting aesthetic result.",
        },
        technique: { az: "Keramik viniirlər", en: "Ceramic Veneers" },
        duration: { az: "2 həftə", en: "2 weeks" },
        beforeColor: "from-slate-300 to-slate-400",
        afterColor: "from-white to-slate-100",
        galleryColors: [
          "from-rose-100 to-pink-200",
          "from-sky-100 to-blue-200",
          "from-emerald-100 to-teal-200",
        ],
      },
      {
        id: "p2",
        title: { az: "Diş ağartma + düzəliş", en: "Whitening & Alignment" },
        description: {
          az: "Peşəkar ağartma və Invisalign ilə minor düzəliş kombinasiyası.",
          en: "Combined professional whitening and minor alignment correction with Invisalign.",
        },
        technique: { az: "Ağartma + Invisalign", en: "Whitening + Invisalign" },
        duration: { az: "6 ay", en: "6 months" },
        beforeColor: "from-amber-200 to-yellow-300",
        afterColor: "from-white to-blue-50",
        galleryColors: ["from-violet-100 to-purple-200"],
      },
    ],
    reviews: [
      {
        id: "r1",
        patientName: "Ləman H.",
        rating: 5,
        content: {
          az: "Dr. Güney mənim gülüşümü tamamilə dəyişdi. Peşəkar, diqqətli və nəticə gözləntilərimdən də yaxşı oldu.",
          en: "Dr. Gunay completely transformed my smile. Professional, caring, and the results exceeded my expectations.",
        },
        date: "2025-11-12",
        helpfulCount: 24,
      },
      {
        id: "r2",
        patientName: "Rəşad M.",
        rating: 5,
        content: {
          az: "Hollywood Smile proseduru ağrısız keçdi. Bakının ən yaxşı estetik stomatoloqu!",
          en: "The Hollywood Smile procedure was painless. Best cosmetic dentist in Baku!",
        },
        date: "2025-10-03",
        helpfulCount: 18,
      },
    ],
  },
  {
    id: "2",
    slug: "elcin-aliyev",
    fullName: "Dr. Elçin Əliyev",
    title: {
      az: "Həkim-stomatoloq, Ortodontiya mütəxəssisi",
      en: "DMD, Orthodontics Specialist",
    },
    specializationKey: "orthodontics",
    specialization: { az: "Ortodontiya", en: "Orthodontics" },
    biography: {
      az: "Ortodontiya üzrə 12 illik təcrübəyə malik mütəxəssis. Invisalign, metal və keramik breket sistemləri ilə mürəkkəb diş düzəlişi hallarını müalicə edir. Uşaq və böyük pasiyentlərlə işləyir.",
      en: "Orthodontics specialist with 12 years of experience. Treats complex malocclusion cases with Invisalign, metal and ceramic braces. Works with both children and adults.",
    },
    city: { az: "Bakı", en: "Baku" },
    cityId: "baku",
    countryCode: "az",
    country: { az: "Azərbaycan", en: "Azerbaijan" },
    languages: [
      { az: "Azərbaycan dili", en: "Azerbaijani" },
      { az: "İngilis dili", en: "English" },
    ],
    experienceYears: 12,
    rating: 4.8,
    reviewCount: 96,
    recommendationRate: 95,
    patientCount: 2800,
    followerCount: 620,
    profileViews: 9800,
    isVerified: true,
    isFeatured: false,
    isOnline: false,
    verificationStatus: VerificationStatus.APPROVED,
    subscriptionPlan: SubscriptionPlan.PRO,
    priceRange: "$$",
    licenseNumber: "AZ-DNT-2012-0789",
    avatarInitial: "E",
    coverGradient: "from-indigo-600/30 via-violet-500/20 to-purple-400/30",
    portfolioPreview: [
      "from-indigo-200 to-violet-300",
      "from-blue-200 to-indigo-300",
      "from-purple-200 to-fuchsia-300",
    ],
    services: [
      { az: "Invisalign", en: "Invisalign" },
      { az: "Metal breket", en: "Metal Braces" },
      { az: "Keramik breket", en: "Ceramic Braces" },
      { az: "Retainer", en: "Retainer" },
    ],
    associations: [
      { az: "Azərbaycan Ortodontlar Cəmiyyəti", en: "Azerbaijan Orthodontic Society" },
    ],
    awards: [
      { az: "Invisalign Top 1% Provayder", en: "Invisalign Top 1% Provider" },
    ],
    socialLinks: {
      instagram: "https://instagram.com/dr.elcin.aliyev",
      linkedin: "https://linkedin.com/in/elcin-aliyev",
      whatsapp: "+994502345678",
    },
    diplomas: [
      {
        id: "dip1",
        degree: { az: "Həkim-stomatoloq", en: "Doctor of Dental Medicine" },
        title: { az: "Stomatologiya ixtisası", en: "Dentistry Degree" },
        institution: { az: "Azərbaycan Tibb Universiteti", en: "Azerbaijan Medical University" },
        year: 2012,
        country: { az: "Azərbaycan", en: "Azerbaijan" },
      },
    ],
    certificates: [
      {
        id: "cert1",
        title: { az: "Invisalign Diamond Provider", en: "Invisalign Diamond Provider" },
        issuer: { az: "Align Technology", en: "Align Technology" },
        year: 2022,
      },
    ],
    education: [
      {
        id: "edu1",
        degree: { az: "Həkim-stomatoloq", en: "DMD" },
        institution: { az: "Azərbaycan Tibb Universiteti", en: "Azerbaijan Medical University" },
        field: { az: "Stomatologiya", en: "Dentistry" },
        year: 2012,
        country: { az: "Azərbaycan", en: "Azerbaijan" },
      },
      {
        id: "edu2",
        degree: { az: "Ortodontiya rezidenturası", en: "Orthodontics Residency" },
        institution: { az: "Hacettepe Universiteti", en: "Hacettepe University" },
        field: { az: "Ortodontiya", en: "Orthodontics" },
        year: 2014,
        country: { az: "Türkiyə", en: "Turkey" },
      },
    ],
    workplaces: [
      {
        id: "wp1",
        name: { az: "Align Dental Ortodontiya Mərkəzi", en: "Align Dental Orthodontics Center" },
        type: "clinic",
        role: { az: "Baş ortodont", en: "Chief Orthodontist" },
        address: { az: "Azadlıq prospekti 156", en: "156 Azadlig Avenue" },
        city: { az: "Bakı", en: "Baku" },
        country: { az: "Azərbaycan", en: "Azerbaijan" },
        period: { az: "2014 — indi", en: "2014 — Present" },
        isCurrent: true,
        phone: "+994 12 444 78 90",
      },
    ],
    experience: [
      {
        id: "exp1",
        role: { az: "Ortodont", en: "Orthodontist" },
        organization: { az: "Align Dental Ortodontiya Mərkəzi", en: "Align Dental Orthodontics Center" },
        period: { az: "2014 — indi", en: "2014 — Present" },
      },
    ],
    portfolioCases: [
      {
        id: "p1",
        title: { az: "Invisalign tam müalicə", en: "Invisalign Full Treatment" },
        description: {
          az: "18 aylıq Invisalign müalicəsi ilə ciddi sıxılıq düzəldildi.",
          en: "18-month Invisalign treatment corrected severe crowding.",
        },
        technique: { az: "Invisalign", en: "Invisalign" },
        duration: { az: "18 ay", en: "18 months" },
        beforeColor: "from-stone-300 to-stone-400",
        afterColor: "from-white to-stone-100",
        galleryColors: ["from-indigo-100 to-violet-200"],
      },
    ],
    reviews: [
      {
        id: "r1",
        patientName: "Nigar S.",
        rating: 5,
        content: {
          az: "Invisalign müalicəsi mükəmməl nəticə verdi. Dr. Elçin çox peşəkardır.",
          en: "Invisalign treatment gave perfect results. Dr. Elcin is very professional.",
        },
        date: "2025-12-01",
        helpfulCount: 12,
      },
    ],
  },
  {
    id: "3",
    slug: "aynur-hasanova",
    fullName: "Dr. Aynur Həsənova",
    title: {
      az: "Həkim-stomatoloq, İmplantologiya mütəxəssisi",
      en: "DDS, Implantology Specialist",
    },
    specializationKey: "implantology",
    specialization: { az: "İmplantologiya", en: "Implantology" },
    biography: {
      az: "İmplantologiya üzrə aparıcı mütəxəssis. All-on-4, tam çənə restavrasiyası və mürəkkəb sümük qraftı əməliyyatları üzrə 2000-dən çox uğurlu implant qoyulması. 18 illik təcrübə.",
      en: "Leading implantologist with 18 years of experience. Over 2,000 successful implant placements including All-on-4, full-arch restoration, and complex bone grafting procedures.",
    },
    city: { az: "Bakı", en: "Baku" },
    cityId: "baku",
    countryCode: "az",
    country: { az: "Azərbaycan", en: "Azerbaijan" },
    languages: [
      { az: "Azərbaycan dili", en: "Azerbaijani" },
      { az: "Türk dili", en: "Turkish" },
      { az: "İngilis dili", en: "English" },
    ],
    experienceYears: 18,
    rating: 5.0,
    reviewCount: 74,
    recommendationRate: 99,
    patientCount: 4200,
    followerCount: 1100,
    profileViews: 15600,
    isVerified: true,
    isFeatured: true,
    isOnline: true,
    verificationStatus: VerificationStatus.APPROVED,
    subscriptionPlan: SubscriptionPlan.PREMIUM,
    priceRange: "$$$$",
    licenseNumber: "AZ-DNT-2007-0123",
    avatarInitial: "A",
    coverGradient: "from-teal-600/30 via-emerald-500/20 to-green-400/30",
    portfolioPreview: [
      "from-teal-200 to-emerald-300",
      "from-green-200 to-lime-300",
      "from-cyan-200 to-teal-300",
    ],
    services: [
      { az: "Dental implant", en: "Dental Implants" },
      { az: "All-on-4", en: "All-on-4" },
      { az: "Sümük qraftı", en: "Bone Grafting" },
      { az: "Sinüs lift", en: "Sinus Lift" },
    ],
    associations: [
      { az: "ICOI — Beynəlxalq İmplantoloqlar Konqresi", en: "ICOI — International Congress of Oral Implantologists" },
    ],
    awards: [
      { az: "İlin ən yaxşı implantoloqu — Bakı 2024", en: "Best Implantologist of the Year — Baku 2024" },
    ],
    socialLinks: {
      website: "https://implantcenter.az",
      instagram: "https://instagram.com/dr.aynur.hasanova",
      facebook: "https://facebook.com/implantcenter.baku",
      youtube: "https://youtube.com/@draynurhasanova",
      whatsapp: "+994503456789",
    },
    diplomas: [
      {
        id: "dip1",
        degree: { az: "Həkim-stomatoloq", en: "Doctor of Dental Surgery" },
        title: { az: "Stomatologiya ixtisası", en: "Dentistry Degree" },
        institution: { az: "Azərbaycan Tibb Universiteti", en: "Azerbaijan Medical University" },
        year: 2007,
        country: { az: "Azərbaycan", en: "Azerbaijan" },
      },
    ],
    certificates: [
      {
        id: "cert1",
        title: { az: "All-on-4 sertifikatı", en: "All-on-4 Certification" },
        issuer: { az: "Nobel Biocare", en: "Nobel Biocare" },
        year: 2020,
      },
      {
        id: "cert2",
        title: { az: "ICOI Fellowship", en: "ICOI Fellowship" },
        issuer: { az: "ICOI", en: "ICOI" },
        year: 2018,
      },
    ],
    education: [
      {
        id: "edu1",
        degree: { az: "Həkim-stomatoloq", en: "DDS" },
        institution: { az: "Azərbaycan Tibb Universiteti", en: "Azerbaijan Medical University" },
        field: { az: "Stomatologiya", en: "Dentistry" },
        year: 2007,
        country: { az: "Azərbaycan", en: "Azerbaijan" },
      },
    ],
    workplaces: [
      {
        id: "wp1",
        name: { az: "Bakı İmplant Mərkəzi", en: "Baku Implant Center" },
        type: "clinic",
        role: { az: "Direktor, implantoloq", en: "Director, Implantologist" },
        address: { az: "Bülbül prospekti 23", en: "23 Bulbul Avenue" },
        city: { az: "Bakı", en: "Baku" },
        country: { az: "Azərbaycan", en: "Azerbaijan" },
        period: { az: "2015 — indi", en: "2015 — Present" },
        isCurrent: true,
        phone: "+994 12 333 12 34",
      },
      {
        id: "wp2",
        name: { az: "Central Hospital", en: "Central Hospital" },
        type: "hospital",
        role: { az: "Cərrahi stomatoloq", en: "Oral Surgeon" },
        address: { az: "Səməd Vurğun küçəsi 12", en: "12 Samad Vurgun Street" },
        city: { az: "Bakı", en: "Baku" },
        country: { az: "Azərbaycan", en: "Azerbaijan" },
        period: { az: "2009 — 2015", en: "2009 — 2015" },
        isCurrent: false,
      },
    ],
    experience: [
      {
        id: "exp1",
        role: { az: "İmplantologiya direktoru", en: "Director of Implantology" },
        organization: { az: "Bakı İmplant Mərkəzi", en: "Baku Implant Center" },
        period: { az: "2015 — indi", en: "2015 — Present" },
      },
    ],
    portfolioCases: [
      {
        id: "p1",
        title: { az: "All-on-4 tam çənə", en: "All-on-4 Full Arch" },
        description: {
          az: "Yuxarı və aşağı çənənin implant dəstəkli sabit protezlə tam bərpası.",
          en: "Complete upper and lower arch restoration with implant-supported fixed prosthesis.",
        },
        technique: { az: "All-on-4", en: "All-on-4" },
        duration: { az: "1 gün əməliyyat + 3 ay", en: "1 day surgery + 3 months" },
        beforeColor: "from-stone-400 to-stone-500",
        afterColor: "from-white to-stone-50",
        galleryColors: ["from-teal-100 to-emerald-200"],
      },
    ],
    reviews: [
      {
        id: "r1",
        patientName: "Kamran V.",
        rating: 5,
        content: {
          az: "Həyatımı dəyişən implantlar. Dr. Aynur həqiqətən ekspertdir.",
          en: "Life-changing implants. Dr. Aynur is a true expert.",
        },
        date: "2025-11-28",
        helpfulCount: 31,
      },
    ],
  },
  {
    id: "4",
    slug: "nigar-quliyeva",
    fullName: "Dr. Nigar Quliyeva",
    title: {
      az: "Həkim-stomatoloq, Uşaq Stomatologiyası",
      en: "DDS, Pediatric Dentistry",
    },
    specializationKey: "pediatric",
    specialization: { az: "Uşaq Stomatologiyası", en: "Pediatric Dentistry" },
    biography: {
      az: "Uşaqlar üçün stomatologiya üzrə ixtisaslaşmış həkim. Sedasiya stomatologiyası və xüsusi ehtiyaclı uşaqlarla iş təcrübəsi. Uşaqlar üçün pozitiv stomatoloji təcrübə yaratmağa fokuslanır.",
      en: "Pediatric dentist specializing in creating positive dental experiences for children. Expert in sedation dentistry and special needs patients.",
    },
    city: { az: "Gəncə", en: "Ganja" },
    cityId: "ganja",
    countryCode: "az",
    country: { az: "Azərbaycan", en: "Azerbaijan" },
    languages: [
      { az: "Azərbaycan dili", en: "Azerbaijani" },
      { az: "Rus dili", en: "Russian" },
    ],
    experienceYears: 10,
    rating: 4.7,
    reviewCount: 112,
    recommendationRate: 94,
    patientCount: 5200,
    followerCount: 450,
    profileViews: 7200,
    isVerified: true,
    isFeatured: false,
    isOnline: true,
    verificationStatus: VerificationStatus.APPROVED,
    subscriptionPlan: SubscriptionPlan.PRO,
    priceRange: "$$",
    licenseNumber: "AZ-DNT-2014-0567",
    avatarInitial: "N",
    coverGradient: "from-orange-500/30 via-amber-400/20 to-yellow-300/30",
    portfolioPreview: [
      "from-orange-200 to-amber-300",
      "from-yellow-200 to-orange-200",
      "from-rose-200 to-orange-200",
    ],
    services: [
      { az: "Uşaq diş müalicəsi", en: "Pediatric Dental Treatment" },
      { az: "Sedasiya stomatologiyası", en: "Sedation Dentistry" },
      { az: "Fissur sealant", en: "Fissure Sealants" },
      { az: "Fluorlaşdırma", en: "Fluoridation" },
    ],
    associations: [],
    awards: [],
    socialLinks: {
      instagram: "https://instagram.com/dr.nigar.quliyeva",
      facebook: "https://facebook.com/kidssmile.ganja",
      whatsapp: "+994504567890",
    },
    diplomas: [
      {
        id: "dip1",
        degree: { az: "Həkim-stomatoloq", en: "Doctor of Dental Surgery" },
        title: { az: "Stomatologiya ixtisası", en: "Dentistry Degree" },
        institution: { az: "Azərbaycan Tibb Universiteti", en: "Azerbaijan Medical University" },
        year: 2014,
        country: { az: "Azərbaycan", en: "Azerbaijan" },
      },
    ],
    certificates: [
      {
        id: "cert1",
        title: { az: "Uşaq Stomatologiyası Sertifikatı", en: "Pediatric Dentistry Certificate" },
        issuer: { az: "AAPD", en: "American Academy of Pediatric Dentistry" },
        year: 2016,
      },
    ],
    education: [
      {
        id: "edu1",
        degree: { az: "Həkim-stomatoloq", en: "DDS" },
        institution: { az: "Azərbaycan Tibb Universiteti", en: "Azerbaijan Medical University" },
        field: { az: "Stomatologiya", en: "Dentistry" },
        year: 2014,
        country: { az: "Azərbaycan", en: "Azerbaijan" },
      },
    ],
    workplaces: [
      {
        id: "wp1",
        name: { az: "Kids Smile Klinikası", en: "Kids Smile Clinic" },
        type: "clinic",
        role: { az: "Uşaq stomatoloqu", en: "Pediatric Dentist" },
        address: { az: "Atatürk prospekti 89", en: "89 Ataturk Avenue" },
        city: { az: "Gəncə", en: "Ganja" },
        country: { az: "Azərbaycan", en: "Azerbaijan" },
        period: { az: "2016 — indi", en: "2016 — Present" },
        isCurrent: true,
        phone: "+994 22 555 67 89",
      },
    ],
    experience: [],
    portfolioCases: [],
    reviews: [
      {
        id: "r1",
        patientName: "Günay M.",
        rating: 5,
        content: {
          az: "Uşaqlarım artıq stomatoloqa getməkdən qorxmurlar!",
          en: "My kids actually look forward to dental visits now!",
        },
        date: "2025-10-15",
        helpfulCount: 9,
      },
    ],
  },
  {
    id: "5",
    slug: "ramin-ismayilov",
    fullName: "Dr. Ramin İsmayılov",
    title: {
      az: "Həkim-stomatoloq, Endodontiya mütəxəssisi",
      en: "DDS, Endodontics Specialist",
    },
    specializationKey: "endodontics",
    specialization: { az: "Endodontiya", en: "Endodontics" },
    biography: {
      az: "Mikroskop dəstəkli endodontiya üzrə mütəxəssis. Kök canal müalicəsində yüksək dəqiqlik və uğur faizi. Diş çəkilməli deyil deyən hallarda dişi xilas edir.",
      en: "Root canal specialist using microscope-assisted endodontics for highest precision and success rates. Saves teeth when others recommend extraction.",
    },
    city: { az: "Sumqayıt", en: "Sumgait" },
    cityId: "sumgait",
    countryCode: "az",
    country: { az: "Azərbaycan", en: "Azerbaijan" },
    languages: [
      { az: "Azərbaycan dili", en: "Azerbaijani" },
      { az: "Rus dili", en: "Russian" },
    ],
    experienceYears: 9,
    rating: 4.8,
    reviewCount: 65,
    recommendationRate: 93,
    patientCount: 1900,
    followerCount: 290,
    profileViews: 4100,
    isVerified: true,
    isFeatured: false,
    isOnline: true,
    verificationStatus: VerificationStatus.APPROVED,
    subscriptionPlan: SubscriptionPlan.FREE,
    priceRange: "$$",
    licenseNumber: "AZ-DNT-2015-0890",
    avatarInitial: "R",
    coverGradient: "from-red-500/20 via-rose-400/15 to-pink-300/20",
    portfolioPreview: [
      "from-red-200 to-rose-300",
      "from-pink-200 to-red-200",
      "from-rose-200 to-pink-300",
    ],
    services: [
      { az: "Kök canal müalicəsi", en: "Root Canal Treatment" },
      { az: "Mikroskop endodontiya", en: "Microscope Endodontics" },
      { az: "Diş çəkilməsi", en: "Tooth Extraction" },
    ],
    associations: [],
    awards: [],
    socialLinks: {
      linkedin: "https://linkedin.com/in/ramin-ismayilov",
      whatsapp: "+994505678901",
    },
    diplomas: [
      {
        id: "dip1",
        degree: { az: "Həkim-stomatoloq", en: "Doctor of Dental Surgery" },
        title: { az: "Stomatologiya ixtisası", en: "Dentistry Degree" },
        institution: { az: "Azərbaycan Tibb Universiteti", en: "Azerbaijan Medical University" },
        year: 2015,
        country: { az: "Azərbaycan", en: "Azerbaijan" },
      },
    ],
    certificates: [
      {
        id: "cert1",
        title: { az: "Endodontiya sertifikatı", en: "Endodontics Certificate" },
        issuer: { az: "University of Illinois", en: "University of Illinois" },
        year: 2017,
      },
    ],
    education: [
      {
        id: "edu1",
        degree: { az: "Həkim-stomatoloq + Endodontiya", en: "DDS + Endodontics" },
        institution: { az: "Azərbaycan Tibb Universiteti", en: "Azerbaijan Medical University" },
        field: { az: "Endodontiya", en: "Endodontics" },
        year: 2015,
        country: { az: "Azərbaycan", en: "Azerbaijan" },
      },
    ],
    workplaces: [
      {
        id: "wp1",
        name: { az: "Endo Dental Klinikası", en: "Endo Dental Clinic" },
        type: "clinic",
        role: { az: "Endodontoloq", en: "Endodontist" },
        address: { az: "Koroğlu Ramin küçəsi 34", en: "34 Koroglu Ramin Street" },
        city: { az: "Sumqayıt", en: "Sumgait" },
        country: { az: "Azərbaycan", en: "Azerbaijan" },
        period: { az: "2016 — indi", en: "2016 — Present" },
        isCurrent: true,
      },
    ],
    experience: [],
    portfolioCases: [],
    reviews: [
      {
        id: "r1",
        patientName: "Leyla A.",
        rating: 5,
        content: {
          az: "Dişimi xilas etdi, başqa həkimlər çəkməyi deyirdilər.",
          en: "Saved my tooth when others said extraction was the only option.",
        },
        date: "2025-11-02",
        helpfulCount: 11,
      },
    ],
  },
  {
    id: "6",
    slug: "sevda-karimova",
    fullName: "Dr. Sevda Kərimova",
    title: {
      az: "Həkim-stomatoloq, Protez Stomatologiyası",
      en: "DDS, Prosthodontics",
    },
    specializationKey: "prosthodontics",
    specialization: { az: "Protez Stomatologiyası", en: "Prosthodontics" },
    biography: {
      az: "Protez stomatologiyası üzrə mütəxəssis. Korona, körpü, protez və rəqəmsal axınla tam ağız rekonstruksiyası. Türkiyə və Avropadan pasiyentlər qəbul edir.",
      en: "Prosthodontist expert in crowns, bridges, dentures, and full-mouth reconstructions with digital workflow. Accepts patients from Turkey and Europe.",
    },
    city: { az: "Bakı", en: "Baku" },
    cityId: "baku",
    countryCode: "az",
    country: { az: "Azərbaycan", en: "Azerbaijan" },
    languages: [
      { az: "Azərbaycan dili", en: "Azerbaijani" },
      { az: "Türk dili", en: "Turkish" },
      { az: "İngilis dili", en: "English" },
      { az: "Alman dili", en: "German" },
    ],
    experienceYears: 11,
    rating: 4.9,
    reviewCount: 142,
    recommendationRate: 98,
    patientCount: 4800,
    followerCount: 920,
    profileViews: 11200,
    isVerified: true,
    isFeatured: true,
    isOnline: true,
    verificationStatus: VerificationStatus.APPROVED,
    subscriptionPlan: SubscriptionPlan.PREMIUM,
    priceRange: "$$",
    licenseNumber: "AZ-DNT-2013-0345",
    avatarInitial: "S",
    coverGradient: "from-amber-600/30 via-orange-500/20 to-red-400/30",
    portfolioPreview: [
      "from-amber-200 to-orange-300",
      "from-orange-200 to-red-200",
      "from-yellow-200 to-amber-300",
    ],
    services: [
      { az: "Sirkon korona", en: "Zirconia Crowns" },
      { az: "Tam ağız rekonstruksiya", en: "Full Mouth Reconstruction" },
      { az: "Removable protez", en: "Removable Dentures" },
      { az: "CAD/CAM restavrasyon", en: "CAD/CAM Restoration" },
    ],
    associations: [
      { az: "3Shape Academy", en: "3Shape Academy" },
    ],
    awards: [
      { az: "Tibbi turizm mükafatı 2024", en: "Medical Tourism Excellence Award 2024" },
    ],
    socialLinks: {
      website: "https://demirdental.az",
      instagram: "https://instagram.com/dr.sevda.karimova",
      facebook: "https://facebook.com/demirdental",
      linkedin: "https://linkedin.com/in/sevda-karimova",
      youtube: "https://youtube.com/@demirdental",
      whatsapp: "+994506789012",
    },
    diplomas: [
      {
        id: "dip1",
        degree: { az: "Həkim-stomatoloq", en: "Doctor of Dental Surgery" },
        title: { az: "Stomatologiya ixtisası", en: "Dentistry Degree" },
        institution: { az: "Azərbaycan Tibb Universiteti", en: "Azerbaijan Medical University" },
        year: 2013,
        country: { az: "Azərbaycan", en: "Azerbaijan" },
      },
    ],
    certificates: [
      {
        id: "cert1",
        title: { az: "Rəqəmsal Stomatologiya", en: "Digital Dentistry Certification" },
        issuer: { az: "3Shape Academy", en: "3Shape Academy" },
        year: 2023,
      },
    ],
    education: [
      {
        id: "edu1",
        degree: { az: "Həkim-stomatoloq", en: "DDS" },
        institution: { az: "Azərbaycan Tibb Universiteti", en: "Azerbaijan Medical University" },
        field: { az: "Stomatologiya", en: "Dentistry" },
        year: 2013,
        country: { az: "Azərbaycan", en: "Azerbaijan" },
      },
    ],
    workplaces: [
      {
        id: "wp1",
        name: { az: "Demir Dental Lab & Klinika", en: "Demir Dental Lab & Clinic" },
        type: "clinic",
        role: { az: "Baş protez stomatoloqu", en: "Lead Prosthodontist" },
        address: { az: "Xaqani küçəsi 67", en: "67 Xagani Street" },
        city: { az: "Bakı", en: "Baku" },
        country: { az: "Azərbaycan", en: "Azerbaijan" },
        period: { az: "2015 — indi", en: "2015 — Present" },
        isCurrent: true,
        phone: "+994 12 666 78 90",
      },
    ],
    experience: [],
    portfolioCases: [
      {
        id: "p1",
        title: { az: "Tam ağız rekonstruksiya", en: "Full Mouth Reconstruction" },
        description: {
          az: "Sirkon kronlar və implant dəstəkli körpülərlə tam rehabilitasiya.",
          en: "Complete rehabilitation with zirconia crowns and implant-supported bridges.",
        },
        technique: { az: "Sirkon kron + implant", en: "Zirconia Crowns + Implants" },
        duration: { az: "4 ay", en: "4 months" },
        beforeColor: "from-stone-400 to-stone-500",
        afterColor: "from-white to-stone-50",
        galleryColors: ["from-amber-100 to-orange-200"],
      },
    ],
    reviews: [
      {
        id: "r1",
        patientName: "Hans K.",
        rating: 5,
        content: {
          az: "Almaniyadan gəldim, hər manatına dəyər.",
          en: "Came from Germany for treatment. Worth every penny.",
        },
        date: "2025-12-10",
        helpfulCount: 28,
      },
    ],
  },
];

export function getDentistBySlug(slug: string): MockDentist | undefined {
  return MOCK_DENTISTS.find((d) => d.slug === slug);
}

export function getFeaturedDentists(): MockDentist[] {
  return MOCK_DENTISTS.filter((d) => d.isFeatured);
}

export function getSpecializationLabel(
  key: SpecializationKey,
  locale: "az" | "en"
): string {
  const labels: Record<SpecializationKey, { az: string; en: string }> = {
    cosmetic: { az: "Estetik Stomatologiya", en: "Cosmetic Dentistry" },
    orthodontics: { az: "Ortodontiya", en: "Orthodontics" },
    implantology: { az: "İmplantologiya", en: "Implantology" },
    pediatric: { az: "Uşaq Stomatologiyası", en: "Pediatric Dentistry" },
    surgery: { az: "Cərrahi Stomatologiya", en: "Oral Surgery" },
    periodontics: { az: "Periodontologiya", en: "Periodontics" },
    endodontics: { az: "Endodontiya", en: "Endodontics" },
    prosthodontics: { az: "Protez Stomatologiyası", en: "Prosthodontics" },
    general: { az: "Ümumi Stomatologiya", en: "General Dentistry" },
  };
  return labels[key][locale];
}
