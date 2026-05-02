// app/login/page.tsx
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="h-screen flex">
      {/* Seção Esquerda: Branding - 70% */}
      <div className="hidden lg:flex lg:w-7/10 bg-gradient-to-br from-yellow-400 via-amber-400 to-emerald-400 flex-col justify-center px-20 py-8">
        <div className="space-y-12 max-w-lg">
          <div className="space-y-4">
            <h1 className="text-7xl font-serif font-bold text-black">Moven</h1>
            <p className="text-xl font-sans uppercase tracking-widest text-black font-light">
              KINETIC ELEVATION
            </p>
          </div>

          <p className="text-lg leading-relaxed text-black font-light max-w-md">
            Desafiando a gravidade e redefinindo performance. Acesse seu portal
            de gestão de estúdio para orquestrar o momentum do seu negócio.
          </p>

          {/* Ícone dinâmico */}
          <div className="w-48 h-48 bg-blue-200 rounded-full flex items-center justify-center shadow-xl">
            <span className="text-sm text-gray-600">Ícone dinâmico</span>
          </div>

          <div className="space-y-6 pt-8 border-t-2 border-black/30">
            <p className="text-sm uppercase font-bold text-black tracking-wider">
              STATUS: READY FOR LAUNCH
            </p>
            <p className="italic font-serif text-lg text-black">
              &quot;O pico é apenas o começo da queda.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Seção Direita: Form - 30% */}
      <div className="w-full lg:w-3/10 bg-white flex flex-col items-center justify-center px-8 py-8 lg:py-0">
        <div className="w-full max-w-xs space-y-6">
          {/* Header do Form */}
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              Bem-vindo
            </h2>
            <p className="text-gray-500 text-xs leading-relaxed">
              Acesse sua conta para continuar a jornada.
            </p>
          </div>

          {/* Form Component */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
