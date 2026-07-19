"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutItem, navItems } from "@/features/dashboard/data";

export function MobileHeader() {
  const { signOut } = useAuthStore();
  const router = useRouter();
  const LogoutIcon = logoutItem.icon;

  function handleSignOut() {
    signOut();
    router.push("/auth/login");
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-4 sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button aria-label="Abrir menu" size="icon" variant="outline">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu de navegacao</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Lamia Analytics</SheetTitle>
          </SheetHeader>
          <nav aria-label="Navegacao mobile" className="mt-6 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LogoutIcon className="h-4 w-4" />
            {logoutItem.label}
          </button>
        </SheetContent>
      </Sheet>
      <strong className="text-sm font-semibold tracking-tight">
        Lamia Analytics
      </strong>
    </header>
  );
}
