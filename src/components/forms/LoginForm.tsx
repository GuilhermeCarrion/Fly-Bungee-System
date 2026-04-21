// components/forms/LoginForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/schemas/login-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
      {/* Campo Email */}
      <div className="space-y-3">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="pl-10 h-11 border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            {...register("email")}
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Campo Senha */}
      <div className="space-y-3">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Senha
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 h-11 border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            {...register("password")}
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Checkbox Lembrar */}
      <div className="flex items-center space-x-3 pt-2">
        <Checkbox id="remember" className="border-gray-300 rounded" />
        <Label
          htmlFor="remember"
          className="text-sm text-gray-600 font-normal cursor-pointer"
        >
          Lembrar-me neste dispositivo
        </Label>
      </div>

      {/* Botão Entrar */}
      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold rounded-lg transition-all duration-200 mt-6"
        disabled={isPending}
      >
        {isPending ? "Entrando..." : "Entrar"}
      </Button>

      {/* Link Recuperar Senha */}
      <div className="text-center pt-2">
        <a
          href="#"
          className="text-xs text-gray-500 hover:text-amber-600 transition-colors"
        >
          Esqueceu sua senha?
        </a>
      </div>
    </form>
  );
}
