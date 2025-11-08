import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalStats } from "@/components/personal/PersonalStats";
import { PersonalList } from "@/components/personal/PersonalList";
import { RoleManagement } from "@/components/personal/RoleManagement";
import { Users, Shield, Activity } from "lucide-react";

export default function Personal() {
  const [activeTab, setActiveTab] = useState("lista");

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Gestión de Personal" />
      
      <main className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Módulo de Personal</h2>
          <p className="text-muted-foreground mt-1">
            Gestión completa de usuarios, roles, vigencia y control de accesos
          </p>
        </div>

        <PersonalStats />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="lista" className="gap-2">
              <Users className="h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="auditoria" className="gap-2">
              <Activity className="h-4 w-4" />
              Auditoría
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="space-y-4 mt-6">
            <PersonalList />
          </TabsContent>

          <TabsContent value="roles" className="space-y-4 mt-6">
            <RoleManagement />
          </TabsContent>

          <TabsContent value="auditoria" className="space-y-4 mt-6">
            <div className="text-center py-12 text-muted-foreground">
              Panel de auditoría - Próximamente
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
