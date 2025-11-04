import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText, Cloud } from "lucide-react";
import { toast } from "sonner";

interface ExportPanelProps {
  period: string;
  filters: any;
}

export function ExportPanel({ period, filters }: ExportPanelProps) {
  const handleExport = (format: string) => {
    toast.success(`Exportando reporte en formato ${format}`, {
      description: "El archivo se descargará en breve...",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Formato de Exportación</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("Excel")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("PDF")}>
          <FileText className="mr-2 h-4 w-4" />
          PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Integración Externa</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleExport("ERP")}>
          <Cloud className="mr-2 h-4 w-4" />
          Enviar a ERP
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("BI")}>
          <Cloud className="mr-2 h-4 w-4" />
          Enviar a BI
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
