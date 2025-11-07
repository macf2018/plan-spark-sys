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
  marca_id?: string;
  modelo_id?: string;
  version_revision?: string;
  nro_serie?: string;
  anio_fabricacion?: number;
  vida_util_estimada?: number;
  fecha_ingreso: string;
  proximo_mantenimiento?: string;
  estado: EstadoEquipo;
  tramo_id?: string;
  sentido_id?: string;
  pk_id?: string;
  shelter_id?: string;
  portico_id?: string;
  ubicacion_fisica?: string;
  zona?: string;
  sala?: string;
  responsable_asignado?: string;
  proveedor_asociado?: string;
  observaciones?: string;
  fecha_inicio_estado?: string;
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
  const [marcas, setMarcas] = useState<Catalogo[]>([]);
  const [modelos, setModelos] = useState<Catalogo[]>([]);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EquipmentFormData>({
    defaultValues: {
      fecha_ingreso: new Date().toISOString().split('T')[0],
      estado: 'operativo',
      tipo: 'electrico'
    }
  });

  const selectedTipo = watch("tipo");
  const selectedEstado = watch("estado");
  const selectedMarcaId = watch("marca_id");

  const handleTipoChange = (value: string) => {
    setValue("tipo", value as TipoEquipo);
  };

  const handleEstadoChange = (value: string) => {
    setValue("estado", value as EstadoEquipo);
  };

  useEffect(() => {
    fetchCatalogos();
    if (equipmentId) {
      fetchEquipment();
    }
  }, [equipmentId]);

  useEffect(() => {
    if (selectedMarcaId) {
      fetchModelos(selectedMarcaId);
    }
  }, [selectedMarcaId]);

  const fetchCatalogos = async () => {
    try {
      const [tramosRes, sentidosRes, pksRes, sheltersRes, porticosRes, marcasRes] = await Promise.all([
        supabase.from("catalogo_tramos").select("*").eq("activo", true),
        supabase.from("catalogo_sentidos").select("*").eq("activo", true),
        supabase.from("catalogo_pks").select("*").eq("activo", true),
        supabase.from("catalogo_shelters").select("*").eq("activo", true),
        supabase.from("catalogo_porticos").select("*").eq("activo", true),
        supabase.from("catalogo_marcas").select("*").eq("activo", true),
      ]);

      if (tramosRes.data) setTramos(tramosRes.data);
      if (sentidosRes.data) setSentidos(sentidosRes.data);
      if (pksRes.data) setPks(pksRes.data);
      if (sheltersRes.data) setShelters(sheltersRes.data);
      if (porticosRes.data) setPorticos(porticosRes.data);
      if (marcasRes.data) setMarcas(marcasRes.data);
    } catch (error: any) {
      toast.error("Error al cargar catálogos");
    }
  };

  const fetchModelos = async (marcaId: string) => {
    try {
      const { data, error } = await supabase
        .from("catalogo_modelos")
        .select("*")
        .eq("marca_id", marcaId)
        .eq("activo", true);

      if (error) throw error;
      if (data) setModelos(data);
    } catch (error: any) {
      toast.error("Error al cargar modelos");
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
        if (key === 'fecha_ingreso' || key === 'proximo_mantenimiento') {
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

      // Validaciones
      if ((data.estado === 'en_reparacion' || data.estado === 'en_mantenimiento') && 
          (!data.fecha_inicio_estado || !data.tecnico_responsable_estado)) {
        toast.error("Para estados 'En reparación' o 'En mantenimiento' debe especificar fecha de inicio y técnico responsable");
        return;
      }

      if (new Date(data.fecha_ingreso) > new Date()) {
        toast.error("La fecha de ingreso no puede ser futura");
        return;
      }

      const equipmentData = {
        ...data,
        anio_fabricacion: data.anio_fabricacion ? Number(data.anio_fabricacion) : null,
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
      {(selectedEstado === 'en_reparacion' || selectedEstado === 'en_mantenimiento') && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Para este estado debe especificar fecha de inicio y técnico responsable
          </AlertDescription>
        </Alert>
      )}

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
          <Label htmlFor="marca_id">Marca *</Label>
          <Select value={watch("marca_id")} onValueChange={(value) => {
            setValue("marca_id", value);
            setValue("modelo_id", "");
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar marca" />
            </SelectTrigger>
            <SelectContent>
              {marcas.map((marca) => (
                <SelectItem key={marca.id} value={marca.id}>
                  {marca.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelo_id">Modelo *</Label>
          <Select value={watch("modelo_id")} onValueChange={(value) => setValue("modelo_id", value)} disabled={!selectedMarcaId}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar modelo" />
            </SelectTrigger>
            <SelectContent>
              {modelos.map((modelo) => (
                <SelectItem key={modelo.id} value={modelo.id}>
                  {modelo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="version_revision">Versión/Revisión</Label>
          <Input id="version_revision" {...register("version_revision")} placeholder="Ej: v2.1" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nro_serie">Número de Serie</Label>
          <Input id="nro_serie" {...register("nro_serie")} placeholder="Ej: SN123456" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="anio_fabricacion">Año de Fabricación</Label>
          <Input
            id="anio_fabricacion"
            type="number"
            {...register("anio_fabricacion")}
            placeholder="Ej: 2020"
          />
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
          <Label htmlFor="fecha_ingreso">Fecha de Ingreso *</Label>
          <Input
            id="fecha_ingreso"
            type="date"
            {...register("fecha_ingreso", { required: "Este campo es obligatorio" })}
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
          <Label htmlFor="estado">Estado *</Label>
          <Select value={selectedEstado} onValueChange={handleEstadoChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operativo">Operativo</SelectItem>
              <SelectItem value="en_reparacion">En reparación</SelectItem>
              <SelectItem value="en_mantenimiento">En mantenimiento</SelectItem>
              <SelectItem value="fuera_de_servicio">Fuera de servicio</SelectItem>
              <SelectItem value="obsoleto">Obsoleto</SelectItem>
              <SelectItem value="dado_de_baja">Dado de baja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ubicacion_fisica">Ubicación Física</Label>
          <Input id="ubicacion_fisica" {...register("ubicacion_fisica")} placeholder="Ej: Planta Norte" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zona">Zona</Label>
          <Input id="zona" {...register("zona")} placeholder="Ej: Zona A" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sala">Sala</Label>
          <Input id="sala" {...register("sala")} placeholder="Ej: Sala 101" />
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
          <Select value={watch("tramo_id")} onValueChange={(value) => setValue("tramo_id", value)}>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="sentido_id">Sentido *</Label>
          <Select value={watch("sentido_id")} onValueChange={(value) => setValue("sentido_id", value)}>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="pk_id">PK *</Label>
          <Select value={watch("pk_id")} onValueChange={(value) => setValue("pk_id", value)}>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="shelter_id">Shelter</Label>
          <Select value={watch("shelter_id") || ""} onValueChange={(value) => setValue("shelter_id", value)}>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="portico_id">Pórtico</Label>
          <Select value={watch("portico_id") || ""} onValueChange={(value) => setValue("portico_id", value)}>
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
        </div>

        {(selectedEstado === 'en_reparacion' || selectedEstado === 'en_mantenimiento') && (
          <>
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio_estado">Fecha Inicio Estado *</Label>
              <Input
                id="fecha_inicio_estado"
                type="date"
                {...register("fecha_inicio_estado")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tecnico_responsable_estado">Técnico Responsable *</Label>
              <Input
                id="tecnico_responsable_estado"
                {...register("tecnico_responsable_estado")}
                placeholder="Nombre del técnico"
              />
            </div>
          </>
        )}
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
