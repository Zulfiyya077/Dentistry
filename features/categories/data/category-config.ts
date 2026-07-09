import type { LocalizedString } from "@/lib/i18n/types";
import type { SpecializationKey } from "@/features/dentist/data/mock-dentists";

export interface CategoryConfig {
  key: SpecializationKey;
  gradient: string;
  icon: string;
  description: LocalizedString;
}

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    key: "cosmetic",
    gradient: "from-rose-500/20 via-pink-400/15 to-fuchsia-300/20",
    icon: "sparkles",
    description: {
      az: "Gülüş dizaynı, vinirlər, Hollywood Smile və estetik diş müalicəsi",
      en: "Smile design, veneers, Hollywood Smile, and aesthetic dental treatments",
    },
  },
  {
    key: "orthodontics",
    gradient: "from-indigo-500/20 via-violet-400/15 to-purple-300/20",
    icon: "align-center",
    description: {
      az: "Breket, Invisalign və diş düzəlişi müalicələri",
      en: "Braces, Invisalign, and teeth alignment treatments",
    },
  },
  {
    key: "implantology",
    gradient: "from-teal-500/20 via-emerald-400/15 to-green-300/20",
    icon: "circle-dot",
    description: {
      az: "Dental implant, All-on-4 və çənə restavrasiyası",
      en: "Dental implants, All-on-4, and jaw restoration",
    },
  },
  {
    key: "pediatric",
    gradient: "from-orange-500/20 via-amber-400/15 to-yellow-300/20",
    icon: "baby",
    description: {
      az: "Uşaqlar üçün stomatoloji müalicə və profilaktika",
      en: "Dental treatment and prevention for children",
    },
  },
  {
    key: "surgery",
    gradient: "from-slate-500/20 via-gray-400/15 to-zinc-300/20",
    icon: "scissors",
    description: {
      az: "Diş çəkilməsi, implant əməliyyatları və cərrahi müdaxilələr",
      en: "Tooth extraction, implant surgery, and oral surgical procedures",
    },
  },
  {
    key: "periodontics",
    gradient: "from-emerald-500/20 via-green-400/15 to-lime-300/20",
    icon: "heart-pulse",
    description: {
      az: "Diş əti xəstəlikləri, qraft və periodontoloji müalicə",
      en: "Gum disease treatment, grafting, and periodontal care",
    },
  },
  {
    key: "endodontics",
    gradient: "from-red-500/20 via-rose-400/15 to-pink-300/20",
    icon: "target",
    description: {
      az: "Kök canal müalicəsi və diş xilasetmə prosedurları",
      en: "Root canal treatment and tooth preservation procedures",
    },
  },
  {
    key: "prosthodontics",
    gradient: "from-amber-500/20 via-orange-400/15 to-red-300/20",
    icon: "crown",
    description: {
      az: "Korona, körpü, protez və tam ağız rekonstruksiya",
      en: "Crowns, bridges, dentures, and full mouth reconstruction",
    },
  },
  {
    key: "general",
    gradient: "from-blue-500/20 via-sky-400/15 to-cyan-300/20",
    icon: "stethoscope",
    description: {
      az: "Ümumi stomatoloji müayinə, müalicə və profilaktika",
      en: "General dental examination, treatment, and prevention",
    },
  },
];
