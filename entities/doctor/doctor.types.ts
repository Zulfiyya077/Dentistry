import { UserRole, SubscriptionPlan, VerificationStatus } from "@/types/enums";

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  slug: string;
  fullName: string;
  title: string;
  specialization: string;
  biography: string;
  profilePhoto?: string;
  coverImage?: string;
  medicalDegree?: string;
  university?: string;
  hospital?: string;
  clinic?: string;
  city: string;
  country: string;
  languages: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  recommendationRate: number;
  patientCount: number;
  followerCount: number;
  profileViews: number;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  isFeatured: boolean;
  subscriptionPlan: SubscriptionPlan;
  socialLinks?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  rating: number;
  content: string;
  images?: string[];
  helpfulCount: number;
  status: string;
  createdAt: Date;
}

export interface PortfolioCase {
  id: string;
  doctorId: string;
  title: string;
  description: string;
  technique?: string;
  duration?: string;
  beforeImage?: string;
  afterImage?: string;
  gallery: string[];
  createdAt: Date;
}
