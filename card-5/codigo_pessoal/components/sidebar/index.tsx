import { BarChart3 } from "lucide-react";
import { logoutItem, navItems } from "@/components/dashboard-data";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const LogoutIcon = logoutItem.icon;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider delayDuration={0}>
        <nav
          aria-label="Navegacao principal"
          className="flex h-full flex-col items-center gap-3 px-2 py-4"
        >
          <a
            href="/"
            className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            aria-label="Lamia Analytics"
          >
            <BarChart3 className="h-4 w-4" />
          </a>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Button asChild size="icon" variant="ghost">
                    <a href={item.href} aria-label={item.label}>
                      <Icon className="h-5 w-5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild className="mt-auto" size="icon" variant="ghost">
                <a href={logoutItem.href} aria-label={logoutItem.label}>
                  <LogoutIcon className="h-5 w-5" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{logoutItem.label}</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
