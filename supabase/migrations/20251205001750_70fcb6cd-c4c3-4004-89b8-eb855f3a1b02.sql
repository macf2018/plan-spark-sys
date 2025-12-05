-- Política de desarrollo para permitir SELECT sin autenticación
CREATE POLICY "DEV: Permitir SELECT OT"
ON public.ordenes_trabajo
FOR SELECT
USING (true);