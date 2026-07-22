import { apiPrivate } from "@/lib/axios";
import { StudentPackage } from "@/types/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useStudentPackages(studentId?: string) {
  return useQuery({
    queryKey: ["student-packages", studentId],
    enabled: !!studentId,
    queryFn: async () =>
      (
        await apiPrivate.get<StudentPackage[]>(
          `/student-packages?studentId=${studentId}`,
        )
      ).data,
  });
}

export function useAssignPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { studentId: string; planId: string }) =>
      apiPrivate.post("/student-packages", data),
    onSuccess: (_res, vars) =>
      qc.invalidateQueries({ queryKey: ["student-packages", vars.studentId] }),
  });
}

export function useCancelPackage(studentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiPrivate.delete(`/student-packages/${id}`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["student-packages", studentId] }),
  });
}
