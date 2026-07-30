"use client";

import { apiPrivate } from "@/lib/axios";
import { ClassSession } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const KEY = ["class-sessions"];

export function useClassSessions(range?: { from?: string; to?: string }) {
  const params = new URLSearchParams();
  if (range?.from) params.set("from", range.from);
  if (range?.to) params.set("to", range.to);

  const qs = params.toString();

  return useQuery({
    queryKey: [...KEY, range],
    queryFn: async () =>
      (
        await apiPrivate.get<ClassSession[]>(
          `/class-sessions${qs ? `?${qs}` : ""}`,
        )
      ).data,
  });
}

export function useCreateClassSession() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => apiPrivate.post("/class-sessions", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
