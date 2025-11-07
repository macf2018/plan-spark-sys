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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      estado_equipo:
        | "operativo"
        | "en_reparacion"
        | "en_mantenimiento"
        | "fuera_de_servicio"
        | "obsoleto"
        | "dado_de_baja"
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
      estado_equipo: [
        "operativo",
        "en_reparacion",
        "en_mantenimiento",
        "fuera_de_servicio",
        "obsoleto",
        "dado_de_baja",
      ],
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
