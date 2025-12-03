import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  Clock,
  User,
  Wrench,
  Calendar,
  AlertCircle,
  MapPin,
  Building,
  FileText,
  Loader2,
} from "lucide-react";
import { ChecklistForm } from "./ChecklistForm";
import { PhotoCapture } from "./PhotoCapture";
import { ObservationsPanel } from "./ObservationsPanel";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WorkOrderDetailProps {
  orderId: string;
  onClose: () => void;
}

interface OrdenTrabajo {
  id: string;
  fecha_programada: string;
  nombre_sitio: string;
  tramo: string;
  pk: string;
  tipo_equipo: string;
  tipo_mantenimiento: string;
  frecuencia: string;
  proveedor_codigo: string | null;
  proveedor_nombre: string | null;
  criticidad: string | null;
  ventana_horaria: string | null;
  descripcion_trabajo: string | null;
  estado: string | null;
  tecnico_asignado: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  observaciones: string | null;
}

const getPriorityBadge = (criticidad: string | null) => {
  switch (criticidad?.toLowerCase()) {
    case "crítica":
    case "critica":
    case "muy alta":
      return <Badge className="bg-destructive">Crítica</Badge>;
    case "alta":
      return <Badge className="bg-warning">Alta Prioridad</Badge>;
    case "media":
      return <Badge className="bg-primary">Media</Badge>;
    default:
      return <Badge className="bg-muted">Baja</Badge>;
  }
};

export function WorkOrderDetail({ orderId, onClose }: WorkOrderDetailProps) {
  const [orden, setOrden] = useState<OrdenTrabajo | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"pending" | "in_progress" | "paused" | "completed">("pending");
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");

  // Cargar la orden desde Supabase
  useEffect(() => {
    const fetchOrden = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("ordenes_trabajo")
          .select("*")
          .eq("id", orderId)
          .maybeSingle();

        if (error) {
          console.error("Error al cargar orden:", error);
          toast.error("Error al cargar los detalles de la orden");
        } else if (data) {
          setOrden(data);
          // Mapear estado
          const estadoLower = data.estado?.toLowerCase() || "";
          if (estadoLower.includes("ejecución") || estadoLower.includes("progreso")) {
            setStatus("in_progress");
          } else if (estadoLower.includes("completada") || estadoLower.includes("cerrada")) {
            setStatus("completed");
          } else if (estadoLower.includes("pausada")) {
            setStatus("paused");
          } else {
            setStatus("pending");
          }
        }
      } catch (err) {
        console.error("Error:", err);
        toast.error("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    fetchOrden();
  }, [orderId]);

  const handleStartPause = async () => {
    if (!orden) return;

    const newStatus = status === "in_progress" ? "Pausada" : "En ejecución";
    
    try {
      const { error } = await supabase
        .from("ordenes_trabajo")
        .update({ 
          estado: newStatus,
          ...(newStatus === "En ejecución" && !orden.fecha_inicio 
            ? { fecha_inicio: new Date().toISOString() } 
            : {})
        })
        .eq("id", orderId);

      if (error) {
        toast.error("Error al actualizar la orden");
        return;
      }

      if (status === "in_progress") {
        setStatus("paused");
        toast.info("Orden de trabajo pausada");
      } else {
        setStatus("in_progress");
        toast.success("Orden de trabajo reanudada");
      }
    } catch (err) {
      toast.error("Error al actualizar la orden");
    }
  };

  const handleComplete = () => {
    setShowCompleteDialog(true);
  };

  const confirmComplete = async () => {
    if (!orden) return;

    try {
      const { error } = await supabase
        .from("ordenes_trabajo")
        .update({ 
          estado: "Completada",
          fecha_fin: new Date().toISOString(),
          observaciones: completionNotes 
            ? `${orden.observaciones || ""}\n--- Notas de cierre ---\n${completionNotes}`.trim()
            : orden.observaciones
        })
        .eq("id", orderId);

      if (error) {
        toast.error("Error al completar la orden");
        return;
      }

      setStatus("completed");
      setShowCompleteDialog(false);
      toast.success("Orden de trabajo completada exitosamente", {
        description: "Se ha actualizado el estado en el sistema",
      });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      toast.error("Error al completar la orden");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando detalles de la orden...</p>
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg font-medium">Orden no encontrada</p>
        <p className="text-sm text-muted-foreground">La orden de trabajo solicitada no existe</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-notion border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">OT-{orden.id.slice(0, 8).toUpperCase()}</CardTitle>
              <p className="text-muted-foreground">{orden.tipo_mantenimiento} - {orden.nombre_sitio}</p>
            </div>
            {getPriorityBadge(orden.criticidad)}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Tipo de Equipo</p>
                  <p className="font-medium">{orden.tipo_equipo}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Tramo / PK</p>
                  <p className="font-medium">{orden.tramo} / {orden.pk}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Técnico Asignado</p>
                  <p className="font-medium">{orden.tecnico_asignado || "Sin asignar"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Proveedor</p>
                  <p className="font-medium">{orden.proveedor_nombre || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Fecha Programada</p>
                  <p className="font-medium">{orden.fecha_programada}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Ventana Horaria</p>
                  <p className="font-medium">{orden.ventana_horaria || "No especificada"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Frecuencia</p>
                  <p className="font-medium">{orden.frecuencia}</p>
                </div>
              </div>

              {orden.fecha_inicio && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Inicio Real</p>
                    <p className="font-medium text-primary">
                      {new Date(orden.fecha_inicio).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Descripción del Trabajo</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {orden.descripcion_trabajo || "Sin descripción"}
            </p>
          </div>

          {orden.observaciones && (
            <div>
              <h4 className="text-sm font-medium mb-2">Observaciones</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {orden.observaciones}
              </p>
            </div>
          )}

          {status !== "completed" && (
            <div className="flex gap-2">
              <Button
                onClick={handleStartPause}
                variant={status === "in_progress" ? "outline" : "default"}
                className="flex-1"
              >
                {status === "in_progress" ? (
                  <>
                    <PauseCircle className="mr-2 h-4 w-4" />
                    Pausar Orden
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {status === "paused" ? "Reanudar Orden" : "Iniciar Orden"}
                  </>
                )}
              </Button>

              <Button
                onClick={handleComplete}
                className="flex-1"
                disabled={status === "pending"}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Completar Orden
              </Button>
            </div>
          )}

          {status === "completed" && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Orden Completada</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ChecklistForm orderId={orderId} />
          <PhotoCapture />
        </div>

        <div>
          <ObservationsPanel />
        </div>
      </div>

      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Completar Orden de Trabajo</DialogTitle>
            <DialogDescription>
              Está a punto de marcar esta orden como completada. Agregue notas finales si es necesario.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Verificar antes de completar:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Todas las tareas requeridas están completadas</li>
                    <li>Las fotos del trabajo están registradas</li>
                    <li>Las observaciones importantes están documentadas</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="completion-notes">Notas de Cierre</Label>
              <Textarea
                id="completion-notes"
                placeholder="Resumen del trabajo realizado, hallazgos importantes, recomendaciones..."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmComplete}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirmar Completación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
