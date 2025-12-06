import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PlanningStatsData {
  total: number;
  pendientes: number;
  activos: number;
  completados: number;
  atrasados: number;
}

export function PlanningStats() {
  const [stats, setStats] = useState<PlanningStatsData>({
    total: 0,
    pendientes: 0,
    activos: 0,
    completados: 0,
    atrasados: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Obtener todas las OT para calcular KPIs reales
      const { data: ordenes, error } = await supabase
        .from('ordenes_trabajo')
        .select('estado, fecha_programada');

      if (error) throw error;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const calculatedStats = {
        total: ordenes?.length || 0,
        pendientes: 0,
        activos: 0,
        completados: 0,
        atrasados: 0
      };

      ordenes?.forEach(orden => {
        const fechaProgramada = new Date(orden.fecha_programada);
        fechaProgramada.setHours(0, 0, 0, 0);
        
        const estadoLower = orden.estado?.toLowerCase() || 'planificada';
        
        if (estadoLower === 'planificada' || estadoLower === 'pendiente') {
          calculatedStats.pendientes++;
          // Si está pendiente y ya pasó la fecha, está atrasada
          if (fechaProgramada < today) {
            calculatedStats.atrasados++;
          }
        } else if (estadoLower === 'en ejecución' || estadoLower === 'en_ejecucion' || estadoLower === 'activa' || estadoLower === 'pausada') {
          calculatedStats.activos++;
        } else if (estadoLower === 'completada' || estadoLower === 'cerrada' || estadoLower === 'finalizada') {
          calculatedStats.completados++;
        }
      });

      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsDisplay = [
    {
      title: "Total Registros",
      value: loading ? "..." : stats.total.toString(),
      icon: FileText,
      trend: "Última carga",
      color: "text-primary",
    },
    {
      title: "Pendientes",
      value: loading ? "..." : stats.pendientes.toString(),
      icon: Clock,
      trend: "Por ejecutar",
      color: "text-warning",
    },
    {
      title: "En Ejecución",
      value: loading ? "..." : stats.activos.toString(),
      icon: Calendar,
      trend: "Actualmente activos",
      color: "text-blue-500",
    },
    {
      title: "Completados",
      value: loading ? "..." : stats.completados.toString(),
      icon: CheckCircle2,
      trend: "Finalizados",
      color: "text-success",
    },
    {
      title: "Atrasados",
      value: loading ? "..." : stats.atrasados.toString(),
      icon: AlertTriangle,
      trend: "Requieren atención",
      color: "text-destructive",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statsDisplay.map((stat) => (
        <Card key={stat.title} className="shadow-notion">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
