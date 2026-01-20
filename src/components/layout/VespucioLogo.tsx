import { Link } from "react-router-dom";
import logoVespucio from "@/assets/logo-vespucio-norte.png";

interface VespucioLogoProps {
  /** Contexto de uso: 'auth' para login/registro (protagonista), 'sidebar' para menú lateral */
  context?: "auth" | "sidebar";
  /** Solo aplica en sidebar: true cuando el sidebar está colapsado */
  collapsed?: boolean;
  className?: string;
}

/**
 * Logo corporativo Autopista Vespucio Norte - RESPONSIVE SIN DEFORMACIONES
 * 
 * Usa contenedores con dimensiones fijas para evitar CLS y aspect-ratio preservado.
 * El logo NUNCA se estira - siempre object-contain dentro de su contenedor.
 */
export function VespucioLogo({ 
  context = "sidebar", 
  collapsed = false, 
  className = "" 
}: VespucioLogoProps) {
  
  // En contexto auth: contenedor azul corporativo para coherencia con dashboard
  if (context === "auth") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="bg-primary rounded-xl px-8 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-10">
          {/* Contenedor con dimensiones fijas por breakpoint - evita CLS */}
          <div className="relative h-[80px] w-[200px] sm:h-[96px] sm:w-[240px] lg:h-[112px] lg:w-[280px]">
            <img
              src={logoVespucio}
              alt="Autopista Vespucio Norte"
              className="absolute inset-0 h-full w-full object-contain object-center"
            />
          </div>
        </div>
      </div>
    );
  }

  // Contexto sidebar: clickable hacia dashboard
  return (
    <Link 
      to="/" 
      className={`flex flex-col items-center justify-center gap-3 transition-fast hover:opacity-80 w-full py-5 px-3 ${className}`}
      title="Ir al Dashboard - SGME"
    >
      {/* Contenedor con dimensiones fijas - NUNCA se deforma */}
      <div 
        className={`relative flex-shrink-0 ${
          collapsed 
            ? "h-[40px] w-[40px]" // Colapsado: cuadrado pequeño
            : "h-[56px] w-[180px] sm:h-[64px] sm:w-[200px] lg:h-[72px] lg:w-[220px]" // Expandido: responsive
        }`}
      >
        <img
          src={logoVespucio}
          alt="Autopista Vespucio Norte"
          className="absolute inset-0 h-full w-full object-contain object-center"
        />
      </div>

      {/* Texto SGME - Solo en modo expandido del sidebar */}
      {!collapsed && (
        <div className="flex flex-col items-center text-center gap-0.5">
          <span className="text-base font-semibold text-white tracking-wide leading-tight">
            SGME
          </span>
          <span className="text-xs text-white/60 leading-tight">
            Mantenimiento
          </span>
        </div>
      )}
    </Link>
  );
}
