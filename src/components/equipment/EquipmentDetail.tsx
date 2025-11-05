import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { History, Settings } from "lucide-react";

interface EquipmentDetailProps {
  equipmentId: string;
  onClose: () => void;
}

interface Equipment {
  id: string;
  nombre_equipo: string;
  tipo: string;
  marca: string;
  modelo: string;
  version_revision: string;
  nro_serie: string;
  anio_fabricacion: number;
  vida_util_estimada: number;
  fecha_ingreso: string;
  proximo_mantenimiento: string;
  estado: string;
  ubicacion_fisica: string;
  zona: string;
  sala: string;
  responsable_asignado: string;
  proveedor_asociado: string;
  observaciones: string;
  created_at: string;
  updated_at: string;
}

interface HistoryRecord {
  id: string;
  estado_anterior: string;
  estado_nuevo: string;
  observacion: string;
  fecha_cambio: string;
}

const estadoLabels: Record<string, string> = {
  operativo: "Operativo",
  en_reparacion: "En reparación",
  en_mantenimiento: "En mantenimiento",
  fuera_de_servicio: "Fuera de servicio",
  obsoleto: "Obsoleto",
  dado_de_baja: "Dado de baja"
};

type EstadoEquipo = 'operativo' | 'en_reparacion' | 'en_mantenimiento' | 'fuera_de_servicio' | 'obsoleto' | 'dado_de_baja';

const EquipmentDetail = ({ equipmentId, onClose }: EquipmentDetailProps) => {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState<EstadoEquipo>("operativo");
  const [observation, setObservation] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchEquipmentDetail();
    fetchHistory();
  }, [equipmentId]);

  const fetchEquipmentDetail = async () => {
    try {
      const { data, error } = await supabase
        .from("equipos")
        .select("*")
        .eq("id", equipmentId)
        .single();

      if (error) throw error;
      setEquipment(data);
      setNewStatus(data.estado as EstadoEquipo);
    } catch (error: any) {
      toast.error("Error al cargar detalle: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("equipos_historial_estado")
        .select("*")
        .eq("equipo_id", equipmentId)
        .order("fecha_cambio", { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      console.error("Error al cargar historial:", error.message);
    }
  };

  const handleStatusChange = async () => {
    if (!equipment || newStatus === equipment.estado) {
      toast.error("Debes seleccionar un estado diferente");
      return;
    }

    if (!observation.trim()) {
      toast.error("Debes agregar una observación");
      return;
    }

    try {
      setUpdating(true);

      const { error: updateError } = await supabase
        .from("equipos")
        .update({ estado: newStatus })
        .eq("id", equipmentId);

      if (updateError) throw updateError;

      const { error: historyError } = await supabase
        .from("equipos_historial_estado")
        .insert([{
          equipo_id: equipmentId,
          estado_anterior: equipment.estado as EstadoEquipo,
          estado_nuevo: newStatus,
          observacion: observation
        }]);

      if (historyError) throw historyError;

      await supabase.from("equipos_logs").insert({
        equipo_id: equipmentId,
        accion: "CAMBIO DE ESTADO",
        descripcion: `Estado cambiado de ${estadoLabels[equipment.estado]} a ${estadoLabels[newStatus]}`
      });

      toast.success("Estado actualizado correctamente");
      setObservation("");
      fetchEquipmentDetail();
      fetchHistory();
    } catch (error: any) {
      toast.error("Error al actualizar estado: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !equipment) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre</p>
            <p className="font-medium">{equipment.nombre_equipo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estado Actual</p>
            <Badge>{estadoLabels[equipment.estado]}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tipo</p>
            <p className="font-medium capitalize">{equipment.tipo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Marca / Modelo</p>
            <p className="font-medium">{equipment.marca} {equipment.modelo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Número de Serie</p>
            <p className="font-medium">{equipment.nro_serie || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Año de Fabricación</p>
            <p className="font-medium">{equipment.anio_fabricacion || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ubicación</p>
            <p className="font-medium">
              {[equipment.ubicacion_fisica, equipment.zona, equipment.sala]
                .filter(Boolean)
                .join(" - ") || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Responsable</p>
            <p className="font-medium">{equipment.responsable_asignado || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Próximo Mantenimiento</p>
            <p className="font-medium">
              {equipment.proximo_mantenimiento
                ? format(new Date(equipment.proximo_mantenimiento), "dd/MM/yyyy")
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Vida Útil Estimada</p>
            <p className="font-medium">
              {equipment.vida_util_estimada ? `${equipment.vida_util_estimada} años` : "-"}
            </p>
          </div>
          {equipment.observaciones && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Observaciones</p>
              <p className="font-medium">{equipment.observaciones}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar Estado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nuevo Estado</Label>
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v as EstadoEquipo)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operativo">Operativo</SelectItem>
                <SelectItem value="en_reparacion">En reparación</SelectItem>
                <SelectItem value="en_mantenimiento">En mantenimiento</SelectItem>
                <SelectItem value="fuera_de_servicio">Fuera de servicio</SelectItem>
                <SelectItem value="obsoleto">Obsoleto</SelectItem>
                <SelectItem value="dado_de_baja">Dado de baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Observación</Label>
            <Textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Describe el motivo del cambio de estado..."
              rows={3}
            />
          </div>
          <Button onClick={handleStatusChange} disabled={updating} className="w-full">
            {updating ? "Guardando..." : "Guardar Cambio de Estado"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Cambios de Estado
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay cambios de estado registrados
            </p>
          ) : (
            <div className="space-y-4">
              {history.map((record, index) => (
                <div key={record.id}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{estadoLabels[record.estado_anterior]}</Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge>{estadoLabels[record.estado_nuevo]}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{record.observacion}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(record.fecha_cambio), "dd/MM/yyyy HH:mm", { locale: es })}
                    </p>
                  </div>
                  {index < history.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentDetail;
