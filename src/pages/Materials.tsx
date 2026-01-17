import { Header } from "@/components/layout/Header";
import { Package, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/**
 * Página de Materiales - En desarrollo
 * Muestra un mensaje amigable indicando que el módulo está en mejora.
 */
const Materials = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <Header title="Gestión de Materiales" />
      <main className="flex-1 flex items-center justify-center bg-background p-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Construction className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Sección en Mejora
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              El módulo de <strong>Gestión de Materiales</strong> se encuentra en proceso de mejora 
              para ofrecerte una mejor experiencia. Pronto estará disponible.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              Volver atrás
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="gap-2 bg-vn-orange hover:bg-vn-orange/90"
            >
              Ir al inicio
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/60 pt-4">
            SGME — Sistema de Gestión de Mantenimiento de Equipos
          </p>
        </div>
      </main>
    </div>
  );
};

export default Materials;
