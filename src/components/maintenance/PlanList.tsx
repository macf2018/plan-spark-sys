import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit, Trash2, Search, Filter } from "lucide-react";

const plans = [
  {
    id: "PLN-001",
    name: "Mantenimiento Preventivo Q1",
    type: "Trimestral",
    equipment: "Transformador #1",
    technician: "Carlos Rodríguez",
    startDate: "2024-01-01",
    status: "active",
    frequency: "Mensual",
  },
  {
    id: "PLN-002",
    name: "Inspección UPS",
    type: "Mensual",
    equipment: "UPS-01",
    technician: "Ana García",
    startDate: "2024-01-15",
    status: "pending",
    frequency: "Semanal",
  },
  {
    id: "PLN-003",
    name: "Revisión Generador A",
    type: "Semestral",
    equipment: "Generador A",
    technician: "Pedro Martínez",
    startDate: "2024-02-01",
    status: "completed",
    frequency: "Trimestral",
  },
  {
    id: "PLN-004",
    name: "Panel Principal - Revisión",
    type: "Anual",
    equipment: "Panel Principal",
    technician: "Carlos Rodríguez",
    startDate: "2024-03-01",
    status: "conflict",
    frequency: "Mensual",
  },
];

const statusColors = {
  active: "bg-success",
  pending: "bg-warning",
  completed: "bg-muted",
  conflict: "bg-destructive",
};

const statusLabels = {
  active: "Activo",
  pending: "Pendiente",
  completed: "Completado",
  conflict: "Conflicto",
};

export function PlanList() {
  return (
    <Card className="shadow-notion">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Planes de Mantenimiento</CardTitle>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar planes..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="completed">Completados</SelectItem>
                <SelectItem value="conflict">Con Conflictos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Técnico</TableHead>
              <TableHead>Frecuencia</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.id}</TableCell>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.type}</TableCell>
                <TableCell>{plan.equipment}</TableCell>
                <TableCell>{plan.technician}</TableCell>
                <TableCell>{plan.frequency}</TableCell>
                <TableCell>{plan.startDate}</TableCell>
                <TableCell>
                  <Badge
                    className={statusColors[plan.status as keyof typeof statusColors]}
                  >
                    {statusLabels[plan.status as keyof typeof statusLabels]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
