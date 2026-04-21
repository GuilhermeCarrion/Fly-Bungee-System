import { LoginForm } from "@/components/forms/LoginForm";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-amber-400 to-emerald-400 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
        {/* Lado esquerdo: Branding */}
        <div className="lg:w-1/2 flex flex-col justify-center text-black space-y-6">
          <div>
            <h1 className="text-5xl font-serif font-bold">Moven</h1>
            <p className="text-lg font-sans uppercase tracking-wide">
              KINETIC ELEVATION
            </p>
          </div>
          <p className="text-xl leading-relaxed">
            Desafiando a gravidade e redefinindo performance. Acesse seu portal
            de gestão de estúdio para orquestrar o momentum do seu negócio.
          </p>
          {/* Ícone circular: use SVG ou img */}
          <div className="w-32 h-32 mx-auto bg-blue-200 rounded-full flex items-center justify-center">
            {/* Silhueta SVG aqui */}
            <span>Ícone dinâmico</span>
          </div>
          <div className="text-sm uppercase font-bold">
            STATUS: READY FOR LAUNCH
          </div>
          <p className="italic font-serif text-lg">
            &quot;O pico é apenas o começo da queda.&quot;
          </p>
        </div>
        {/* Lado direito: Form */}
        <div className="lg:w-1/2 flex items-center justify-center">
          <Card className="w-full max-w-md shadow-2xl">
            <CardContent className="p-8 space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-serif font-bold text-gray-800">
                  Bem-vindo
                </h2>
                <p className="text-gray-600">
                  Acesse sua conta para continuar a jornada.
                </p>
              </div>
              <LoginForm />
              {/* Adicione Google/Apple, links depois */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
