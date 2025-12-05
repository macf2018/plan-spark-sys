import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Trash2, Search, Filter, ArrowUpDown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getStatusColor, getStatusLabel, FILTER_STATES } from "@/lib/orderStatus";

interface OrdenTrabajo {
  id: string;
  fecha_programada: string;
  nombre_sitio: string;
  tramo: string;
  pk: string;
  tipo_equipo: string;
  tipo_mantenimiento: string;
  frecuencia: string;
  proveedor_nombre: string | null;
  proveedor_codigo: string | null;
  criticidad: string | null;
  ventana_horaria: string | null;
  descripcion_trabajo: string | null;
  estado: string | null;
  observaciones: string | null;
  created_at: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  tecnico_asignado: string | null;
}

export function PlanList() {
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [filteredOrdenes, setFilteredOrdenes] = useState<OrdenTrabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrden, setSelectedOrden] = useState<OrdenTrabajo | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    fetchOrdenes();
  }, []);

  useEffect(() => {
    filterOrdenes();
  }, [ordenes, searchTerm, statusFilter, sortOrder]);

  const fetchOrdenes = async () => {
    try {
      const { data, error } = await supabase
        .from('ordenes_trabajo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrdenes(data || []);
    } catch (error) {
      console.error('Error fetching ordenes:', error);
      toast.error('Error al cargar las órdenes de trabajo');
    } finally {
      setLoading(false);
    }
  };

  const filterOrdenes = () => {
    let filtered = [...ordenes];

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(o => 
        o.nombre_sitio?.toLowerCase().includes(term) ||
        o.tramo?.toLowerCase().includes(term) ||
        o.pk?.toLowerCase().includes(term) ||
        o.tipo_equipo?.toLowerCase().includes(term) ||
        o.proveedor_nombre?.toLowerCase().includes(term) ||
        o.id?.toLowerCase().includes(term)
      );
    }

    // Filtro por estado - usando comparación flexible
    if (statusFilter !== "all") {
      filtered = filtered.filter(o => {
        const estadoLower = o.estado?.toLowerCase() || "planificada";
        const filterLower = statusFilter.toLowerCase();
        return estadoLower === filterLower || 
               (filterLower === "en ejecución" && estadoLower === "en_ejecucion");
      });
    }

    // Ordenar por fecha
    filtered.sort((a, b) => {
      const dateA = new Date(a.fecha_programada).getTime();
      const dateB = new Date(b.fecha_programada).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredOrdenes(filtered);
  };

  const handleViewDetail = (orden: OrdenTrabajo) => {
    setSelectedOrden(orden);
    setDetailOpen(true);
  };

  const handleDeleteOrden = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta orden de trabajo?')) return;
    
    try {
      const { error } = await supabase
        .from('ordenes_trabajo')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Orden eliminada correctamente');
      fetchOrdenes();
    } catch (error) {
      console.error('Error deleting orden:', error);
      toast.error('Error al eliminar la orden');
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  if (loading) {
    return (
      <Card className="shadow-notion">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Cargando órdenes...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-notion">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Órdenes de Trabajo</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {ordenes.length === 0 
                  ? "No hay órdenes de trabajo en el sistema"
                  : `${filteredOrdenes.length} de ${ordenes.length} registros`
                }
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por sitio, tramo, PK..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_STATES.map(state => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={toggleSortOrder} title="Ordenar por fecha">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {ordenes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium">No hay órdenes de trabajo</p>
              <p className="text-sm mt-2">Cargue un plan anual para generar órdenes de trabajo.</p>
            </div>
          ) : filteredOrdenes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No se encontraron resultados con los filtros aplicados.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Fecha Prog.</TableHead>
                  <TableHead>Sitio</TableHead>
                  <TableHead>Tramo</TableHead>
                  <TableHead>PK</TableHead>
                  <TableHead>Tipo Equipo</TableHead>
                  <TableHead>Mantenimiento</TableHead>
                  <TableHead>Frecuencia</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrdenes.map((orden) => (
                  <TableRow key={orden.id}>
                    <TableCell className="font-mono text-xs">
                      {orden.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{orden.fecha_programada}</TableCell>
                    <TableCell className="max-w-[150px] truncate" title={orden.nombre_sitio}>
                      {orden.nombre_sitio}
                    </TableCell>
                    <TableCell>{orden.tramo}</TableCell>
                    <TableCell>{orden.pk}</TableCell>
                    <TableCell>{orden.tipo_equipo}</TableCell>
                    <TableCell>{orden.tipo_mantenimiento}</TableCell>
                    <TableCell>{orden.frecuencia}</TableCell>
                    <TableCell>{orden.proveedor_nombre || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(orden.estado)}>
                        {getStatusLabel(orden.estado)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewDetail(orden)}
                          title="Ver detalle"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteOrden(orden.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de detalle */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Orden de Trabajo</DialogTitle>
            <DialogDescription>
              ID: {selectedOrden?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrden && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha Programada</p>
                <p className="text-sm">{selectedOrden.fecha_programada}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <Badge className={getStatusColor(selectedOrden.estado)}>
                  {getStatusLabel(selectedOrden.estado)}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre Sitio</p>
                <p className="text-sm">{selectedOrden.nombre_sitio}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tramo</p>
                <p className="text-sm">{selectedOrden.tramo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">PK</p>
                <p className="text-sm">{selectedOrden.pk}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo Equipo</p>
                <p className="text-sm">{selectedOrden.tipo_equipo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo Mantenimiento</p>
                <p className="text-sm">{selectedOrden.tipo_mantenimiento}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Frecuencia</p>
                <p className="text-sm">{selectedOrden.frecuencia}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Proveedor</p>
                <p className="text-sm">{selectedOrden.proveedor_nombre || '-'} ({selectedOrden.proveedor_codigo || '-'})</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Criticidad</p>
                <p className="text-sm">{selectedOrden.criticidad || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ventana Horaria</p>
                <p className="text-sm">{selectedOrden.ventana_horaria || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Técnico Asignado</p>
                <p className="text-sm">{selectedOrden.tecnico_asignado || 'Sin asignar'}</p>
              </div>
              {selectedOrden.fecha_inicio && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha Inicio</p>
                  <p className="text-sm">{new Date(selectedOrden.fecha_inicio).toLocaleString('es-ES')}</p>
                </div>
              )}
              {selectedOrden.fecha_fin && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha Fin</p>
                  <p className="text-sm">{new Date(selectedOrden.fecha_fin).toLocaleString('es-ES')}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Creado</p>
                <p className="text-sm">{selectedOrden.created_at ? new Date(selectedOrden.created_at).toLocaleString('es-ES') : '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Descripción del Trabajo</p>
                <p className="text-sm">{selectedOrden.descripcion_trabajo || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
                <p className="text-sm whitespace-pre-wrap">{selectedOrden.observaciones || '-'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
