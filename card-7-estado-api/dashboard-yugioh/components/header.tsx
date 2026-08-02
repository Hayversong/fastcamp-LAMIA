"use client";

import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/features/auth/store/user-store";

export function Header() {
  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Yu-Gi-Oh! Dashboard</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Lista de proibidas e limitadas
            </p>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">Olá, {user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Avatar>
              <AvatarFallback>
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sair"
              title="Sair"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={login}>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Entrar como Haytham</span>
            <span className="sm:hidden">Entrar</span>
          </Button>
        )}
      </div>
    </header>
  );
}
