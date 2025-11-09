import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import { Upload, FileText, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BulkUploadProps {
  onClose: () => void;
}

type TipoEquipo = 'electrico' | 'mecanico' | 'electronico' | 'medicion' | 'otros';

interface EquipmentRow {
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
}

interface Catalogo {
  id: string;
  nombre?: string;
  pk?: string;
}

const BulkUpload = ({ onClose }: BulkUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<EquipmentRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [tramos, setTramos] = useState<Catalogo[]>([]);
  const [sentidos, setSentidos] = useState<Catalogo[]>([]);
  const [pks, setPks] = useState<Catalogo[]>([]);
  const [shelters, setShelters] = useState<Catalogo[]>([]);
  const [porticos, setPorticos] = useState<Catalogo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCatalogos();
  }, []);

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

  const findCatalogoId = (nombre: string, catalogos: Catalogo[], tipo: string): string | null => {
    const found = catalogos.find(c => 
      (c.nombre && c.nombre.toLowerCase() === nombre.toLowerCase()) ||
      (c.pk && c.pk.toLowerCase() === nombre.toLowerCase())
    );
    return found ? found.id : null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension !== 'csv') {
      toast.error("Solo se permiten archivos CSV");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        validateAndPreview(results.data as any[]);
      },
      error: () => {
        toast.error("Error al leer el archivo CSV");
      }
    });
  };

  const validateAndPreview = (data: any[]) => {
    const validationErrors: string[] = [];
    const validRows: EquipmentRow[] = [];

    const validTypes = ['electrico', 'mecanico', 'electronico', 'medicion', 'otros'];

    data.forEach((row, index) => {
      const rowNum = index + 1;

      // Validar campos obligatorios
      if (!row.nombre_equipo?.trim()) {
        validationErrors.push(`Fila ${rowNum}: Falta nombre del equipo`);
        return;
      }

      if (!row.tipo || !validTypes.includes(row.tipo.toLowerCase())) {
        validationErrors.push(`Fila ${rowNum}: Tipo inválido. Debe ser: ${validTypes.join(', ')}`);
        return;
      }

      if (!row.marca?.trim()) {
        validationErrors.push(`Fila ${rowNum}: Falta marca`);
        return;
      }

      if (!row.modelo?.trim()) {
        validationErrors.push(`Fila ${rowNum}: Falta modelo`);
        return;
      }

      if (!row.version_revision?.trim()) {
        validationErrors.push(`Fila ${rowNum}: Falta versión/revisión`);
        return;
      }

      if (!row.nro_serie?.trim()) {
        validationErrors.push(`Fila ${rowNum}: Falta número de serie`);
        return;
      }

      if (!row.anio_fabricacion || isNaN(Number(row.anio_fabricacion))) {
        validationErrors.push(`Fila ${rowNum}: Año de fabricación inválido`);
        return;
      }

      if (!row.ubicacion_fisica?.trim()) {
        validationErrors.push(`Fila ${rowNum}: Falta ubicación física`);
        return;
      }

      if (!row.zona?.trim()) {
        validationErrors.push(`Fila ${rowNum}: Falta zona`);
        return;
      }

      if (!row.sala?.trim()) {
        validationErrors.push(`Fila ${rowNum}: Falta sala`);
        return;
      }

      // Validar y convertir referencias de catálogos
      const tramo_id = findCatalogoId(row.tramo, tramos, 'tramo');
      if (!tramo_id) {
        validationErrors.push(`Fila ${rowNum}: Tramo "${row.tramo}" no encontrado en catálogo`);
        return;
      }

      const sentido_id = findCatalogoId(row.sentido, sentidos, 'sentido');
      if (!sentido_id) {
        validationErrors.push(`Fila ${rowNum}: Sentido "${row.sentido}" no encontrado en catálogo`);
        return;
      }

      const pk_id = findCatalogoId(row.pk, pks, 'pk');
      if (!pk_id) {
        validationErrors.push(`Fila ${rowNum}: PK "${row.pk}" no encontrado en catálogo`);
        return;
      }

      const shelter_id = findCatalogoId(row.shelter, shelters, 'shelter');
      if (!shelter_id) {
        validationErrors.push(`Fila ${rowNum}: Shelter "${row.shelter}" no encontrado en catálogo`);
        return;
      }

      const portico_id = findCatalogoId(row.portico, porticos, 'pórtico');
      if (!portico_id) {
        validationErrors.push(`Fila ${rowNum}: Pórtico "${row.portico}" no encontrado en catálogo`);
        return;
      }

      validRows.push({
        nombre_equipo: row.nombre_equipo.trim(),
        tipo: row.tipo.toLowerCase() as TipoEquipo,
        marca: row.marca.trim(),
        modelo: row.modelo.trim(),
        version_revision: row.version_revision.trim(),
        nro_serie: row.nro_serie.trim(),
        anio_fabricacion: Number(row.anio_fabricacion),
        ubicacion_fisica: row.ubicacion_fisica.trim(),
        zona: row.zona.trim(),
        sala: row.sala.trim(),
        tramo_id,
        sentido_id,
        pk_id,
        shelter_id,
        portico_id,
        vida_util_estimada: row.vida_util_estimada ? Number(row.vida_util_estimada) : undefined,
        proximo_mantenimiento: row.proximo_mantenimiento?.trim() || undefined,
        responsable_asignado: row.responsable_asignado?.trim() || undefined,
        proveedor_asociado: row.proveedor_asociado?.trim() || undefined,
        observaciones: row.observaciones?.trim() || undefined,
      });
    });

    setErrors(validationErrors);
    setPreview(validRows.slice(0, 20));
  };

  const handleConfirmUpload = async () => {
    if (preview.length === 0) {
      toast.error("No hay equipos válidos para cargar");
      return;
    }

    try {
      setUploading(true);

      const { error } = await supabase
        .from("equipos")
        .insert(preview);

      if (error) throw error;

      await supabase.from("equipos_logs").insert({
        accion: "CARGA MASIVA",
        descripcion: `${preview.length} equipos cargados mediante archivo CSV`
      });

      toast.success(`${preview.length} equipos cargados correctamente`);
      onClose();
    } catch (error: any) {
      toast.error("Error al cargar equipos: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Formato requerido del archivo CSV:</strong>
          <div className="mt-2 text-sm font-mono bg-muted p-2 rounded overflow-x-auto">
            nombre_equipo,tipo,marca,modelo,version_revision,nro_serie,anio_fabricacion,ubicacion_fisica,zona,sala,tramo,sentido,pk,shelter,portico,vida_util_estimada,proximo_mantenimiento,responsable_asignado,proveedor_asociado,observaciones
          </div>
          <div className="mt-3 space-y-1 text-sm">
            <p><strong>Tipos válidos:</strong> electrico, mecanico, electronico, medicion, otros</p>
            <p><strong>Campos obligatorios:</strong> nombre_equipo, tipo, marca, modelo, version_revision, nro_serie, anio_fabricacion, ubicacion_fisica, zona, sala, tramo, sentido, pk, shelter, portico</p>
            <p><strong>Campos opcionales:</strong> vida_util_estimada, proximo_mantenimiento, responsable_asignado, proveedor_asociado, observaciones</p>
            <p className="text-muted-foreground"><strong>Nota:</strong> Los campos fecha_ingreso, estado, id, created_at, updated_at se asignan automáticamente por el sistema.</p>
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="font-semibold mb-1">Cargar archivo CSV</h3>
              <p className="text-sm text-muted-foreground">
                Arrastra y suelta o haz clic para seleccionar
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Seleccionar Archivo CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Errores de validación encontrados:</strong>
            <ul className="mt-2 space-y-1 max-h-60 overflow-y-auto">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">• {error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {preview.length > 0 && (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">Vista Previa</h3>
                  <Badge variant="outline">{preview.length} equipos válidos</Badge>
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>N° Serie</TableHead>
                      <TableHead>Año Fab.</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Zona</TableHead>
                      <TableHead>Sala</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.nombre_equipo}</TableCell>
                        <TableCell className="capitalize">{row.tipo}</TableCell>
                        <TableCell>{row.marca}</TableCell>
                        <TableCell>{row.modelo}</TableCell>
                        <TableCell>{row.nro_serie}</TableCell>
                        <TableCell>{row.anio_fabricacion}</TableCell>
                        <TableCell>{row.ubicacion_fisica}</TableCell>
                        <TableCell>{row.zona}</TableCell>
                        <TableCell>{row.sala}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmUpload} disabled={uploading || errors.length > 0}>
              {uploading ? "Cargando..." : `Confirmar Carga de ${preview.length} Equipos`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default BulkUpload;
