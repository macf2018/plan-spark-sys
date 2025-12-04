-- Agregar campos de tracking a plan_anual_logs
ALTER TABLE public.plan_anual_logs 
ADD COLUMN IF NOT EXISTS ip_carga text,
ADD COLUMN IF NOT EXISTS duracion_carga_ms integer,
ADD COLUMN IF NOT EXISTS id_carga uuid DEFAULT gen_random_uuid();

-- Crear índice para búsqueda rápida por fecha
CREATE INDEX IF NOT EXISTS idx_plan_anual_logs_fecha ON public.plan_anual_logs(fecha_hora DESC);

-- Comentario: Estos campos son para tracking de cargas en desarrollo
COMMENT ON COLUMN public.plan_anual_logs.ip_carga IS 'IP desde donde se realizó la carga (desarrollo)';
COMMENT ON COLUMN public.plan_anual_logs.duracion_carga_ms IS 'Duración de la carga en milisegundos';