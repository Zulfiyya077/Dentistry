export enum UserRole {
  GUEST = "guest",
  PATIENT = "patient",
  DOCTOR = "doctor",
  ADMIN = "admin",
}

export enum SubscriptionPlan {
  FREE = "free",
  PRO = "pro",
  PREMIUM = "premium",
}

export enum VerificationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ReportStatus {
  OPEN = "open",
  RESOLVED = "resolved",
  DISMISSED = "dismissed",
}

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export enum CredentialDocumentType {
  DIPLOMA = "diploma",
  MEDICAL_LICENSE = "medical_license",
  SPECIALIZATION_CERT = "specialization_cert",
}
