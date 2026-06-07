import z from "zod";

export const classSessionSchema = z.object({
  name: z.string().trim().min(3, "Nome da aula é obrigatório"),
  professorId: z.string().uuid("Professor inválido"),
  startAt: z.string().pipe(z.coerce.date()), // Converte string ISO para Date
  capacity: z.number().int().positive("Capacidade deve ser maior que zero"),
});

export type ClassSessionSchema = z.infer<typeof classSessionSchema>;
