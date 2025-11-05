import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Eye, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import EquipmentDetail from "./EquipmentDetail";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Equipment {
  id: string;
  nombre_equipo: string;
  tipo: string;
  marca: string;
  modelo: string;
  estado: string;
  ubicacion_fisica: string;
  responsable_asignado: string;
  proximo_mantenimiento: string;
}

interface EquipmentListProps {
  onEdit: (id: string) => void;
  refreshTrigger: number;
}

const estadoConfig = {
  operativo: { label: "Operativo", color: "bg-green-500" },
  en_reparacion: { label: "En reparación", color: "bg-yellow-500" },
  en_mantenimiento: { label: "En mantenimiento", color: "bg-yellow-500" },
  fuera_de_servicio: { label: "Fuera de servicio", color: "bg-red-500" },
  obsoleto: { label: "Obsoleto", color: "bg-gray-500" },
  dado_de_baja: { label: "Dado de baja", color: "bg-red-700" }
};

const EquipmentList = ({ onEdit, refreshTrigger }: EquipmentListProps) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipments();
  }, [refreshTrigger]);

  useEffect(() => {
    filterEquipments();
  }, [searchTerm, filterType, filterStatus, equipments]);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("equipos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEquipments(data || []);
    } catch (error: any) {
      toast.error("Error al cargar equipos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterEquipments = () => {
    let filtered = [...equipments];

    if (searchTerm) {
      filtered = filtered.filter(eq =>
        eq.nombre_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.modelo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(eq => eq.tipo === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(eq => eq.estado === filterStatus);
    }

    setFilteredEquipments(filtered);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("equipos")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      await supabase.from("equipos_logs").insert({
        equipo_id: deleteId,
        accion: "ELIMINACIÓN",
        descripcion: "Equipo eliminado del sistema"
      });

      toast.success("Equipo eliminado correctamente");
      fetchEquipments();
    } catch (error: any) {
      toast.error("Error al eliminar equipo: " + error.message);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, marca o modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="electrico">Eléctrico</SelectItem>
                <SelectItem value="mecanico">Mecánico</SelectItem>
                <SelectItem value="electronico">Electrónico</SelectItem>
                <SelectItem value="medicion">Medición</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="operativo">Operativo</SelectItem>
                <SelectItem value="en_reparacion">En reparación</SelectItem>
                <SelectItem value="en_mantenimiento">En mantenimiento</SelectItem>
                <SelectItem value="fuera_de_servicio">Fuera de servicio</SelectItem>
                <SelectItem value="obsoleto">Obsoleto</SelectItem>
                <SelectItem value="dado_de_baja">Dado de baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredEquipments.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay equipos</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "No se encontraron equipos con los filtros seleccionados"
                  : "Comienza agregando tu primer equipo"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estado</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Marca/Modelo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Próx. Mant.</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipments.map((equipment) => (
                    <TableRow key={equipment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${estadoConfig[equipment.estado as keyof typeof estadoConfig]?.color}`} />
                          <Badge variant="outline" className="text-xs">
                            {estadoConfig[equipment.estado as keyof typeof estadoConfig]?.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{equipment.nombre_equipo}</TableCell>
                      <TableCell className="capitalize">{equipment.tipo}</TableCell>
                      <TableCell>
                        {equipment.marca} {equipment.modelo}
                      </TableCell>
                      <TableCell>{equipment.ubicacion_fisica || "-"}</TableCell>
                      <TableCell>{equipment.responsable_asignado || "-"}</TableCell>
                      <TableCell>
                        {equipment.proximo_mantenimiento
                          ? new Date(equipment.proximo_mantenimiento).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDetailId(equipment.id)}
                            title="Ver detalle"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(equipment.id)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(equipment.id)}
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
            </div>
          )}
        </div>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El equipo y su historial serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle del Equipo</DialogTitle>
          </DialogHeader>
          {detailId && <EquipmentDetail equipmentId={detailId} onClose={() => setDetailId(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EquipmentList;
