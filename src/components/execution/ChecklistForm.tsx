import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  item_key: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  notes?: string;
}

interface ChecklistFormProps {
  orderId: string;
}

// Default checklist template
const DEFAULT_CHECKLIST: Omit<ChecklistItem, "id">[] = [
  {
    item_key: "inspeccion_visual",
    title: "Inspección visual del equipo",
    description: "Verificar estado físico y señales de deterioro",
    required: true,
    completed: false,
  },
  {
    item_key: "medicion_voltaje",
    title: "Medición de voltaje",
    description: "Registrar voltaje de entrada y salida",
    required: true,
    completed: false,
  },
  {
    item_key: "prueba_aislamiento",
    title: "Prueba de aislamiento",
    description: "Verificar resistencia de aislamiento con megger",
    required: true,
    completed: false,
  },
  {
    item_key: "limpieza_contactos",
    title: "Limpieza de contactos",
    description: "Limpiar y verificar conexiones",
    required: false,
    completed: false,
  },
  {
    item_key: "revision_protecciones",
    title: "Revisión de protecciones",
    description: "Comprobar fusibles y dispositivos de protección",
    required: true,
    completed: false,
  },
  {
    item_key: "prueba_funcionamiento",
    title: "Prueba de funcionamiento",
    description: "Verificar operación normal del equipo",
    required: true,
    completed: false,
  },
];

export function ChecklistForm({ orderId }: ChecklistFormProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load checklist from DB
  const loadChecklist = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("ordenes_trabajo_checklist")
        .select("*")
        .eq("orden_id", orderId);

      if (error) throw error;

      if (data && data.length > 0) {
        // Map DB data to component format
        setItems(
          data.map((row) => ({
            id: row.id,
            item_key: row.item_key,
            title: row.title,
            description: row.description || "",
            required: row.required,
            completed: row.completed,
            notes: row.notes || "",
          }))
        );
      } else {
        // Initialize with default checklist for this order
        const initialItems: ChecklistItem[] = DEFAULT_CHECKLIST.map(
          (item, index) => ({
            ...item,
            id: `temp-${index}`,
          })
        );
        setItems(initialItems);

        // Insert defaults into DB
        const inserts = DEFAULT_CHECKLIST.map((item) => ({
          orden_id: orderId,
          item_key: item.item_key,
          title: item.title,
          description: item.description,
          required: item.required,
          completed: item.completed,
          notes: "",
        }));

        const { data: inserted, error: insertError } = await supabase
          .from("ordenes_trabajo_checklist")
          .insert(inserts)
          .select();

        if (insertError) throw insertError;

        if (inserted) {
          setItems(
            inserted.map((row) => ({
              id: row.id,
              item_key: row.item_key,
              title: row.title,
              description: row.description || "",
              required: row.required,
              completed: row.completed,
              notes: row.notes || "",
            }))
          );
        }
      }
    } catch (err) {
      console.error("Error loading checklist:", err);
      toast.error("Error al cargar checklist");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadChecklist();
  }, [loadChecklist]);

  const toggleItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item || id.startsWith("temp-")) return;

    const newCompleted = !item.completed;
    
    // Optimistic update
    setItems(items.map((i) => (i.id === id ? { ...i, completed: newCompleted } : i)));

    try {
      const { error } = await supabase
        .from("ordenes_trabajo_checklist")
        .update({
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating checklist item:", err);
      // Revert on error
      setItems(items.map((i) => (i.id === id ? { ...i, completed: !newCompleted } : i)));
      toast.error("Error al actualizar item");
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    if (id.startsWith("temp-")) return;
    
    // Optimistic update
    setItems(items.map((item) => (item.id === id ? { ...item, notes } : item)));
  };

  // Debounced save for notes
  const saveNotes = async (id: string, notes: string) => {
    if (id.startsWith("temp-")) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from("ordenes_trabajo_checklist")
        .update({
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Error saving notes:", err);
      toast.error("Error al guardar notas");
    } finally {
      setSaving(false);
    }
  };

  const completedCount = items.filter((i) => i.completed).length;
  const requiredCount = items.filter((i) => i.required).length;
  const requiredCompleted = items.filter((i) => i.required && i.completed).length;
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  if (loading) {
    return (
      <Card className="shadow-notion">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Cargando checklist...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-notion">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Checklist de Ejecución
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              {completedCount}/{items.length} completadas
            </Badge>
            <Badge
              className={
                requiredCompleted === requiredCount ? "bg-success" : "bg-warning"
              }
            >
              {requiredCompleted}/{requiredCount} requeridas
            </Badge>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso General</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 border rounded-lg space-y-3 transition-smooth ${
              item.completed ? "bg-muted/30" : "bg-card"
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id={item.id}
                checked={item.completed}
                onCheckedChange={() => toggleItem(item.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={item.id}
                    className={`font-medium cursor-pointer ${
                      item.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.title}
                  </Label>
                  {item.required && (
                    <Badge variant="outline" className="text-xs">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Requerido
                    </Badge>
                  )}
                  {item.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>

                <div className="mt-3">
                  <Label htmlFor={`notes-${item.id}`} className="text-xs">
                    Notas y observaciones
                  </Label>
                  <Textarea
                    id={`notes-${item.id}`}
                    placeholder="Agregar notas sobre esta tarea..."
                    value={item.notes || ""}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    onBlur={(e) => saveNotes(item.id, e.target.value)}
                    className="mt-1 text-sm"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
