-- Agregar política DEV temporal para UPDATE en ordenes_trabajo
CREATE POLICY "DEV: Permitir UPDATE OT" 
ON public.ordenes_trabajo 
FOR UPDATE 
USING (true);