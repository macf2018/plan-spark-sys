-- =====================================================
-- MIGRACIÓN DEMO: Equipos → Plan → OT → Ejecución
-- =====================================================

-- 1) AGREGAR COLUMNA tipo_equipo A EQUIPOS
ALTER TABLE public.equipos 
ADD COLUMN IF NOT EXISTS tipo_equipo TEXT;

-- 2) AGREGAR equipo_id A plan_anual_lineas
ALTER TABLE public.plan_anual_lineas 
ADD COLUMN IF NOT EXISTS equipo_id UUID REFERENCES public.equipos(id) ON DELETE SET NULL;

-- 3) AGREGAR equipo_id A ordenes_trabajo
ALTER TABLE public.ordenes_trabajo 
ADD COLUMN IF NOT EXISTS equipo_id UUID REFERENCES public.equipos(id) ON DELETE SET NULL;

-- 4) CREAR TABLA DE PLANTILLAS DE CHECKLIST
CREATE TABLE IF NOT EXISTS public.checklist_plantillas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  tipo_equipo TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5) CREAR TABLA DE ITEMS DE PLANTILLA
CREATE TABLE IF NOT EXISTS public.checklist_plantilla_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plantilla_id UUID NOT NULL REFERENCES public.checklist_plantillas(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  required BOOLEAN DEFAULT false,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(plantilla_id, item_key)
);

-- 6) HABILITAR RLS EN NUEVAS TABLAS
ALTER TABLE public.checklist_plantillas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_plantilla_items ENABLE ROW LEVEL SECURITY;

-- 7) POLÍTICAS RLS PARA PLANTILLAS (lectura pública, escritura autenticada)
CREATE POLICY "Todos pueden ver plantillas" ON public.checklist_plantillas
  FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden modificar plantillas" ON public.checklist_plantillas
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Todos pueden ver items de plantilla" ON public.checklist_plantilla_items
  FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden modificar items de plantilla" ON public.checklist_plantilla_items
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 8) ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_equipos_tipo_equipo ON public.equipos(tipo_equipo);
CREATE INDEX IF NOT EXISTS idx_ordenes_trabajo_equipo_id ON public.ordenes_trabajo(equipo_id);
CREATE INDEX IF NOT EXISTS idx_plan_anual_lineas_equipo_id ON public.plan_anual_lineas(equipo_id);
CREATE INDEX IF NOT EXISTS idx_checklist_plantilla_items_plantilla ON public.checklist_plantilla_items(plantilla_id);

-- 9) ASEGURAR UNIQUE EN ordenes_trabajo_checklist (orden_id, item_key)
-- Primero verificar si existe, si no crear
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'ordenes_trabajo_checklist_orden_item_unique'
  ) THEN
    ALTER TABLE public.ordenes_trabajo_checklist 
    ADD CONSTRAINT ordenes_trabajo_checklist_orden_item_unique UNIQUE (orden_id, item_key);
  END IF;
EXCEPTION WHEN duplicate_table THEN
  NULL;
END $$;