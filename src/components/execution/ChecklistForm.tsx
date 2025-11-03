import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  notes?: string;
}

interface ChecklistFormProps {
  orderId: string;
}

export function ChecklistForm({ orderId }: ChecklistFormProps) {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "Inspección visual del equipo",
      description: "Verificar estado físico y señales de deterioro",
      required: true,
      completed: false,
    },
    {
      id: "2",
      title: "Medición de voltaje",
      description: "Registrar voltaje de entrada y salida",
      required: true,
      completed: false,
    },
    {
      id: "3",
      title: "Prueba de aislamiento",
      description: "Verificar resistencia de aislamiento con megger",
      required: true,
      completed: false,
    },
    {
      id: "4",
      title: "Limpieza de contactos",
      description: "Limpiar y verificar conexiones",
      required: false,
      completed: false,
    },
    {
      id: "5",
      title: "Revisión de protecciones",
      description: "Comprobar fusibles y dispositivos de protección",
      required: true,
      completed: false,
    },
    {
      id: "6",
      title: "Prueba de funcionamiento",
      description: "Verificar operación normal del equipo",
      required: true,
      completed: true,
    },
  ]);

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const updateNotes = (id: string, notes: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, notes } : item
    ));
  };

  const completedCount = items.filter(i => i.completed).length;
  const requiredCount = items.filter(i => i.required).length;
  const requiredCompleted = items.filter(i => i.required && i.completed).length;
  const progress = Math.round((completedCount / items.length) * 100);

  return (
    <Card className="shadow-notion">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Checklist de Ejecución</CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              {completedCount}/{items.length} completadas
            </Badge>
            <Badge
              className={
                requiredCompleted === requiredCount
                  ? "bg-success"
                  : "bg-warning"
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
