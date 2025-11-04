import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";

interface ReportPeriodSelectorProps {
  selected: string;
  onSelect: (period: string) => void;
}

export function ReportPeriodSelector({ selected, onSelect }: ReportPeriodSelectorProps) {
  const periods = [
    { id: "daily", label: "Diario", icon: Calendar },
    { id: "weekly", label: "Semanal", icon: CalendarDays },
    { id: "monthly", label: "Mensual", icon: CalendarRange },
  ];

  return (
    <Card className="shadow-notion">
      <CardHeader>
        <CardTitle className="text-base">Período de Reporte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {periods.map((period) => (
          <Button
            key={period.id}
            variant={selected === period.id ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => onSelect(period.id)}
          >
            <period.icon className="mr-2 h-4 w-4" />
            {period.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
