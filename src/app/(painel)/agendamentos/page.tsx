"use client";

import { ClassSessionForm } from "@/components/schedule/ClassSessionForm";
import { SessionDetail } from "@/components/schedule/SessionDetail";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  useClassSessions,
  useCreateClassSession,
} from "@/hooks/useClassSessions";
import { apiError } from "@/lib/apiError";
import { ClassSession } from "@/types/models";
import { ChevronLeft, ChevronRight, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export default function AgendamentosPage() {
  const [day, setDay] = useState(() => startOfDay(new Date()));

  const from = day;
  const to = new Date(day);
  to.setDate(to.getDate() + 1);

  const { data: sessions, isLoading } = useClassSessions({
    from: from.toISOString(),
    to: to.toISOString(),
  });

  const create = useCreateClassSession();

  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<ClassSession | null>(null);

  const shiftDay = (delta: number) => {
    const next = new Date(day);
    next.setDate(next.getDate() + delta);
    setDay(startOfDay(next));
  };

  const isToday = isSameDay(day, new Date());
  const label = day.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-medium text-foreground">Agendamentos</h1>
        <div className="flex-1" />
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Nova aula
        </Button>
      </div>

      {/* Navegação por dia */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => shiftDay(-1)}
          title="Dia anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-[190px] text-center">
          <div className="text-sm font-medium capitalize text-foreground">
            {label}
          </div>
          {isToday && <div className="text-xs text-cyan-700">Hoje</div>}
        </div>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => shiftDay(1)}
          title="Próximo dia"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        {!isToday && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDay(startOfDay(new Date()))}
          >
            Hoje
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        )}
        {!isLoading && sessions?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma aula neste dia.
          </p>
        )}
        {sessions?.map((s) => {
          const occupancy = s._count?.appointments ?? 0;
          const full = occupancy >= s.capacity;
          return (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className="rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{s.name}</span>
                <span className="text-sm font-medium text-cyan-700">
                  {new Date(s.startAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Prof. {s.professor?.name ?? "--"}
              </p>
              <p className="mt-2 flex items-center gap-1 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span
                  className={
                    full
                      ? "font-medium text-highlight-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {occupancy}/{s.capacity}
                  {full ? " · lotada" : ""}
                </span>
              </p>
            </button>
          );
        })}
      </div>

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Nova aula"
      >
        <ClassSessionForm
          isSubmitting={create.isPending}
          onSubmit={(data) =>
            create.mutate(data, {
              onSuccess: () => {
                toast.success("Aula criada");
                setCreating(false);
              },
              onError: (e) => toast.error(apiError(e)),
            })
          }
        />
      </Modal>

      {/* Detalhe da aula (alunos + presença) */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? "Aula"}
        maxWidth="max-w-xl"
      >
        {selected && (
          <p className="text-sm text-muted-foreground">
            Lista de alunos e presença - em breve
          </p>
        )}
      </Modal>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? "Aula"}
        maxWidth="max-w-xl"
      >
        {selected && <SessionDetail session={selected} />}
      </Modal>
    </div>
  );
}
