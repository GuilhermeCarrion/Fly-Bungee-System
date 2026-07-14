import { AxiosError } from "axios";

// Extrai a mensagem {error} que o handleError do backend padroniza
export function apiError(
  e: unknown,
  fallback = "Algo deu errado. Tente novamente",
): string {
  if (e instanceof AxiosError) {
    return (e.response?.data as { error?: string })?.error ?? fallback;
  }
  return fallback;
}
