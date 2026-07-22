"use client";

import { usePlans } from "@/hooks/usePlans";
import {
  useAssignPackage,
  useCancelPackage,
  useStudentPackages,
} from "@/hooks/useStudentPackages";
import { apiError } from "@/lib/apiError";
import { StudentPackageStatus } from "@/types/models";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const statusLabel: Record<StudentPackageStatus, string> = {
  ACTIVE: "Ativo",
  EXPIRED: "Vencido",
  DEPLETED: "Esgotado",
  CANCELLED: "Cancelado",
};

const statusColor: Record<StudentPackageStatus, string> = {
  ACTIVE: "bg-cyan-100 text-cyan-800",
  EXPIRED: "bg-muted text-muted-foreground",
  DEPLETED: "bg-highlight/20 text-highlight-foreground",
  CANCELLED: "bg-destructive/10 text-destructive",
};

export function StudentPackages({
  studentId,
  studentActive,
}: {
  studentId: string;
  studentActive: boolean;
}) {
  const { data: packages, isLoading } = useStudentPackages(studentId);
  const { data: plans } = usePlans(true); // Só planos ativos
  const assign = useAssignPackage();
  const cancel = useCancelPackage(studentId);
  const [planId, setPlanId] = useState("");

  const handleAssign = () => {
    if (!planId) return toast.error("Selecione um plano");
    assign.mutate(
      { studentId, planId },
      {
        onSuccess: () => {
          toast.success("Pacote atribuído");
          setPlanId("");
        },
        onError: (e) => toast.error(apiError(e)),
      },
    );
  };

  return (
    <div className="space-y-5">
      {isLoading && (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      )}
      {!isLoading && packages?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum pacote registrado.
        </p>
      )}

      {!!packages?.length && (
        <ul className="space-y-2">
          {packages.map((pkg) => (
            <li
              key={pkg.id}
              className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
            >
              <div>
                <p className="font-medium text-foreground">
                  {pkg.plan?.name ?? "Plano"}
                </p>
                <p className="text-muted-foreground">
                  {pkg.creditsRemaining}/{pkg.creditsTotal} créditos · vence{" "}
                  {new Date(pkg.expiresAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[pkg.status]}`}
                >
                  {statusLabel[pkg.status]}
                </span>
                {pkg.status === "ACTIVE" && (
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-destructive"
                    onClick={() =>
                      cancel.mutate(pkg.id, {
                        onSuccess: () => toast.success("Pacote cancelado"),
                        onError: (e) => toast.error(apiError(e)),
                      })
                    }
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {studentActive && (
        <div className="flex items-end gap-2 border-t border-border pt-4">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground">
              Atribuir novo pacote
            </label>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
            >
              <option value="">Selecione um plano...</option>
              {plans?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.credits} aulas / {p.validityDays} dias
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleAssign}
            disabled={assign.isPending}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-focus)]"
          >
            Atribuir
          </Button>
        </div>
      )}
    </div>
  );
}
