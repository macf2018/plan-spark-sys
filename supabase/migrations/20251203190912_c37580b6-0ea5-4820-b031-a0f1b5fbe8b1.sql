-- ============================================
-- TEMPORAL: RLS relajada para desarrollo
-- REVERTIR antes de producción
-- ============================================

-- plan_anual_lineas: Permitir INSERT sin autenticación
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar plan anual" ON public.plan_anual_lineas;
CREATE POLICY "DEV: Permitir INSERT plan anual" 
ON public.plan_anual_lineas 
FOR INSERT 
WITH CHECK (true);

-- ordenes_trabajo: Permitir INSERT sin autenticación
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar OT" ON public.ordenes_trabajo;
CREATE POLICY "DEV: Permitir INSERT OT" 
ON public.ordenes_trabajo 
FOR INSERT 
WITH CHECK (true);

-- plan_anual_logs: Permitir INSERT sin autenticación
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar logs" ON public.plan_anual_logs;
CREATE POLICY "DEV: Permitir INSERT logs plan anual" 
ON public.plan_anual_logs 
FOR INSERT 
WITH CHECK (true);

-- ============================================
-- NOTA: Estas políticas permiten INSERT a cualquier usuario
-- incluso sin autenticación. SOLO para desarrollo.
-- En producción, restaurar políticas con auth.uid() IS NOT NULL
-- ============================================