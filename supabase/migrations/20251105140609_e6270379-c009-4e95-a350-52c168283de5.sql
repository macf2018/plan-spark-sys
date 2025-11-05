-- Crear enums para tipos y estados
CREATE TYPE public.tipo_equipo AS ENUM (
  'electrico',
  'mecanico',
  'electronico',
  'medicion',
  'otros'
);

CREATE TYPE public.estado_equipo AS ENUM (
  'operativo',
  'en_reparacion',
  'en_mantenimiento',
  'fuera_de_servicio',
  'obsoleto',
  'dado_de_baja'
);

-- Tabla principal de equipos
CREATE TABLE public.equipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_equipo TEXT NOT NULL,
  tipo tipo_equipo NOT NULL,
  marca TEXT,
  modelo TEXT,
  version_revision TEXT,
  nro_serie TEXT,
  anio_fabricacion INTEGER,
  vida_util_estimada INTEGER,
  fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
  proximo_mantenimiento DATE,
  estado estado_equipo NOT NULL DEFAULT 'operativo',
  ubicacion_fisica TEXT,
  zona TEXT,
  sala TEXT,
  responsable_asignado TEXT,
  proveedor_asociado TEXT,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabla de historial de cambios de estado
CREATE TABLE public.equipos_historial_estado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipo_id UUID REFERENCES public.equipos(id) ON DELETE CASCADE NOT NULL,
  estado_anterior estado_equipo,
  estado_nuevo estado_equipo NOT NULL,
  observacion TEXT,
  fecha_cambio TIMESTAMP WITH TIME ZONE DEFAULT now(),
  usuario_id UUID REFERENCES auth.users(id)
);

-- Tabla de logs de acciones
CREATE TABLE public.equipos_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipo_id UUID REFERENCES public.equipos(id) ON DELETE CASCADE,
  accion TEXT NOT NULL,
  descripcion TEXT,
  usuario_id UUID REFERENCES auth.users(id),
  fecha TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_equipos_tipo ON public.equipos(tipo);
CREATE INDEX idx_equipos_estado ON public.equipos(estado);
CREATE INDEX idx_equipos_responsable ON public.equipos(responsable_asignado);
CREATE INDEX idx_equipos_historial_equipo ON public.equipos_historial_estado(equipo_id);
CREATE INDEX idx_equipos_logs_equipo ON public.equipos_logs(equipo_id);

-- Habilitar RLS
ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipos_historial_estado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipos_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para equipos (permitir todas las operaciones a usuarios autenticados)
CREATE POLICY "Los usuarios autenticados pueden ver todos los equipos"
  ON public.equipos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Los usuarios autenticados pueden crear equipos"
  ON public.equipos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Los usuarios autenticados pueden actualizar equipos"
  ON public.equipos FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Los usuarios autenticados pueden eliminar equipos"
  ON public.equipos FOR DELETE
  TO authenticated
  USING (true);

-- Políticas RLS para historial de estado
CREATE POLICY "Los usuarios autenticados pueden ver el historial"
  ON public.equipos_historial_estado FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Los usuarios autenticados pueden crear historial"
  ON public.equipos_historial_estado FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas RLS para logs
CREATE POLICY "Los usuarios autenticados pueden ver los logs"
  ON public.equipos_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Los usuarios autenticados pueden crear logs"
  ON public.equipos_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en equipos
CREATE TRIGGER update_equipos_updated_at
  BEFORE UPDATE ON public.equipos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Función para registrar cambios de estado automáticamente
CREATE OR REPLACE FUNCTION public.log_equipo_estado_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.estado IS DISTINCT FROM NEW.estado THEN
    INSERT INTO public.equipos_historial_estado (
      equipo_id,
      estado_anterior,
      estado_nuevo,
      observacion,
      usuario_id
    ) VALUES (
      NEW.id,
      OLD.estado,
      NEW.estado,
      'Cambio automático de estado',
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para registrar cambios de estado
CREATE TRIGGER trigger_log_equipo_estado_change
  AFTER UPDATE ON public.equipos
  FOR EACH ROW
  EXECUTE FUNCTION public.log_equipo_estado_change();