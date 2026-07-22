"use client";

import { PlanForm } from "@/components/plans/PlanForm";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  useCreatePlan,
  useDeactivatePlan,
  usePlans,
  useUpdatePlan,
} from "@/hooks/usePlans";
import { apiError } from "@/lib/apiError";
import { Plan } from "@/types/models";
import { Pencil, Plus, Power } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function PlanosPage() {
  const { data: plans, isLoading } = usePlans();
  const create = useCreatePlan();
  const deactivate = useDeactivatePlan();

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const update = useUpdatePlan(editing?.id ?? "");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-foreground">Planos</h1>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Novo plano
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Aulas</th>
              <th className="px-4 py-3">Validade</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  Carregando...
                </td>
              </tr>
            )}
            {!isLoading && plans?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  Nenhum plano cadastrado.
                </td>
              </tr>
            )}
            {plans?.map((p) => (
              <tr key={p.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground">
                  {p.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.credits}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.validityDays} dias
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {brl.format(Number(p.price))}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.active ? "bg-cyan-100 text-cyan-800" : "bg-muted text-muted-foreground"}`}
                  >
                    {p.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditing(p)}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {p.active && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive"
                        title="Desativar"
                        onClick={() =>
                          deactivate.mutate(p.id, {
                            onSuccess: () => toast.success("Plano desativado"),
                            onError: (e) => toast.error(apiError(e)),
                          })
                        }
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Novo plano"
      >
        <PlanForm
          isSubmitting={create.isPending}
          onSubmit={(data) =>
            create.mutate(data, {
              onSuccess: () => {
                toast.success("Plano criado");
                setCreating(false);
              },
              onError: (e) => toast.error(apiError(e)),
            })
          }
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Editar plano"
      >
        {editing && (
          <PlanForm
            plan={editing}
            isSubmitting={update.isPending}
            onSubmit={(data) =>
              update.mutate(data, {
                onSuccess: () => {
                  toast.success("Plano atualizado");
                  setEditing(null);
                },
                onError: (e) => toast.error(apiError(e)),
              })
            }
          />
        )}
      </Modal>
    </div>
  );
}
