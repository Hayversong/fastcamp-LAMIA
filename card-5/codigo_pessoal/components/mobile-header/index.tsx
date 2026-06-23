import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutItem, navItems } from "@/components/dashboard-data";

export function MobileHeader() {
  const LogoutIcon = logoutItem.icon;

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
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>
          <a
            href={logoutItem.href}
            className="mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LogoutIcon className="h-4 w-4" />
            {logoutItem.label}
          </a>
        </SheetContent>
      </Sheet>
      <strong className="text-sm font-semibold tracking-tight">
        Lamia Analytics
      </strong>
    </header>
  );
}
