import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export function PlanningStats() {
  const stats = [
    {
      title: "Planes Activos",
      value: "24",
      icon: Calendar,
      trend: "+3 este mes",
      color: "text-primary",
    },
    {
      title: "Pendientes de Aprobar",
      value: "5",
      icon: Clock,
      trend: "Requieren atención",
      color: "text-warning",
    },
    {
      title: "Completados",
      value: "156",
      icon: CheckCircle2,
      trend: "+12 esta semana",
      color: "text-success",
    },
    {
      title: "Conflictos",
      value: "2",
      icon: AlertTriangle,
      trend: "Resolver urgente",
      color: "text-destructive",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-notion">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
