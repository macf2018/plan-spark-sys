import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import {
  Calendar,
  ClipboardCheck,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Activity,
  PlayCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface DashboardKPIs {
  total: number;
  planificadas: number;
  enEjecucion: number;
  completadas: number;
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<DashboardKPIs>({
    total: 0,
    planificadas: 0,
    enEjecucion: 0,
    completadas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const { data, error } = await supabase
          .from("ordenes_trabajo")
          .select("estado");

        if (error) throw error;

        const calc: DashboardKPIs = {
          total: data?.length || 0,
          planificadas: 0,
          enEjecucion: 0,
          completadas: 0,
        };

        data?.forEach((row) => {
          const e = (row.estado ?? "planificada").toLowerCase().trim();
          if (e === "planificada" || e === "pendiente") {
            calc.planificadas++;
          } else if (
            e === "en ejecución" ||
            e === "en ejecucion" ||
            e === "en_ejecucion" ||
            e === "pausada"
          ) {
            calc.enEjecucion++;
          } else if (
            e === "completada" ||
            e === "cerrada" ||
            e === "finalizada"
          ) {
            calc.completadas++;
          }
        });

        setKpis(calc);
      } catch (err) {
        console.error("Error fetching dashboard KPIs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  const display = (n: number) => (loading ? "…" : n.toString());

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Sistema de Gestión de Mantenimiento Eléctrico" />

      <main className="flex-1 p-4 sm:p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-secondary">Dashboard Principal</h2>
          <p className="text-muted-foreground mt-1">
            Visión general del sistema de mantenimiento eléctrico
          </p>
        </div>

        {/* KPI Cards (datos reales desde ordenes_trabajo) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-notion hover:shadow-notion-hover transition-smooth border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total OT
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{display(kpis.total)}</div>
              <p className="text-xs text-muted-foreground mt-1">Órdenes registradas</p>
            </CardContent>
          </Card>

          <Card className="shadow-notion hover:shadow-notion-hover transition-smooth border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Planificadas
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{display(kpis.planificadas)}</div>
              <p className="text-xs text-muted-foreground mt-1">Por ejecutar</p>
            </CardContent>
          </Card>

          <Card className="shadow-notion hover:shadow-notion-hover transition-smooth border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Ejecución
              </CardTitle>
              <PlayCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{display(kpis.enEjecucion)}</div>
              <p className="text-xs text-muted-foreground mt-1">Incluye pausadas</p>
            </CardContent>
          </Card>

          <Card className="shadow-notion hover:shadow-notion-hover transition-smooth border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completadas
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{display(kpis.completadas)}</div>
              <p className="text-xs text-muted-foreground mt-1">Cerradas / Finalizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Module Cards */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-secondary">Módulos del Sistema</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/planificacion">
              <Card className="shadow-notion hover:shadow-notion-hover transition-smooth cursor-pointer border-warning/30 hover:border-warning h-full group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10 transition-smooth group-hover:bg-warning/20">
                      <Calendar className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-foreground">Planificación</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Gestión de planes
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Crea y administra planes de mantenimiento preventivo y correctivo
                  </p>
                  <Button variant="link" className="mt-2 px-0 h-auto text-warning">
                    Acceder al módulo →
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/ejecucion">
              <Card className="shadow-notion hover:shadow-notion-hover transition-smooth cursor-pointer border-accent/30 hover:border-accent h-full group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 transition-smooth group-hover:bg-accent/20">
                      <ClipboardCheck className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-foreground">Ejecución</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Órdenes de trabajo
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ejecuta y registra actividades de mantenimiento en tiempo real
                  </p>
                  <Button variant="link" className="mt-2 px-0 h-auto text-warning">
                    Acceder al módulo →
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/seguimiento">
              <Card className="shadow-notion hover:shadow-notion-hover transition-smooth cursor-pointer border-secondary/30 hover:border-secondary h-full group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 transition-smooth group-hover:bg-secondary/20">
                      <Activity className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-foreground">Control y Seguimiento</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        KPIs y monitoreo
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Monitorea el desempeño y controla las operaciones de mantenimiento
                  </p>
                  <Button variant="link" className="mt-2 px-0 h-auto text-warning">
                    Acceder al módulo →
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/reportes">
              <Card className="shadow-notion hover:shadow-notion-hover transition-smooth cursor-pointer border-secondary/30 hover:border-secondary h-full group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 transition-smooth group-hover:bg-secondary/20">
                      <BarChart3 className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-foreground">Reportes y Analytics</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Análisis y métricas
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Visualiza indicadores y genera reportes de desempeño
                  </p>
                  <Button variant="link" className="mt-2 px-0 h-auto text-warning">
                    Acceder al módulo →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
