import { metrics } from "@/components/dashboard-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MetricsGrid() {
  return (
    <section
      aria-label="Metricas principais"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold tracking-tight sm:text-2xl">
                {metric.value}
              </p>
              <CardDescription>{metric.description}</CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
