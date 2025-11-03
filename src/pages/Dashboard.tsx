import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import {
  Calendar,
  ClipboardCheck,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Sistema de Gestión de Mantenimiento Eléctrico" />
      
      <main className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Dashboard Principal</h2>
          <p className="text-muted-foreground mt-1">
            Visión general del sistema de mantenimiento eléctrico
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-notion">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Equipos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground mt-1">+4 este mes</p>
            </CardContent>
          </Card>

          <Card className="shadow-notion">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mantenimientos Activos
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">En progreso</p>
            </CardContent>
          </Card>

          <Card className="shadow-notion">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completados (Mes)
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground mt-1">+15% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card className="shadow-notion">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alertas Críticas
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/planificacion">
            <Card className="shadow-notion hover:shadow-md transition-smooth cursor-pointer border-primary/20 hover:border-primary/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Planificación</CardTitle>
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
                <Button variant="link" className="mt-2 px-0">
                  Acceder al módulo →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="shadow-notion hover:shadow-md transition-smooth cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <ClipboardCheck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>Ejecución</CardTitle>
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
              <Button variant="link" className="mt-2 px-0">
                Acceder al módulo →
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-notion hover:shadow-md transition-smooth cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                  <BarChart3 className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <CardTitle>Reportes y Analytics</CardTitle>
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
              <Button variant="link" className="mt-2 px-0">
                Acceder al módulo →
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-notion">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Plan creado",
                  description: "Mantenimiento Preventivo Q1 - Transformador #1",
                  time: "Hace 2 horas",
                  type: "success",
                },
                {
                  action: "Alerta generada",
                  description: "Conflicto de programación detectado en Panel Principal",
                  time: "Hace 5 horas",
                  type: "warning",
                },
                {
                  action: "Mantenimiento completado",
                  description: "Revisión Generador A - Finalizado por Pedro Martínez",
                  time: "Hace 1 día",
                  type: "success",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${
                      activity.type === "success" ? "bg-success" : "bg-warning"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
