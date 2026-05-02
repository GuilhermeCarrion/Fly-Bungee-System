import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
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
      const err = error as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error || "Erro no login");
    },
  });
}
