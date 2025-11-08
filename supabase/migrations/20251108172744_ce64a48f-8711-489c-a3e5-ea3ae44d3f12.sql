-- =====================================================
-- FASE 1: MÓDULO DE PERSONAL - BASE FUNDAMENTAL
-- =====================================================

-- 1. Crear enum de roles
CREATE TYPE public.app_role AS ENUM (
  'administrador_general',
  'supervisor_tecnico',
  'operador_tecnico',
  'proveedor_contratista',
  'jefatura_gerencia',
  'usuario_proceso_sistema',
  'usuario_tecnologia',
  'invitado'
);

-- 2. Tabla de roles de usuario (sin recursión RLS)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  asignado_por UUID REFERENCES auth.users(id),
  fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Security definer function para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Function para verificar si es admin o usuario proceso/sistema
CREATE OR REPLACE FUNCTION public.is_admin_or_system()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('administrador_general', 'usuario_proceso_sistema', 'usuario_tecnologia')
  )
$$;

-- 5. Enum de estados de personal
CREATE TYPE public.estado_personal AS ENUM (
  'activo',
  'inactivo',
  'suspendido',
  'vencido'
);

-- 6. Tabla principal de personal
CREATE TABLE public.personal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre_completo TEXT NOT NULL,
  cargo TEXT,
  correo_electronico TEXT UNIQUE NOT NULL,
  telefono TEXT,
  estado estado_personal NOT NULL DEFAULT 'activo',
  fecha_inicio_vigencia DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_termino_vigencia DATE,
  empresa_proveedor TEXT,
  observaciones TEXT,
  require_cambio_clave BOOLEAN DEFAULT false,
  ultimo_acceso TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT vigencia_valida CHECK (fecha_termino_vigencia IS NULL OR fecha_termino_vigencia >= fecha_inicio_vigencia)
);

-- 7. Tabla de auditoría de personal
CREATE TABLE public.personal_auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  personal_id UUID REFERENCES public.personal(id) ON DELETE CASCADE,
  accion TEXT NOT NULL,
  campos_modificados JSONB,
  valor_anterior JSONB,
  valor_nuevo JSONB,
  usuario_id UUID REFERENCES auth.users(id),
  fecha TIMESTAMP WITH TIME ZONE DEFAULT now(),
  tipo_log TEXT DEFAULT 'auditoría',
  descripcion TEXT
);

-- 8. Enable RLS en todas las tablas
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_auditoria ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies para user_roles
CREATE POLICY "Usuarios pueden ver sus propios roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins y usuarios sistema pueden ver todos los roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin_or_system());

CREATE POLICY "Solo admins y usuarios sistema pueden modificar roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin_or_system());

-- 10. RLS Policies para personal
CREATE POLICY "Usuarios autenticados pueden ver personal activo"
  ON public.personal FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Solo admins y usuarios sistema pueden insertar personal"
  ON public.personal FOR INSERT
  WITH CHECK (public.is_admin_or_system());

CREATE POLICY "Solo admins y usuarios sistema pueden actualizar personal"
  ON public.personal FOR UPDATE
  USING (public.is_admin_or_system());

CREATE POLICY "Solo admins pueden eliminar personal"
  ON public.personal FOR DELETE
  USING (public.has_role(auth.uid(), 'administrador_general'));

-- 11. RLS Policies para auditoría
CREATE POLICY "Usuarios autenticados pueden ver auditoría"
  ON public.personal_auditoria FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Sistema puede insertar auditoría"
  ON public.personal_auditoria FOR INSERT
  WITH CHECK (true);

-- 12. Trigger para updated_at en personal
CREATE TRIGGER update_personal_updated_at
  BEFORE UPDATE ON public.personal
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Function para actualizar estado según vigencia
CREATE OR REPLACE FUNCTION public.actualizar_estado_vigencia_personal()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.personal
  SET estado = 'vencido'
  WHERE fecha_termino_vigencia IS NOT NULL
    AND fecha_termino_vigencia < CURRENT_DATE
    AND estado != 'vencido';
END;
$$;

