-- Corregir función update_updated_at_column con search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Corregir función log_equipo_estado_change con search_path seguro
CREATE OR REPLACE FUNCTION public.log_equipo_estado_change()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.estado IS DISTINCT FROM NEW.estado THEN
    INSERT INTO public.equipos_historial_estado (
      equipo_id,
      estado_anterior,
      estado_nuevo,
      observacion,
      usuario_id
    ) VALUES (
      NEW.id,
      OLD.estado,
      NEW.estado,
      'Cambio automático de estado',
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$;