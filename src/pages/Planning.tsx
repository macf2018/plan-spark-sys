import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { PlanningStats } from "@/components/maintenance/PlanningStats";
import { PlanList } from "@/components/maintenance/PlanList";
import { PlanForm } from "@/components/maintenance/PlanForm";
import { AnnualPlanUpload } from "@/components/maintenance/AnnualPlanUpload";
import { Plus, Download, Upload, FileSpreadsheet, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Planning() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [lastUpload, setLastUpload] = useState<any>(null);

  useEffect(() => {
    // Cargar información de última carga
    const uploadInfo = localStorage.getItem('lastAnnualPlanUpload');
    if (uploadInfo) {
      setLastUpload(JSON.parse(uploadInfo));
    }
  }, [isUploadOpen]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Módulo de Planificación de Mantenimiento" showNavigation />
      
      <main className="flex-1 p-6 space-y-6">
        {/* Sección destacada: Carga de Plan Anual */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                  Carga de Plan Anual
                </CardTitle>
                <CardDescription>
                  Importe el plan anual de mantenimiento desde un archivo CSV
                </CardDescription>
              </div>
              <Button 
                size="icon" 
                variant="ghost"
                className="h-8 w-8"
                title="Ayuda sobre formato de archivo"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                size="lg" 
                onClick={() => setIsUploadOpen(true)}
                className="flex-1 h-14 text-base"
              >
                <FileSpreadsheet className="mr-2 h-5 w-5" />
                📂 Cargar Plan Anual
              </Button>
              {lastUpload && (
                <div className="text-sm text-muted-foreground space-y-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{lastUpload.recordCount} registros</Badge>
                  </div>
                  <p>Última carga: {lastUpload.date}</p>
                  <p className="text-xs">Usuario: {lastUpload.user}</p>
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
              Gestiona y programa todos los planes de mantenimiento eléctrico
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Plan
            </Button>
          </div>
        </div>

        <PlanningStats />
        
        <PlanList />
      </main>

      <PlanForm open={isFormOpen} onOpenChange={setIsFormOpen} />
      <AnnualPlanUpload open={isUploadOpen} onOpenChange={setIsUploadOpen} />
    </div>
  );
}