-- 14. Trigger para auditar cambios en personal
CREATE OR REPLACE FUNCTION public.auditar_cambios_personal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_campos_modificados TEXT[] := '{}';
  v_valor_anterior JSONB := '{}'::jsonb;
  v_valor_nuevo JSONB := '{}'::jsonb;
  v_accion TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_accion := 'CREACIÓN';
    INSERT INTO public.personal_auditoria (
      personal_id, accion, valor_nuevo, usuario_id, tipo_log, descripcion
    ) VALUES (
      NEW.id,
      v_accion,
      to_jsonb(NEW),
      auth.uid(),
      'auditoría',
      'Personal creado: ' || NEW.nombre_completo
    );
  ELSIF TG_OP = 'UPDATE' THEN
    v_accion := 'MODIFICACIÓN';
    
    -- Detectar campos modificados
    IF OLD.nombre_completo IS DISTINCT FROM NEW.nombre_completo THEN
      v_campos_modificados := array_append(v_campos_modificados, 'nombre_completo');
      v_valor_anterior := v_valor_anterior || jsonb_build_object('nombre_completo', OLD.nombre_completo);
      v_valor_nuevo := v_valor_nuevo || jsonb_build_object('nombre_completo', NEW.nombre_completo);
    END IF;
    
    IF OLD.estado IS DISTINCT FROM NEW.estado THEN
      v_campos_modificados := array_append(v_campos_modificados, 'estado');
      v_valor_anterior := v_valor_anterior || jsonb_build_object('estado', OLD.estado);
      v_valor_nuevo := v_valor_nuevo || jsonb_build_object('estado', NEW.estado);
    END IF;
    
    IF OLD.cargo IS DISTINCT FROM NEW.cargo THEN
      v_campos_modificados := array_append(v_campos_modificados, 'cargo');
      v_valor_anterior := v_valor_anterior || jsonb_build_object('cargo', OLD.cargo);
      v_valor_nuevo := v_valor_nuevo || jsonb_build_object('cargo', NEW.cargo);
    END IF;
    
    IF OLD.fecha_termino_vigencia IS DISTINCT FROM NEW.fecha_termino_vigencia THEN
      v_campos_modificados := array_append(v_campos_modificados, 'fecha_termino_vigencia');
      v_valor_anterior := v_valor_anterior || jsonb_build_object('fecha_termino_vigencia', OLD.fecha_termino_vigencia);
      v_valor_nuevo := v_valor_nuevo || jsonb_build_object('fecha_termino_vigencia', NEW.fecha_termino_vigencia);
    END IF;
    
    IF array_length(v_campos_modificados, 1) > 0 THEN
      INSERT INTO public.personal_auditoria (
        personal_id, accion, campos_modificados, valor_anterior, valor_nuevo, usuario_id, tipo_log
      ) VALUES (
        NEW.id,
        v_accion,
        to_jsonb(v_campos_modificados),
        v_valor_anterior,
        v_valor_nuevo,
        auth.uid(),
        'auditoría'
      );
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    v_accion := 'ELIMINACIÓN';
    INSERT INTO public.personal_auditoria (
      personal_id, accion, valor_anterior, usuario_id, tipo_log, descripcion
    ) VALUES (
      OLD.id,
      v_accion,
      to_jsonb(OLD),
      auth.uid(),
      'auditoría',
      'Personal eliminado: ' || OLD.nombre_completo
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trigger_auditar_personal
  AFTER INSERT OR UPDATE OR DELETE ON public.personal
  FOR EACH ROW
  EXECUTE FUNCTION public.auditar_cambios_personal();

-- 15. Índices para rendimiento
CREATE INDEX idx_personal_estado ON public.personal(estado);
CREATE INDEX idx_personal_correo ON public.personal(correo_electronico);
CREATE INDEX idx_personal_vigencia ON public.personal(fecha_termino_vigencia) WHERE fecha_termino_vigencia IS NOT NULL;
CREATE INDEX idx_personal_user_id ON public.personal(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_personal_auditoria_personal_id ON public.personal_auditoria(personal_id);
CREATE INDEX idx_personal_auditoria_fecha ON public.personal_auditoria(fecha DESC);