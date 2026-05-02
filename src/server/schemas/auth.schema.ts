import z from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z
    .string()
    .trim()
    .min(6, "Senha deve conter no mínimo 6 caracteres"),
});
