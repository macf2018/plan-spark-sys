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
      equipos: {
        Row: {
          anio_fabricacion: number | null
          created_at: string | null
          created_by: string | null
          estado: Database["public"]["Enums"]["estado_equipo"]
          fecha_ingreso: string
          id: string
          marca: string | null
          modelo: string | null
          nombre_equipo: string
          nro_serie: string | null
          observaciones: string | null
          proveedor_asociado: string | null
          proximo_mantenimiento: string | null
          responsable_asignado: string | null
          sala: string | null
          tipo: Database["public"]["Enums"]["tipo_equipo"]
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
          id?: string
          marca?: string | null
          modelo?: string | null
          nombre_equipo: string
          nro_serie?: string | null
          observaciones?: string | null
          proveedor_asociado?: string | null
          proximo_mantenimiento?: string | null
          responsable_asignado?: string | null
          sala?: string | null
          tipo: Database["public"]["Enums"]["tipo_equipo"]
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
          id?: string
          marca?: string | null
          modelo?: string | null
          nombre_equipo?: string
          nro_serie?: string | null
          observaciones?: string | null
          proveedor_asociado?: string | null
          proximo_mantenimiento?: string | null
          responsable_asignado?: string | null
          sala?: string | null
          tipo?: Database["public"]["Enums"]["tipo_equipo"]
          ubicacion_fisica?: string | null
          updated_at?: string | null
          version_revision?: string | null
          vida_util_estimada?: number | null
          zona?: string | null
        }
        Relationships: []
      }
      equipos_historial_estado: {
        Row: {
          equipo_id: string
          estado_anterior: Database["public"]["Enums"]["estado_equipo"] | null
          estado_nuevo: Database["public"]["Enums"]["estado_equipo"]
          fecha_cambio: string | null
          id: string
          observacion: string | null
          usuario_id: string | null
        }
        Insert: {
          equipo_id: string
          estado_anterior?: Database["public"]["Enums"]["estado_equipo"] | null
          estado_nuevo: Database["public"]["Enums"]["estado_equipo"]
          fecha_cambio?: string | null
          id?: string
          observacion?: string | null
          usuario_id?: string | null
        }
        Update: {
          equipo_id?: string
          estado_anterior?: Database["public"]["Enums"]["estado_equipo"] | null
          estado_nuevo?: Database["public"]["Enums"]["estado_equipo"]
          fecha_cambio?: string | null
          id?: string
          observacion?: string | null
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
          descripcion: string | null
          equipo_id: string | null
          fecha: string | null
          id: string
          usuario_id: string | null
        }
        Insert: {
          accion: string
          descripcion?: string | null
          equipo_id?: string | null
          fecha?: string | null
          id?: string
          usuario_id?: string | null
        }
        Update: {
          accion?: string
          descripcion?: string | null
          equipo_id?: string | null
          fecha?: string | null
          id?: string
          usuario_id?: string | null
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
