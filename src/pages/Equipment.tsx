import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import EquipmentList from "@/components/equipment/EquipmentList";
import EquipmentForm from "@/components/equipment/EquipmentForm";
import BulkUpload from "@/components/equipment/BulkUpload";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Equipment = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddEquipment = () => {
    setSelectedEquipmentId(null);
    setIsFormOpen(true);
  };

  const handleEditEquipment = (id: string) => {
    setSelectedEquipmentId(id);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEquipmentId(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBulkUploadClose = () => {
    setIsBulkUploadOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Gestión de Equipos" />
      
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Inventario de Equipos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona equipos, estados, mantenimiento e historial
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsBulkUploadOpen(true)} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Carga Masiva
            </Button>
            <Button onClick={handleAddEquipment}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Equipo
            </Button>
          </div>
        </div>

        <EquipmentList 
          onEdit={handleEditEquipment} 
          refreshTrigger={refreshTrigger}
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedEquipmentId ? "Editar Equipo" : "Agregar Nuevo Equipo"}
              </DialogTitle>
              <DialogDescription>
                Completa los datos del equipo para registrarlo en el sistema
              </DialogDescription>
            </DialogHeader>
            <EquipmentForm 
              equipmentId={selectedEquipmentId} 
              onClose={handleFormClose}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Carga Masiva de Equipos</DialogTitle>
              <DialogDescription>
                Sube un archivo CSV o Excel con múltiples equipos
              </DialogDescription>
            </DialogHeader>
            <BulkUpload onClose={handleBulkUploadClose} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Equipment;
