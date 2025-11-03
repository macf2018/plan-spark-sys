import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Observation {
  id: string;
  type: "info" | "warning" | "success";
  text: string;
  timestamp: string;
  author: string;
}

export function ObservationsPanel() {
  const [observations, setObservations] = useState<Observation[]>([
    {
      id: "1",
      type: "warning",
      text: "Se detectó calentamiento en el cable de fase R, se recomienda revisión adicional",
      timestamp: new Date(Date.now() - 3600000).toLocaleString(),
      author: "Carlos Rodríguez",
    },
    {
      id: "2",
      type: "success",
      text: "Mediciones de aislamiento dentro de parámetros normales",
      timestamp: new Date(Date.now() - 1800000).toLocaleString(),
      author: "Carlos Rodríguez",
    },
  ]);
  const [newObservation, setNewObservation] = useState("");
  const [observationType, setObservationType] = useState<"info" | "warning" | "success">("info");

  const addObservation = () => {
    if (!newObservation.trim()) {
      toast.error("Ingrese una observación");
      return;
    }

    const observation: Observation = {
      id: Date.now().toString(),
      type: observationType,
      text: newObservation,
      timestamp: new Date().toLocaleString(),
      author: "Carlos Rodríguez", // En producción vendría del usuario autenticado
    };

    setObservations([observation, ...observations]);
    setNewObservation("");
    toast.success("Observación registrada");
  };

  const typeConfig = {
    info: {
      icon: Info,
      color: "bg-primary/10 text-primary border-primary/20",
      badge: "bg-primary",
      label: "Información",
    },
    warning: {
      icon: AlertTriangle,
      color: "bg-warning/10 text-warning-foreground border-warning/20",
      badge: "bg-warning",
      label: "Advertencia",
    },
    success: {
      icon: CheckCircle2,
      color: "bg-success/10 text-success-foreground border-success/20",
      badge: "bg-success",
      label: "Éxito",
    },
  };

  return (
    <Card className="shadow-notion">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Observaciones y Notas
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant={observationType === "info" ? "default" : "outline"}
              size="sm"
              onClick={() => setObservationType("info")}
            >
              <Info className="mr-2 h-4 w-4" />
              Info
            </Button>
            <Button
              variant={observationType === "warning" ? "default" : "outline"}
              size="sm"
              onClick={() => setObservationType("warning")}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Alerta
            </Button>
            <Button
              variant={observationType === "success" ? "default" : "outline"}
              size="sm"
              onClick={() => setObservationType("success")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Éxito
            </Button>
          </div>

          <Textarea
            placeholder="Describe hallazgos, problemas detectados o información relevante..."
            value={newObservation}
            onChange={(e) => setNewObservation(e.target.value)}
            rows={3}
          />

          <Button onClick={addObservation} className="w-full">
            Agregar Observación
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">
            Historial ({observations.length})
          </h4>

          {observations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No hay observaciones registradas
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {observations.map((obs) => {
                const config = typeConfig[obs.type];
                const Icon = config.icon;

                return (
                  <div
                    key={obs.id}
                    className={`p-4 border rounded-lg space-y-2 ${config.color}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <Badge className={config.badge}>
                          {config.label}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {obs.timestamp}
                      </span>
                    </div>
                    <p className="text-sm">{obs.text}</p>
                    <p className="text-xs text-muted-foreground">
                      Por: {obs.author}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
