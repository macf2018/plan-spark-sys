import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload, FileSpreadsheet, Trash2, Info, CheckCircle2, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Papa from "papaparse";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnnualPlanUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PlanRecord {
  año: string;
  actividad: string;
  equipo: string;
  responsable: string;
  fechaInicio: string;
  fechaTermino: string;
}

export function AnnualPlanUpload({ open, onOpenChange }: AnnualPlanUploadProps) {
  const [records, setRecords] = useState<PlanRecord[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState<'all' | 'single'>('all');
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateRecord = (record: any): { isValid: boolean; errors: string[] } => {
    const validationErrors: string[] = [];
    const requiredFields = ['año', 'actividad', 'equipo', 'responsable', 'fechaInicio', 'fechaTermino'];
    
    requiredFields.forEach(field => {
      if (!record[field] || record[field].toString().trim() === '') {
        validationErrors.push(`Campo "${field}" es obligatorio`);
      }
    });

    // Validar formato de año
    if (record.año && !/^\d{4}$/.test(record.año.toString())) {
      validationErrors.push('El año debe ser un número de 4 dígitos');
    }

    // Validar formato de fechas (YYYY-MM-DD o DD/MM/YYYY)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
    if (record.fechaInicio && !dateRegex.test(record.fechaInicio)) {
      validationErrors.push('Formato de Fecha Inicio inválido (usar YYYY-MM-DD o DD/MM/YYYY)');
    }
    if (record.fechaTermino && !dateRegex.test(record.fechaTermino)) {
      validationErrors.push('Formato de Fecha Término inválido (usar YYYY-MM-DD o DD/MM/YYYY)');
    }

    return { isValid: validationErrors.length === 0, errors: validationErrors };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsValidating(true);
    setErrors([]);
    setRecords([]);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processUploadedData(results.data);
        },
        error: (error) => {
          setErrors([`Error al leer el archivo: ${error.message}`]);
          setIsValidating(false);
          toast.error("Error al procesar el archivo CSV");
        }
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      // Para Excel, mostrar mensaje de que se debe convertir a CSV
      setErrors(['Por favor, exporte el archivo Excel a formato CSV antes de cargarlo']);
      setIsValidating(false);
      toast.error("Formato no soportado", { description: "Por favor use formato CSV" });
    } else {
      setErrors(['Formato de archivo no soportado. Use CSV o Excel exportado a CSV']);
      setIsValidating(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processUploadedData = (data: any[]) => {
    const allErrors: string[] = [];
    const validRecords: PlanRecord[] = [];

    data.forEach((record, index) => {
      const { isValid, errors: recordErrors } = validateRecord(record);
      
      if (!isValid) {
        allErrors.push(`Registro ${index + 1}: ${recordErrors.join(', ')}`);
      } else {
        validRecords.push({
          año: record.año?.toString() || record.Año?.toString() || '',
          actividad: record.actividad?.toString() || record.Actividad?.toString() || '',
          equipo: record.equipo?.toString() || record.Equipo?.toString() || '',
          responsable: record.responsable?.toString() || record.Responsable?.toString() || '',
          fechaInicio: record.fechaInicio?.toString() || record['Fecha Inicio']?.toString() || record.FechaInicio?.toString() || '',
          fechaTermino: record.fechaTermino?.toString() || record['Fecha Término']?.toString() || record['Fecha Termino']?.toString() || record.FechaTermino?.toString() || '',
        });
      }
    });

    setRecords(validRecords.slice(0, 20)); // Máximo 20 para vista previa
    setErrors(allErrors.slice(0, 10)); // Mostrar máximo 10 errores
    setIsValidating(false);

    if (validRecords.length > 0) {
      toast.success(`${validRecords.length} registros válidos encontrados`);
    }
  };

  const handleConfirmUpload = () => {
    if (records.length === 0) {
      toast.error("No hay registros válidos para cargar");
      return;
    }

    // Simular guardado
    const timestamp = new Date().toLocaleString('es-ES');
    const user = "Usuario Demo";
    
    localStorage.setItem('lastAnnualPlanUpload', JSON.stringify({
      date: timestamp,
      user: user,
      recordCount: records.length
    }));

    toast.success("Plan anual cargado exitosamente", {
      description: `${records.length} registros guardados`
    });

    setRecords([]);
    setErrors([]);
    onOpenChange(false);
  };

  const handleDeleteRecord = (index: number) => {
    setDeleteIndex(index);
    setDeleteType('single');
    setShowDeleteDialog(true);
  };

  const handleDeleteAll = () => {
    setDeleteType('all');
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteType === 'all') {
      setRecords([]);
      setErrors([]);
      toast.info("Vista previa eliminada");
    } else if (deleteType === 'single' && deleteIndex !== null) {
      const newRecords = records.filter((_, i) => i !== deleteIndex);
      setRecords(newRecords);
      toast.info("Registro eliminado");
    }
    setShowDeleteDialog(false);
    setDeleteIndex(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Cargar Plan Anual de Mantenimiento
            </DialogTitle>
            <DialogDescription>
              Suba un archivo CSV con la estructura requerida
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Información de formato */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Formato requerido (CSV)</AlertTitle>
              <AlertDescription>
                <p className="text-sm mb-2">Columnas obligatorias:</p>
                <code className="text-xs bg-muted px-2 py-1 rounded block">
                  Año, Actividad, Equipo, Responsable, Fecha Inicio, Fecha Término
                </code>
                <p className="text-xs mt-2 text-muted-foreground">
                  Formatos de fecha aceptados: YYYY-MM-DD o DD/MM/YYYY
                </p>
              </AlertDescription>
            </Alert>

            {/* Botón de carga */}
            <div className="flex gap-2">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="default"
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                Seleccionar Archivo
              </Button>
              {records.length > 0 && (
                <Button 
                  onClick={handleDeleteAll}
                  variant="destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpiar Vista Previa
                </Button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Errores de validación */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Errores de validación ({errors.length})</AlertTitle>
                <AlertDescription>
                  <ScrollArea className="h-24">
                    <ul className="text-xs space-y-1">
                      {errors.map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </ScrollArea>
                </AlertDescription>
              </Alert>
            )}

            {/* Vista previa de registros */}
            {records.length > 0 && (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Vista Previa ({records.length} registros)
                  </h4>
                  <Badge variant="secondary">{records.length > 20 ? 'Mostrando primeros 20' : 'Todos los registros'}</Badge>
                </div>
                <ScrollArea className="flex-1 border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Año</TableHead>
                        <TableHead>Actividad</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Responsable</TableHead>
                        <TableHead>Fecha Inicio</TableHead>
                        <TableHead>Fecha Término</TableHead>
                        <TableHead className="w-[80px]">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{record.año}</TableCell>
                          <TableCell>{record.actividad}</TableCell>
                          <TableCell>{record.equipo}</TableCell>
                          <TableCell>{record.responsable}</TableCell>
                          <TableCell>{record.fechaInicio}</TableCell>
                          <TableCell>{record.fechaTermino}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRecord(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmUpload}
              disabled={records.length === 0 || isValidating}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirmar Carga
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === 'all' 
                ? 'Se eliminará la vista previa completa. Esta acción no se puede deshacer.'
                : 'Se eliminará este registro de la vista previa.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
