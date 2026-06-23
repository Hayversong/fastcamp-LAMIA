import { recentSales } from "@/components/dashboard-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SalesFeed() {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Vendas recentes</CardTitle>
        <CardDescription>Voce recebeu 265 vendas este mes.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {recentSales.map((sale) => (
          <article key={sale.email} className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={sale.avatarUrl} alt={sale.name} />
              <AvatarFallback>{sale.fallback}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium leading-none">
                {sale.name}
              </h3>
              <p className="truncate text-sm text-muted-foreground">
                {sale.email}
              </p>
            </div>
            <p className="ml-auto text-sm font-medium">{sale.amount}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
