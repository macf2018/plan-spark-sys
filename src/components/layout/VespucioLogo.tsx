import { Link } from "react-router-dom";
import logoVespucio from "@/assets/logo-vespucio-norte.png";

interface VespucioLogoProps {
  collapsed?: boolean;
  className?: string;
}

/**
 * Logo corporativo Autopista Vespucio Norte
 * - Desktop: Logo completo 24-32px alto
 * - Mobile/Collapsed: Logo reducido 16-20px
 * - Clickable → redirige al dashboard
 */
export function VespucioLogo({ collapsed = false, className = "" }: VespucioLogoProps) {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 transition-fast hover:opacity-80 ${className}`}
      title="Ir al Dashboard - Autopista Vespucio Norte"
    >
      <img
        src={logoVespucio}
        alt="Autopista Vespucio Norte"
        className={collapsed ? "h-6 w-auto" : "h-8 w-auto"}
      />

      {/* Texto SGME - Solo en modo expandido */}
      {!collapsed && (
        <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
          SGME
        </span>
      )}
    </Link>
  );
}
