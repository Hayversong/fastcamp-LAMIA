"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { useAuthStore } from "@/features/auth/store/auth-store";

export default function LoginPage() {
  const { hydrated, userEmail, hydrateSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (hydrated && userEmail) {
      router.replace("/");
    }
  }, [hydrated, router, userEmail]);

  if (!hydrated || userEmail) {
    return <main className="min-h-screen bg-muted/40" aria-label="Carregando" />;
  }

  return <LoginForm />;
}
