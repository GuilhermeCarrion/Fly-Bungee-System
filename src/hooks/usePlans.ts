"use client";

import { apiPrivate } from "@/lib/axios";
import { Plan } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const KEY = ["plans"];

export function usePlans(onlyActive = false) {
  return useQuery({
    queryKey: [...KEY, { onlyActive }],
    queryFn: async () =>
      (
        await apiPrivate.get<Plan[]>(
          `/plans${onlyActive ? "?active=true" : ""}`,
        )
      ).data,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => apiPrivate.post("/plans", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdatePlan(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => apiPrivate.patch(`/plans/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeactivatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiPrivate.delete(`/plans/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
