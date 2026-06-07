interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: "cyan" | "amber";
}

export function StatCard({ title, value, color }: StatCardProps) {
  const accentColor = color === "cyan" ? "text-cyan-500" : "text-amber-500";

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-slate-50 ${accentColor}`}>
        {/* Ícone aqui */}
      </div>
    </div>
  );
}
