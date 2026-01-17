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
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1">{children}</div>
    </div>
  </SidebarProvider>
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
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/planificacion"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Planning />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ejecucion"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Execution />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/seguimiento"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Monitoring />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reportes"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Reports />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipos"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Equipment />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/personal"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Personal />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
