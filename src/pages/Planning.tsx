import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { PlanningStats } from "@/components/maintenance/PlanningStats";
import { PlanList } from "@/components/maintenance/PlanList";
import { PlanForm } from "@/components/maintenance/PlanForm";
import { Plus, Download, Upload } from "lucide-react";

export default function Planning() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Módulo de Planificación de Mantenimiento" showNavigation />
      
      <main className="flex-1 p-6 space-y-6">
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
    </div>
  );
}
