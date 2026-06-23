import type { ReactNode } from "react";
import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-muted/40">
      <MobileHeader />
      <Sidebar />
      <main className="px-4 py-6 sm:pl-20 sm:pr-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
