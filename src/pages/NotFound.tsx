import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, MapPin } from "lucide-react";
import logoVespucio from "@/assets/logo-vespucio-norte.png";

/**
 * Página 404 amigable y consistente con el estilo SGME.
 * No muestra errores técnicos, solo un mensaje amigable.
 */
const NotFound = () => {
  const navigate = useNavigate();

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

        {/* Icono y mensaje */}
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground">
            Página no encontrada
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            La sección que buscas no existe o ha sido movida. 
            Puedes volver atrás o ir al inicio del sistema.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver atrás
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="gap-2 bg-vn-orange hover:bg-vn-orange/90"
          >
            <Home className="h-4 w-4" />
            Ir al inicio
          </Button>
        </div>

        {/* Footer discreto */}
        <p className="text-xs text-muted-foreground/60 pt-8">
          SGME — Sistema de Gestión de Mantenimiento de Equipos
        </p>
      </div>
    </div>
  );
};

export default NotFound;
