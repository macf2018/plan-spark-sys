import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

interface TrendAnalysisProps {
  period: string;
  filters: any;
}

export function TrendAnalysis({ period, filters }: TrendAnalysisProps) {
  const efficiencyData = [
    { month: "Ene", eficiencia: 82, cumplimiento: 88 },
    { month: "Feb", eficiencia: 85, cumplimiento: 90 },
    { month: "Mar", eficiencia: 83, cumplimiento: 87 },
    { month: "Abr", eficiencia: 87, cumplimiento: 92 },
    { month: "May", eficiencia: 89, cumplimiento: 94 },
    { month: "Jun", eficiencia: 91, cumplimiento: 95 },
  ];

  const maintenanceData = [
    { month: "Ene", preventivo: 45, correctivo: 12, predictivo: 8 },
    { month: "Feb", preventivo: 48, correctivo: 10, predictivo: 9 },
    { month: "Mar", preventivo: 50, correctivo: 11, predictivo: 10 },
    { month: "Abr", preventivo: 52, correctivo: 9, predictivo: 12 },
    { month: "May", preventivo: 55, correctivo: 8, predictivo: 14 },
    { month: "Jun", preventivo: 58, correctivo: 7, predictivo: 15 },
  ];

  const chartConfig = {
    eficiencia: { label: "Eficiencia", color: "hsl(var(--primary))" },
    cumplimiento: { label: "Cumplimiento", color: "hsl(var(--success))" },
    preventivo: { label: "Preventivo", color: "hsl(var(--primary))" },
    correctivo: { label: "Correctivo", color: "hsl(var(--destructive))" },
    predictivo: { label: "Predictivo", color: "hsl(var(--success))" },
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-notion">
        <CardHeader>
          <CardTitle>Tendencia de Eficiencia y Cumplimiento</CardTitle>
          <CardDescription>
            Evolución de indicadores clave en los últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="eficiencia"
                  stroke="var(--color-eficiencia)"
                  strokeWidth={2}
                  name="Eficiencia %"
                />
                <Line
                  type="monotone"
                  dataKey="cumplimiento"
                  stroke="var(--color-cumplimiento)"
                  strokeWidth={2}
                  name="Cumplimiento %"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-notion">
        <CardHeader>
          <CardTitle>Distribución de Mantenimientos</CardTitle>
          <CardDescription>
            Comparación entre tipos de mantenimiento realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="preventivo" fill="var(--color-preventivo)" name="Preventivo" />
                <Bar dataKey="correctivo" fill="var(--color-correctivo)" name="Correctivo" />
                <Bar dataKey="predictivo" fill="var(--color-predictivo)" name="Predictivo" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
