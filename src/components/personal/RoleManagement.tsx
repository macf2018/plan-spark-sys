import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Shield } from "lucide-react";
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

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  fecha_asignacion: string;
  personal?: {
    nombre_completo: string;
    correo_electronico: string;
  };
}

interface Personal {
  id: string;
  user_id: string | null;
  nombre_completo: string;
  correo_electronico: string;
}

const ROLES = [
  { value: "administrador_general", label: "Administrador General", color: "bg-destructive" },
  { value: "supervisor_tecnico", label: "Supervisor Técnico", color: "bg-primary" },
  { value: "operador_tecnico", label: "Operador Técnico", color: "bg-accent" },
  { value: "proveedor_contratista", label: "Proveedor/Contratista", color: "bg-secondary" },
  { value: "jefatura_gerencia", label: "Jefatura/Gerencia", color: "bg-warning" },
  { value: "usuario_proceso_sistema", label: "Usuario Proceso y Sistema", color: "bg-success" },
  { value: "usuario_tecnologia", label: "Usuario Tecnología", color: "bg-info" },
  { value: "invitado", label: "Invitado", color: "bg-muted" },
];

export function RoleManagement() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersonal, setSelectedPersonal] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<UserRole | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch user roles with personal info
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select(`
          id,
          user_id,
          role,
          fecha_asignacion
        `)
        .order("fecha_asignacion", { ascending: false });

      if (rolesError) throw rolesError;

      // Fetch personal data
      const { data: personalData, error: personalError } = await supabase
        .from("personal")
        .select("id, user_id, nombre_completo, correo_electronico")
        .not("user_id", "is", null);

      if (personalError) throw personalError;

      // Match roles with personal data
      const rolesWithPersonal = rolesData?.map((role) => {
        const person = personalData?.find((p) => p.user_id === role.user_id);
        return {
          ...role,
          personal: person
            ? {
                nombre_completo: person.nombre_completo,
                correo_electronico: person.correo_electronico,
              }
            : undefined,
        };
      });

      setUserRoles(rolesWithPersonal || []);
      setPersonal(personalData || []);
    } catch (error: any) {
      toast({
        title: "Error al cargar roles",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedPersonal || !selectedRole) {
      toast({
        title: "Campos requeridos",
        description: "Debe seleccionar un usuario y un rol",
        variant: "destructive",
      });
      return;
    }

    try {
      const person = personal.find((p) => p.id === selectedPersonal);
      if (!person?.user_id) {
        toast({
          title: "Error",
          description: "El personal seleccionado no tiene usuario asociado",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("user_roles").insert([
        {
          user_id: person.user_id,
          role: selectedRole as any,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Rol asignado",
        description: "El rol se asignó correctamente",
      });

      setSelectedPersonal("");
      setSelectedRole("");
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error al asignar rol",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      const { error } = await supabase.from("user_roles").delete().eq("id", roleToDelete.id);

      if (error) throw error;

      toast({
        title: "Rol eliminado",
        description: "El rol se eliminó correctamente",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error al eliminar rol",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const getRoleLabel = (role: string) => {
    return ROLES.find((r) => r.value === role)?.label || role;
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = ROLES.find((r) => r.value === role);
    return (
      <Badge className={roleConfig?.color || "bg-muted"}>
        <Shield className="h-3 w-3 mr-1" />
        {roleConfig?.label || role}
      </Badge>
    );
  };

  return (
    <>
      <Card className="shadow-notion">
        <CardHeader>
          <CardTitle>Asignar Roles a Usuarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={selectedPersonal} onValueChange={setSelectedPersonal}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar personal" />
              </SelectTrigger>
              <SelectContent>
                {personal.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nombre_completo} - {p.correo_electronico}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleAssignRole} className="gap-2">
              <Plus className="h-4 w-4" />
              Asignar Rol
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-notion">
        <CardHeader>
          <CardTitle>Roles Asignados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
            </div>
          ) : userRoles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay roles asignados</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Fecha Asignación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRoles.map((ur) => (
                    <TableRow key={ur.id}>
                      <TableCell className="font-medium">
                        {ur.personal?.nombre_completo || "Usuario sin perfil"}
                      </TableCell>
                      <TableCell>{ur.personal?.correo_electronico || "-"}</TableCell>
                      <TableCell>{getRoleBadge(ur.role)}</TableCell>
                      <TableCell>
                        {new Date(ur.fecha_asignacion).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setRoleToDelete(ur);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
            <AlertDialogTitle>¿Eliminar rol?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el rol "{getRoleLabel(roleToDelete?.role || "")}" del usuario{" "}
              {roleToDelete?.personal?.nombre_completo}. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-destructive">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
