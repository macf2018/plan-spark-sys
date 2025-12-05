// Estados unificados para órdenes de trabajo
// Usar estos estados en TODOS los módulos (Planificación y Ejecución)

export const ORDER_STATES = {
  PLANIFICADA: "Planificada",
  EN_EJECUCION: "En ejecución",
  PAUSADA: "Pausada",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
} as const;

export type OrderState = typeof ORDER_STATES[keyof typeof ORDER_STATES];

// Mapeo de estados de BD a estados de UI (para WorkOrderCard)
export type UIStatus = "pending" | "in_progress" | "completed" | "delayed";

export const mapEstadoToUIStatus = (estado: string | null): UIStatus => {
  const estadoLower = estado?.toLowerCase() || "";
  
  if (estadoLower === "en ejecución" || estadoLower === "en_ejecucion" || estadoLower === "en progreso" || estadoLower === "pausada") {
    return "in_progress";
  }
  if (estadoLower === "completada" || estadoLower === "cerrada" || estadoLower === "finalizada") {
    return "completed";
  }
  if (estadoLower === "cancelada") {
    return "delayed";
  }
  // Planificada, pendiente, o cualquier otro -> pending
  return "pending";
};

// Mapeo de criticidad a prioridad UI
export type UIPriority = "low" | "medium" | "high" | "critical";

export const mapCriticidadToPriority = (criticidad: string | null): UIPriority => {
  const critLower = criticidad?.toLowerCase() || "";
  
  if (critLower === "crítica" || critLower === "critica" || critLower === "muy alta") {
    return "critical";
  }
  if (critLower === "alta") {
    return "high";
  }
  if (critLower === "media") {
    return "medium";
  }
  return "low";
};

// Colores para badges de estado
export const statusColors: Record<string, string> = {
  planificada: "bg-blue-500",
  pendiente: "bg-blue-500",
  "en ejecución": "bg-green-500",
  en_ejecucion: "bg-green-500",
  pausada: "bg-warning",
  completada: "bg-muted",
  cerrada: "bg-muted",
  cancelada: "bg-destructive",
};

// Labels para estados
export const statusLabels: Record<string, string> = {
  planificada: "Planificada",
  pendiente: "Planificada",
  "en ejecución": "En Ejecución",
  en_ejecucion: "En Ejecución",
  pausada: "Pausada",
  completada: "Completada",
  cerrada: "Completada",
  cancelada: "Cancelada",
};

export const getStatusColor = (estado: string | null): string => {
  const key = estado?.toLowerCase() || 'planificada';
  return statusColors[key] || 'bg-muted';
};

export const getStatusLabel = (estado: string | null): string => {
  const key = estado?.toLowerCase() || 'planificada';
  return statusLabels[key] || estado || 'Sin estado';
};

// Lista de estados para filtros (usar en ambos módulos)
export const FILTER_STATES = [
  { value: "all", label: "Todos" },
  { value: "Planificada", label: "Planificadas" },
  { value: "En ejecución", label: "En Ejecución" },
  { value: "Pausada", label: "Pausadas" },
  { value: "Completada", label: "Completadas" },
  { value: "Cancelada", label: "Canceladas" },
];
