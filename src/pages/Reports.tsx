import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ReportPeriodSelector } from "@/components/reports/ReportPeriodSelector";
import { ConsolidatedKPIs } from "@/components/reports/ConsolidatedKPIs";
import { ExportPanel } from "@/components/reports/ExportPanel";
import { TrendAnalysis } from "@/components/reports/TrendAnalysis";
import { AdvancedFilters } from "@/components/reports/AdvancedFilters";
import { PredictiveMaintenance } from "@/components/reports/PredictiveMaintenance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [filters, setFilters] = useState({
    area: "",
    equipment: "",
    criticality: "",
    resource: "",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Sistema de Gestión de Mantenimiento Eléctrico" showNavigation />
      
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Reportes y Analytics</h2>
            <p className="text-muted-foreground">
              Análisis consolidado, tendencias y exportación de datos
            </p>
          </div>
          <ExportPanel period={selectedPeriod} filters={filters} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <ReportPeriodSelector
              selected={selectedPeriod}
              onSelect={setSelectedPeriod}
            />
            <AdvancedFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          <div className="space-y-6">
            <ConsolidatedKPIs period={selectedPeriod} filters={filters} />

            <Tabs defaultValue="trends" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="trends">Análisis de Tendencias</TabsTrigger>
                <TabsTrigger value="predictive">Mantenimiento Predictivo</TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="space-y-4">
                <TrendAnalysis period={selectedPeriod} filters={filters} />
              </TabsContent>

              <TabsContent value="predictive" className="space-y-4">
                <PredictiveMaintenance filters={filters} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
