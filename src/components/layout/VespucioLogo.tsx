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

  // Contexto sidebar: clickable hacia dashboard - Logo grande + SGME discreto, alineados por baseline
   return (
     <Link
       to="/"
       className={`flex items-end gap-3 transition-fast hover:opacity-80 w-full min-w-0 ${className}`}
       title="Ir al Dashboard - SGME"
     >
      {/* Logo corporativo: altura 48px para presencia real en header h-16 */}
      <img
        src={logoVespucio}
        alt="Autopista Vespucio Norte"
        className={`flex-shrink-0 object-contain ${
          collapsed ? "h-[48px] w-[48px]" : "h-[48px] w-auto"
        }`}
      />

       {/* Texto SGME - tamaño equilibrado, alineado por baseline con logo */}
       {!collapsed && (
         <span className="text-lg font-semibold text-white tracking-wider whitespace-nowrap leading-none">
           SGME
         </span>
       )}
    </Link>
  );
}
