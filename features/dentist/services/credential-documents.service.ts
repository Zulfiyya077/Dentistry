import { VerificationStatus, CredentialDocumentType } from "@/types/enums";

const DOCUMENTS_KEY = "dentistry-credential-documents";

export interface CredentialDocument {
  id: string;
  dentistSlug: string;
  dentistName: string;
  type: CredentialDocumentType;
  title: string;
  fileName: string;
  mimeType: string;
  fileData: string;
  status: VerificationStatus;
  submittedAt: string;
}

export interface CredentialUploadInput {
  dentistSlug: string;
  dentistName: string;
  type: CredentialDocumentType;
  title: string;
  fileName: string;
  mimeType: string;
  fileData: string;
}

const MAX_FILE_SIZE = 3 * 1024 * 1024;

function getDocuments(): CredentialDocument[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DOCUMENTS_KEY);
    return raw ? (JSON.parse(raw) as CredentialDocument[]) : [];
  } catch {
    return [];
  }
}

function saveDocuments(docs: CredentialDocument[]) {
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs));
}

export const credentialDocumentsService = {
  getAll(): CredentialDocument[] {
    return getDocuments().sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  },

  getForDentist(slug: string): CredentialDocument[] {
    return this.getAll().filter((d) => d.dentistSlug === slug);
  },

  getApprovedForDentist(slug: string): CredentialDocument[] {
    return this.getForDentist(slug).filter(
      (d) => d.status === VerificationStatus.APPROVED
    );
  },

  isDocumentVerified(slug: string): boolean {
    const approved = this.getApprovedForDentist(slug);
    const hasDiploma = approved.some(
      (d) => d.type === CredentialDocumentType.DIPLOMA
    );
    const hasLicense = approved.some(
      (d) => d.type === CredentialDocumentType.MEDICAL_LICENSE
    );
    return hasDiploma && hasLicense;
  },

  getPendingCount(): number {
    return getDocuments().filter((d) => d.status === VerificationStatus.PENDING)
      .length;
  },

  upload(input: CredentialUploadInput): CredentialDocument {
    if (input.fileData.length > MAX_FILE_SIZE * 1.4) {
      throw new Error("FILE_TOO_LARGE");
    }

    const doc: CredentialDocument = {
      id: `doc-${Date.now()}`,
      dentistSlug: input.dentistSlug,
      dentistName: input.dentistName,
      type: input.type,
      title: input.title,
      fileName: input.fileName,
      mimeType: input.mimeType,
      fileData: input.fileData,
      status: VerificationStatus.PENDING,
      submittedAt: new Date().toISOString(),
    };

    const docs = getDocuments();
    docs.push(doc);
    saveDocuments(docs);
    return doc;
  },

  setStatus(id: string, status: VerificationStatus) {
    const docs = getDocuments();
    const index = docs.findIndex((d) => d.id === id);
    if (index === -1) return;
    docs[index] = { ...docs[index], status };
    saveDocuments(docs);
  },

  deleteDocument(id: string, dentistSlug: string) {
    const docs = getDocuments().filter(
      (d) => !(d.id === id && d.dentistSlug === dentistSlug)
    );
    saveDocuments(docs);
  },

  seedDemoDocuments() {
    const existing = getDocuments();
    if (existing.length > 0) return;

    const demo: CredentialDocument[] = [
      {
        id: "demo-doc-1",
        dentistSlug: "elcin-aliyev",
        dentistName: "Dr. Elçin Əliyev",
        type: CredentialDocumentType.DIPLOMA,
        title: "Stomatologiya diplomu",
        fileName: "diploma.pdf",
        mimeType: "application/pdf",
        fileData: "",
        status: VerificationStatus.PENDING,
        submittedAt: "2026-02-10T00:00:00.000Z",
      },
      {
        id: "demo-doc-2",
        dentistSlug: "aynur-hasanova",
        dentistName: "Dr. Aynur Həsənova",
        type: CredentialDocumentType.MEDICAL_LICENSE,
        title: "Həkim lisenziyası",
        fileName: "license.jpg",
        mimeType: "image/jpeg",
        fileData: "",
        status: VerificationStatus.PENDING,
        submittedAt: "2026-02-12T00:00:00.000Z",
      },
    ];
    saveDocuments(demo);
  },
};
