import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, CheckCircle2, AlertTriangle, Target, Wrench } from "lucide-react";

interface ConsolidatedKPIsProps {
  period: string;
  filters: any;
}

export function ConsolidatedKPIs({ period, filters }: ConsolidatedKPIsProps) {
  const kpis = [
    {
      title: "Eficiencia Global",
      value: "89.2%",
      change: "+3.5%",
      positive: true,
      icon: Target,
    },
    {
      title: "Cumplimiento",
      value: "94.8%",
      change: "+2.1%",
      positive: true,
      icon: CheckCircle2,
    },
    {
      title: "MTTR Promedio",
      value: "3.2h",
      change: "-0.6h",
      positive: true,
      icon: Clock,
    },
    {
      title: "MTBF",
      value: "745h",
      change: "+52h",
      positive: true,
      icon: TrendingUp,
    },
    {
      title: "Desviaciones",
      value: "12",
      change: "+4",
      positive: false,
      icon: AlertTriangle,
    },
    {
      title: "Productividad",
      value: "87.5%",
      change: "+5.8%",
      positive: true,
      icon: Wrench,
    },
  ];

  const periodLabel = {
    daily: "Hoy",
    weekly: "Esta Semana",
    monthly: "Este Mes",
  }[period];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">KPIs Consolidados - {periodLabel}</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="shadow-notion">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.positive ? 'text-success' : 'text-destructive'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs mt-1 ${kpi.positive ? 'text-success' : 'text-destructive'}`}>
                {kpi.change} vs período anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
