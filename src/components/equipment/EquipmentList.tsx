import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Trash2, Search, Download, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Equipment {
  id: string;
  nombre_equipo: string;
  tipo: string;
  estado: string;
  responsable_asignado?: string;
  proximo_mantenimiento?: string;
  updated_at?: string;
  tramo_id?: string;
  sentido_id?: string;
  pk_id?: string;
  catalogo_tramos?: { nombre: string };
  catalogo_sentidos?: { nombre: string };
  catalogo_pks?: { pk: string };
  anio_fabricacion?: number;
  catalogo_marcas?: { nombre: string };
}

interface EquipmentListProps {
  onEdit: (id: string) => void;
  refreshTrigger: number;
}

const EquipmentList = ({ onEdit, refreshTrigger }: EquipmentListProps) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [filterTramo, setFilterTramo] = useState<string>("all");
  const [filterSentido, setFilterSentido] = useState<string>("all");
  const [filterPk, setFilterPk] = useState<string>("all");
  const [filterMarca, setFilterMarca] = useState<string>("all");
  const [filterAnio, setFilterAnio] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(null);
  const [tramos, setTramos] = useState<any[]>([]);
  const [sentidos, setSentidos] = useState<any[]>([]);
  const [pks, setPks] = useState<any[]>([]);
  const [marcas, setMarcas] = useState<any[]>([]);
  const [anios, setAnios] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipments();
    fetchCatalogos();
  }, [refreshTrigger]);

  const fetchCatalogos = async () => {
    try {
      const [tramosRes, sentidosRes, pksRes, marcasRes] = await Promise.all([
        supabase.from("catalogo_tramos").select("*").eq("activo", true),
        supabase.from("catalogo_sentidos").select("*").eq("activo", true),
        supabase.from("catalogo_pks").select("*").eq("activo", true),
        supabase.from("catalogo_marcas").select("*").eq("activo", true),
      ]);

      if (tramosRes.data) setTramos(tramosRes.data);
      if (sentidosRes.data) setSentidos(sentidosRes.data);
      if (pksRes.data) setPks(pksRes.data);
      if (marcasRes.data) setMarcas(marcasRes.data);

      // Obtener años únicos de equipos
      const { data: equiposData } = await supabase
        .from("equipos")
        .select("anio_fabricacion")
        .not("anio_fabricacion", "is", null);
      
      if (equiposData) {
        const uniqueAnios = [...new Set(equiposData.map(e => e.anio_fabricacion))].filter(Boolean).sort((a, b) => (b as number) - (a as number)) as number[];
        setAnios(uniqueAnios);
      }
    } catch (error: any) {
      console.error("Error al cargar catálogos:", error);
    }
  };

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("equipos")
        .select(`
          *,
          catalogo_tramos(nombre),
          catalogo_sentidos(nombre),
          catalogo_pks(pk),
          catalogo_marcas(nombre)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEquipments(data || []);
    } catch (error: any) {
      toast.error("Error al cargar equipos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (equipment: Equipment) => {
    setEquipmentToDelete(equipment);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!equipmentToDelete) return;

    try {
      const { error } = await supabase
        .from("equipos")
        .delete()
        .eq("id", equipmentToDelete.id);

      if (error) throw error;

      await supabase.from("equipos_logs").insert({
        equipo_id: equipmentToDelete.id,
        accion: "ELIMINACIÓN",
        descripcion: `Equipo ${equipmentToDelete.nombre_equipo} eliminado del sistema`,
        tipo_log: 'auditoría'
      });

      toast.success("Equipo eliminado correctamente");
      fetchEquipments();
    } catch (error: any) {
      toast.error("Error al eliminar equipo: " + error.message);
    } finally {
      setDeleteDialogOpen(false);
      setEquipmentToDelete(null);
    }
  };

  const filteredEquipments = equipments.filter((equipment) => {
    const matchesSearch = equipment.nombre_equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "all" || equipment.tipo === filterTipo;
    const matchesEstado = filterEstado === "all" || equipment.estado === filterEstado;
    const matchesTramo = filterTramo === "all" || equipment.tramo_id === filterTramo;
    const matchesSentido = filterSentido === "all" || equipment.sentido_id === filterSentido;
    const matchesPk = filterPk === "all" || equipment.pk_id === filterPk;
    const matchesMarca = filterMarca === "all" || equipment.catalogo_marcas?.nombre === filterMarca;
    const matchesAnio = filterAnio === "all" || String(equipment.anio_fabricacion) === filterAnio;

    return matchesSearch && matchesTipo && matchesEstado && matchesTramo && matchesSentido && matchesPk && matchesMarca && matchesAnio;
  });

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "operativo":
        return "bg-green-500 hover:bg-green-600";
      case "en_mantenimiento":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "en_reparacion":
        return "bg-orange-500 hover:bg-orange-600";
      case "fuera_de_servicio":
        return "bg-red-500 hover:bg-red-600";
      case "obsoleto":
      case "dado_de_baja":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const isMaintenanceDue = (date: string | undefined) => {
    if (!date) return false;
    const daysUntil = Math.floor((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil < 30 && daysUntil >= 0;
  };

  const exportToCSV = () => {
    const headers = ["ID", "Nombre", "Tipo", "Estado", "Tramo", "Sentido", "PK", "Marca", "Año Fabricación", "Responsable", "Próximo Mantenimiento", "Actualizado"];
    const rows = filteredEquipments.map(eq => [
      eq.id,
      eq.nombre_equipo,
      eq.tipo,
      eq.estado,
      eq.catalogo_tramos?.nombre || "",
      eq.catalogo_sentidos?.nombre || "",
      eq.catalogo_pks?.pk || "",
      eq.catalogo_marcas?.nombre || "",
      eq.anio_fabricacion || "",
      eq.responsable_asignado || "",
      eq.proximo_mantenimiento || "",
      eq.updated_at ? new Date(eq.updated_at).toLocaleDateString() : ""
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `equipos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("Datos exportados correctamente");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={exportToCSV} variant="outline" size="default">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="electrico">Eléctrico</SelectItem>
                  <SelectItem value="mecanico">Mecánico</SelectItem>
                  <SelectItem value="electronico">Electrónico</SelectItem>
                  <SelectItem value="medicion">Medición</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="operativo">Operativo</SelectItem>
                  <SelectItem value="en_mantenimiento">En mantenimiento</SelectItem>
                  <SelectItem value="en_reparacion">En reparación</SelectItem>
                  <SelectItem value="fuera_de_servicio">Fuera de servicio</SelectItem>
                  <SelectItem value="obsoleto">Obsoleto</SelectItem>
                  <SelectItem value="dado_de_baja">Dado de baja</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTramo} onValueChange={setFilterTramo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tramo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {tramos.map((tramo) => (
                    <SelectItem key={tramo.id} value={tramo.id}>{tramo.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterSentido} onValueChange={setFilterSentido}>
                <SelectTrigger>
                  <SelectValue placeholder="Sentido" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {sentidos.map((sentido) => (
                    <SelectItem key={sentido.id} value={sentido.id}>{sentido.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterPk} onValueChange={setFilterPk}>
                <SelectTrigger>
                  <SelectValue placeholder="PK" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {pks.map((pk) => (
                    <SelectItem key={pk.id} value={pk.id}>{pk.pk}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterMarca} onValueChange={setFilterMarca}>
                <SelectTrigger>
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {marcas.map((marca) => (
                    <SelectItem key={marca.id} value={marca.nombre}>{marca.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterAnio} onValueChange={setFilterAnio}>
                <SelectTrigger>
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {anios.map((anio) => (
                    <SelectItem key={anio} value={String(anio)}>{anio}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Tramo</TableHead>
                    <TableHead>PK</TableHead>
                    <TableHead>Sentido</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Próx. Mant.</TableHead>
                    <TableHead>Actualizado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center text-muted-foreground">
                        No se encontraron equipos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEquipments.map((equipment) => (
                      <TableRow key={equipment.id}>
                        <TableCell className="font-mono text-xs">{equipment.id.split('-')[0]}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {equipment.nombre_equipo}
                            {isMaintenanceDue(equipment.proximo_mantenimiento) && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  Mantenimiento próximo
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{equipment.tipo}</TableCell>
                        <TableCell>
                          <Badge className={`${getEstadoBadgeColor(equipment.estado)} text-white`}>
                            {equipment.estado.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{equipment.catalogo_tramos?.nombre || "-"}</TableCell>
                        <TableCell>{equipment.catalogo_pks?.pk || "-"}</TableCell>
                        <TableCell>{equipment.catalogo_sentidos?.nombre || "-"}</TableCell>
                        <TableCell>{equipment.responsable_asignado || "-"}</TableCell>
                        <TableCell>
                          {equipment.proximo_mantenimiento ? (
                            <Tooltip>
                              <TooltipTrigger>
                                <span className={isMaintenanceDue(equipment.proximo_mantenimiento) ? "text-yellow-600 font-semibold" : ""}>
                                  {new Date(equipment.proximo_mantenimiento).toLocaleDateString()}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {Math.floor((new Date(equipment.proximo_mantenimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días restantes
                              </TooltipContent>
                            </Tooltip>
                          ) : "-"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {equipment.updated_at ? new Date(equipment.updated_at).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/equipos/${equipment.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(equipment.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(equipment)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El equipo "{equipmentToDelete?.nombre_equipo}" será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EquipmentList;
