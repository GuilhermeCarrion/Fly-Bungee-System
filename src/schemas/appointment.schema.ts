import z from "zod";

export const appointmentSchema = z.object({
  studentId: z.string().uuid("Aluno invalido"),
  classSessionId: z.string().uuid("Aula invalida"),
});

// Ações sobre um agendamento
export const appointmentActionSchema = z.object({
  action: z.enum(["confirm", "cancel", "reschedule"]),
  targetClassSessionId: z.string().uuid().optional(), // Obrigatório apenas no "reschedule"
});

// Registro de presença
export const attendanceSchema = z.object({
  attendance: z.enum(["PRESENT", "ABSENT", "NO_SHOW", "PENDING"]),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;
export type AppointmentActionSchema = z.infer<typeof appointmentActionSchema>;
