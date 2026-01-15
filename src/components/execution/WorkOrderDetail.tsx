import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Save,
} from "lucide-react";
import { ChecklistForm } from "./ChecklistForm";
import { PhotoCapture } from "./PhotoCapture";
import { ObservationsPanel } from "./ObservationsPanel";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ORDER_STATES } from "@/lib/orderStatus";

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
  if (!criticidad) {
    return <Badge className="bg-muted">–</Badge>;
  }
  switch (criticidad.toLowerCase()) {
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

// Función para registrar cambios en el historial
const logChange = async (
  ordenId: string,
  accion: string,
  estadoAnterior: string | null,
  estadoNuevo: string | null,
  descripcion: string,
  camposModificados?: Record<string, any>
) => {
  const { error } = await supabase
    .from("ordenes_trabajo_historial")
    .insert({
      orden_id: ordenId,
      accion,
      estado_anterior: estadoAnterior,
      estado_nuevo: estadoNuevo,
      descripcion,
      campos_modificados: camposModificados || null,
      usuario: "sistema"
    });
  
  if (error) {
    console.error("Error logging change:", error);
    throw error;
  }
};

export function WorkOrderDetail({ orderId, onClose }: WorkOrderDetailProps) {
  const [orden, setOrden] = useState<OrdenTrabajo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"pending" | "in_progress" | "paused" | "completed">("pending");
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  
  // Campos editables
  const [editTecnico, setEditTecnico] = useState("");
  const [editObservaciones, setEditObservaciones] = useState("");
  const [editEstado, setEditEstado] = useState("");

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
          setEditTecnico(data.tecnico_asignado || "");
          setEditObservaciones(data.observaciones || "");
          setEditEstado(data.estado || ORDER_STATES.PLANIFICADA);
          
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

  const handleSaveChanges = async () => {
    if (!orden) return;
    
    setSaving(true);
    try {
      const updates: Record<string, any> = {};
      const cambios: Record<string, { anterior: any; nuevo: any }> = {};

      // Verificar qué campos cambiaron
      if (editTecnico !== (orden.tecnico_asignado || "")) {
        updates.tecnico_asignado = editTecnico || null;
        cambios.tecnico_asignado = { anterior: orden.tecnico_asignado, nuevo: editTecnico };
      }
      if (editObservaciones !== (orden.observaciones || "")) {
        updates.observaciones = editObservaciones || null;
        cambios.observaciones = { anterior: orden.observaciones, nuevo: editObservaciones };
      }
      if (editEstado !== orden.estado) {
        updates.estado = editEstado;
        cambios.estado = { anterior: orden.estado, nuevo: editEstado };
        
        // Si cambia a "En ejecución" y no tiene fecha_inicio
        if (editEstado === ORDER_STATES.EN_EJECUCION && !orden.fecha_inicio) {
          updates.fecha_inicio = new Date().toISOString();
        }
        // Si cambia a "Completada"
        if (editEstado === ORDER_STATES.COMPLETADA && !orden.fecha_fin) {
          updates.fecha_fin = new Date().toISOString();
        }
      }

      if (Object.keys(updates).length === 0) {
        toast.info("No hay cambios para guardar");
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from("ordenes_trabajo")
        .update(updates)
        .eq("id", orderId);

      if (error) {
        toast.error("Error al guardar los cambios");
        console.error(error);
        return;
      }

      // Registrar en historial
      await logChange(
        orderId,
        "MODIFICACIÓN",
        orden.estado,
        updates.estado || orden.estado,
        `Campos modificados: ${Object.keys(cambios).join(", ")}`,
        cambios
      );

      // Recargar desde la base de datos para confirmar persistencia
      const { data: updatedOrden, error: fetchError } = await supabase
        .from("ordenes_trabajo")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

      if (fetchError || !updatedOrden) {
        console.error("Error al recargar orden:", fetchError);
        toast.warning("Cambios guardados pero no se pudo recargar");
        setOrden({ ...orden, ...updates });
      } else {
        setOrden(updatedOrden);
        setEditTecnico(updatedOrden.tecnico_asignado || "");
        setEditObservaciones(updatedOrden.observaciones || "");
        setEditEstado(updatedOrden.estado || ORDER_STATES.PLANIFICADA);
        
        // Actualizar status visual
        const estadoLower = updatedOrden.estado?.toLowerCase() || "";
        if (estadoLower.includes("ejecución")) setStatus("in_progress");
        else if (estadoLower.includes("completada") || estadoLower.includes("cerrada")) setStatus("completed");
        else if (estadoLower.includes("pausada")) setStatus("paused");
        else setStatus("pending");
      }

      toast.success("Cambios guardados correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleStartPause = async () => {
    if (!orden) return;

    const newStatus = status === "in_progress" ? ORDER_STATES.PAUSADA : ORDER_STATES.EN_EJECUCION;
    
    try {
      const updateData: Record<string, any> = { estado: newStatus };
      
      if (newStatus === ORDER_STATES.EN_EJECUCION && !orden.fecha_inicio) {
        updateData.fecha_inicio = new Date().toISOString();
      }

      const { error } = await supabase
        .from("ordenes_trabajo")
        .update(updateData)
        .eq("id", orderId);

      if (error) {
        toast.error("Error al actualizar la orden");
        return;
      }

      // Registrar en historial
      await logChange(
        orderId,
        status === "in_progress" ? "PAUSA" : "INICIO",
        orden.estado,
        newStatus,
        status === "in_progress" ? "Orden pausada" : "Orden iniciada/reanudada"
      );

      if (status === "in_progress") {
        setStatus("paused");
        setEditEstado(ORDER_STATES.PAUSADA);
        toast.info("Orden de trabajo pausada");
      } else {
        setStatus("in_progress");
        setEditEstado(ORDER_STATES.EN_EJECUCION);
        toast.success("Orden de trabajo reanudada");
      }
      
      setOrden({ ...orden, estado: newStatus, ...(updateData.fecha_inicio ? { fecha_inicio: updateData.fecha_inicio } : {}) });
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
      const finalObservaciones = completionNotes 
        ? `${orden.observaciones || ""}\n--- Notas de cierre ---\n${completionNotes}`.trim()
        : orden.observaciones;

      const { error } = await supabase
        .from("ordenes_trabajo")
        .update({ 
          estado: ORDER_STATES.COMPLETADA,
          fecha_fin: new Date().toISOString(),
          observaciones: finalObservaciones
        })
        .eq("id", orderId);

      if (error) {
        toast.error("Error al completar la orden");
        return;
      }

      // Registrar en historial
      await logChange(
        orderId,
        "COMPLETACIÓN",
        orden.estado,
        ORDER_STATES.COMPLETADA,
        `Orden completada. ${completionNotes ? "Notas: " + completionNotes : ""}`
      );

      setStatus("completed");
      setEditEstado(ORDER_STATES.COMPLETADA);
      setShowCompleteDialog(false);
      toast.success("Orden de trabajo completada exitosamente", {
        description: "Se ha actualizado el estado en el sistema",
      });
      
      // Cerrar después de un momento para que el usuario vea el mensaje
      setTimeout(() => {
        onClose();
      }, 1500);
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

          {/* Sección de edición */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Editar Orden
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tecnico">Técnico Asignado</Label>
                <Input 
                  id="tecnico"
                  value={editTecnico}
                  onChange={(e) => setEditTecnico(e.target.value)}
                  placeholder="Nombre del técnico"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={editEstado} onValueChange={setEditEstado}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ORDER_STATES).map(estado => (
                      <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={editObservaciones}
                onChange={(e) => setEditObservaciones(e.target.value)}
                placeholder="Observaciones de la orden..."
                rows={3}
              />
            </div>

            <Button onClick={handleSaveChanges} disabled={saving} className="w-full">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
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
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-600">
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
          <PhotoCapture orderId={orderId} />
        </div>

        <div>
          <ObservationsPanel orderId={orderId} />
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
