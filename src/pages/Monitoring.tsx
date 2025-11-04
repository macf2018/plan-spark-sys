import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { KPICards } from "@/components/monitoring/KPICards";
import { TimeComparison } from "@/components/monitoring/TimeComparison";
import { IncidentLog } from "@/components/monitoring/IncidentLog";
import { AlertsPanel } from "@/components/monitoring/AlertsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Monitoring() {
  const [criticalAlerts, setCriticalAlerts] = useState(2);

  useEffect(() => {
    // Simular alerta automática de retraso crítico
    if (criticalAlerts > 0) {
      toast.error("¡Alertas críticas detectadas!", {
        description: `${criticalAlerts} órdenes de trabajo con retraso crítico requieren atención inmediata.`,
        duration: 5000,
      });
    }
  }, [criticalAlerts]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Módulo de Control y Seguimiento" showNavigation />
      
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Control y Seguimiento</h2>
            <p className="text-muted-foreground">
              Monitoreo en tiempo real de KPIs, eficiencia operativa y desviaciones
            </p>
          </div>
        </div>

        <KPICards />

        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparison">Comparación de Tiempos</TabsTrigger>
            <TabsTrigger value="incidents">Incidencias</TabsTrigger>
            <TabsTrigger value="alerts">Alertas Críticas</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4">
            <TimeComparison />
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            <IncidentLog />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <AlertsPanel onAlertsChange={setCriticalAlerts} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
