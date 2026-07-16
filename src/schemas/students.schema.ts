import z from "zod";

/*
  Regras de negócio: Peso entre 42 e 107 kg, altura minima 140cm.
  Exigidas por segurança na prática de Bungee Fitness.
*/

export const studentSchema = z.object({
  name: z.string().trim().min(3, "O nome deve conter no mínimo 3 caracteres"),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10,11}$/, "Telefone deve conter 10 ou 11 dígitos numéricos"),
  cpf: z
    .string()
    .trim()
    .regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos"),
  email: z.string().trim().email("Email Invalido").optional().or(z.literal("")),
  birthDate: z.string().pipe(z.coerce.date()).optional(),
  heightCm: z
    .number()
    .int()
    .min(140, "A altura mínima para a prática é de 140cm")
    .max(250, "Altura inválida"),
  weightKg: z
    .number()
    .min(42, "O peso mínimo para a prática é de 42 kg")
    .max(107, "O peso máximo para a prática é de 107 kg"),
});

// PATCH manda só os campos que mudaram -> Tudo opcional.
export const studentUpdateSchema = studentSchema.partial();

export type StudentSchema = z.infer<typeof studentSchema>;
export type StudentUpdateSchema = z.infer<typeof studentUpdateSchema>;
