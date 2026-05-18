"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  ChevronLeft,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  user: any;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Alunos", href: "/dashboard/alunos", icon: Users },
  { label: "Planos", href: "/dashboard/planos", icon: ClipboardList },
  { label: "Agendamentos", href: "/dashboard/agendamentos", icon: Calendar },
  { label: "Mensagens", href: "/dashboard/mensagens", icon: MessageSquare },
];

export function Sidebar({
  isCollapsed,
  onToggle,
  onLogout,
  user,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-600 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Logo + botão toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!isCollapsed && (
          <span className="font-bold text-lg text-gray-900">
            {user?.academy?.name || "Academia"}
          </span>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft
            className={`h-5 w-5 text-gray-500 transition-transform duration-600 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Itens de navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${active ? "bg-amber-50 text-amber-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Botão Logout */}
      <div className="px-3 pb-4 border-t border-gray-200 pt-2">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
          title={isCollapsed ? "Sair" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Sair</span>}
        </button>
      </div>
    </aside>
  );
}
