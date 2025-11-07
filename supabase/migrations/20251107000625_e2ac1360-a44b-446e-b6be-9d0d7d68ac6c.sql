-- Crear tabla de catálogo para tramos
CREATE TABLE public.catalogo_tramos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Crear tabla de catálogo para sentidos
CREATE TABLE public.catalogo_sentidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Crear tabla de catálogo para PKs
CREATE TABLE public.catalogo_pks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pk TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT pk_format CHECK (pk ~ '^\d+\+\d{1,3}$')
);

-- Crear tabla de catálogo para shelters
CREATE TABLE public.catalogo_shelters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  ubicacion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Crear tabla de catálogo para pórticos
CREATE TABLE public.catalogo_porticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  ubicacion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Crear tabla de catálogo para marcas
CREATE TABLE public.catalogo_marcas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Crear tabla de catálogo para modelos
CREATE TABLE public.catalogo_modelos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  marca_id UUID REFERENCES public.catalogo_marcas(id),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Agregar nuevos campos a equipos
ALTER TABLE public.equipos 
  ADD COLUMN tramo_id UUID REFERENCES public.catalogo_tramos(id),
  ADD COLUMN sentido_id UUID REFERENCES public.catalogo_sentidos(id),
  ADD COLUMN pk_id UUID REFERENCES public.catalogo_pks(id),
  ADD COLUMN shelter_id UUID REFERENCES public.catalogo_shelters(id),
  ADD COLUMN portico_id UUID REFERENCES public.catalogo_porticos(id),
  ADD COLUMN marca_id UUID REFERENCES public.catalogo_marcas(id),
  ADD COLUMN modelo_id UUID REFERENCES public.catalogo_modelos(id),
  ADD COLUMN fecha_inicio_estado TIMESTAMPTZ,
  ADD COLUMN tecnico_responsable_estado TEXT;

-- Actualizar historial de estado para incluir más información
ALTER TABLE public.equipos_historial_estado
  ADD COLUMN fecha_inicio_estado TIMESTAMPTZ,
  ADD COLUMN tecnico_responsable TEXT,
  ADD COLUMN campos_modificados JSONB;

-- Actualizar equipos_logs para incluir más detalle
ALTER TABLE public.equipos_logs
  ADD COLUMN tipo_log TEXT DEFAULT 'auditoría',
  ADD COLUMN valor_anterior JSONB,
  ADD COLUMN valor_nuevo JSONB,
  ADD COLUMN campos_modificados TEXT[];

-- Agregar constraint para fecha_ingreso
ALTER TABLE public.equipos
  ADD CONSTRAINT fecha_ingreso_valida CHECK (fecha_ingreso <= CURRENT_DATE);

-- Crear índices para mejorar performance (solo los que no existen)
CREATE INDEX idx_equipos_tramo ON public.equipos(tramo_id);
CREATE INDEX idx_equipos_sentido ON public.equipos(sentido_id);
CREATE INDEX idx_equipos_pk ON public.equipos(pk_id);
CREATE INDEX idx_equipos_proximo_mantenimiento ON public.equipos(proximo_mantenimiento);

-- Habilitar RLS en tablas de catálogo
ALTER TABLE public.catalogo_tramos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_sentidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_pks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_porticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_modelos ENABLE ROW LEVEL SECURITY;

-- Políticas para catálogos (lectura pública, escritura autenticada)
CREATE POLICY "Todos pueden ver tramos" ON public.catalogo_tramos FOR SELECT USING (true);
CREATE POLICY "Usuarios autenticados pueden modificar tramos" ON public.catalogo_tramos FOR ALL USING (true);

CREATE POLICY "Todos pueden ver sentidos" ON public.catalogo_sentidos FOR SELECT USING (true);
CREATE POLICY "Usuarios autenticados pueden modificar sentidos" ON public.catalogo_sentidos FOR ALL USING (true);

CREATE POLICY "Todos pueden ver PKs" ON public.catalogo_pks FOR SELECT USING (true);
CREATE POLICY "Usuarios autenticados pueden modificar PKs" ON public.catalogo_pks FOR ALL USING (true);

CREATE POLICY "Todos pueden ver shelters" ON public.catalogo_shelters FOR SELECT USING (true);
CREATE POLICY "Usuarios autenticados pueden modificar shelters" ON public.catalogo_shelters FOR ALL USING (true);

CREATE POLICY "Todos pueden ver pórticos" ON public.catalogo_porticos FOR SELECT USING (true);
CREATE POLICY "Usuarios autenticados pueden modificar pórticos" ON public.catalogo_porticos FOR ALL USING (true);

CREATE POLICY "Todos pueden ver marcas" ON public.catalogo_marcas FOR SELECT USING (true);
CREATE POLICY "Usuarios autenticados pueden modificar marcas" ON public.catalogo_marcas FOR ALL USING (true);

CREATE POLICY "Todos pueden ver modelos" ON public.catalogo_modelos FOR SELECT USING (true);
CREATE POLICY "Usuarios autenticados pueden modificar modelos" ON public.catalogo_modelos FOR ALL USING (true);

-- Trigger para actualizar updated_at en catálogos
CREATE TRIGGER update_catalogo_tramos_updated_at
  BEFORE UPDATE ON public.catalogo_tramos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_catalogo_sentidos_updated_at
  BEFORE UPDATE ON public.catalogo_sentidos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_catalogo_pks_updated_at
  BEFORE UPDATE ON public.catalogo_pks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_catalogo_shelters_updated_at
  BEFORE UPDATE ON public.catalogo_shelters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_catalogo_porticos_updated_at
  BEFORE UPDATE ON public.catalogo_porticos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_catalogo_marcas_updated_at
  BEFORE UPDATE ON public.catalogo_marcas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_catalogo_modelos_updated_at
  BEFORE UPDATE ON public.catalogo_modelos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar datos iniciales en catálogos
INSERT INTO public.catalogo_tramos (nombre, descripcion) VALUES
  ('Tramo 1', 'Primer tramo del trayecto'),
  ('Tramo 2', 'Segundo tramo del trayecto'),
  ('Tramo 3', 'Tercer tramo del trayecto');

INSERT INTO public.catalogo_sentidos (nombre, descripcion) VALUES
  ('Norte-Sur', 'Sentido de norte a sur'),
  ('Sur-Norte', 'Sentido de sur a norte'),
  ('Este-Oeste', 'Sentido de este a oeste'),
  ('Oeste-Este', 'Sentido de oeste a este');

INSERT INTO public.catalogo_pks (pk, descripcion) VALUES
  ('0+000', 'Inicio del trayecto'),
  ('1+000', 'Kilómetro 1'),
  ('2+500', 'Kilómetro 2.5');

INSERT INTO public.catalogo_marcas (nombre) VALUES
  ('Siemens'),
  ('ABB'),
  ('Schneider Electric'),
  ('General Electric'),
  ('Honeywell');