import { MOCK_DENTISTS, type MockPortfolioCase } from "@/features/dentist/data/mock-dentists";
import type { LocalizedString } from "@/lib/i18n/types";

const PORTFOLIO_KEY = "dentistry-portfolio-store";

export const PORTFOLIO_GRADIENT_OPTIONS = [
  "from-slate-300 to-slate-400",
  "from-white to-slate-100",
  "from-rose-200 to-pink-300",
  "from-sky-200 to-blue-300",
  "from-emerald-200 to-teal-300",
  "from-amber-200 to-yellow-300",
  "from-violet-200 to-purple-300",
  "from-cyan-200 to-blue-200",
] as const;

export interface PortfolioCaseInput {
  titleAz: string;
  titleEn: string;
  descriptionAz: string;
  descriptionEn: string;
  techniqueAz: string;
  techniqueEn: string;
  durationAz: string;
  durationEn: string;
  beforeColor: string;
  afterColor: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

interface PortfolioStoreEntry {
  updated: Record<string, MockPortfolioCase>;
  added: MockPortfolioCase[];
  deletedIds: string[];
}

type PortfolioStore = Record<string, PortfolioStoreEntry>;

function getStore(): PortfolioStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PORTFOLIO_KEY);
    return raw ? (JSON.parse(raw) as PortfolioStore) : {};
  } catch {
    return {};
  }
}

function saveStore(store: PortfolioStore) {
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(store));
}

function getBaseCases(slug: string): MockPortfolioCase[] {
  return MOCK_DENTISTS.find((d) => d.slug === slug)?.portfolioCases ?? [];
}

function ensureEntry(store: PortfolioStore, slug: string): PortfolioStoreEntry {
  return store[slug] ?? { updated: {}, added: [], deletedIds: [] };
}

function toPortfolioCase(id: string, data: PortfolioCaseInput): MockPortfolioCase {
  const ls = (az: string, en: string): LocalizedString => ({ az, en });
  return {
    id,
    title: ls(data.titleAz, data.titleEn),
    description: ls(data.descriptionAz, data.descriptionEn),
    technique: ls(data.techniqueAz, data.techniqueEn),
    duration: ls(data.durationAz, data.durationEn),
    beforeColor: data.beforeColor,
    afterColor: data.afterColor,
    beforeImageUrl: data.beforeImageUrl,
    afterImageUrl: data.afterImageUrl,
    galleryColors: [],
  };
}

function mergeCases(slug: string): MockPortfolioCase[] {
  const base = getBaseCases(slug);
  const entry = getStore()[slug];

  if (!entry) return base;

  const merged = base
    .filter((c) => !entry.deletedIds.includes(c.id))
    .map((c) => entry.updated[c.id] ?? c);

  return [...merged, ...entry.added];
}

export const dentistPortfolioService = {
  getCases(slug: string): MockPortfolioCase[] {
    return mergeCases(slug);
  },

  getCaseInput(item: MockPortfolioCase): PortfolioCaseInput {
    return {
      titleAz: item.title.az,
      titleEn: item.title.en,
      descriptionAz: item.description.az,
      descriptionEn: item.description.en,
      techniqueAz: item.technique.az,
      techniqueEn: item.technique.en,
      durationAz: item.duration.az,
      durationEn: item.duration.en,
      beforeColor: item.beforeColor,
      afterColor: item.afterColor,
    };
  },

  saveCase(slug: string, data: PortfolioCaseInput, caseId?: string) {
    const store = getStore();
    const entry = ensureEntry(store, slug);
    const id = caseId ?? `custom-${Date.now()}`;
    const portfolioCase = toPortfolioCase(id, data);

    const isBase = getBaseCases(slug).some((c) => c.id === id);
    const isAdded = entry.added.some((c) => c.id === id);

    if (isAdded) {
      entry.added = entry.added.map((c) => (c.id === id ? portfolioCase : c));
    } else if (isBase || entry.updated[id]) {
      entry.updated[id] = portfolioCase;
    } else {
      entry.added.push(portfolioCase);
    }

    store[slug] = entry;
    saveStore(store);
  },

  deleteCase(slug: string, caseId: string) {
    const store = getStore();
    const entry = ensureEntry(store, slug);
    const isBase = getBaseCases(slug).some((c) => c.id === caseId);

    if (isBase) {
      if (!entry.deletedIds.includes(caseId)) {
        entry.deletedIds.push(caseId);
      }
      delete entry.updated[caseId];
    } else {
      entry.added = entry.added.filter((c) => c.id !== caseId);
    }

    store[slug] = entry;
    saveStore(store);
  },
};
