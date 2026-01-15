export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      catalogo_marcas: {
        Row: {
          activo: boolean | null
          created_at: string | null
          id: string
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      catalogo_modelos: {
        Row: {
          activo: boolean | null
          created_at: string | null
          id: string
          marca_id: string | null
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          marca_id?: string | null
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          marca_id?: string | null
          nombre?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalogo_modelos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "catalogo_marcas"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogo_pks: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          id: string
          pk: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          pk: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          pk?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      catalogo_porticos: {
        Row: {
          activo: boolean | null
          created_at: string | null
          id: string
          nombre: string
          ubicacion: string | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          nombre: string
          ubicacion?: string | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          nombre?: string
          ubicacion?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      catalogo_sentidos: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      catalogo_shelters: {
        Row: {
          activo: boolean | null
          created_at: string | null
          id: string
          nombre: string
          ubicacion: string | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          nombre: string
          ubicacion?: string | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          id?: string
          nombre?: string
          ubicacion?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      catalogo_tramos: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      equipos: {
        Row: {
          anio_fabricacion: number | null
          created_at: string | null
          created_by: string | null
          estado: Database["public"]["Enums"]["estado_equipo"]
          fecha_ingreso: string
          fecha_inicio_estado: string | null
          id: string
          marca: string | null
          marca_id: string | null
          modelo: string | null
          modelo_id: string | null
          nombre_equipo: string
          nro_serie: string | null
          observaciones: string | null
          pk_id: string | null
          portico_id: string | null
          proveedor_asociado: string | null
          proximo_mantenimiento: string | null
          responsable_asignado: string | null
          sala: string | null
          sentido_id: string | null
          shelter_id: string | null
          tecnico_responsable_estado: string | null
          tipo: Database["public"]["Enums"]["tipo_equipo"]
          tramo_id: string | null
          ubicacion_fisica: string | null
          updated_at: string | null
          version_revision: string | null
          vida_util_estimada: number | null
          zona: string | null
        }
        Insert: {
          anio_fabricacion?: number | null
          created_at?: string | null
          created_by?: string | null
          estado?: Database["public"]["Enums"]["estado_equipo"]
          fecha_ingreso?: string
          fecha_inicio_estado?: string | null
          id?: string
          marca?: string | null
          marca_id?: string | null
          modelo?: string | null
          modelo_id?: string | null
          nombre_equipo: string
          nro_serie?: string | null
          observaciones?: string | null
          pk_id?: string | null
          portico_id?: string | null
          proveedor_asociado?: string | null
          proximo_mantenimiento?: string | null
          responsable_asignado?: string | null
          sala?: string | null
          sentido_id?: string | null
          shelter_id?: string | null
          tecnico_responsable_estado?: string | null
          tipo: Database["public"]["Enums"]["tipo_equipo"]
          tramo_id?: string | null
          ubicacion_fisica?: string | null
          updated_at?: string | null
          version_revision?: string | null
          vida_util_estimada?: number | null
          zona?: string | null
        }
        Update: {
          anio_fabricacion?: number | null
          created_at?: string | null
          created_by?: string | null
          estado?: Database["public"]["Enums"]["estado_equipo"]
          fecha_ingreso?: string
          fecha_inicio_estado?: string | null
          id?: string
          marca?: string | null
          marca_id?: string | null
          modelo?: string | null
          modelo_id?: string | null
          nombre_equipo?: string
          nro_serie?: string | null
          observaciones?: string | null
          pk_id?: string | null
          portico_id?: string | null
          proveedor_asociado?: string | null
          proximo_mantenimiento?: string | null
          responsable_asignado?: string | null
          sala?: string | null
          sentido_id?: string | null
          shelter_id?: string | null
          tecnico_responsable_estado?: string | null
          tipo?: Database["public"]["Enums"]["tipo_equipo"]
          tramo_id?: string | null
          ubicacion_fisica?: string | null
          updated_at?: string | null
          version_revision?: string | null
          vida_util_estimada?: number | null
          zona?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "catalogo_marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipos_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "catalogo_modelos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipos_pk_id_fkey"
            columns: ["pk_id"]
            isOneToOne: false
            referencedRelation: "catalogo_pks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipos_portico_id_fkey"
            columns: ["portico_id"]
            isOneToOne: false
            referencedRelation: "catalogo_porticos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipos_sentido_id_fkey"
            columns: ["sentido_id"]
            isOneToOne: false
            referencedRelation: "catalogo_sentidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipos_shelter_id_fkey"
            columns: ["shelter_id"]
            isOneToOne: false
            referencedRelation: "catalogo_shelters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipos_tramo_id_fkey"
            columns: ["tramo_id"]
            isOneToOne: false
            referencedRelation: "catalogo_tramos"
            referencedColumns: ["id"]
          },
        ]
      }
      equipos_historial_estado: {
        Row: {
          campos_modificados: Json | null
          equipo_id: string
          estado_anterior: Database["public"]["Enums"]["estado_equipo"] | null
          estado_nuevo: Database["public"]["Enums"]["estado_equipo"]
          fecha_cambio: string | null
          fecha_inicio_estado: string | null
          id: string
          observacion: string | null
          tecnico_responsable: string | null
          usuario_id: string | null
        }
        Insert: {
          campos_modificados?: Json | null
          equipo_id: string
          estado_anterior?: Database["public"]["Enums"]["estado_equipo"] | null
          estado_nuevo: Database["public"]["Enums"]["estado_equipo"]
          fecha_cambio?: string | null
          fecha_inicio_estado?: string | null
          id?: string
          observacion?: string | null
          tecnico_responsable?: string | null
          usuario_id?: string | null
        }
        Update: {
          campos_modificados?: Json | null
          equipo_id?: string
          estado_anterior?: Database["public"]["Enums"]["estado_equipo"] | null
          estado_nuevo?: Database["public"]["Enums"]["estado_equipo"]
          fecha_cambio?: string | null
          fecha_inicio_estado?: string | null
          id?: string
          observacion?: string | null
          tecnico_responsable?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipos_historial_estado_equipo_id_fkey"
            columns: ["equipo_id"]
            isOneToOne: false
            referencedRelation: "equipos"
            referencedColumns: ["id"]
          },
        ]
      }
      equipos_logs: {
        Row: {
          accion: string
          campos_modificados: string[] | null
          descripcion: string | null
          equipo_id: string | null
          fecha: string | null
          id: string
          tipo_log: string | null
          usuario_id: string | null
          valor_anterior: Json | null
          valor_nuevo: Json | null
        }
        Insert: {
          accion: string
          campos_modificados?: string[] | null
          descripcion?: string | null
          equipo_id?: string | null
          fecha?: string | null
          id?: string
          tipo_log?: string | null
          usuario_id?: string | null
          valor_anterior?: Json | null
          valor_nuevo?: Json | null
        }
        Update: {
          accion?: string
          campos_modificados?: string[] | null
          descripcion?: string | null
          equipo_id?: string | null
          fecha?: string | null
          id?: string
          tipo_log?: string | null
          usuario_id?: string | null
          valor_anterior?: Json | null
          valor_nuevo?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "equipos_logs_equipo_id_fkey"
            columns: ["equipo_id"]
            isOneToOne: false
            referencedRelation: "equipos"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes_trabajo: {
        Row: {
          created_at: string | null
          created_by: string | null
          criticidad: string | null
          descripcion_trabajo: string | null
          estado: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          fecha_programada: string
          frecuencia: string
          id: string
          id_plan_linea: string | null
          nombre_sitio: string
          observaciones: string | null
          pk: string
          proveedor_codigo: string | null
          proveedor_nombre: string | null
          tecnico_asignado: string | null
          tipo_equipo: string
          tipo_mantenimiento: string
          tramo: string
          updated_at: string | null
          ventana_horaria: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          criticidad?: string | null
          descripcion_trabajo?: string | null
          estado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          fecha_programada: string
          frecuencia: string
          id?: string
          id_plan_linea?: string | null
          nombre_sitio: string
          observaciones?: string | null
          pk: string
          proveedor_codigo?: string | null
          proveedor_nombre?: string | null
          tecnico_asignado?: string | null
          tipo_equipo: string
          tipo_mantenimiento: string
          tramo: string
          updated_at?: string | null
          ventana_horaria?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          criticidad?: string | null
          descripcion_trabajo?: string | null
          estado?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          fecha_programada?: string
          frecuencia?: string
          id?: string
          id_plan_linea?: string | null
          nombre_sitio?: string
          observaciones?: string | null
          pk?: string
          proveedor_codigo?: string | null
          proveedor_nombre?: string | null
          tecnico_asignado?: string | null
          tipo_equipo?: string
          tipo_mantenimiento?: string
          tramo?: string
          updated_at?: string | null
          ventana_horaria?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_trabajo_id_plan_linea_fkey"
            columns: ["id_plan_linea"]
            isOneToOne: false
            referencedRelation: "plan_anual_lineas"
            referencedColumns: ["id_plan_linea"]
          },
        ]
      }
      ordenes_trabajo_checklist: {
        Row: {
          completed: boolean
          completed_at: string | null
          completed_by: string | null
          created_at: string
          description: string | null
          id: string
          item_key: string
          notes: string | null
          orden_id: string
          required: boolean
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          item_key: string
          notes?: string | null
          orden_id: string
          required?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          item_key?: string
          notes?: string | null
          orden_id?: string
          required?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_trabajo_checklist_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "ordenes_trabajo"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes_trabajo_fotos: {
        Row: {
          caption: string | null
          created_at: string
          created_by: string | null
          id: string
          orden_id: string
          storage_path: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          orden_id: string
          storage_path: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          orden_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_trabajo_fotos_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "ordenes_trabajo"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes_trabajo_historial: {
        Row: {
          accion: string
          campos_modificados: Json | null
          created_at: string | null
          descripcion: string | null
          estado_anterior: string | null
          estado_nuevo: string | null
          fecha_hora: string
          id: string
          orden_id: string
          usuario: string | null
        }
        Insert: {
          accion: string
          campos_modificados?: Json | null
          created_at?: string | null
          descripcion?: string | null
          estado_anterior?: string | null
          estado_nuevo?: string | null
          fecha_hora?: string
          id?: string
          orden_id: string
          usuario?: string | null
        }
        Update: {
          accion?: string
          campos_modificados?: Json | null
          created_at?: string | null
          descripcion?: string | null
          estado_anterior?: string | null
          estado_nuevo?: string | null
          fecha_hora?: string
          id?: string
          orden_id?: string
          usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_trabajo_historial_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "ordenes_trabajo"
            referencedColumns: ["id"]
          },
        ]
      }
      ordenes_trabajo_observaciones: {
        Row: {
          author: string
          created_at: string
          id: string
          orden_id: string
          text: string
          type: string
        }
        Insert: {
          author: string
          created_at?: string
          id?: string
          orden_id: string
          text: string
          type?: string
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          orden_id?: string
          text?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_trabajo_observaciones_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "ordenes_trabajo"
            referencedColumns: ["id"]
          },
        ]
      }
      personal: {
        Row: {
          cargo: string | null
          correo_electronico: string
          created_at: string | null
          created_by: string | null
          empresa_proveedor: string | null
          estado: Database["public"]["Enums"]["estado_personal"]
          fecha_inicio_vigencia: string
          fecha_termino_vigencia: string | null
          id: string
          nombre_completo: string
          observaciones: string | null
          require_cambio_clave: boolean | null
          telefono: string | null
          ultimo_acceso: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cargo?: string | null
          correo_electronico: string
          created_at?: string | null
          created_by?: string | null
          empresa_proveedor?: string | null
          estado?: Database["public"]["Enums"]["estado_personal"]
          fecha_inicio_vigencia?: string
          fecha_termino_vigencia?: string | null
          id?: string
          nombre_completo: string
          observaciones?: string | null
          require_cambio_clave?: boolean | null
          telefono?: string | null
          ultimo_acceso?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cargo?: string | null
          correo_electronico?: string
          created_at?: string | null
          created_by?: string | null
          empresa_proveedor?: string | null
          estado?: Database["public"]["Enums"]["estado_personal"]
          fecha_inicio_vigencia?: string
          fecha_termino_vigencia?: string | null
          id?: string
          nombre_completo?: string
          observaciones?: string | null
          require_cambio_clave?: boolean | null
          telefono?: string | null
          ultimo_acceso?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      personal_auditoria: {
        Row: {
          accion: string
          campos_modificados: Json | null
          descripcion: string | null
          fecha: string | null
          id: string
          personal_id: string | null
          tipo_log: string | null
          usuario_id: string | null
          valor_anterior: Json | null
          valor_nuevo: Json | null
        }
        Insert: {
          accion: string
          campos_modificados?: Json | null
          descripcion?: string | null
          fecha?: string | null
          id?: string
          personal_id?: string | null
          tipo_log?: string | null
          usuario_id?: string | null
          valor_anterior?: Json | null
          valor_nuevo?: Json | null
        }
        Update: {
          accion?: string
          campos_modificados?: Json | null
          descripcion?: string | null
          fecha?: string | null
          id?: string
          personal_id?: string | null
          tipo_log?: string | null
          usuario_id?: string | null
          valor_anterior?: Json | null
          valor_nuevo?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_auditoria_personal_id_fkey"
            columns: ["personal_id"]
            isOneToOne: false
            referencedRelation: "personal"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_anual_lineas: {
        Row: {
          anio: number
          created_at: string | null
          criticidad: string | null
          descripcion_trabajo: string | null
          estado_plan: string | null
          fecha_carga: string | null
          fecha_programada: string
          frecuencia: string
          id_plan_linea: string
          mes: number
          nombre_sitio: string
          origen_archivo: string | null
          pk: string
          proveedor_codigo: string | null
          proveedor_nombre: string | null
          tipo_equipo: string
          tipo_mantenimiento: string
          tramo: string
          updated_at: string | null
          usuario_carga: string | null
          ventana_horaria: string | null
        }
        Insert: {
          anio: number
          created_at?: string | null
          criticidad?: string | null
          descripcion_trabajo?: string | null
          estado_plan?: string | null
          fecha_carga?: string | null
          fecha_programada: string
          frecuencia: string
          id_plan_linea?: string
          mes: number
          nombre_sitio: string
          origen_archivo?: string | null
          pk: string
          proveedor_codigo?: string | null
          proveedor_nombre?: string | null
          tipo_equipo: string
          tipo_mantenimiento: string
          tramo: string
          updated_at?: string | null
          usuario_carga?: string | null
          ventana_horaria?: string | null
        }
        Update: {
          anio?: number
          created_at?: string | null
          criticidad?: string | null
          descripcion_trabajo?: string | null
          estado_plan?: string | null
          fecha_carga?: string | null
          fecha_programada?: string
          frecuencia?: string
          id_plan_linea?: string
          mes?: number
          nombre_sitio?: string
          origen_archivo?: string | null
          pk?: string
          proveedor_codigo?: string | null
          proveedor_nombre?: string | null
          tipo_equipo?: string
          tipo_mantenimiento?: string
          tramo?: string
          updated_at?: string | null
          usuario_carga?: string | null
          ventana_horaria?: string | null
        }
        Relationships: []
      }
      plan_anual_logs: {
        Row: {
          detalles_errores: Json | null
          duracion_carga_ms: number | null
          fecha_hora: string | null
          id: string
          id_carga: string | null
          ip_carga: string | null
          nombre_archivo: string
          total_filas_error: number
          total_filas_validas: number
          usuario: string | null
        }
        Insert: {
          detalles_errores?: Json | null
          duracion_carga_ms?: number | null
          fecha_hora?: string | null
          id?: string
          id_carga?: string | null
          ip_carga?: string | null
          nombre_archivo: string
          total_filas_error: number
          total_filas_validas: number
          usuario?: string | null
        }
        Update: {
          detalles_errores?: Json | null
          duracion_carga_ms?: number | null
          fecha_hora?: string | null
          id?: string
          id_carga?: string | null
          ip_carga?: string | null
          nombre_archivo?: string
          total_filas_error?: number
          total_filas_validas?: number
          usuario?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          asignado_por: string | null
          fecha_asignacion: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          asignado_por?: string | null
          fecha_asignacion?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          asignado_por?: string | null
          fecha_asignacion?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      actualizar_estado_vigencia_personal: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_system: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role:
        | "administrador_general"
        | "supervisor_tecnico"
        | "operador_tecnico"
        | "proveedor_contratista"
        | "jefatura_gerencia"
        | "usuario_proceso_sistema"
        | "usuario_tecnologia"
        | "invitado"
      estado_equipo:
        | "operativo"
        | "en_reparacion"
        | "en_mantenimiento"
        | "fuera_de_servicio"
        | "obsoleto"
        | "dado_de_baja"
      estado_personal: "activo" | "inactivo" | "suspendido" | "vencido"
      tipo_equipo:
        | "electrico"
        | "mecanico"
        | "electronico"
        | "medicion"
        | "otros"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "administrador_general",
        "supervisor_tecnico",
        "operador_tecnico",
        "proveedor_contratista",
        "jefatura_gerencia",
        "usuario_proceso_sistema",
        "usuario_tecnologia",
        "invitado",
      ],
      estado_equipo: [
        "operativo",
        "en_reparacion",
        "en_mantenimiento",
        "fuera_de_servicio",
        "obsoleto",
        "dado_de_baja",
      ],
      estado_personal: ["activo", "inactivo", "suspendido", "vencido"],
      tipo_equipo: [
        "electrico",
        "mecanico",
        "electronico",
        "medicion",
        "otros",
      ],
    },
  },
} as const
