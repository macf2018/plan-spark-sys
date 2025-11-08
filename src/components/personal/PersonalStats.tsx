import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserCheck, UserX, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Stats {
  total: number;
  activos: number;
  inactivos: number;
  proximosVencer: number;
}

export function PersonalStats() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    activos: 0,
    inactivos: 0,
    proximosVencer: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from("personal")
        .select("estado, fecha_termino_vigencia");

      if (error) throw error;

      const total = data?.length || 0;
      const activos = data?.filter((p) => p.estado === "activo").length || 0;
      const inactivos =
        data?.filter((p) => p.estado === "inactivo" || p.estado === "suspendido" || p.estado === "vencido")
          .length || 0;

      // Calcular próximos a vencer (dentro de 30 días)
      const hoy = new Date();
      const enTreintaDias = new Date();
      enTreintaDias.setDate(hoy.getDate() + 30);

      const proximosVencer =
        data?.filter((p) => {
          if (!p.fecha_termino_vigencia || p.estado === "vencido") return false;
          const fechaVigencia = new Date(p.fecha_termino_vigencia);
          return fechaVigencia >= hoy && fechaVigencia <= enTreintaDias;
        }).length || 0;

      setStats({ total, activos, inactivos, proximosVencer });
    } catch (error: any) {
      toast({
        title: "Error al cargar estadísticas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Personal",
      value: stats.total,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Activos",
      value: stats.activos,
      icon: UserCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Inactivos/Vencidos",
      value: stats.inactivos,
      icon: UserX,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    {
      title: "Próximos a Vencer",
      value: stats.proximosVencer,
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-notion">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="shadow-notion hover:shadow-notion-hover transition-smooth"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
