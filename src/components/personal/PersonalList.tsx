import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PersonalForm } from "./PersonalForm";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Users,
} from "lucide-react";
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

interface Personal {
  id: string;
  nombre_completo: string;
  cargo: string | null;
  correo_electronico: string;
  telefono: string | null;
  estado: string;
  fecha_inicio_vigencia: string;
  fecha_termino_vigencia: string | null;
  empresa_proveedor: string | null;
  created_at: string;
  updated_at: string;
}

export function PersonalList() {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [filteredPersonal, setFilteredPersonal] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [showForm, setShowForm] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState<Personal | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personalToDelete, setPersonalToDelete] = useState<Personal | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPersonal();
  }, []);

  useEffect(() => {
    filterPersonal();
  }, [searchTerm, estadoFilter, personal]);

  const fetchPersonal = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("personal")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPersonal(data || []);
    } catch (error: any) {
      toast({
        title: "Error al cargar personal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPersonal = () => {
    let filtered = [...personal];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.correo_electronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.cargo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (estadoFilter !== "todos") {
      filtered = filtered.filter((p) => p.estado === estadoFilter);
    }

    setFilteredPersonal(filtered);
  };

  const handleDelete = async () => {
    if (!personalToDelete) return;

    try {
      const { error } = await supabase
        .from("personal")
        .delete()
        .eq("id", personalToDelete.id);

      if (error) throw error;

      toast({
        title: "Personal eliminado",
        description: "El registro ha sido eliminado correctamente",
      });

      fetchPersonal();
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPersonalToDelete(null);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      activo: <Badge className="bg-success text-success-foreground">Activo</Badge>,
      inactivo: <Badge variant="secondary">Inactivo</Badge>,
      suspendido: <Badge className="bg-warning text-warning-foreground">Suspendido</Badge>,
      vencido: <Badge variant="destructive">Vencido</Badge>,
    };
    return badges[estado as keyof typeof badges] || <Badge>{estado}</Badge>;
  };

  const isProximoVencer = (fechaTermino: string | null) => {
    if (!fechaTermino) return false;
    const hoy = new Date();
    const vencimiento = new Date(fechaTermino);
    const diasRestantes = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diasRestantes > 0 && diasRestantes <= 30;
  };

  if (showForm) {
    return (
      <PersonalForm
        personal={editingPersonal}
        onClose={() => {
          setShowForm(false);
          setEditingPersonal(null);
        }}
        onSuccess={() => {
          setShowForm(false);
          setEditingPersonal(null);
          fetchPersonal();
        }}
      />
    );
  }

  return (
    <>
      <Card className="shadow-notion">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, correo o cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="suspendido">Suspendido</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => fetchPersonal()} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Personal
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
              <p className="mt-4 text-muted-foreground">Cargando personal...</p>
            </div>
          ) : filteredPersonal.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontró personal</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Vigencia</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPersonal.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {p.nombre_completo}
                          {isProximoVencer(p.fecha_termino_vigencia) && (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{p.cargo || "-"}</TableCell>
                      <TableCell className="text-sm">{p.correo_electronico}</TableCell>
                      <TableCell>{getEstadoBadge(p.estado)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {p.fecha_termino_vigencia ? (
                            <span
                              className={
                                isProximoVencer(p.fecha_termino_vigencia)
                                  ? "text-warning font-medium"
                                  : ""
                              }
                            >
                              {new Date(p.fecha_termino_vigencia).toLocaleDateString("es-ES")}
                            </span>
                          ) : (
                            "Indefinida"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{p.empresa_proveedor || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingPersonal(p);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPersonalToDelete(p);
                              setDeleteDialogOpen(true);
                            }}
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
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el registro de {personalToDelete?.nombre_completo}. Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
