import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Photo {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
  storagePath: string;
}

interface PhotoCaptureProps {
  orderId: string;
}

export function PhotoCapture({ orderId }: PhotoCaptureProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Cargar fotos al montar
  useEffect(() => {
    if (orderId) {
      fetchPhotos();
    }
  }, [orderId]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ordenes_trabajo_fotos")
        .select("*")
        .eq("orden_id", orderId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const photosWithUrls: Photo[] = (data || []).map((foto) => {
        const { data: urlData } = supabase.storage
          .from("work-order-photos")
          .getPublicUrl(foto.storage_path);

        return {
          id: foto.id,
          url: urlData.publicUrl,
          caption: foto.caption || "Sin descripción",
          timestamp: new Date(foto.created_at).toLocaleString(),
          storagePath: foto.storage_path,
        };
      });

      setPhotos(photosWithUrls);
    } catch (error) {
      console.error("Error fetching photos:", error);
      toast.error("Error al cargar fotos");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${orderId}/${Date.now()}.${fileExt}`;

    try {
      setUploading(true);

      // 1. Subir a Storage
      const { error: uploadError } = await supabase.storage
        .from("work-order-photos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Obtener usuario actual
      const { data: userData } = await supabase.auth.getUser();

      // 3. Insertar referencia en tabla
      const { data: insertData, error: insertError } = await supabase
        .from("ordenes_trabajo_fotos")
        .insert({
          orden_id: orderId,
          storage_path: fileName,
          caption: caption || "Sin descripción",
          created_by: userData?.user?.id || null,
        })
        .select()
        .single();

      if (insertError) {
        // Si falla el insert, eliminar el archivo subido
        await supabase.storage.from("work-order-photos").remove([fileName]);
        throw insertError;
      }

      // 4. Obtener URL pública
      const { data: urlData } = supabase.storage
        .from("work-order-photos")
        .getPublicUrl(fileName);

      const newPhoto: Photo = {
        id: insertData.id,
        url: urlData.publicUrl,
        caption: caption || "Sin descripción",
        timestamp: new Date().toLocaleString(),
        storagePath: fileName,
      };

      setPhotos([newPhoto, ...photos]);
      setCaption("");
      toast.success("Foto agregada correctamente");
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      toast.error(error.message || "Error al subir foto");
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  const removePhoto = async (photo: Photo) => {
    try {
      // 1. Eliminar de Storage
      const { error: storageError } = await supabase.storage
        .from("work-order-photos")
        .remove([photo.storagePath]);

      if (storageError) {
        console.warn("Storage delete warning:", storageError);
      }

      // 2. Eliminar de tabla
      const { error: dbError } = await supabase
        .from("ordenes_trabajo_fotos")
        .delete()
        .eq("id", photo.id);

      if (dbError) throw dbError;

      setPhotos(photos.filter((p) => p.id !== photo.id));
      toast.success("Foto eliminada");
    } catch (error: any) {
      console.error("Error removing photo:", error);
      toast.error(error.message || "Error al eliminar foto");
    }
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
              disabled={uploading}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" disabled={uploading} asChild>
              <label className="cursor-pointer">
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                Capturar Foto
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </Button>

            <Button variant="outline" className="flex-1" disabled={uploading} asChild>
              <label className="cursor-pointer">
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Subir Imagen
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
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

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : photos.length === 0 ? (
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
                      onClick={() => removePhoto(photo)}
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
