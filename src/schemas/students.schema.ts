import z from "zod";

export const studentSchema = z.object({
  name: z.string().trim().min(3, "O nome deve conter no mínimo 3 caracteres"),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10,11}$/, "Telefone deve conter 10 ou 11 dígitos numéricos"),
  cpf: z
    .string()
    .trim()
    .regex(/^\d{11}$/, "CPF deve conter 11 dígitos numériocos"),
  email: z.string().trim().email("Email Invalido").optional().or(z.literal("")),
  birthDate: z.string().pipe(z.coerce.date()).optional(),
  heightCm: z.number().int().positive(),
  weightKg: z.number().positive("O peso deve ser um valor positivo"),
});

export type StudentSchema = z.infer<typeof studentSchema>;
