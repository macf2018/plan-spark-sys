import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileSpreadsheet, AlertCircle, Download, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Papa from "papaparse";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AnnualPlanUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PlanRecord {
  anio: string;
  mes: string;
  fecha_programada: string;
  nombre_sitio: string;
  tramo: string;
  pk: string;
  tipo_equipo: string;
  tipo_mantenimiento: string;
  frecuencia: string;
  proveedor_codigo?: string;
  proveedor_nombre?: string;
  criticidad?: string;
  ventana_horaria?: string;
  descripcion_trabajo?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
  record: any;
}

export function AnnualPlanUpload({ open, onOpenChange }: AnnualPlanUploadProps) {
  const [records, setRecords] = useState<PlanRecord[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const REQUIRED_COLUMNS = [
    'anio', 'mes', 'fecha_programada', 'nombre_sitio', 'tramo', 'pk',
    'tipo_equipo', 'tipo_mantenimiento', 'frecuencia', 'proveedor_codigo',
    'proveedor_nombre', 'criticidad', 'ventana_horaria', 'descripcion_trabajo'
  ];

  const REQUIRED_FIELDS = [
    'anio', 'mes', 'fecha_programada', 'nombre_sitio', 'tramo', 'pk',
    'tipo_equipo', 'tipo_mantenimiento', 'frecuencia'
  ];

  const validateRecord = (record: any, rowNumber: number): ValidationError[] => {
    const rowErrors: ValidationError[] = [];

    // Validar campos obligatorios
    REQUIRED_FIELDS.forEach(field => {
      if (!record[field] || record[field].toString().trim() === '') {
        rowErrors.push({
          row: rowNumber,
          field,
          message: `Campo obligatorio vacío: ${field}`,
          record
        });
      }
    });

    // Validar año
    const anio = parseInt(record.anio);
    if (record.anio && (isNaN(anio) || anio < 2020 || anio > 2050)) {
      rowErrors.push({
        row: rowNumber,
        field: 'anio',
        message: 'El año debe ser un número entre 2020 y 2050',
        record
      });
    }

    // Validar mes
    const mes = parseInt(record.mes);
    if (record.mes && (isNaN(mes) || mes < 1 || mes > 12)) {
      rowErrors.push({
        row: rowNumber,
        field: 'mes',
        message: 'El mes debe ser un número entre 1 y 12',
        record
      });
    }

    // Validar fecha_programada
    if (record.fecha_programada) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(record.fecha_programada)) {
        rowErrors.push({
          row: rowNumber,
          field: 'fecha_programada',
          message: 'La fecha debe estar en formato YYYY-MM-DD',
          record
        });
      } else {
        const [year, month] = record.fecha_programada.split('-').map(Number);
        if (anio && year !== anio) {
          rowErrors.push({
            row: rowNumber,
            field: 'fecha_programada',
            message: 'El año de la fecha no coincide con el campo año',
            record
          });
        }
        if (mes && month !== mes) {
          rowErrors.push({
            row: rowNumber,
            field: 'fecha_programada',
            message: 'El mes de la fecha no coincide con el campo mes',
            record
          });
        }
      }
    }

    return rowErrors;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error("Solo se aceptan archivos .csv");
      return;
    }

    setFileName(file.name);
    setIsValidating(true);
    setErrors([]);
    setRecords([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processUploadedData(results.data, file.name);
        setIsValidating(false);
      },
      error: (error) => {
        setErrors([{
          row: 0,
          field: 'file',
          message: `Error al procesar el archivo: ${error.message}`,
          record: {}
        }]);
        setIsValidating(false);
        toast.error("Error al procesar el archivo CSV");
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processUploadedData = (data: any[], fileName: string) => {
    // Verificar que existen todas las columnas requeridas
    if (data.length === 0) {
      setErrors([{
        row: 0,
        field: 'file',
        message: 'El archivo CSV está vacío',
        record: {}
      }]);
      toast.error("El archivo CSV está vacío");
      return;
    }

    const firstRow = data[0];
    const missingColumns = REQUIRED_COLUMNS.filter(col => !(col in firstRow));
    
    if (missingColumns.length > 0) {
      setErrors([{
        row: 0,
        field: 'columns',
        message: `Faltan columnas obligatorias: ${missingColumns.join(', ')}`,
        record: {}
      }]);
      toast.error(`Faltan columnas obligatorias en el CSV: ${missingColumns.join(', ')}`);
      return;
    }

    const validationErrors: ValidationError[] = [];
    const validRecords: PlanRecord[] = [];

    data.forEach((row, index) => {
      const rowErrors = validateRecord(row, index + 2); // +2 porque la fila 1 es el header
      
      if (rowErrors.length > 0) {
        validationErrors.push(...rowErrors);
      } else {
        validRecords.push(row as PlanRecord);
      }
    });

    setRecords(validRecords);
    setErrors(validationErrors);

    if (validRecords.length > 0) {
      toast.success(`${validRecords.length} registros válidos listos para cargar`);
    }
    
    if (validationErrors.length > 0) {
      toast.warning(`${validationErrors.length} errores encontrados en el archivo`);
    }
  };

  const handleConfirmUpload = async () => {
    if (records.length === 0) {
      toast.error("No hay registros válidos para cargar");
      return;
    }

    setIsUploading(true);
    
    try {
      // ============================================
      // TEMPORAL: Validación de usuario desactivada
      // Para revertir, descomentar el bloque siguiente
      // ============================================
      // const { data: { user } } = await supabase.auth.getUser();
      // if (!user) {
      //   toast.error("Usuario no autenticado");
      //   setIsUploading(false);
      //   return;
      // }
      // const userId = user.id;
      // const userEmail = user.email;
      // ============================================
      
      // TEMPORAL: Usuario por defecto (null para campos UUID)
      const userId = null;
      const userEmail = 'test@temporal.com';
      // ============================================

      // Insertar líneas del plan anual
      const planLineas = records.map(record => ({
        anio: parseInt(record.anio),
        mes: parseInt(record.mes),
        fecha_programada: record.fecha_programada,
        nombre_sitio: record.nombre_sitio,
        tramo: record.tramo,
        pk: record.pk,
        tipo_equipo: record.tipo_equipo,
        tipo_mantenimiento: record.tipo_mantenimiento,
        frecuencia: record.frecuencia,
        proveedor_codigo: record.proveedor_codigo || null,
        proveedor_nombre: record.proveedor_nombre || null,
        criticidad: record.criticidad || null,
        ventana_horaria: record.ventana_horaria || null,
        descripcion_trabajo: record.descripcion_trabajo || null,
        estado_plan: 'Planificado',
        usuario_carga: userId,
        origen_archivo: fileName
      }));

      const { data: insertedPlan, error: planError } = await supabase
        .from('plan_anual_lineas')
        .insert(planLineas)
        .select();

      if (planError) throw planError;

      // Generar órdenes de trabajo automáticamente
      if (insertedPlan) {
        const ordenesTrabajoData = insertedPlan.map((linea: any) => ({
          id_plan_linea: linea.id_plan_linea,
          fecha_programada: linea.fecha_programada,
          nombre_sitio: linea.nombre_sitio,
          tramo: linea.tramo,
          pk: linea.pk,
          tipo_equipo: linea.tipo_equipo,
          tipo_mantenimiento: linea.tipo_mantenimiento,
          frecuencia: linea.frecuencia,
          proveedor_codigo: linea.proveedor_codigo,
          proveedor_nombre: linea.proveedor_nombre,
          criticidad: linea.criticidad,
          ventana_horaria: linea.ventana_horaria,
          descripcion_trabajo: linea.descripcion_trabajo,
          estado: 'Planificada',
          created_by: userId  // TEMPORAL: usando userId (null)
        }));

        const { error: otError } = await supabase
          .from('ordenes_trabajo')
          .insert(ordenesTrabajoData);

        if (otError) throw otError;
      }

      // Registrar log
      await supabase.from('plan_anual_logs').insert({
        usuario: userId,  // TEMPORAL: usando userId (null)
        nombre_archivo: fileName,
        total_filas_validas: records.length,
        total_filas_error: errors.length,
        detalles_errores: errors.length > 0 ? (errors as any) : null
      } as any);

      const uploadInfo = {
        recordCount: records.length,
        date: new Date().toLocaleDateString('es-ES'),
        user: userEmail  // TEMPORAL: usando userEmail
      };
      
      localStorage.setItem('lastAnnualPlanUpload', JSON.stringify(uploadInfo));
      
      toast.success(`Plan anual cargado: ${records.length} registros y ${records.length} órdenes de trabajo generadas`);
      
      // Limpiar y cerrar
      setRecords([]);
      setErrors([]);
      setFileName("");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error al cargar plan anual:', error);
      toast.error(`Error al cargar el plan: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearPreview = () => {
    setRecords([]);
    setErrors([]);
    setFileName("");
    toast.success("Vista previa limpiada");
  };

  const downloadErrorsCSV = () => {
    if (errors.length === 0) {
      toast.info("No hay errores para descargar");
      return;
    }

    const errorRows = errors.map(err => ({
      fila: err.row,
      campo: err.field,
      error: err.message,
      ...err.record
    }));

    const csv = Papa.unparse(errorRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `errores_${fileName}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Errores descargados como CSV");
  };

  const totalRows = records.length + errors.length;
  const validCount = records.length;
  const errorCount = errors.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Carga de Plan Anual de Mantenimiento
          </DialogTitle>
          <DialogDescription>
            Importe el plan anual desde un archivo CSV con las columnas requeridas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Instrucciones */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Columnas requeridas:</strong> anio, mes, fecha_programada, nombre_sitio, tramo, pk, tipo_equipo, tipo_mantenimiento, frecuencia
              <br />
              <strong>Columnas opcionales:</strong> proveedor_codigo, proveedor_nombre, criticidad, ventana_horaria, descripcion_trabajo
            </AlertDescription>
          </Alert>

          {/* Contadores y botones */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-base">
                  Total: {totalRows}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <Badge variant="default" className="bg-green-600 text-base">
                  Válidos: {validCount}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <Badge variant="destructive" className="text-base">
                  Errores: {errorCount}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              {errorCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={downloadErrorsCSV}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar Errores
                </Button>
              )}
              {(validCount > 0 || errorCount > 0) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearPreview}
                  disabled={isValidating || isUploading}
                >
                  Limpiar Vista Previa
                </Button>
              )}
            </div>
          </div>

          {/* Input de archivo */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isValidating || isUploading}
            size="lg"
            className="w-full"
          >
            <FileSpreadsheet className="mr-2 h-5 w-5" />
            {isValidating ? "Validando archivo..." : "Seleccionar archivo CSV"}
          </Button>

          {/* Errores detallados */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Errores encontrados ({errors.length}):</strong>
                <ScrollArea className="h-40 mt-2">
                  <div className="space-y-2 text-sm">
                    {errors.map((error, i) => (
                      <div key={i} className="border-l-2 border-destructive pl-3 py-1">
                        <div className="font-semibold">Fila {error.row} - Campo: {error.field}</div>
                        <div className="text-muted-foreground">{error.message}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </AlertDescription>
            </Alert>
          )}

          {/* Tabla de preview */}
          {records.length > 0 && (
            <div className="border rounded-lg">
              <div className="p-3 bg-muted">
                <span className="font-semibold">Vista Previa de Registros Válidos</span>
              </div>
              
              <ScrollArea className="h-[350px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Fecha</TableHead>
                      <TableHead>Sitio</TableHead>
                      <TableHead className="w-20">PK</TableHead>
                      <TableHead>Tramo</TableHead>
                      <TableHead>Tipo Mant.</TableHead>
                      <TableHead>Frecuencia</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead className="w-24">Criticidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs">{record.fecha_programada}</TableCell>
                        <TableCell className="font-medium">{record.nombre_sitio}</TableCell>
                        <TableCell>{record.pk}</TableCell>
                        <TableCell>{record.tramo}</TableCell>
                        <TableCell>{record.tipo_mantenimiento}</TableCell>
                        <TableCell>{record.frecuencia}</TableCell>
                        <TableCell>{record.proveedor_nombre || '-'}</TableCell>
                        <TableCell>
                          {record.criticidad ? (
                            <Badge variant={
                              record.criticidad.toLowerCase() === 'alta' ? 'destructive' :
                              record.criticidad.toLowerCase() === 'media' ? 'default' : 'secondary'
                            }>
                              {record.criticidad}
                            </Badge>
                          ) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmUpload}
            disabled={records.length === 0 || isValidating || isUploading}
          >
            {isUploading ? "Cargando..." : `Confirmar Carga del Plan (${validCount} registros)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
