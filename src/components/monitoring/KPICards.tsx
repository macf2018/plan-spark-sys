import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, CheckCircle2, AlertTriangle, Activity } from "lucide-react";

export function KPICards() {
  const kpis = [
    {
      title: "Eficiencia Operativa",
      value: "87.5%",
      trend: "+5.2%",
      trendUp: true,
      icon: Activity,
      color: "text-success",
    },
    {
      title: "Órdenes Completadas",
      value: "156",
      trend: "+12 esta semana",
      trendUp: true,
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      title: "Tiempo Promedio Ejecución",
      value: "4.2h",
      trend: "-0.8h vs estimado",
      trendUp: true,
      icon: Clock,
      color: "text-primary",
    },
    {
      title: "Desviaciones Críticas",
      value: "8",
      trend: "+3 último mes",
      trendUp: false,
      icon: AlertTriangle,
      color: "text-destructive",
    },
    {
      title: "MTTR (Tiempo Medio)",
      value: "3.1h",
      trend: "-0.5h vs meta",
      trendUp: true,
      icon: Clock,
      color: "text-success",
    },
    {
      title: "MTBF (Disponibilidad)",
      value: "720h",
      trend: "+45h vs anterior",
      trendUp: true,
      icon: TrendingUp,
      color: "text-success",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="shadow-notion">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="flex items-center gap-1 mt-1">
              {kpi.trendUp ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <p className={`text-xs ${kpi.trendUp ? 'text-success' : 'text-destructive'}`}>
                {kpi.trend}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
