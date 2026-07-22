"use client";

import { StudentForm } from "@/components/students/StudentForm";
import { StudentPackages } from "@/components/students/StudentPackages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  useCreateStudent,
  useInactivateStudent,
  useStudents,
  useUpdateStudent,
} from "@/hooks/useStudents";
import { apiError } from "@/lib/apiError";
import { Student } from "@/types/models";
import { Package, Pencil, Plus, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AlunosPage() {
  const { data: students, isLoading } = useStudents();
  const create = useCreateStudent();
  const inactivate = useInactivateStudent();

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const update = useUpdateStudent(editing?.id ?? "");

  const filtered = (students ?? []).filter((s) => {
    if (!showInactive && !s.active) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return s.name.toLowerCase().includes(q) || s.cpf.includes(q);
  });

  // Packages do aluno
  const [packagesOf, setPackagesOf] = useState<Student | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-foreground">Alunos</h1>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Novo Aluno
        </Button>
      </div>

      {/* Busca + filtro */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar por nome ou CPF"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="accent-primary h-4 w-4"
          />
          Mostrar inativos
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">CPF</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td
                  className="px-4 py-6 text-center text-muted-foreground"
                  colSpan={5}
                >
                  Carregando...
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td
                  className="px-4 py-6 text-center text-muted-foreground"
                  colSpan={5}
                >
                  Nenhum aluno encontrado.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground">
                  {s.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.cpf}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.active ? "bg-cyan-100 text-cyan-800" : "bg-muted text-muted-foreground"}`}
                  >
                    {s.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setPackagesOf(s)}
                      title="Pacotes"
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditing(s)}
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {s.active && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive"
                        title="Inativar"
                        onClick={() =>
                          inactivate.mutate(s.id, {
                            onSuccess: () => toast.success("Aluno inativado"),
                            onError: (e) => toast.error(apiError(e)),
                          })
                        }
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Criar */}
      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Novo aluno"
      >
        <StudentForm
          isSubmitting={create.isPending}
          onSubmit={(data) =>
            create.mutate(data, {
              onSuccess: () => {
                (toast.success("Aluno cadastrado"), setCreating(false));
              },
              onError: (e) => toast.error(apiError(e)),
            })
          }
        />
      </Modal>

      {/* Editar */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Editar aluno"
      >
        {editing && (
          <StudentForm
            student={editing}
            isSubmitting={update.isPending}
            onSubmit={(data) => {
              update.mutate(data, {
                onSuccess: () => {
                  toast.success("Aluno atualizado");
                  setEditing(null);
                },
                onError: (e) => toast.error(apiError(e)),
              });
            }}
          />
        )}
      </Modal>

      {/* Pacotes */}
      <Modal
        open={!!packagesOf}
        onClose={() => setPackagesOf(null)}
        title={`Pacotes - ${packagesOf?.name ?? ""}`}
      >
        {packagesOf && (
          <StudentPackages
            studentId={packagesOf.id}
            studentActive={packagesOf.active}
          />
        )}
      </Modal>
    </div>
  );
}
