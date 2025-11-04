import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface AdvancedFiltersProps {
  filters: {
    area: string;
    equipment: string;
    criticality: string;
    resource: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function AdvancedFilters({ filters, onFiltersChange }: AdvancedFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      area: "",
      equipment: "",
      criticality: "",
      resource: "",
    });
  };

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="shadow-notion">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Filtros Avanzados</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Área</Label>
          <Select value={filters.area} onValueChange={(v) => updateFilter("area", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las áreas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="produccion">Producción</SelectItem>
              <SelectItem value="distribucion">Distribución</SelectItem>
              <SelectItem value="subestacion">Subestación</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Equipo</Label>
          <Select value={filters.equipment} onValueChange={(v) => updateFilter("equipment", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los equipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="transformador">Transformador</SelectItem>
              <SelectItem value="generador">Generador</SelectItem>
              <SelectItem value="tablero">Tablero Eléctrico</SelectItem>
              <SelectItem value="ups">UPS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Criticidad</Label>
          <Select value={filters.criticality} onValueChange={(v) => updateFilter("criticality", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Recurso</Label>
          <Select value={filters.resource} onValueChange={(v) => updateFilter("resource", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="tecnico">Técnico</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="ingeniero">Ingeniero</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
