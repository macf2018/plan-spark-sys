import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Photo {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
}

export function PhotoCapture() {
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400",
      caption: "Estado inicial del transformador",
      timestamp: new Date().toLocaleString(),
    },
  ]);
  const [caption, setCaption] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const newPhoto: Photo = {
          id: Date.now().toString(),
          url: e.target?.result as string,
          caption: caption || "Sin descripción",
          timestamp: new Date().toLocaleString(),
        };
        
        setPhotos([...photos, newPhoto]);
        setCaption("");
        toast.success("Foto agregada correctamente");
      };
      
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
    toast.success("Foto eliminada");
  };

  return (
    <Card className="shadow-notion">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Registro Fotográfico
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="caption">Descripción de la foto</Label>
            <Input
              id="caption"
              placeholder="Ej: Medición de voltaje en panel principal"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <label className="cursor-pointer">
                <Camera className="mr-2 h-4 w-4" />
                Capturar Foto
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </Button>

            <Button variant="outline" className="flex-1" asChild>
              <label className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Subir Imagen
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Fotos Registradas ({photos.length})
            </h4>
          </div>

          {photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No hay fotos registradas
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Captura o sube fotos del mantenimiento
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group rounded-lg overflow-hidden border bg-muted"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{photo.caption}</p>
                    <p className="text-xs text-muted-foreground">{photo.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
