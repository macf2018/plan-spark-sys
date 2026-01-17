import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Home } from "lucide-react";
import logoVespucio from "@/assets/logo-vespucio-norte.png";

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

/**
 * Página de error amigable y genérica para todo el sistema SGME.
 * Muestra el logo corporativo y un mensaje profesional sin exponer detalles técnicos.
 * 
 * NOTA: Este componente puede renderizarse FUERA del Router (en ErrorBoundary global),
 * por eso usa window.history y window.location en lugar de useNavigate.
 */
export function ErrorFallback({ resetErrorBoundary }: ErrorFallbackProps) {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Logo corporativo */}
        <div className="flex justify-center">
          <img
            src={logoVespucio}
            alt="Autopista Vespucio Norte"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Mensaje amigable */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Estamos mejorando esta sección
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            El SGME se encuentra en proceso de mejora para ofrecerte una mejor experiencia.
            Puedes volver atrás o regresar al inicio.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver atrás
          </Button>
          <Button
            onClick={handleGoHome}
            className="gap-2 bg-vn-orange hover:bg-vn-orange/90"
          >
            <Home className="h-4 w-4" />
            Ir al inicio
          </Button>
          <Button
            variant="ghost"
            onClick={handleRetry}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
        </div>

        {/* Footer discreto */}
        <p className="text-xs text-muted-foreground/60 pt-8">
          SGME — Sistema de Gestión de Mantenimiento de Equipos
        </p>
      </div>
    </div>
  );
}
