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
