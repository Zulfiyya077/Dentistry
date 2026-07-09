import {
  MOCK_DENTISTS,
  type MockDentist,
  type SpecializationKey,
} from "@/features/dentist/data/mock-dentists";

export interface CategoryStats {
  key: SpecializationKey;
  dentistCount: number;
  averageRating: number;
  totalReviews: number;
  verifiedCount: number;
}

export function getCategoryStats(): CategoryStats[] {
  const keys = new Set(MOCK_DENTISTS.map((d) => d.specializationKey));

  return Array.from(keys).map((key) => {
    const dentists = MOCK_DENTISTS.filter((d) => d.specializationKey === key);
    const avgRating =
      dentists.reduce((sum, d) => sum + d.rating, 0) / dentists.length;

    return {
      key,
      dentistCount: dentists.length,
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: dentists.reduce((sum, d) => sum + d.reviewCount, 0),
      verifiedCount: dentists.filter((d) => d.isVerified).length,
    };
  });
}

export function getDentistsBySpecialization(
  key: SpecializationKey
): MockDentist[] {
  return MOCK_DENTISTS.filter((d) => d.specializationKey === key);
}

export function getCategoryStatsByKey(
  key: SpecializationKey
): CategoryStats | undefined {
  return getCategoryStats().find((s) => s.key === key);
}
