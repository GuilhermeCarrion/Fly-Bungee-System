"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type MeResponse =
  | { user: null }
  | { user: { id: number; name?: string; email: string; role?: string } };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<MeResponse["user"]>(null);

  useEffect(() => {
    async function run() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { authorization: `Bearer ${token}` },
        });

        const data = (await res
          .json()
          .catch(() => ({ user: null }))) as MeResponse;

        if (!data.user) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/login");
          return;
        }

        setUser(data.user);
      } catch {
        // Falha de rede: comportamento simples no MVP
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [router, pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-3 w-64 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-brand-cyan-500" />
            <div className="font-semibold">
              <span className="text-brand-orange-500">Fly</span>{" "}
              <span className="text-slate-900">bungee</span>
            </div>

            <span className="ml-3 hidden rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 md:inline">
              {user?.email}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user?.role && (
              <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 md:inline">
                {user.role}
              </span>
            )}

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
