export interface Student {
  id: string;
  name: string;
  phone: string;
  cpf: string;
  email: string | null;
  birthDate: string | null;
  academyId: string;
  active: boolean;
  registredAt: string;
  heightCm: number | null;
  weightKg: string; // Prisma Decimal chega como string no JSON
  createdAt: string;
  updatedAt: string;
}

export interface Professor {
  id: string;
  name: string;
  phone: string;
  cpf: string;
  academyId: string;
  userId: string | null;
  active: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  academyId: string;
  name: string;
  credits: string;
  validityDays: string;
  price: string; // Decimal - chega como string no JSON
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type StudentPackageStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "DEPLETED"
  | "CANCELLED";

export interface StudentPackage {
  id: string;
  academyId: string;
  studentId: string;
  planId: string;
  creditsTotal: number;
  creditsRemaining: number;
  startedAt: string;
  expiresAt: string;
  status: StudentPackageStatus;
  createdAt: string;
  updatedAt: string;
  plan?: { name: string }; // vem do include no listByStudent
}
