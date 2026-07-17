import z from "zod";

export const planSchema = z.object({
  name: z.string().trim().min(2, "Nome do plano é obrigatório"),
  credits: z
    .number()
    .int()
    .positive("A quantidade de aulas deve ser maior que zero"),
  validityDays: z
    .number()
    .int()
    .positive("A validade (em dias) deve ser maior que zero"),
  price: z.number().nonnegative("Preço inválido"),
  active: z.boolean().optional(),
});

export const planUpdateSchema = planSchema.partial();

export type PlanSchema = z.infer<typeof planSchema>;
export type PlanUpdateSchema = z.infer<typeof planUpdateSchema>;
