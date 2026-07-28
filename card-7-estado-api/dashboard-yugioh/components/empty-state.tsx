import { SearchX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="rounded-full bg-muted p-3 text-muted-foreground">
          <SearchX className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="font-medium">Nenhuma carta encontrada</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajuste o ID pesquisado ou selecione outro status.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
