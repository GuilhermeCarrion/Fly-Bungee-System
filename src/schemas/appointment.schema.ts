import z from "zod";

export const appointmentSchema = z.object({
  studentId: z.string().uuid("Aluno invalido"),
  classSessionId: z.string().uuid("Aula invalida"),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;
