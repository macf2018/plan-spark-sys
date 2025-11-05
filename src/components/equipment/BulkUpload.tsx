import { useState, useRef } from "react";
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

type EstadoEquipo = 'operativo' | 'en_reparacion' | 'en_mantenimiento' | 'fuera_de_servicio' | 'obsoleto' | 'dado_de_baja';
type TipoEquipo = 'electrico' | 'mecanico' | 'electronico' | 'medicion' | 'otros';

interface EquipmentRow {
  nombre_equipo: string;
  tipo: TipoEquipo;
  marca?: string;
  modelo?: string;
  nro_serie?: string;
  estado: EstadoEquipo;
  ubicacion_fisica?: string;
  responsable_asignado?: string;
}

const BulkUpload = ({ onClose }: BulkUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<EquipmentRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const validStates = ['operativo', 'en_reparacion', 'en_mantenimiento', 'fuera_de_servicio', 'obsoleto', 'dado_de_baja'];

    data.forEach((row, index) => {
      if (!row.nombre_equipo?.trim()) {
        validationErrors.push(`Fila ${index + 1}: Falta nombre del equipo`);
        return;
      }

      if (!row.tipo || !validTypes.includes(row.tipo.toLowerCase())) {
        validationErrors.push(`Fila ${index + 1}: Tipo inválido. Debe ser: ${validTypes.join(', ')}`);
        return;
      }

      const estado = row.estado?.toLowerCase() || 'operativo';
      if (!validStates.includes(estado)) {
        validationErrors.push(`Fila ${index + 1}: Estado inválido`);
        return;
      }

      validRows.push({
        nombre_equipo: row.nombre_equipo.trim(),
        tipo: row.tipo.toLowerCase() as TipoEquipo,
        marca: row.marca?.trim(),
        modelo: row.modelo?.trim(),
        nro_serie: row.nro_serie?.trim(),
        estado: estado as EstadoEquipo,
        ubicacion_fisica: row.ubicacion_fisica?.trim(),
        responsable_asignado: row.responsable_asignado?.trim()
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
          <div className="mt-2 text-sm font-mono bg-muted p-2 rounded">
            nombre_equipo, tipo, marca, modelo, nro_serie, estado, ubicacion_fisica, responsable_asignado
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <p><strong>Tipos válidos:</strong> electrico, mecanico, electronico, medicion, otros</p>
            <p><strong>Estados válidos:</strong> operativo, en_reparacion, en_mantenimiento, fuera_de_servicio, obsoleto, dado_de_baja</p>
            <p><strong>Campos obligatorios:</strong> nombre_equipo, tipo</p>
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
            <ul className="mt-2 space-y-1">
              {errors.slice(0, 10).map((error, index) => (
                <li key={index} className="text-sm">• {error}</li>
              ))}
              {errors.length > 10 && (
                <li className="text-sm">• ...y {errors.length - 10} errores más</li>
              )}
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
                      <TableHead>Estado</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Responsable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.nombre_equipo}</TableCell>
                        <TableCell className="capitalize">{row.tipo}</TableCell>
                        <TableCell>{row.marca || "-"}</TableCell>
                        <TableCell>{row.modelo || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.estado}</Badge>
                        </TableCell>
                        <TableCell>{row.ubicacion_fisica || "-"}</TableCell>
                        <TableCell>{row.responsable_asignado || "-"}</TableCell>
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
