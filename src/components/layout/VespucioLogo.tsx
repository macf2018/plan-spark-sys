import { Link } from "react-router-dom";

interface VespucioLogoProps {
  collapsed?: boolean;
  className?: string;
}

/**
 * Logo corporativo Autopista Vespucio Norte
 * - Desktop: Logo completo (texto + símbolo) 24-32px alto
 * - Mobile/Collapsed: Solo ícono monocromo blanco 16-20px
 * - Clickable → redirige al dashboard
 * 
 * PLACEHOLDER: Reemplazar con SVG/PNG oficial cuando esté disponible
 */
export function VespucioLogo({ collapsed = false, className = "" }: VespucioLogoProps) {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 transition-fast hover:opacity-80 ${className}`}
      title="Ir al Dashboard - Autopista Vespucio Norte"
    >
      {/* Ícono/Símbolo - Siempre visible */}
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 shrink-0">
        {/* Placeholder: Símbolo "VN" estilizado */}
        <svg
          viewBox="0 0 32 32"
          className="h-5 w-5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 8L12 24L16 14L20 24L26 8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          />
          <path
            d="M16 8V14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-vn-orange"
          />
        </svg>
      </div>

      {/* Texto - Solo en modo expandido */}
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-bold tracking-wider text-white uppercase">
            Vespucio Norte
          </span>
          <span className="text-[10px] text-white/70 font-medium">
            SGME
          </span>
        </div>
      )}
    </Link>
  );
}
