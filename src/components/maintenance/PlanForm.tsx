import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanForm({ open, onOpenChange }: PlanFormProps) {
  const [hasConflict, setHasConflict] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular validación de conflictos
    const randomConflict = Math.random() > 0.7;
    setHasConflict(randomConflict);

    if (randomConflict) {
      toast.error("Conflicto detectado", {
        description: "El equipo seleccionado ya tiene mantenimiento programado en esa fecha.",
      });
      return;
    }

    toast.success("Plan creado exitosamente", {
      description: "El plan de mantenimiento ha sido registrado.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Plan de Mantenimiento</DialogTitle>
          <DialogDescription>
            Complete los datos para crear un nuevo plan de mantenimiento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {hasConflict && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Se ha detectado un conflicto de programación. Verifique las fechas y equipos seleccionados.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Nombre del Plan</Label>
                <Input
                  id="plan-name"
                  placeholder="Ej: Mantenimiento Preventivo Q1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan-type">Tipo de Plan</Label>
                <Select required>
                  <SelectTrigger id="plan-type">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="quarterly">Trimestral</SelectItem>
                    <SelectItem value="semiannual">Semestral</SelectItem>
                    <SelectItem value="annual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipo</Label>
                <Select required>
                  <SelectTrigger id="equipment">
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transformer-1">Transformador #1</SelectItem>
                    <SelectItem value="generator-a">Generador A</SelectItem>
                    <SelectItem value="panel-main">Panel Principal</SelectItem>
                    <SelectItem value="ups-01">UPS-01</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frecuencia</Label>
                <Select required>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="biweekly">Quincenal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="quarterly">Trimestral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Fecha de Inicio</Label>
                <Input id="start-date" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">Fecha de Fin</Label>
                <Input id="end-date" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technician">Técnico Asignado</Label>
              <Select required>
                <SelectTrigger id="technician">
                  <SelectValue placeholder="Seleccionar técnico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech-1">Carlos Rodríguez - Electricista Senior</SelectItem>
                  <SelectItem value="tech-2">Ana García - Técnico Nivel II</SelectItem>
                  <SelectItem value="tech-3">Pedro Martínez - Especialista</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="materials">Materiales Requeridos</Label>
              <Select required>
                <SelectTrigger id="materials">
                  <SelectValue placeholder="Seleccionar materiales" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Kit Básico (Disponible: 5)</SelectItem>
                  <SelectItem value="advanced">Kit Avanzado (Disponible: 2)</SelectItem>
                  <SelectItem value="specialized">Kit Especializado (Disponible: 1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tools">Herramientas Requeridas</Label>
              <Select required>
                <SelectTrigger id="tools">
                  <SelectValue placeholder="Seleccionar herramientas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multimeter">Multímetro Digital (Disponible)</SelectItem>
                  <SelectItem value="megger">Megger (Disponible)</SelectItem>
                  <SelectItem value="thermal">Cámara Térmica (En uso)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describa las actividades del plan de mantenimiento..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Plan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
