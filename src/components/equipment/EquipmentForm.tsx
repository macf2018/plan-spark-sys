import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EquipmentFormProps {
  equipmentId: string | null;
  onClose: () => void;
}

type EstadoEquipo = 'operativo' | 'en_reparacion' | 'en_mantenimiento' | 'fuera_de_servicio' | 'obsoleto' | 'dado_de_baja';
type TipoEquipo = 'electrico' | 'mecanico' | 'electronico' | 'medicion' | 'otros';

interface EquipmentFormData {
  nombre_equipo: string;
  tipo: TipoEquipo;
  marca: string;
  modelo: string;
  version_revision: string;
  nro_serie: string;
  anio_fabricacion: number;
  ubicacion_fisica: string;
  zona: string;
  sala: string;
  tramo_id: string;
  sentido_id: string;
  pk_id: string;
  shelter_id: string;
  portico_id: string;
  vida_util_estimada?: number;
  proximo_mantenimiento?: string;
  responsable_asignado?: string;
  proveedor_asociado?: string;
  observaciones?: string;
  marca_id?: string;
  modelo_id?: string;
  tecnico_responsable_estado?: string;
}

interface Catalogo {
  id: string;
  nombre?: string;
  pk?: string;
  ubicacion?: string;
  activo: boolean;
}

