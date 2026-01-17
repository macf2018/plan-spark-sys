import { Link } from "react-router-dom";
import logoVespucio from "@/assets/logo-vespucio-norte.png";

interface VespucioLogoProps {
  collapsed?: boolean;
  className?: string;
}

/**
 * Logo corporativo Autopista Vespucio Norte
 * - Tamaño recomendado DEMO: h-9 a h-10 (36-40px)
 * - Modo collapsed: solo icono pequeño
 * - Clickable → redirige al dashboard
 */
export function VespucioLogo({ collapsed = false, className = "" }: VespucioLogoProps) {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-3 transition-fast hover:opacity-80 ${className}`}
      title="Ir al Dashboard - SGME"
    >
      <img
        src={logoVespucio}
        alt="Autopista Vespucio Norte"
        className={collapsed ? "h-7 w-auto object-contain" : "h-10 w-auto object-contain"}
      />

      {/* Texto SGME - Solo en modo expandido */}
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white tracking-wide">
            SGME
          </span>
          <span className="text-[9px] text-white/60 leading-tight">
            Mantenimiento
          </span>
        </div>
      )}
    </Link>
  );
}
