
-- Crear tabla de alias para shelters
CREATE TABLE public.catalogo_shelter_alias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alias_nombre text NOT NULL,
  shelter_id uuid NOT NULL REFERENCES public.catalogo_shelters(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT catalogo_shelter_alias_nombre_unique UNIQUE (alias_nombre)
);

-- Índice para búsqueda eficiente
CREATE INDEX idx_catalogo_shelter_alias_nombre ON public.catalogo_shelter_alias (LOWER(TRIM(alias_nombre)));

-- RLS
ALTER TABLE public.catalogo_shelter_alias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver alias" ON public.catalogo_shelter_alias
  FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden modificar alias" ON public.catalogo_shelter_alias
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Comentario
COMMENT ON TABLE public.catalogo_shelter_alias IS 'Mapeo de nombres alternativos a shelters canónicos para backfill de OTs';
