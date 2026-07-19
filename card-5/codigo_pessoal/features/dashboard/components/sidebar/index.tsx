"use client";

import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { logoutItem, navItems } from "@/features/dashboard/data";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const { signOut } = useAuthStore();
  const router = useRouter();
  const LogoutIcon = logoutItem.icon;

  function handleSignOut() {
    signOut();
    router.push("/auth/login");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider delayDuration={0}>
        <nav
          aria-label="Navegacao principal"
          className="flex h-full flex-col items-center gap-3 px-2 py-4"
        >
          <Link
            href="/"
            className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            aria-label="Lamia Analytics"
          >
            <BarChart3 className="h-4 w-4" />
          </Link>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Button asChild size="icon" variant="ghost">
                    <Link href={item.href} aria-label={item.label}>
                      <Icon className="h-5 w-5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="mt-auto" size="icon" variant="ghost" onClick={handleSignOut} aria-label={logoutItem.label}>
                  <LogoutIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{logoutItem.label}</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
