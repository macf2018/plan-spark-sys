-- Crear tabla de historial de cambios de OT
CREATE TABLE IF NOT EXISTS public.ordenes_trabajo_historial (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  orden_id uuid NOT NULL REFERENCES public.ordenes_trabajo(id) ON DELETE CASCADE,
  fecha_hora timestamp with time zone NOT NULL DEFAULT now(),
  usuario text DEFAULT 'sistema',
  accion text NOT NULL,
  estado_anterior text,
  estado_nuevo text,
  campos_modificados jsonb,
  descripcion text,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.ordenes_trabajo_historial ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Permitir INSERT historial OT"
ON public.ordenes_trabajo_historial
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir SELECT historial OT"
ON public.ordenes_trabajo_historial
FOR SELECT
USING (true);

-- Índice para búsquedas por orden
CREATE INDEX idx_ot_historial_orden ON public.ordenes_trabajo_historial(orden_id);
CREATE INDEX idx_ot_historial_fecha ON public.ordenes_trabajo_historial(fecha_hora DESC);