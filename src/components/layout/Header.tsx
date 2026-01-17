import { Bell, User, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface HeaderProps {
  title: string;
  showNavigation?: boolean;
}

/**
 * Header principal de la aplicación.
 * NOTA: El logo se muestra SOLO en el sidebar para evitar duplicación.
 */
export function Header({ title, showNavigation = false }: HeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada");
      navigate("/auth", { replace: true });
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-primary px-4 shadow-md">
      {/* SidebarTrigger - único control de navegación del sidebar */}
      <SidebarTrigger className="transition-fast text-white hover:bg-white/10" />
      
      {showNavigation && (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8 transition-fast text-white hover:bg-white/10"
            title="Atrás"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(1)}
            className="h-8 w-8 transition-fast text-white hover:bg-white/10"
            title="Adelante"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <h1 className="text-lg font-semibold tracking-tight text-white">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative transition-fast text-white hover:bg-white/10" 
          title="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-warning animate-pulse" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="transition-fast text-white hover:bg-white/10" 
              title="Perfil de usuario"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.email || "Usuario"}</p>
                <p className="text-xs text-muted-foreground">
                  Supervisor de Mantenimiento
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer transition-fast">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive cursor-pointer transition-fast"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
