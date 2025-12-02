-- Crear tabla para almacenar líneas del plan anual
CREATE TABLE IF NOT EXISTS public.plan_anual_lineas (
  id_plan_linea uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anio integer NOT NULL,
  mes integer NOT NULL CHECK (mes >= 1 AND mes <= 12),
  fecha_programada date NOT NULL,
  nombre_sitio text NOT NULL,
  tramo text NOT NULL,
  pk text NOT NULL,
  tipo_equipo text NOT NULL,
  tipo_mantenimiento text NOT NULL,
  frecuencia text NOT NULL,
  proveedor_codigo text,
  proveedor_nombre text,
  criticidad text,
  ventana_horaria text,
  descripcion_trabajo text,
  estado_plan text DEFAULT 'Planificado',
  usuario_carga uuid REFERENCES auth.users(id),
  fecha_carga timestamp with time zone DEFAULT now(),
  origen_archivo text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Crear tabla para órdenes de trabajo
CREATE TABLE IF NOT EXISTS public.ordenes_trabajo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_plan_linea uuid REFERENCES public.plan_anual_lineas(id_plan_linea),
  fecha_programada date NOT NULL,
  nombre_sitio text NOT NULL,
  tramo text NOT NULL,
  pk text NOT NULL,
  tipo_equipo text NOT NULL,
  tipo_mantenimiento text NOT NULL,
  frecuencia text NOT NULL,
  proveedor_codigo text,
  proveedor_nombre text,
  criticidad text,
  ventana_horaria text,
  descripcion_trabajo text,
  estado text DEFAULT 'Planificada',
  fecha_inicio timestamp with time zone,
  fecha_fin timestamp with time zone,
  tecnico_asignado text,
  observaciones text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Crear tabla para logs de carga
CREATE TABLE IF NOT EXISTS public.plan_anual_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario uuid REFERENCES auth.users(id),
  fecha_hora timestamp with time zone DEFAULT now(),
  nombre_archivo text NOT NULL,
  total_filas_validas integer NOT NULL,
  total_filas_error integer NOT NULL,
  detalles_errores jsonb
);

-- Habilitar RLS
ALTER TABLE public.plan_anual_lineas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes_trabajo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_anual_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para plan_anual_lineas
CREATE POLICY "Usuarios autenticados pueden ver plan anual"
  ON public.plan_anual_lineas FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden insertar plan anual"
  ON public.plan_anual_lineas FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden actualizar plan anual"
  ON public.plan_anual_lineas FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden eliminar plan anual"
  ON public.plan_anual_lineas FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para ordenes_trabajo
CREATE POLICY "Usuarios autenticados pueden ver OT"
  ON public.ordenes_trabajo FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden insertar OT"
  ON public.ordenes_trabajo FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden actualizar OT"
  ON public.ordenes_trabajo FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden eliminar OT"
  ON public.ordenes_trabajo FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para plan_anual_logs
CREATE POLICY "Usuarios autenticados pueden ver logs"
  ON public.plan_anual_logs FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden insertar logs"
  ON public.plan_anual_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Triggers para updated_at
CREATE TRIGGER update_plan_anual_lineas_updated_at
  BEFORE UPDATE ON public.plan_anual_lineas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ordenes_trabajo_updated_at
  BEFORE UPDATE ON public.ordenes_trabajo
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para mejorar rendimiento
CREATE INDEX idx_plan_anual_lineas_fecha ON public.plan_anual_lineas(fecha_programada);
CREATE INDEX idx_plan_anual_lineas_sitio ON public.plan_anual_lineas(nombre_sitio);
CREATE INDEX idx_ordenes_trabajo_estado ON public.ordenes_trabajo(estado);
CREATE INDEX idx_ordenes_trabajo_fecha ON public.ordenes_trabajo(fecha_programada);
CREATE INDEX idx_ordenes_trabajo_plan_linea ON public.ordenes_trabajo(id_plan_linea);