import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { PlanningStats } from "@/components/maintenance/PlanningStats";
import { PlanList } from "@/components/maintenance/PlanList";
import { PlanForm } from "@/components/maintenance/PlanForm";
import { AnnualPlanUpload } from "@/components/maintenance/AnnualPlanUpload";
import { Plus, Download, FileSpreadsheet, User, Clock, Globe, Timer, Trash2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
import Papa from "papaparse";

interface LastUploadInfo {
  id: string;
  fecha_hora: string;
  usuario: string;
  ip_carga: string | null;
  duracion_carga_ms: number | null;
  total_filas_validas: number;
  nombre_archivo: string;
}

export default function Planning() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [lastUpload, setLastUpload] = useState<LastUploadInfo | null>(null);
  const [loadingUploadInfo, setLoadingUploadInfo] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalOrdenes, setTotalOrdenes] = useState(0);

  useEffect(() => {
    fetchLastUploadInfo();
    fetchTotalOrdenes();
  }, [isUploadOpen, refreshKey]);

  const fetchLastUploadInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('plan_anual_logs')
        .select('*')
        .order('fecha_hora', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching upload info:', error);
      }

      if (data) {
        setLastUpload({
          id: data.id,
          fecha_hora: data.fecha_hora || '',
          usuario: data.usuario || 'Sistema',
          ip_carga: (data as any).ip_carga || null,
          duracion_carga_ms: (data as any).duracion_carga_ms || null,
          total_filas_validas: data.total_filas_validas,
          nombre_archivo: data.nombre_archivo
        });
      } else {
        setLastUpload(null);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingUploadInfo(false);
    }
  };

  const fetchTotalOrdenes = async () => {
    try {
      const { count, error } = await supabase
        .from('ordenes_trabajo')
        .select('*', { count: 'exact', head: true });

      if (!error && count !== null) {
        setTotalOrdenes(count);
      }
    } catch (error) {
      console.error('Error fetching total:', error);
    }
  };

  const handleExport = async () => {
    try {
      const { data, error } = await supabase
        .from('ordenes_trabajo')
        .select('*')
        .order('fecha_programada', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.info('No hay órdenes de trabajo para exportar');
        return;
      }

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `ordenes_trabajo_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${data.length} órdenes exportadas correctamente`);
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Error al exportar las órdenes');
    }
  };

  const handleDeleteAllOrders = async () => {
    setIsDeleting(true);
    try {
      // Eliminar todas las órdenes de trabajo
      const { error: otError } = await supabase
        .from('ordenes_trabajo')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (otError) throw otError;

      // Eliminar los logs de carga
      const { error: logError } = await supabase
        .from('plan_anual_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (logError) {
        console.warn('Error eliminando logs:', logError);
      }

      toast.success('Todas las órdenes de trabajo han sido eliminadas');
      setLastUpload(null);
      setTotalOrdenes(0);
      setRefreshKey(prev => prev + 1);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting orders:', error);
      toast.error('Error al eliminar las órdenes de trabajo');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNewPlan = () => {
    setIsFormOpen(true);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Datos actualizados');
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Módulo de Planificación de Mantenimiento" showNavigation />
      
      <main className="flex-1 p-6 space-y-6">
        {/* Sección de Carga de Plan Anual */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  Carga de Plan Anual
                </CardTitle>
                <CardDescription>
                  Importe el plan anual de mantenimiento desde un archivo CSV
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-6">
              {/* Botón de carga - TAMAÑO AUMENTADO */}
              <Button 
                onClick={() => setIsUploadOpen(true)}
                className="h-20 px-10 text-lg font-semibold"
                size="lg"
              >
                <FileSpreadsheet className="mr-3 h-6 w-6" />
                Cargar Plan CSV
              </Button>

              {/* Info de última carga */}
              {loadingUploadInfo ? (
                <div className="text-sm text-muted-foreground">Cargando info...</div>
              ) : lastUpload ? (
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Última carga</p>
                      <p className="text-sm font-medium">{formatDateTime(lastUpload.fecha_hora)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Usuario</p>
                      <p className="text-sm font-medium">{lastUpload.usuario || 'dev_test'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">IP</p>
                      <p className="text-sm font-medium">{lastUpload.ip_carga || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duración</p>
                      <p className="text-sm font-medium">{formatDuration(lastUpload.duracion_carga_ms)}</p>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-4 flex items-center gap-2">
                    <Badge variant="secondary">{lastUpload.total_filas_validas} registros cargados</Badge>
                    <span className="text-xs text-muted-foreground">Archivo: {lastUpload.nombre_archivo}</span>
                  </div>
                </div>
              ) : (
                <div className="flex-1 p-4 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">
                    {totalOrdenes > 0 
                      ? `Hay ${totalOrdenes} órdenes de trabajo en el sistema.`
                      : "No hay cargas registradas. Cargue su primer plan anual."
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Encabezado y acciones */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Planificación de Mantenimiento</h2>
            <p className="text-muted-foreground">
              Gestiona y programa todos los planes de mantenimiento
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            {totalOrdenes > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Todo
              </Button>
            )}
            <Button size="sm" onClick={handleNewPlan}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Plan
            </Button>
          </div>
        </div>

        {/* KPIs reales */}
        <PlanningStats key={refreshKey} />
        
        {/* Lista de OT reales */}
        <PlanList key={`list-${refreshKey}`} />
      </main>

      <PlanForm open={isFormOpen} onOpenChange={setIsFormOpen} />
      <AnnualPlanUpload open={isUploadOpen} onOpenChange={setIsUploadOpen} />

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar todas las órdenes de trabajo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará TODAS las órdenes de trabajo ({totalOrdenes} registros) 
              y el historial de carga. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAllOrders}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Sí, eliminar todo'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
