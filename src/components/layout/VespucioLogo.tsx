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
      // Sidebar colapsado: tamaño fijo
      return "h-12 w-auto object-contain";
    }
    
    // Sidebar expandido: tamaños aumentados (triple del original)
    // móvil: 144px, tablet: 128px, desktop: 112px
    return "h-36 sm:h-32 lg:h-28 w-auto object-contain";
  };

  // En contexto auth: contenedor azul corporativo para coherencia con dashboard
  if (context === "auth") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="bg-primary rounded-xl px-8 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-10">
          <img
            src={logoVespucio}
            alt="Autopista Vespucio Norte"
            className={getLogoClasses()}
          />
        </div>
      </div>
    );
  }

  // Contexto sidebar: clickable hacia dashboard
  return (
    <Link 
      to="/" 
      className={`flex flex-col items-center justify-center gap-2 transition-fast hover:opacity-80 w-full py-4 ${className}`}
      title="Ir al Dashboard - SGME"
    >
      <img
        src={logoVespucio}
        alt="Autopista Vespucio Norte"
        className={getLogoClasses()}
      />

      {/* Texto SGME - Solo en modo expandido del sidebar */}
      {!collapsed && (
        <div className="flex flex-col items-center text-center">
          <span className="text-base font-semibold text-white tracking-wide">
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
