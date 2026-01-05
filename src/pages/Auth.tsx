import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Wrench, ArrowLeft } from "lucide-react";

type AuthView = "login" | "signup" | "forgot" | "reset";

export default function Auth() {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Keep these refs stable so we don't recreate the auth listener
  const recoveryModeRef = useRef(false);
  const viewRef = useRef<AuthView>(view);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    // Latch recovery mode ONCE based on initial hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const isRecovery = hashParams.get("type") === "recovery";

    if (isRecovery) {
      recoveryModeRef.current = true;
      setView("reset");
      setCheckingSession(false);
    }

    // Set up auth state listener (do not depend on `view` to avoid recreating it)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // If we enter recovery flow, latch it.
      if (event === "PASSWORD_RECOVERY") {
        recoveryModeRef.current = true;
      }

      // If recovery is active, NEVER navigate away.
      if (event === "PASSWORD_RECOVERY" || recoveryModeRef.current) {
        setView("reset");
        setCheckingSession(false);
        return;
      }

      // Handle USER_UPDATED after password reset
      if (event === "USER_UPDATED" && viewRef.current === "reset") {
        return;
      }

      // Only redirect to "/" if NOT in forgot/reset flow
      if (
        session?.user &&
        !recoveryModeRef.current &&
        viewRef.current !== "reset" &&
        viewRef.current !== "forgot"
      ) {
        navigate("/", { replace: true });
      }

      setCheckingSession(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // If recovery is active, stay here.
      if (recoveryModeRef.current) {
        setView("reset");
        setCheckingSession(false);
        return;
      }

      if (session?.user && viewRef.current !== "reset" && viewRef.current !== "forgot") {
        navigate("/", { replace: true });
      }

      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Credenciales inválidas");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Sesión iniciada correctamente");
    } catch (err) {
      console.error("Auth error:", err);
      toast.error("Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este correo ya está registrado");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Cuenta creada exitosamente. Iniciando sesión...");
    } catch (err) {
      console.error("Auth error:", err);
      toast.error("Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Revisa tu correo para restablecer tu contraseña");
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("Error al enviar el enlace de recuperación");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        if (error.message.includes("expired") || error.message.includes("invalid")) {
          toast.error("El enlace ha expirado o es inválido. Solicita uno nuevo.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Contraseña actualizada correctamente");
      // Clear hash and reset form
      window.history.replaceState(null, "", window.location.pathname);
      recoveryModeRef.current = false;

      setPassword("");
      setConfirmPassword("");

      // Sign out to force fresh login with new password
      await supabase.auth.signOut();
      setView("login");
    } catch (err) {
      console.error("Update password error:", err);
      toast.error("Error al actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getViewContent = () => {
    switch (view) {
      case "forgot":
        return {
          title: "Recuperar contraseña",
          description: "Te enviaremos un enlace para restablecer tu contraseña",
          form: (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar enlace
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setView("login")}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a iniciar sesión
              </Button>
            </form>
          ),
        };
      case "reset":
        return {
          title: "Nueva contraseña",
          description: "Ingresa tu nueva contraseña",
          form: (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Actualizar contraseña
              </Button>
            </form>
          ),
        };
      case "signup":
        return {
          title: "Sistema de Gestión de Mantenimiento",
          description: "Crea tu cuenta para comenzar",
          form: (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear cuenta
              </Button>
            </form>
          ),
          footer: (
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes cuenta?</span>{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="font-medium text-primary hover:underline"
                disabled={loading}
              >
                Inicia sesión
              </button>
            </div>
          ),
        };
      default: // login
        return {
          title: "Sistema de Gestión de Mantenimiento",
          description: "Inicia sesión para continuar",
          form: (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-xs text-primary hover:underline"
                    disabled={loading}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Iniciar sesión
              </Button>
            </form>
          ),
          footer: (
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">¿No tienes cuenta?</span>{" "}
              <button
                type="button"
                onClick={() => setView("signup")}
                className="font-medium text-primary hover:underline"
                disabled={loading}
              >
                Regístrate
              </button>
            </div>
          ),
        };
    }
  };

  const content = getViewContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wrench className="h-7 w-7" />
          </div>
          <div>
            <CardTitle className="text-2xl">{content.title}</CardTitle>
            <CardDescription className="mt-2">{content.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {content.form}
          {content.footer}
        </CardContent>
      </Card>
    </div>
  );
}
