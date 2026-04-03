"use client";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { loginSchema } from "@/schemas/login-schema";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function useLogin() {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const validated = loginSchema.parse({ email, password });
      const response = await api.post("/auth/login", validated);
      return response.data;
    },
    onSuccess: (data) => {
      // Assume que o back retorna token no body
      setToken(data.token);
      toast({ title: "Login realizado com sucesso!" });
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: error.response?.data?.error || "Erro no login",
      });
    },
  });
}
