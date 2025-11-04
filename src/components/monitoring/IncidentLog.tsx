import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, FileText, Search, Filter } from "lucide-react";
import { useState } from "react";

export function IncidentLog() {
  const [searchTerm, setSearchTerm] = useState("");

  const incidents = [
    {
      id: "INC-2024-015",
      orderId: "OT-2024-003",
      type: "deviation",
      severity: "high",
      title: "Retraso en mantenimiento de Motor #3",
      description: "Tiempo de ejecución excede en 36% el tiempo estimado. Requerido personal adicional.",
      reportedBy: "Carlos Rodríguez",
      date: "2024-01-15 14:30",
      status: "open",
    },
    {
      id: "INC-2024-014",
      orderId: "OT-2024-002",
      type: "material",
      severity: "medium",
      title: "Falta de material para Panel B",
      description: "Material de aislamiento no disponible en almacén. Requiere compra urgente.",
      reportedBy: "Ana García",
      date: "2024-01-15 10:15",
      status: "resolved",
    },
    {
      id: "INC-2024-013",
      orderId: "OT-2024-005",
      type: "safety",
      severity: "high",
      title: "Equipo de seguridad defectuoso",
      description: "Detector de voltaje presenta fallas. Trabajo suspendido hasta reemplazo.",
      reportedBy: "Luis Martínez",
      date: "2024-01-14 16:45",
      status: "open",
    },
    {
      id: "INC-2024-012",
      orderId: "OT-2024-001",
      type: "deviation",
      severity: "low",
      title: "Variación menor en procedimiento",
      description: "Ajuste en secuencia de apagado por recomendación del fabricante.",
      reportedBy: "Carlos Rodríguez",
      date: "2024-01-14 09:20",
      status: "resolved",
    },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-destructive">Alta</Badge>;
      case "medium":
        return <Badge className="bg-warning">Media</Badge>;
      case "low":
        return <Badge className="bg-muted">Baja</Badge>;
      default:
        return <Badge>Desconocida</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="border-destructive text-destructive">Abierta</Badge>;
      case "resolved":
        return <Badge className="bg-success">Resuelta</Badge>;
      default:
        return <Badge>Pendiente</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    return <AlertTriangle className="h-4 w-4" />;
  };

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-notion">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registro de Incidencias y Desviaciones
          </CardTitle>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, orden o descripción..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredIncidents.map((incident) => (
          <div
            key={incident.id}
            className="border border-border rounded-lg p-4 space-y-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getTypeIcon(incident.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{incident.id}</h4>
                    {getSeverityBadge(incident.severity)}
                    {getStatusBadge(incident.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Orden: {incident.orderId}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-1">{incident.title}</h5>
              <p className="text-sm text-muted-foreground">{incident.description}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>Reportado por: {incident.reportedBy}</span>
              <span>{incident.date}</span>
            </div>

            {incident.status === "open" && (
              <Button size="sm" className="w-full">
                Atender Incidencia
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
