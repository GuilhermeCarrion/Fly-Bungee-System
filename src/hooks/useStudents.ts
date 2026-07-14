"use client";

import { apiPrivate } from "@/lib/axios";
import { Student } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const KEY = ["students"];

export function useStudents() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => (await apiPrivate.get<Student[]>("/students")).data,
  });
}

export function useStudent(id?: string) {
  return useQuery({
    queryKey: ["students", id],
    queryFn: async () =>
      (await apiPrivate.get<Student>(`/students/${id}`)).data,
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => apiPrivate.post("/students", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateStudent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => apiPrivate.patch(`/students/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["students", id] });
    },
  });
}

export function useInactivateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiPrivate.delete(`/students/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
