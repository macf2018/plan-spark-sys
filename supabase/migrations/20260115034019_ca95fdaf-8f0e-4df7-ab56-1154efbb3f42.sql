-- 1) Crear bucket para fotos de órdenes de trabajo
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-order-photos', 'work-order-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2) Políticas de storage para usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden ver fotos OT"
ON storage.objects FOR SELECT
USING (bucket_id = 'work-order-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden subir fotos OT"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'work-order-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden eliminar fotos OT"
ON storage.objects FOR DELETE
USING (bucket_id = 'work-order-photos' AND auth.uid() IS NOT NULL);

-- 3) Crear tabla para referencias de fotos
CREATE TABLE public.ordenes_trabajo_fotos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  orden_id UUID NOT NULL REFERENCES public.ordenes_trabajo(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT unique_storage_path UNIQUE (storage_path)
);

-- 4) Habilitar RLS
ALTER TABLE public.ordenes_trabajo_fotos ENABLE ROW LEVEL SECURITY;

-- 5) Políticas RLS para la tabla
CREATE POLICY "Usuarios autenticados pueden ver fotos"
ON public.ordenes_trabajo_fotos FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden insertar fotos"
ON public.ordenes_trabajo_fotos FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuarios autenticados pueden eliminar fotos"
ON public.ordenes_trabajo_fotos FOR DELETE
USING (auth.uid() IS NOT NULL);

-- 6) Índice para consultas por orden_id
CREATE INDEX idx_ordenes_trabajo_fotos_orden_id ON public.ordenes_trabajo_fotos(orden_id);