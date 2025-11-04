import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";

export function TimeComparison() {
  const comparisons = [
    {
      id: "OT-2024-001",
      equipment: "Transformador #1",
      estimatedTime: 4.0,
      realTime: 3.5,
      status: "completed",
      deviation: -12.5,
    },
    {
      id: "OT-2024-002",
      equipment: "Panel Eléctrico B",
      estimatedTime: 2.5,
      realTime: 3.2,
      status: "completed",
      deviation: +28.0,
    },
    {
      id: "OT-2024-003",
      equipment: "Motor Principal #3",
      estimatedTime: 5.0,
      realTime: 6.8,
      status: "in_progress",
      deviation: +36.0,
    },
    {
      id: "OT-2024-004",
      equipment: "Sistema UPS",
      estimatedTime: 3.0,
      realTime: 2.8,
      status: "completed",
      deviation: -6.7,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success">Completado</Badge>;
      case "in_progress":
        return <Badge className="bg-warning">En Progreso</Badge>;
      default:
        return <Badge>Pendiente</Badge>;
    }
  };

  const getDeviationColor = (deviation: number) => {
    if (deviation < 0) return "text-success";
    if (deviation > 20) return "text-destructive";
    return "text-warning";
  };

  return (
    <Card className="shadow-notion">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Comparación: Tiempo Estimado vs Tiempo Real
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {comparisons.map((item) => (
          <div
            key={item.id}
            className="border border-border rounded-lg p-4 space-y-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{item.id}</h4>
                <p className="text-sm text-muted-foreground">{item.equipment}</p>
              </div>
              {getStatusBadge(item.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Tiempo Estimado</p>
                <p className="font-medium">{item.estimatedTime}h</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tiempo Real</p>
                <p className="font-medium">{item.realTime}h</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className={`font-medium flex items-center gap-1 ${getDeviationColor(item.deviation)}`}>
                  {item.deviation > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {item.deviation > 0 ? '+' : ''}{item.deviation.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={(item.realTime / item.estimatedTime) * 100}
                className="h-2"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
