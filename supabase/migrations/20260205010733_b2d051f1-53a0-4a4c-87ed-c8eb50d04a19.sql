-- 1) Agregar columnas de match status a ordenes_trabajo
ALTER TABLE public.ordenes_trabajo
ADD COLUMN equipo_match_status text DEFAULT 'OK',
ADD COLUMN equipo_match_reason text;

-- Comentarios
COMMENT ON COLUMN public.ordenes_trabajo.equipo_match_status IS 'Estado del match de equipo: OK, NO_MATCH, PENDING';
COMMENT ON COLUMN public.ordenes_trabajo.equipo_match_reason IS 'Razón del estado de match cuando no es OK';