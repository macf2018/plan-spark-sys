import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Clock, User, Wrench, AlertCircle, PlayCircle, CheckCircle2, MapPin, Building, Calendar } from "lucide-react";

interface WorkOrderCardProps {
  order: {
    id: string;
    fecha_programada: string;
    nombre_sitio: string;
    tramo: string;
    pk: string;
    tipo_equipo: string;
    tipo_mantenimiento: string;
    frecuencia: string;
    proveedor_nombre: string | null;
    tecnico_asignado: string | null;
    estado: string | null;
    criticidad: string | null;
    descripcion_trabajo: string | null;
  };
  onStart: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const getStatusConfig = (estado: string | null) => {
  const estadoLower = estado?.toLowerCase() || "planificada";
  
  if (estadoLower === "en ejecución" || estadoLower === "en_ejecucion") {
    return { label: "En Ejecución", color: "bg-green-500 text-white", icon: PlayCircle };
  }
  if (estadoLower === "pausada") {
    return { label: "Pausada", color: "bg-warning text-warning-foreground", icon: Clock };
  }
  if (estadoLower === "completada" || estadoLower === "cerrada") {
    return { label: "Completada", color: "bg-muted text-muted-foreground", icon: CheckCircle2 };
  }
  if (estadoLower === "cancelada") {
    return { label: "Cancelada", color: "bg-destructive text-destructive-foreground", icon: AlertCircle };
  }
  return { label: "Planificada", color: "bg-blue-500 text-white", icon: Clock };
};

const getPriorityConfig = (criticidad: string | null) => {
  if (!criticidad) {
    return { label: "–", color: "bg-muted" };
  }
  const critLower = criticidad.toLowerCase();
  
  if (critLower === "crítica" || critLower === "critica" || critLower === "muy alta") {
    return { label: "Crítica", color: "bg-destructive animate-pulse" };
  }
  if (critLower === "alta") {
    return { label: "Alta", color: "bg-destructive" };
  }
  if (critLower === "media") {
    return { label: "Media", color: "bg-warning" };
  }
  return { label: "Baja", color: "bg-muted" };
};

export function WorkOrderCard({ order, onStart, onViewDetails }: WorkOrderCardProps) {
  const statusInfo = getStatusConfig(order.estado);
  const priorityInfo = getPriorityConfig(order.criticidad);
  const StatusIcon = statusInfo.icon;
  
  const isPending = order.estado?.toLowerCase() === "planificada" || !order.estado;

  return (
    <Card className="shadow-notion hover:shadow-md transition-smooth">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">OT-{order.id.slice(0, 8).toUpperCase()}</h3>
              <Badge className={priorityInfo.color}>{priorityInfo.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1" title={order.nombre_sitio}>
              {order.nombre_sitio}
            </p>
          </div>
          <Badge className={statusInfo.color}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 py-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="truncate" title={`${order.tramo} / ${order.pk}`}>
              {order.tramo} / {order.pk}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="truncate" title={order.tipo_equipo}>{order.tipo_equipo}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span>{order.fecha_programada}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{order.frecuencia}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="truncate" title={order.tecnico_asignado || "Sin asignar"}>
              {order.tecnico_asignado || "Sin asignar"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="truncate" title={order.proveedor_nombre || "N/A"}>
              {order.proveedor_nombre || "N/A"}
            </span>
          </div>
        </div>
        
        <div className="pt-1 border-t space-y-1">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Mantenimiento:</span> {order.tipo_mantenimiento}
          </p>
          {order.descripcion_trabajo && (
            <p className="text-xs text-muted-foreground line-clamp-2" title={order.descripcion_trabajo}>
              <span className="font-medium">Descripción:</span> {order.descripcion_trabajo}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails(order.id)}
        >
          Ver Detalles
        </Button>
        {isPending && (
          <Button size="sm" className="flex-1" onClick={() => onStart(order.id)}>
            <PlayCircle className="mr-1 h-3.5 w-3.5" />
            Iniciar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
