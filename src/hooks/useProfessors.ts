import { apiPrivate } from "@/lib/axios";
import { Professor } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const KEY = ["professors"];

export function useProfessors() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () =>
      (await apiPrivate.get<Professor[]>("/professors")).data,
  });
}

export function useCreateProfessor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => apiPrivate.post("/professors", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateProfessor(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => apiPrivate.patch(`/professors/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteProfessor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiPrivate.delete(`/professors/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
