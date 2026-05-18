"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut, loading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        <div
          className={`fixed lg:static z-40 h-full transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            onToggle={() => {
              if (window.innerWidth < 1024) {
                setIsMobileOpen(!isMobileOpen);
              } else {
                setIsCollapsed(!isCollapsed);
              }
            }}
            onLogout={signOut}
            user={user}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden mb-4 p-2 rounded-lg hover:bg-gray-100"
          >
            <span className="text-2xl">|||</span>
          </button>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
