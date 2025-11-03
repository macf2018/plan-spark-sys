import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Clock, User, Wrench, AlertCircle, PlayCircle, CheckCircle2 } from "lucide-react";

interface WorkOrderCardProps {
  order: {
    id: string;
    planName: string;
    equipment: string;
    technician: string;
    scheduledDate: string;
    status: "pending" | "in_progress" | "completed" | "delayed";
    priority: "low" | "medium" | "high" | "critical";
    progress: number;
  };
  onStart: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const statusConfig = {
  pending: {
    label: "Pendiente",
    color: "bg-muted text-muted-foreground",
    icon: Clock,
  },
  in_progress: {
    label: "En Progreso",
    color: "bg-primary text-primary-foreground",
    icon: PlayCircle,
  },
  completed: {
    label: "Completado",
    color: "bg-success text-success-foreground",
    icon: CheckCircle2,
  },
  delayed: {
    label: "Retrasado",
    color: "bg-destructive text-destructive-foreground",
    icon: AlertCircle,
  },
};

const priorityConfig = {
  low: { label: "Baja", color: "bg-muted" },
  medium: { label: "Media", color: "bg-warning" },
  high: { label: "Alta", color: "bg-destructive" },
  critical: { label: "Crítica", color: "bg-destructive animate-pulse" },
};

export function WorkOrderCard({ order, onStart, onViewDetails }: WorkOrderCardProps) {
  const statusInfo = statusConfig[order.status];
  const priorityInfo = priorityConfig[order.priority];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="shadow-notion hover:shadow-md transition-smooth">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{order.id}</h3>
              <Badge className={priorityInfo.color}>{priorityInfo.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{order.planName}</p>
          </div>
          <Badge className={statusInfo.color}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Wrench className="h-4 w-4 text-muted-foreground" />
          <span>{order.equipment}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{order.technician}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Programado: {order.scheduledDate}</span>
        </div>

        {order.status === "in_progress" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{order.progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${order.progress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onViewDetails(order.id)}
        >
          Ver Detalles
        </Button>
        {order.status === "pending" && (
          <Button className="flex-1" onClick={() => onStart(order.id)}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Iniciar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
