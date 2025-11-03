import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { WorkOrderCard } from "@/components/execution/WorkOrderCard";
import { WorkOrderDetail } from "@/components/execution/WorkOrderDetail";
import { Search, Filter, ArrowUpDown, Bell } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const mockOrders = [
  {
    id: "OT-2024-001",
    planName: "Mantenimiento Preventivo Q1",
    equipment: "Transformador Principal #1",
    technician: "Carlos Rodríguez",
    scheduledDate: "2024-01-15",
    status: "in_progress" as const,
    priority: "high" as const,
    progress: 65,
  },
  {
    id: "OT-2024-002",
    planName: "Inspección UPS",
    equipment: "UPS-01",
    technician: "Ana García",
    scheduledDate: "2024-01-15",
    status: "pending" as const,
    priority: "medium" as const,
    progress: 0,
  },
  {
    id: "OT-2024-003",
    planName: "Mantenimiento Correctivo",
    equipment: "Generador A",
    technician: "Pedro Martínez",
    scheduledDate: "2024-01-14",
    status: "delayed" as const,
    priority: "critical" as const,
    progress: 30,
  },
  {
    id: "OT-2024-004",
    planName: "Revisión Panel Principal",
    equipment: "Panel Eléctrico Principal",
    technician: "Carlos Rodríguez",
    scheduledDate: "2024-01-16",
    status: "pending" as const,
    priority: "low" as const,
    progress: 0,
  },
];

export default function Execution() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleStartOrder = (orderId: string) => {
    toast.success("Orden iniciada", {
      description: `La orden ${orderId} ha sido iniciada exitosamente`,
    });
    setSelectedOrder(orderId);
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.equipment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const delayedOrders = mockOrders.filter(o => o.status === "delayed").length;
  const activeOrders = mockOrders.filter(o => o.status === "in_progress").length;

  if (selectedOrder) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="Ejecución de Orden de Trabajo" showNavigation />
        
        <main className="flex-1 p-6">
          <Button variant="outline" onClick={() => setSelectedOrder(null)} className="mb-4">
            ← Volver a Órdenes
          </Button>
          <WorkOrderDetail orderId={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Módulo de Ejecución de Órdenes de Trabajo" showNavigation />
      
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Ejecución de Mantenimiento</h2>
            <p className="text-muted-foreground">
              Gestiona y ejecuta órdenes de trabajo en tiempo real
            </p>
          </div>
        </div>

        {delayedOrders > 0 && (
          <Alert variant="destructive">
            <Bell className="h-4 w-4" />
            <AlertDescription>
              <strong>¡Atención!</strong> Hay {delayedOrders} orden(es) retrasada(s) que requieren atención inmediata.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-notion">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Órdenes Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockOrders.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Hoy</p>
            </CardContent>
          </Card>

          <Card className="shadow-notion">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Activas ahora</p>
            </CardContent>
          </Card>

          <Card className="shadow-notion">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockOrders.filter(o => o.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Por iniciar</p>
            </CardContent>
          </Card>

          <Card className="shadow-notion">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Retrasadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{delayedOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-notion">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Órdenes de Trabajo</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar órdenes..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="delayed">Retrasadas</SelectItem>
                    <SelectItem value="completed">Completadas</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No se encontraron órdenes</p>
                <p className="text-sm text-muted-foreground">
                  Intenta con diferentes filtros o términos de búsqueda
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredOrders.map((order) => (
                  <WorkOrderCard
                    key={order.id}
                    order={order}
                    onStart={handleStartOrder}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
