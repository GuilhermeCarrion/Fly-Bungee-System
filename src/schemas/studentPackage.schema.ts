import z from "zod";

export const studentPackageSchema = z.object({
  studentId: z.string().uuid("Aluno inválido"),
  planId: z.string().uuid("Plano inválido"),
  startedAt: z.string().pipe(z.coerce.date()).optional(),
});

export type StudentPackageSchema = z.infer<typeof studentPackageSchema>;
