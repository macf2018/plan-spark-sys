-- Eliminar políticas DEV temporales
DROP POLICY IF EXISTS "DEV_ordenes_trabajo_select" ON public.ordenes_trabajo;
DROP POLICY IF EXISTS "DEV_ordenes_trabajo_update" ON public.ordenes_trabajo;
DROP POLICY IF EXISTS "DEV_ordenes_trabajo_insert" ON public.ordenes_trabajo;
DROP POLICY IF EXISTS "DEV_ordenes_historial_select" ON public.ordenes_trabajo_historial;
DROP POLICY IF EXISTS "DEV_ordenes_historial_insert" ON public.ordenes_trabajo_historial;
DROP POLICY IF EXISTS "DEV_plan_anual_lineas_select" ON public.plan_anual_lineas;
DROP POLICY IF EXISTS "DEV_plan_anual_lineas_insert" ON public.plan_anual_lineas;

-- Políticas seguras para ordenes_trabajo (requieren autenticación)
CREATE POLICY "Authenticated users can select ordenes_trabajo"
  ON public.ordenes_trabajo
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ordenes_trabajo"
  ON public.ordenes_trabajo
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update ordenes_trabajo"
  ON public.ordenes_trabajo
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas seguras para ordenes_trabajo_historial
CREATE POLICY "Authenticated users can select ordenes_trabajo_historial"
  ON public.ordenes_trabajo_historial
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ordenes_trabajo_historial"
  ON public.ordenes_trabajo_historial
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas seguras para plan_anual_lineas
CREATE POLICY "Authenticated users can select plan_anual_lineas"
  ON public.plan_anual_lineas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert plan_anual_lineas"
  ON public.plan_anual_lineas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);