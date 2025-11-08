import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  nombre_completo: z.string().min(3, "Nombre debe tener al menos 3 caracteres").max(100),
  cargo: z.string().optional(),
  correo_electronico: z.string().email("Correo electrónico inválido").max(255),
  telefono: z.string().optional(),
  estado: z.enum(["activo", "inactivo", "suspendido", "vencido"]),
  fecha_inicio_vigencia: z.string(),
  fecha_termino_vigencia: z.string().optional(),
  empresa_proveedor: z.string().optional(),
  observaciones: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PersonalFormProps {
  personal?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function PersonalForm({ personal, onClose, onSuccess }: PersonalFormProps) {
  const { toast } = useToast();
  const isEditing = !!personal;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre_completo: "",
      cargo: "",
      correo_electronico: "",
      telefono: "",
      estado: "activo",
      fecha_inicio_vigencia: new Date().toISOString().split("T")[0],
      fecha_termino_vigencia: "",
      empresa_proveedor: "",
      observaciones: "",
    },
  });

  useEffect(() => {
    if (personal) {
      form.reset({
        nombre_completo: personal.nombre_completo,
        cargo: personal.cargo || "",
        correo_electronico: personal.correo_electronico,
        telefono: personal.telefono || "",
        estado: personal.estado,
        fecha_inicio_vigencia: personal.fecha_inicio_vigencia,
        fecha_termino_vigencia: personal.fecha_termino_vigencia || "",
        empresa_proveedor: personal.empresa_proveedor || "",
        observaciones: personal.observaciones || "",
      });
    }
  }, [personal, form]);

  const onSubmit = async (data: FormData) => {
    try {
      // Validar fechas
      if (data.fecha_termino_vigencia && data.fecha_inicio_vigencia) {
        if (new Date(data.fecha_termino_vigencia) < new Date(data.fecha_inicio_vigencia)) {
          toast({
            title: "Error de validación",
            description: "La fecha de término no puede ser anterior a la fecha de inicio",
            variant: "destructive",
          });
          return;
        }
      }

      const payload = {
        nombre_completo: data.nombre_completo,
        cargo: data.cargo || null,
        correo_electronico: data.correo_electronico,
        telefono: data.telefono || null,
        estado: data.estado,
        fecha_inicio_vigencia: data.fecha_inicio_vigencia,
        fecha_termino_vigencia: data.fecha_termino_vigencia || null,
        empresa_proveedor: data.empresa_proveedor || null,
        observaciones: data.observaciones || null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("personal")
          .update(payload)
          .eq("id", personal.id);

        if (error) throw error;

        toast({
          title: "Personal actualizado",
          description: "Los datos se actualizaron correctamente",
        });
      } else {
        const { error } = await supabase.from("personal").insert([payload]);

        if (error) throw error;

        toast({
          title: "Personal creado",
          description: "El nuevo registro se creó correctamente",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-notion">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>{isEditing ? "Editar Personal" : "Nuevo Personal"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nombre_completo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez García" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input placeholder="Técnico Eléctrico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="correo_electronico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="correo@empresa.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+56 9 1234 5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="suspendido">Suspendido</SelectItem>
                        <SelectItem value="vencido">Vencido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="empresa_proveedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa / Proveedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Empresa Contratista S.A." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fecha_inicio_vigencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Inicio Vigencia *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fecha_termino_vigencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Término Vigencia</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>Dejar vacío para vigencia indefinida</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales sobre el personal..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">{isEditing ? "Actualizar" : "Crear"} Personal</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
