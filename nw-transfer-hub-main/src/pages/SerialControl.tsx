import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Copy, X } from "lucide-react";
import { toast } from "sonner";
import logoImage from "@/assets/nwdrones-logo.png";

const SerialControl = () => {
  const [serialInput, setSerialInput] = useState("");
  const [serials, setSerials] = useState<string[]>([]);

  const addSerial = () => {
    const newSerial = serialInput.trim();
    if (newSerial) {
      setSerials([newSerial, ...serials]);
      setSerialInput("");
    }
  };

  const deleteSerial = (index: number) => {
    const newSerials = [...serials];
    newSerials.splice(index, 1);
    setSerials(newSerials);
  };

  const clearAll = () => {
    setSerials([]);
  };

  const copyToClipboard = () => {
    const textToCopy = serials.join(" - ");
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        toast.success("Copiado!");
      }).catch(() => {
        toast.error("Falha ao copiar");
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSerial();
    }
  };

  // Detectar duplicados
  const serialCounts = serials.reduce((acc, serial) => {
    acc[serial] = (acc[serial] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const outputString = serials.length > 0 ? serials.join(" - ") : "-";

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Logo no canto inferior direito */}
      <img 
        src={logoImage} 
        alt="NW Drones Logo" 
        className="fixed bottom-4 right-4 w-64 h-auto opacity-50 z-0"
      />
      
      {/* Content */}
      <div className="flex items-center justify-center relative z-10 flex-1 p-6">
        <Card className="w-full max-w-2xl p-8 shadow-2xl border-2 backdrop-blur-sm bg-card/95">
          <div className="space-y-6">
            {/* Cabeçalho */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Controle de Seriais</h1>
              <p className="text-muted-foreground mt-1">Digite o serial do produto e pressione Enter.</p>
            </div>

            {/* Input do Serial */}
            <div className="space-y-2">
              <Input
                type="text"
                id="serialInput"
                placeholder="Digite o serial aqui..."
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-lg h-14"
              />
            </div>

            {/* String Final e Botões de Ação */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">String Completa:</h2>
              <div className="flex items-center gap-4">
                <p className="text-foreground font-mono text-lg flex-grow break-all">
                  {outputString}
                </p>
                <Button
                  onClick={copyToClipboard}
                  disabled={serials.length === 0}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
            </div>

            {/* Lista de Seriais Adicionados */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">
                  Seriais Adicionados 
                  <Badge variant="secondary" className="ml-2">
                    {serials.length}
                  </Badge>
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  disabled={serials.length === 0}
                  className="text-destructive hover:text-destructive"
                >
                  Limpar Tudo
                </Button>
              </div>
              
              <ScrollArea className="h-64 w-full rounded-md border p-3">
                {serials.length === 0 ? (
                  <div className="text-center text-muted-foreground p-8">
                    Nenhum serial adicionado ainda.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {serials.map((serial, index) => {
                      const isDuplicate = serialCounts[serial] > 1;
                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                            isDuplicate
                              ? "bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/40"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-muted-foreground w-6 text-right">
                              {index + 1}.
                            </span>
                            <span className="text-foreground">{serial}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteSerial(index)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SerialControl;
