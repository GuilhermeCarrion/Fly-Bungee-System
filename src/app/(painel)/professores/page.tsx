"use client";

import { ProfessorForm } from "@/components/professors/ProfessorForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  useCreateProfessor,
  useDeleteProfessor,
  useProfessors,
  useUpdateProfessor,
} from "@/hooks/useProfessors";
import { apiError } from "@/lib/apiError";
import { Professor } from "@/types/models";
import { Pencil, Plus, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfessoresPage() {
  const { data: professors, isLoading } = useProfessors();
  const create = useCreateProfessor();
  const remove = useDeleteProfessor();

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Professor | null>(null);
  const [search, setSearch] = useState("");

  const update = useUpdateProfessor(editing?.id ?? "");

  const filtered = (professors ?? []).filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return p.name.toLowerCase().includes(q) || p.cpf.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-foreground">Professores</h1>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Novo Professor
        </Button>
      </div>

      <Input
        placeholder="Busque por nome ou CPF"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">CPF</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  Carregando...
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  Nenhum professor encontrado.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground">
                  {p.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.cpf}</td>
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
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      title="Inativar"
                      onClick={() =>
                        remove.mutate(p.id, {
                          onSuccess: () =>
                            toast.success("Professor inativado com sucesso"),
                          onError: (e) => toast.error(apiError(e)),
                        })
                      }
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
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
        title="Novo professor"
      >
        <ProfessorForm
          isSubmitting={create.isPending}
          onSubmit={(data) =>
            create.mutate(data, {
              onSuccess: () => {
                toast.success("Professor cadastrado");
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
        title="Editar professor"
      >
        {editing && (
          <ProfessorForm
            professor={editing}
            isSubmitting={update.isPending}
            onSubmit={(data) =>
              create.mutate(data, {
                onSuccess: () => {
                  toast.success("Professor atualizado");
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
