"use client";

import { apiPrivate } from "@/lib/axios";
import { Appointment } from "@/types/models";
import { AttendanceStatus } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAppointmentsBySession(classSessionId?: string) {
  return useQuery({
    queryKey: ["appointments", { classSessionId }],
    enabled: !!classSessionId,
    queryFn: async () =>
      (
        await apiPrivate.get<Appointment[]>(
          `/appointments?classSessionId=${classSessionId}`,
        )
      ).data,
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["appointments"] });
  qc.invalidateQueries({ queryKey: ["class-sessions"] }); // Atauliza ocupação nos cards
}

export function useBookAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { studentId: string; classSessionId: string }) =>
      apiPrivate.post("/appointments", data),
    onSuccess: () => invalidate(qc),
  });
}

export function useAppointmentAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      id: string;
      action: "confirm" | "cancel" | "reschedule";
      targetClassSessionId?: string;
    }) =>
      apiPrivate.patch(`/appointments/${vars.id}`, {
        action: vars.action,
        targetClassSessionId: vars.targetClassSessionId,
      }),
    onSuccess: () => invalidate(qc),
  });
}

export function useSetAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; attendance: AttendanceStatus }) =>
      apiPrivate.patch(`/appointments/${vars.id}/attendance`, {
        attendance: vars.attendance,
      }),
    onSuccess: () => invalidate(qc),
  });
}
