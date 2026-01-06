import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertTriangle, Info, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Observation {
  id: string;
  type: "info" | "warning" | "success";
  text: string;
  timestamp: string;
  author: string;
}

interface ObservationsPanelProps {
  orderId: string;
}

export function ObservationsPanel({ orderId }: ObservationsPanelProps) {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [newObservation, setNewObservation] = useState("");
  const [observationType, setObservationType] = useState<"info" | "warning" | "success">("info");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load observations from DB
  const loadObservations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("ordenes_trabajo_observaciones")
        .select("*")
        .eq("orden_id", orderId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setObservations(
          data.map((row) => ({
            id: row.id,
            type: row.type as "info" | "warning" | "success",
            text: row.text,
            timestamp: new Date(row.created_at).toLocaleString(),
            author: row.author,
          }))
        );
      }
    } catch (err) {
      console.error("Error loading observations:", err);
      toast.error("Error al cargar observaciones");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadObservations();
  }, [loadObservations]);

  const addObservation = async () => {
    if (!newObservation.trim()) {
      toast.error("Ingrese una observación");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("ordenes_trabajo_observaciones")
        .insert({
          orden_id: orderId,
          type: observationType,
          text: newObservation.trim(),
          author: "Usuario Actual", // In production, get from auth context
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newObs: Observation = {
          id: data.id,
          type: data.type as "info" | "warning" | "success",
          text: data.text,
          timestamp: new Date(data.created_at).toLocaleString(),
          author: data.author,
        };
        setObservations([newObs, ...observations]);
        setNewObservation("");
        toast.success("Observación registrada");
      }
    } catch (err) {
      console.error("Error adding observation:", err);
      toast.error("Error al guardar observación");
    } finally {
      setSaving(false);
    }
  };

  const deleteObservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from("ordenes_trabajo_observaciones")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setObservations(observations.filter((obs) => obs.id !== id));
      toast.success("Observación eliminada");
    } catch (err) {
      console.error("Error deleting observation:", err);
      toast.error("Error al eliminar observación");
    }
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

  if (loading) {
    return (
      <Card className="shadow-notion">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Cargando observaciones...</span>
        </CardContent>
      </Card>
    );
  }

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
              disabled={saving}
            >
              <Info className="mr-2 h-4 w-4" />
              Info
            </Button>
            <Button
              variant={observationType === "warning" ? "default" : "outline"}
              size="sm"
              onClick={() => setObservationType("warning")}
              disabled={saving}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Alerta
            </Button>
            <Button
              variant={observationType === "success" ? "default" : "outline"}
              size="sm"
              onClick={() => setObservationType("success")}
              disabled={saving}
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
            disabled={saving}
          />

          <Button onClick={addObservation} className="w-full" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Agregar Observación"
            )}
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
                        <Badge className={config.badge}>{config.label}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {obs.timestamp}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteObservation(obs.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
