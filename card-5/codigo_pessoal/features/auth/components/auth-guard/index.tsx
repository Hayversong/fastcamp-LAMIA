"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth-store";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { hydrated, userEmail, hydrateSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (hydrated && !userEmail) {
      router.replace("/auth/login");
    }
  }, [hydrated, router, userEmail]);

  if (!hydrated) {
    return <main className="min-h-screen bg-muted/40" aria-label="Carregando" />;
  }

  if (!userEmail) {
    return <main className="min-h-screen bg-muted/40" aria-label="Redirecionando para o login" />;
  }

  return children;
}
