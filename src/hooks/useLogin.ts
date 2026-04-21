"use client";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { loginSchema } from "@/schemas/login-schema";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { LoginFormData } from "@/schemas/login-schema";
import { AxiosError } from "axios";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const validated = loginSchema.parse(data);
      const response = await api.post("/auth/login", validated);
      return response.data;
    },
    onSuccess: (data) => {
      // Assume que o back retorna token no body
      setToken(data.token);
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<[error: string]>;
      toast.error(err.response?.data?.error || "Erro no login");
    },
  });
}
