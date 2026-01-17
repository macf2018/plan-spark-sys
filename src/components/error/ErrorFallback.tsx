import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import logoVespucio from "@/assets/logo-vespucio-norte.png";

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

/**
 * Página de error amigable y genérica para todo el sistema SGME.
 * Muestra el logo corporativo y un mensaje profesional sin exponer detalles técnicos.
 */
export function ErrorFallback({ resetErrorBoundary }: ErrorFallbackProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
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
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Mensaje amigable */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Mejorando tu experiencia
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Estamos mejorando esta sección del sistema para ofrecer una mejor
            experiencia. Por favor, vuelve a la pantalla anterior o inténtalo
            más tarde.
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
            onClick={handleRetry}
            className="gap-2 bg-vn-orange hover:bg-vn-orange/90"
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
