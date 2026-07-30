import {
  useAppointmentAction,
  useAppointmentsBySession,
  useBookAppointment,
  useSetAttendance,
} from "@/hooks/useAppointments";
import { useStudents } from "@/hooks/useStudents";
import { apiError } from "@/lib/apiError";
import {
  AppointmentStatus,
  ClassSession,
  AttendanceStatus,
} from "@/types/models";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const apptStatus: Record<AppointmentStatus, string> = {
  BOOKED: "Agendado",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
  RESCHEDULED: "Remarcado",
};

export function SessionDetail({ session }: { session: ClassSession }) {
  const { data: appts, isLoading } = useAppointmentsBySession(session.id);
  const { data: students } = useStudents();
  const book = useBookAppointment();
  const action = useAppointmentAction();
  const setAtt = useSetAttendance();
  const [studentId, setStudentId] = useState("");

  // Cancelados/remarcados saem da lista visível (mas continuam no histórico)
  const activeAppts = appts?.filter(
    (a) => a.status !== "CANCELLED" && a.status !== "RESCHEDULED",
  );

  const handleBook = () => {
    if (!studentId) return toast.error("Selecione um aluno");
    book.mutate(
      { studentId, classSessionId: session.id },
      {
        onSuccess: () => {
          toast.success("Aluno agendado");
          setStudentId("");
        },
        onError: (e) => toast.error(apiError(e)),
      },
    );
  };

  const mark = (id: string, attendance: AttendanceStatus) =>
    setAtt.mutate(
      { id, attendance },
      { onError: (e) => toast.error(apiError(e)) },
    );

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {new Date(session.startAt).toLocaleString("pt-BR")} · Prof.{" "}
        {session.professor?.name ?? "-"} · {activeAppts?.length ?? 0}/
        {session.capacity}
      </div>

      {/* Agendar aluno */}
      <div className="flex items-end gap-2 border-b border-border pb-4">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground">
            Agendar aluno
          </label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
          >
            <option value="">Selecione um aluno...</option>
            {students
              ?.filter((s) => s.active)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
        </div>
        <Button
          onClick={handleBook}
          disabled={book.isPending}
          className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-focus)]"
        >
          Agendar
        </Button>
      </div>

      {/* Lista */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : activeAppts?.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum aluno agendado.</p>
      ) : (
        <ul className="space-y-2">
          {activeAppts?.map((a) => (
            <li
              key={a.id}
              className="rounded-lg border border-border p-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">
                  {a.student?.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {apptStatus[a.status]}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {a.status === "BOOKED" && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() =>
                      action.mutate(
                        { id: a.id, action: "confirm" },
                        { onError: (e) => toast.error(apiError(e)) },
                      )
                    }
                  >
                    Confirmar
                  </Button>
                )}
                <Button
                  size="xs"
                  variant="outline"
                  className={
                    a.attendance === "PRESENT"
                      ? "border-transparent bg-green-100 text-green-700"
                      : ""
                  }
                  onClick={() => mark(a.id, "PRESENT")}
                >
                  Presente
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  className={
                    a.attendance === "ABSENT"
                      ? "border-transparent bg-red-100 text-red-700"
                      : ""
                  }
                  onClick={() => mark(a.id, "ABSENT")}
                >
                  Faltou
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() =>
                    action.mutate(
                      { id: a.id, action: "cancel" },
                      {
                        onSuccess: () => toast.success("Agendamento cancelado"),
                        onError: (e) => toast.error(apiError(e)),
                      },
                    )
                  }
                >
                  Cancelar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