const EquipmentForm = ({ equipmentId, onClose }: EquipmentFormProps) => {
  const [loading, setLoading] = useState(false);
  const [tramos, setTramos] = useState<Catalogo[]>([]);
  const [sentidos, setSentidos] = useState<Catalogo[]>([]);
  const [pks, setPks] = useState<Catalogo[]>([]);
  const [shelters, setShelters] = useState<Catalogo[]>([]);
  const [porticos, setPorticos] = useState<Catalogo[]>([]);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EquipmentFormData>({
    defaultValues: {
      tipo: 'electrico'
    }
  });

  const selectedTipo = watch("tipo");

  const handleTipoChange = (value: string) => {
    setValue("tipo", value as TipoEquipo);
  };

  useEffect(() => {
    fetchCatalogos();
    if (equipmentId) {
      fetchEquipment();
    }
  }, [equipmentId]);

  const fetchCatalogos = async () => {
    try {
      const [tramosRes, sentidosRes, pksRes, sheltersRes, porticosRes] = await Promise.all([
        supabase.from("catalogo_tramos").select("*").eq("activo", true),
        supabase.from("catalogo_sentidos").select("*").eq("activo", true),
        supabase.from("catalogo_pks").select("*").eq("activo", true),
        supabase.from("catalogo_shelters").select("*").eq("activo", true),
        supabase.from("catalogo_porticos").select("*").eq("activo", true),
      ]);

      if (tramosRes.data) setTramos(tramosRes.data);
      if (sentidosRes.data) setSentidos(sentidosRes.data);
      if (pksRes.data) setPks(pksRes.data);
      if (sheltersRes.data) setShelters(sheltersRes.data);
      if (porticosRes.data) setPorticos(porticosRes.data);
    } catch (error: any) {
      toast.error("Error al cargar catálogos");
    }
  };

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from("equipos")
        .select("*")
        .eq("id", equipmentId)
        .single();

      if (error) throw error;

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'proximo_mantenimiento') {
          setValue(key as any, value ? new Date(value).toISOString().split('T')[0] : '');
        } else {
          setValue(key as any, value);
        }
      });
    } catch (error: any) {
      toast.error("Error al cargar equipo: " + error.message);
    }
  };

  const onSubmit = async (data: EquipmentFormData) => {
    try {
      setLoading(true);

      const equipmentData = {
        ...data,
        anio_fabricacion: Number(data.anio_fabricacion),
        vida_util_estimada: data.vida_util_estimada ? Number(data.vida_util_estimada) : null,
      };

      if (equipmentId) {
        const { error } = await supabase
          .from("equipos")
          .update(equipmentData)
          .eq("id", equipmentId);

        if (error) throw error;

        await supabase.from("equipos_logs").insert({
          equipo_id: equipmentId,
          accion: "ACTUALIZACIÓN",
          descripcion: `Equipo ${data.nombre_equipo} actualizado`,
          tipo_log: 'auditoría'
        });

        toast.success("Equipo actualizado correctamente");
      } else {
        const { error } = await supabase
          .from("equipos")
          .insert(equipmentData);

        if (error) throw error;

        toast.success("Equipo creado correctamente");
      }

      onClose();
    } catch (error: any) {
      toast.error("Error al guardar equipo: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre_equipo">Nombre del Equipo *</Label>
          <Input
            id="nombre_equipo"
            {...register("nombre_equipo", { required: "Este campo es obligatorio" })}
            placeholder="Ej: Transformador Principal"
          />
          {errors.nombre_equipo && (
            <p className="text-sm text-destructive">{errors.nombre_equipo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo *</Label>
          <Select value={selectedTipo} onValueChange={handleTipoChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electrico">Eléctrico</SelectItem>
              <SelectItem value="mecanico">Mecánico</SelectItem>
              <SelectItem value="electronico">Electrónico</SelectItem>
              <SelectItem value="medicion">Medición</SelectItem>
              <SelectItem value="otros">Otros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="marca">Marca *</Label>
          <Input
            id="marca"
            {...register("marca", { required: "Este campo es obligatorio" })}
            placeholder="Ej: ABB, Siemens, Schneider"
          />
          {errors.marca && (
            <p className="text-sm text-destructive">{errors.marca.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo *</Label>
          <Input
            id="modelo"
            {...register("modelo", { required: "Este campo es obligatorio" })}
            placeholder="Ej: T-500, XR-3000"
          />
          {errors.modelo && (
            <p className="text-sm text-destructive">{errors.modelo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="version_revision">Versión/Revisión *</Label>
          <Input
            id="version_revision"
            {...register("version_revision", { required: "Este campo es obligatorio" })}
            placeholder="Ej: v2.1, Rev.A"
          />
          {errors.version_revision && (
            <p className="text-sm text-destructive">{errors.version_revision.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nro_serie">Número de Serie *</Label>
          <Input
            id="nro_serie"
            {...register("nro_serie", { required: "Este campo es obligatorio" })}
            placeholder="Ej: SN123456"
          />
          {errors.nro_serie && (
            <p className="text-sm text-destructive">{errors.nro_serie.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="anio_fabricacion">Año de Fabricación *</Label>
          <Input
            id="anio_fabricacion"
            type="number"
            {...register("anio_fabricacion", { required: "Este campo es obligatorio" })}
            placeholder="Ej: 2020"
          />
          {errors.anio_fabricacion && (
            <p className="text-sm text-destructive">{errors.anio_fabricacion.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vida_util_estimada">Vida Útil Estimada (años)</Label>
          <Input
            id="vida_util_estimada"
            type="number"
            {...register("vida_util_estimada")}
            placeholder="Ej: 10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ubicacion_fisica">Ubicación Física *</Label>
          <Input
            id="ubicacion_fisica"
            {...register("ubicacion_fisica", { required: "Este campo es obligatorio" })}
            placeholder="Ej: Planta Norte, Sector B"
          />
          {errors.ubicacion_fisica && (
            <p className="text-sm text-destructive">{errors.ubicacion_fisica.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zona">Zona *</Label>
          <Input
            id="zona"
            {...register("zona", { required: "Este campo es obligatorio" })}
            placeholder="Ej: Zona A, Zona Industrial"
          />
          {errors.zona && (
            <p className="text-sm text-destructive">{errors.zona.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sala">Sala *</Label>
          <Input
            id="sala"
            {...register("sala", { required: "Este campo es obligatorio" })}
            placeholder="Ej: Sala 101, Subestación 3"
          />
          {errors.sala && (
            <p className="text-sm text-destructive">{errors.sala.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vida_util_estimada">Vida Útil Estimada (años)</Label>
          <Input
            id="vida_util_estimada"
            type="number"
            {...register("vida_util_estimada")}
            placeholder="Ej: 10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proximo_mantenimiento">Próximo Mantenimiento</Label>
          <Input
            id="proximo_mantenimiento"
            type="date"
            {...register("proximo_mantenimiento")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsable_asignado">Responsable Asignado</Label>
          <Input id="responsable_asignado" {...register("responsable_asignado")} placeholder="Ej: Juan Pérez" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proveedor_asociado">Proveedor Asociado</Label>
          <Input id="proveedor_asociado" {...register("proveedor_asociado")} placeholder="Ej: Proveedora XYZ" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tramo_id">Tramo *</Label>
          <Select
            value={watch("tramo_id")}
            onValueChange={(value) => setValue("tramo_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tramo" />
            </SelectTrigger>
            <SelectContent>
              {tramos.map((tramo) => (
                <SelectItem key={tramo.id} value={tramo.id}>
                  {tramo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tramo_id && (
            <p className="text-sm text-destructive">{errors.tramo_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sentido_id">Sentido *</Label>
          <Select
            value={watch("sentido_id")}
            onValueChange={(value) => setValue("sentido_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar sentido" />
            </SelectTrigger>
            <SelectContent>
              {sentidos.map((sentido) => (
                <SelectItem key={sentido.id} value={sentido.id}>
                  {sentido.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.sentido_id && (
            <p className="text-sm text-destructive">{errors.sentido_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pk_id">PK *</Label>
          <Select
            value={watch("pk_id")}
            onValueChange={(value) => setValue("pk_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar PK" />
            </SelectTrigger>
            <SelectContent>
              {pks.map((pk) => (
                <SelectItem key={pk.id} value={pk.id}>
                  {pk.pk}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.pk_id && (
            <p className="text-sm text-destructive">{errors.pk_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shelter_id">Shelter *</Label>
          <Select
            value={watch("shelter_id")}
            onValueChange={(value) => setValue("shelter_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar shelter" />
            </SelectTrigger>
            <SelectContent>
              {shelters.map((shelter) => (
                <SelectItem key={shelter.id} value={shelter.id}>
                  {shelter.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.shelter_id && (
            <p className="text-sm text-destructive">{errors.shelter_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="portico_id">Pórtico *</Label>
          <Select
            value={watch("portico_id")}
            onValueChange={(value) => setValue("portico_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar pórtico" />
            </SelectTrigger>
            <SelectContent>
              {porticos.map((portico) => (
                <SelectItem key={portico.id} value={portico.id}>
                  {portico.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.portico_id && (
            <p className="text-sm text-destructive">{errors.portico_id.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          {...register("observaciones")}
          placeholder="Información adicional sobre el equipo..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : equipmentId ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  );
};

export default EquipmentForm;
