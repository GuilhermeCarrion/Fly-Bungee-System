export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Visão geral do sistema (MVP).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-medium text-slate-600">Alunos</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">—</div>
          <div className="mt-3 text-xs text-slate-500">
            Em breve: total, novos na semana.
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-medium text-slate-600">Aulas</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">—</div>
          <div className="mt-3 text-xs text-slate-500">
            Em breve: próximas aulas.
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-medium text-slate-600">Agendamentos</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">—</div>
          <div className="mt-3 text-xs text-slate-500">
            Em breve: hoje / semana.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Atalhos</h2>
            <p className="mt-1 text-sm text-slate-600">
              Comece pelo CRUD de Alunos.
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href="/alunos"
              className="rounded-xl bg-brand-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-cyan-600"
            >
              Ir para Alunos
            </a>
            <a
              href="/usuarios"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Usuários
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
