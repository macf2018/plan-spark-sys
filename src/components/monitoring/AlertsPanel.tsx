import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bell, Clock, Zap } from "lucide-react";
import { useEffect } from "react";

interface AlertsPanelProps {
  onAlertsChange?: (count: number) => void;
}

export function AlertsPanel({ onAlertsChange }: AlertsPanelProps) {
  const alerts = [
    {
      id: "ALR-2024-008",
      type: "critical_delay",
      priority: "critical",
      title: "Retraso Crítico: OT-2024-003",
      description: "Motor Principal #3 - Excede 30% tiempo estimado. Personal adicional requerido urgente.",
      orderId: "OT-2024-003",
      triggerTime: "2024-01-15 14:00",
      elapsed: "6.8h / 5.0h",
    },
    {
      id: "ALR-2024-007",
      type: "critical_delay",
      priority: "critical",
      title: "Suspensión por Seguridad: OT-2024-005",
      description: "Trabajo detenido por falla en equipo de seguridad. Requiere atención inmediata.",
      orderId: "OT-2024-005",
      triggerTime: "2024-01-14 16:45",
      elapsed: "Suspendido",
    },
    {
      id: "ALR-2024-006",
      type: "resource",
      priority: "high",
      title: "Material Faltante: OT-2024-002",
      description: "Panel Eléctrico B - Material crítico no disponible. Compra urgente necesaria.",
      orderId: "OT-2024-002",
      triggerTime: "2024-01-15 10:15",
      elapsed: "En espera",
    },
    {
      id: "ALR-2024-005",
      type: "quality",
      priority: "medium",
      title: "Revisión Requerida: OT-2024-001",
      description: "Transformador #1 - Mediciones fuera de rango normal. Supervisión necesaria.",
      orderId: "OT-2024-001",
      triggerTime: "2024-01-14 11:30",
      elapsed: "Pendiente revisión",
    },
  ];

  const criticalAlerts = alerts.filter((a) => a.priority === "critical");

  useEffect(() => {
    onAlertsChange?.(criticalAlerts.length);
  }, [criticalAlerts.length, onAlertsChange]);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return (
          <Badge className="bg-destructive flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Crítica
          </Badge>
        );
      case "high":
        return <Badge className="bg-warning">Alta</Badge>;
      case "medium":
        return <Badge className="bg-primary">Media</Badge>;
      default:
        return <Badge>Baja</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "critical_delay":
        return <Clock className="h-5 w-5 text-destructive" />;
      case "resource":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "quality":
        return <Bell className="h-5 w-5 text-primary" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <Card className="shadow-notion">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas Automáticas de Retrasos Críticos
          </CardTitle>
          <Badge variant="outline" className="border-destructive text-destructive">
            {criticalAlerts.length} Críticas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-lg p-4 space-y-3 transition-all ${
              alert.priority === "critical"
                ? "border-destructive bg-destructive/5 animate-pulse"
                : "border-border hover:shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">{getTypeIcon(alert.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-medium">{alert.id}</h4>
                    {getPriorityBadge(alert.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Orden: {alert.orderId}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={
                alert.priority === "critical"
                  ? "bg-background/50 rounded p-3 border border-destructive/20"
                  : ""
              }
            >
              <h5 className="font-medium mb-1">{alert.title}</h5>
              <p className="text-sm text-muted-foreground">{alert.description}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>Activada: {alert.triggerTime}</span>
              <span className="font-medium">{alert.elapsed}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant={alert.priority === "critical" ? "default" : "outline"}
              >
                Atender Ahora
              </Button>
              <Button size="sm" variant="outline">
                Ver Detalles
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
