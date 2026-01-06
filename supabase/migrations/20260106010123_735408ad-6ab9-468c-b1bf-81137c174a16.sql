-- Tabla para checklist items de órdenes de trabajo
CREATE TABLE public.ordenes_trabajo_checklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  orden_id UUID NOT NULL REFERENCES public.ordenes_trabajo(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  required BOOLEAN NOT NULL DEFAULT false,
  completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(orden_id, item_key)
);

-- Tabla para observaciones/notas de órdenes de trabajo
CREATE TABLE public.ordenes_trabajo_observaciones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  orden_id UUID NOT NULL REFERENCES public.ordenes_trabajo(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success')),
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.ordenes_trabajo_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes_trabajo_observaciones ENABLE ROW LEVEL SECURITY;

-- Políticas para checklist
CREATE POLICY "Usuarios autenticados pueden ver checklist"
ON public.ordenes_trabajo_checklist FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden insertar checklist"
ON public.ordenes_trabajo_checklist FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden actualizar checklist"
ON public.ordenes_trabajo_checklist FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden eliminar checklist"
ON public.ordenes_trabajo_checklist FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Políticas para observaciones
CREATE POLICY "Usuarios autenticados pueden ver observaciones"
ON public.ordenes_trabajo_observaciones FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden insertar observaciones"
ON public.ordenes_trabajo_observaciones FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden eliminar observaciones"
ON public.ordenes_trabajo_observaciones FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Índices para performance
CREATE INDEX idx_checklist_orden_id ON public.ordenes_trabajo_checklist(orden_id);
CREATE INDEX idx_observaciones_orden_id ON public.ordenes_trabajo_observaciones(orden_id);