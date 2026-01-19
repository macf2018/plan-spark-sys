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
 * Logo corporativo Autopista Vespucio Norte - RESPONSIVE
 * 
 * Contexto AUTH (Login/Registro) - Logo protagonista:
 * - móvil (<640px): h-24 (96px)
 * - tablet (640-1024px): h-28 (112px)
 * - desktop (>1024px): h-32 (128px)
 * 
 * Contexto SIDEBAR - Logo sobrio pero visible:
 * - móvil: h-16 (64px)
 * - tablet: h-14 (56px)
 * - desktop: h-12 (48px)
 * - collapsed: h-8 (32px) siempre
 */
export function VespucioLogo({ 
  context = "sidebar", 
  collapsed = false, 
  className = "" 
}: VespucioLogoProps) {
  
  // Clases responsive según contexto
  const getLogoClasses = () => {
    if (context === "auth") {
      // Login/Registro: logo protagonista, más grande
      // móvil: 96px, tablet: 112px, desktop: 128px
      return "h-24 sm:h-28 lg:h-32 w-auto object-contain";
    }
    
    // Sidebar
    if (collapsed) {
      // Sidebar colapsado: tamaño fijo pequeño
      return "h-8 w-auto object-contain";
    }
    
    // Sidebar expandido: responsive inverso (más grande en móvil, más pequeño en desktop)
    // móvil: 64px, tablet: 56px, desktop: 48px
    return "h-16 sm:h-14 lg:h-12 w-auto object-contain";
  };

  // En contexto auth, no es clickable (ya estamos en auth)
  if (context === "auth") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src={logoVespucio}
          alt="Autopista Vespucio Norte"
          className={getLogoClasses()}
        />
      </div>
    );
  }

  // Contexto sidebar: clickable hacia dashboard
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-3 transition-fast hover:opacity-80 ${className}`}
      title="Ir al Dashboard - SGME"
    >
      <img
        src={logoVespucio}
        alt="Autopista Vespucio Norte"
        className={getLogoClasses()}
      />

      {/* Texto SGME - Solo en modo expandido del sidebar */}
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white tracking-wide">
            SGME
          </span>
          <span className="text-[10px] text-white/60 leading-tight">
            Mantenimiento
          </span>
        </div>
      )}
    </Link>
  );
}
