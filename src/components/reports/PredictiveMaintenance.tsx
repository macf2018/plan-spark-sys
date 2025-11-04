import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Zap, Wrench } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PredictiveMaintenanceProps {
  filters: any;
}

export function PredictiveMaintenance({ filters }: PredictiveMaintenanceProps) {
  const predictions = [
    {
      id: 1,
      equipment: "Transformador T-01",
      area: "Subestación Principal",
      prediction: "Falla probable en 15 días",
      probability: 87,
      severity: "alta",
      recommendation: "Inspección urgente de aislamiento",
      icon: Zap,
    },
    {
      id: 2,
      equipment: "Generador G-03",
      area: "Planta de Emergencia",
      prediction: "Desgaste de rodamientos",
      probability: 72,
      severity: "media",
      recommendation: "Programar cambio de rodamientos",
      icon: Wrench,
    },
    {
      id: 3,
      equipment: "UPS-02",
      area: "Centro de Datos",
      prediction: "Degradación de baterías",
      probability: 65,
      severity: "media",
      recommendation: "Reemplazo de baterías en 30 días",
      icon: TrendingUp,
    },
    {
      id: 4,
      equipment: "Tablero TE-12",
      area: "Producción Línea 2",
      prediction: "Sobrecalentamiento detectado",
      probability: 91,
      severity: "alta",
      recommendation: "Revisión inmediata de conexiones",
      icon: AlertTriangle,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "alta":
        return "destructive";
      case "media":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-notion border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Alertas Predictivas
          </CardTitle>
          <CardDescription>
            Análisis de tendencias y predicciones basadas en datos históricos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Predicción</TableHead>
                <TableHead>Probabilidad</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>Recomendación</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map((pred) => (
                <TableRow key={pred.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <pred.icon className="h-4 w-4 text-muted-foreground" />
                      {pred.equipment}
                    </div>
                  </TableCell>
                  <TableCell>{pred.area}</TableCell>
                  <TableCell>{pred.prediction}</TableCell>
                  <TableCell>
                    <span className="font-semibold">{pred.probability}%</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(pred.severity)}>
                      {pred.severity.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {pred.recommendation}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Crear OT
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-notion">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Predicciones Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              En los próximos 30 días
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-notion">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Precisión del Modelo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.5%</div>
            <p className="text-xs text-success mt-1">
              +3.2% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-notion">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ahorro Estimado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,200</div>
            <p className="text-xs text-success mt-1">
              Por mantenimiento predictivo
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
