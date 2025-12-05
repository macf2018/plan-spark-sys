import { useState, useEffect } from "react";
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
import { Search, Filter, ArrowUpDown, Bell, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { mapEstadoToUIStatus, mapCriticidadToPriority, FILTER_STATES } from "@/lib/orderStatus";

// Tipo para las órdenes de trabajo desde la BD
interface OrdenTrabajo {
  id: string;
  fecha_programada: string;
  nombre_sitio: string;
  tramo: string;
  pk: string;
  tipo_equipo: string;
  tipo_mantenimiento: string;
  frecuencia: string;
  proveedor_codigo: string | null;
  proveedor_nombre: string | null;
  criticidad: string | null;
  ventana_horaria: string | null;
  descripcion_trabajo: string | null;
  estado: string | null;
  tecnico_asignado: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  observaciones: string | null;
}

export default function Execution() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTramo, setFilterTramo] = useState("all");
  const [filterProveedor, setFilterProveedor] = useState("all");
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar órdenes de trabajo desde Supabase
  const fetchOrdenes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ordenes_trabajo")
        .select("*")
        .order("fecha_programada", { ascending: true });

      if (error) {
        console.error("Error al cargar órdenes:", error);
        toast.error("Error al cargar órdenes de trabajo");
      } else {
        setOrdenes(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  // Obtener listas únicas para filtros
  const tramosUnicos = [...new Set(ordenes.map(o => o.tramo).filter(Boolean))];
  const proveedoresUnicos = [...new Set(ordenes.map(o => o.proveedor_nombre).filter(Boolean))];

  // Transformar órdenes al formato esperado por WorkOrderCard
  const transformedOrders = ordenes.map(orden => ({
    id: orden.id,
    planName: `${orden.tipo_mantenimiento} - ${orden.nombre_sitio}`,
    equipment: orden.tipo_equipo,
    technician: orden.tecnico_asignado || "Sin asignar",
    scheduledDate: orden.fecha_programada,
    status: mapEstadoToUIStatus(orden.estado),
    priority: mapCriticidadToPriority(orden.criticidad),
    progress: orden.estado?.toLowerCase() === "en ejecución" ? 50 : 
              orden.estado?.toLowerCase() === "completada" ? 100 : 0,
    // Campos adicionales para el detalle
    tramo: orden.tramo,
    pk: orden.pk,
    proveedor_nombre: orden.proveedor_nombre,
    frecuencia: orden.frecuencia,
    descripcion_trabajo: orden.descripcion_trabajo,
    ventana_horaria: orden.ventana_horaria,
  }));

  const handleStartOrder = async (orderId: string) => {
    try {
      // Registrar en historial
      const ordenActual = ordenes.find(o => o.id === orderId);
      
      const { error } = await supabase
        .from("ordenes_trabajo")
        .update({ 
          estado: "En ejecución",
          fecha_inicio: new Date().toISOString()
        })
        .eq("id", orderId);

      if (error) {
        toast.error("Error al iniciar la orden");
        return;
      }

      // Registrar en historial
      await supabase
        .from("ordenes_trabajo_historial")
        .insert({
          orden_id: orderId,
          accion: "INICIO",
          estado_anterior: ordenActual?.estado || "Planificada",
          estado_nuevo: "En ejecución",
          descripcion: "Orden iniciada",
          usuario: "sistema"
        });

      toast.success("Orden iniciada", {
        description: `La orden ha sido iniciada exitosamente`,
      });
      
      // Actualizar estado local
      setOrdenes(prev => prev.map(o => 
        o.id === orderId 
          ? { ...o, estado: "En ejecución", fecha_inicio: new Date().toISOString() }
          : o
      ));
      
      setSelectedOrder(orderId);
    } catch (err) {
      toast.error("Error al iniciar la orden");
    }
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
    // Recargar datos para sincronizar cambios
    fetchOrdenes();
  };

  // Filtrar órdenes - usando estados unificados
  const filteredOrders = transformedOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.tramo?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.pk?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    // Mapear filtro de estado
    let matchesStatus = filterStatus === "all";
    if (!matchesStatus) {
      const originalOrder = ordenes.find(o => o.id === order.id);
      const estadoDB = originalOrder?.estado?.toLowerCase() || "planificada";
      const filterLower = filterStatus.toLowerCase();
      matchesStatus = estadoDB === filterLower || 
                      (filterLower === "en ejecución" && estadoDB === "en_ejecucion");
    }
    
    const originalOrder = ordenes.find(o => o.id === order.id);
    const matchesTramo = filterTramo === "all" || originalOrder?.tramo === filterTramo;
    const matchesProveedor = filterProveedor === "all" || originalOrder?.proveedor_nombre === filterProveedor;

    return matchesSearch && matchesStatus && matchesTramo && matchesProveedor;
  });

  // Contadores
  const totalOrders = ordenes.length;
  const delayedOrders = transformedOrders.filter(o => o.status === "delayed").length;
  const activeOrders = transformedOrders.filter(o => o.status === "in_progress").length;
  const pendingOrders = transformedOrders.filter(o => o.status === "pending").length;
  const completedOrders = transformedOrders.filter(o => o.status === "completed").length;

  // Vista de detalle - con navegación funcional
  if (selectedOrder) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header title="Ejecución de Orden de Trabajo" showNavigation />
        
        <main className="flex-1 p-6">
          <Button variant="outline" onClick={handleCloseDetail} className="mb-4">
            ← Volver a Órdenes
          </Button>
          <WorkOrderDetail orderId={selectedOrder} onClose={handleCloseDetail} />
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

        <div className="grid gap-4 md:grid-cols-5">
          <Card className="shadow-notion">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Órdenes Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">En el sistema</p>
            </CardContent>
          </Card>

          <Card className="shadow-notion">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Ejecución
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Activas ahora</p>
            </CardContent>
          </Card>

          <Card className="shadow-notion">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Planificadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Por iniciar</p>
            </CardContent>
          </Card>

          <Card className="shadow-notion">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{completedOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">Finalizadas</p>
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
            <div className="flex flex-col gap-4">
              <CardTitle>Órdenes de Trabajo ({filteredOrders.length} de {totalOrders})</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
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
                  <SelectTrigger className="w-44">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTER_STATES.map(state => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterTramo} onValueChange={setFilterTramo}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tramo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tramos</SelectItem>
                    {tramosUnicos.map(tramo => (
                      <SelectItem key={tramo} value={tramo}>{tramo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterProveedor} onValueChange={setFilterProveedor}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los proveedores</SelectItem>
                    {proveedoresUnicos.map(prov => (
                      <SelectItem key={prov} value={prov!}>{prov}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Cargando órdenes de trabajo...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No se encontraron órdenes</p>
                <p className="text-sm text-muted-foreground">
                  {totalOrders === 0 
                    ? "No hay órdenes de trabajo en el sistema. Cargue un plan anual para generar OT."
                    : "Intenta con diferentes filtros o términos de búsqueda"}
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
