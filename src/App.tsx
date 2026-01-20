import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import Planning from "./pages/Planning";
import Execution from "./pages/Execution";
import Monitoring from "./pages/Monitoring";
import Reports from "./pages/Reports";
import Equipment from "./pages/Equipment";
import Personal from "./pages/Personal";
import Materials from "./pages/Materials";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  </SidebarProvider>
);

/**
 * Wrapper con ErrorBoundary para cada ruta protegida.
 * Esto asegura que errores en cualquier módulo muestren el ErrorFallback.
 */
const ProtectedRouteWithError = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  </ErrorBoundary>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRouteWithError>
                  <Dashboard />
                </ProtectedRouteWithError>
              }
            />
            <Route
              path="/planificacion"
              element={
                <ProtectedRouteWithError>
                  <Planning />
                </ProtectedRouteWithError>
              }
            />
            <Route
              path="/ejecucion"
              element={
                <ProtectedRouteWithError>
                  <Execution />
                </ProtectedRouteWithError>
              }
            />
            <Route
              path="/seguimiento"
              element={
                <ProtectedRouteWithError>
                  <Monitoring />
                </ProtectedRouteWithError>
              }
            />
            <Route
              path="/reportes"
              element={
                <ProtectedRouteWithError>
                  <Reports />
                </ProtectedRouteWithError>
              }
            />
            <Route
              path="/equipos"
              element={
                <ProtectedRouteWithError>
                  <Equipment />
                </ProtectedRouteWithError>
              }
            />
            <Route
              path="/personal"
              element={
                <ProtectedRouteWithError>
                  <Personal />
                </ProtectedRouteWithError>
              }
            />
            <Route
              path="/materiales"
              element={
                <ProtectedRouteWithError>
                  <Materials />
                </ProtectedRouteWithError>
              }
            />
            <Route
              path="/configuracion"
              element={
                <ProtectedRouteWithError>
                  <Settings />
                </ProtectedRouteWithError>
              }
            />
            {/* Ruta catch-all para páginas no encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
