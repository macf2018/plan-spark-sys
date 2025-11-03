import { useState } from "react";
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
} from "lucide-react";
import { ChecklistForm } from "./ChecklistForm";
import { PhotoCapture } from "./PhotoCapture";
import { ObservationsPanel } from "./ObservationsPanel";
import { toast } from "sonner";

interface WorkOrderDetailProps {
  orderId: string;
  onClose: () => void;
}

export function WorkOrderDetail({ orderId, onClose }: WorkOrderDetailProps) {
  const [status, setStatus] = useState<"pending" | "in_progress" | "paused" | "completed">("in_progress");
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const [elapsedTime, setElapsedTime] = useState("02:45:30");

  const order = {
    id: orderId,
    planName: "Mantenimiento Preventivo Q1 - Transformador #1",
    equipment: "Transformador Principal #1",
    technician: "Carlos Rodríguez",
    supervisor: "Ana García",
    scheduledDate: "2024-01-15 08:00",
    startedAt: "2024-01-15 08:15",
    priority: "high",
    description: "Realizar mantenimiento preventivo completo del transformador principal",
  };

  const handleStartPause = () => {
    if (status === "in_progress") {
      setStatus("paused");
      toast.info("Orden de trabajo pausada");
    } else {
      setStatus("in_progress");
      toast.success("Orden de trabajo reanudada");
    }
  };

  const handleComplete = () => {
    setShowCompleteDialog(true);
  };

  const confirmComplete = () => {
    setStatus("completed");
    setShowCompleteDialog(false);
    toast.success("Orden de trabajo completada exitosamente", {
      description: "Se ha notificado al supervisor y actualizado el sistema",
    });
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-notion border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{order.id}</CardTitle>
              <p className="text-muted-foreground">{order.planName}</p>
            </div>
            <Badge className="bg-warning">Alta Prioridad</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Equipo</p>
                  <p className="font-medium">{order.equipment}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Técnico</p>
                  <p className="font-medium">{order.technician}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Supervisor</p>
                  <p className="font-medium">{order.supervisor}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Fecha Programada</p>
                  <p className="font-medium">{order.scheduledDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Inicio Real</p>
                  <p className="font-medium">{order.startedAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Tiempo Transcurrido</p>
                  <p className="font-medium text-primary">{elapsedTime}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Descripción del Trabajo</h4>
            <p className="text-sm text-muted-foreground">{order.description}</p>
          </div>

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
                  Reanudar Orden
                </>
              )}
            </Button>

            <Button
              onClick={handleComplete}
              className="flex-1"
              disabled={status === "paused"}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completar Orden
            </Button>
          </div>
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
