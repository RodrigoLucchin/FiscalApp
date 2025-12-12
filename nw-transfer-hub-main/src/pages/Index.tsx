import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, FileText, Loader2 } from "lucide-react";
import logoImage from "@/assets/nwdrones-logo.png";
import { supabase, locationTableMap, NFeData } from "@/lib/supabase";
import { toast } from "sonner";

const locations = [
  "NW Matriz",
  "NW ES",
  "NW MG",
  "NW PA",
  "NW RJ",
  "NW RS",
  "NW SC",
  "NW SE",
  "NW SP",
];

const transferCategories = [
  "Transferência entre Filiais",
  "Transferência para Intelbras",
  "Transferência para Licitação",
  "Transferência para Multi",
];


const Index = () => {
  const [fromLocation, setFromLocation] = useState<string>("");
  const [nfeNumber, setNfeNumber] = useState<string>("");
  const [toLocation, setToLocation] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showNfeDrawer, setShowNfeDrawer] = useState(false);
  const [showDocumentZoom, setShowDocumentZoom] = useState(false);
  
  // Filtros
  const [filterNumero, setFilterNumero] = useState<string>("");
  const [filterRazaoSocial, setFilterRazaoSocial] = useState<string>("");
  const [filterDataInicio, setFilterDataInicio] = useState<string>("");
  const [filterDataFim, setFilterDataFim] = useState<string>("");
  const [filterChave, setFilterChave] = useState<string>("");

  // NFes do Supabase
  const [nfes, setNfes] = useState<NFeData[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedNfe = nfes.find(nfe => nfe.id === nfeNumber);

  const availableToLocations = locations.filter((loc) => loc !== fromLocation);

  // Buscar NFes do Supabase quando selecionar "De"
  useEffect(() => {
    const fetchNFes = async () => {
      if (!fromLocation) {
        setShowNfeDrawer(false);
        setNfeNumber("");
        setNfes([]);
        return;
      }

      setLoading(true);
      setShowNfeDrawer(true);
      
      const tableName = locationTableMap[fromLocation];
      
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('id, nfe_n, razao_dest, nfe_emi_date, nfe_pdf, nfe_key')
          .order('nfe_emi_date', { ascending: false });

        if (error) {
          console.error('Erro ao buscar NFes:', error);
          toast.error('Erro ao carregar notas fiscais');
          setNfes([]);
        } else {
          console.log('NFes carregadas:', data);
          console.log('Primeira NFe:', data?.[0]);
          console.log('Colunas da primeira NFe:', data?.[0] ? Object.keys(data[0]) : 'Sem dados');
          setNfes(data || []);
        }
      } catch (err) {
        console.error('Erro ao buscar NFes:', err);
        toast.error('Erro ao carregar notas fiscais');
        setNfes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNFes();
  }, [fromLocation]);

  // Filtrar NFes com múltiplos filtros
  const filteredNFes = nfes.filter((nfe) => {
    let matches = true;
    
    if (filterNumero) {
      matches = matches && nfe.nfe_n.toLowerCase().includes(filterNumero.toLowerCase());
    }
    
    if (filterRazaoSocial) {
      matches = matches && nfe.razao_dest.toLowerCase().includes(filterRazaoSocial.toLowerCase());
    }
    
    if (filterChave) {
      matches = matches && nfe.nfe_key.toLowerCase().includes(filterChave.toLowerCase());
    }
    
    // Lógica de filtro de data: se só tem data início, filtra essa data específica
    // Se tem as duas datas, faz o range
    if (filterDataInicio && !filterDataFim) {
      matches = matches && nfe.nfe_emi_date === filterDataInicio;
    } else if (filterDataInicio && filterDataFim) {
      matches = matches && nfe.nfe_emi_date >= filterDataInicio && nfe.nfe_emi_date <= filterDataFim;
    }
    
    return matches;
  });

  const handleTransfer = () => {
    if (!fromLocation || !nfeNumber || !toLocation || !category) {
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    // Reset form after confirmation
    setFromLocation("");
    setNfeNumber("");
    setToLocation("");
    setCategory("");
    setFilterNumero("");
    setFilterRazaoSocial("");
    setFilterDataInicio("");
    setFilterDataFim("");
    setFilterChave("");
    setShowConfirmDialog(false);
  };

  const handleSelectNfe = (nfeId: string) => {
    setNfeNumber(nfeId);
    setShowNfeDrawer(false);
  };

  const isFormValid = fromLocation && nfeNumber && toLocation && category;

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      
      {/* Logo no canto inferior direito */}
      <img 
        src={logoImage} 
        alt="NW Drones Logo" 
        className="fixed bottom-4 right-4 w-64 h-auto opacity-50 z-0"
      />
      
      {/* Content - Centralizado com ou sem drawer */}
      <div className="flex gap-6 items-center justify-center relative z-10 flex-1 p-6">
        <Card className="w-full max-w-md p-8 shadow-2xl border-2 backdrop-blur-sm bg-card/95">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Sistema Futuro</h1>
            <p className="text-muted-foreground">Preencha os campos abaixo para realizar a transferência</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">De:</label>
              <Select value={fromLocation} onValueChange={(value) => {
                setFromLocation(value);
                setNfeNumber("");
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {fromLocation && (
              <div className="space-y-2 animate-in fade-in-50 duration-300">
                <label className="text-sm font-medium text-foreground">Nota Fiscal Selecionada:</label>
                <Button
                  variant="outline"
                  onClick={() => setShowNfeDrawer(true)}
                  className="w-full justify-start text-left font-normal"
                >
                  {nfeNumber ? (
                    <span>NFe: {nfes.find(n => n.id === nfeNumber)?.nfe_n}</span>
                  ) : (
                    <span className="text-muted-foreground">Clique para selecionar uma NFe</span>
                  )}
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Para:</label>
              <Select 
                value={toLocation} 
                onValueChange={setToLocation}
                disabled={!fromLocation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  {availableToLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Categoria:</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {transferCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleTransfer}
            disabled={!isFormValid}
            className="w-full py-6 text-lg font-semibold transition-all hover:scale-105"
          >
            Transferir
          </Button>
        </div>
      </Card>

      {/* Drawer lateral com lista de NFes ou preview */}
      {showNfeDrawer && !showDocumentZoom && (
        <Card className="w-full max-w-md p-8 shadow-2xl border-2 backdrop-blur-sm bg-card/95 animate-in slide-in-from-right-5 duration-300">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                {selectedNfe ? "Nota Fiscal" : "Notas Fiscais"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedNfe 
                  ? `NFe ${selectedNfe.nfe_n} - ${selectedNfe.razao_dest}`
                  : `Filtrar e selecionar NFe de ${fromLocation}`
                }
              </p>
            </div>

            {selectedNfe ? (
              // Preview da nota selecionada
              <div className="space-y-4">
                <div className="relative border rounded-lg overflow-hidden group cursor-pointer"
                     onClick={() => setShowDocumentZoom(true)}>
                  {selectedNfe.nfe_pdf ? (
                    <embed 
                      src={selectedNfe.nfe_pdf} 
                      type="application/pdf"
                      className="w-full h-64"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-muted">
                      <FileText className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white flex flex-col items-center gap-2">
                      <ZoomIn className="w-8 h-8" />
                      <span className="text-sm font-medium">Clique para ampliar</span>
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    PDF
                  </Badge>
                </div>

                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Número:</span>
                    <span className="text-sm">{selectedNfe.nfe_n}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Razão Social:</span>
                    <span className="text-sm">{selectedNfe.razao_dest}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Data:</span>
                    <span className="text-sm">{selectedNfe.nfe_emi_date}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNfeNumber("");
                    }}
                    className="flex-1"
                  >
                    Trocar NFe
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNfeDrawer(false)}
                    className="flex-1"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            ) : (
              // Lista de NFes com filtros
              <>

            {/* Filtros */}
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Número da NFe:</label>
                <Input
                  type="text"
                  placeholder="Filtrar por número"
                  value={filterNumero}
                  onChange={(e) => setFilterNumero(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Razão Social:</label>
                <Input
                  type="text"
                  placeholder="Filtrar por razão social"
                  value={filterRazaoSocial}
                  onChange={(e) => setFilterRazaoSocial(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Chave da Nota Fiscal:</label>
                <Input
                  type="text"
                  placeholder="Filtrar por chave"
                  value={filterChave}
                  onChange={(e) => setFilterChave(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Data de Emissão:</label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    placeholder="Data início"
                    value={filterDataInicio}
                    onChange={(e) => setFilterDataInicio(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground self-center">até</span>
                  <Input
                    type="date"
                    placeholder="Data fim"
                    value={filterDataFim}
                    onChange={(e) => setFilterDataFim(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {(filterNumero || filterRazaoSocial || filterDataInicio || filterDataFim || filterChave) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterNumero("");
                    setFilterRazaoSocial("");
                    setFilterDataInicio("");
                    setFilterDataFim("");
                    setFilterChave("");
                  }}
                  className="w-full"
                >
                  Limpar filtros
                </Button>
              )}
            </div>

            {/* Lista de NFes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Resultados ({filteredNFes.length})
                </label>
              </div>
              
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredNFes.length > 0 ? (
                    <div className="space-y-2 min-w-[400px]">
                      {filteredNFes.map((nfe) => (
                        <Button
                          key={nfe.id}
                          variant={nfeNumber === nfe.id ? "default" : "outline"}
                          onClick={() => handleSelectNfe(nfe.id)}
                          className="w-full justify-start text-left h-auto py-4"
                        >
                          <div className="space-y-2 w-full">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="shrink-0">NFe {nfe.nfe_n || 'N/A'}</Badge>
                              <span className="text-xs text-muted-foreground shrink-0">{nfe.nfe_emi_date || 'Sem data'}</span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-normal break-words">{nfe.razao_dest || 'Sem razão social'}</p>
                              <span className="text-[10px] text-muted-foreground/70 font-mono break-all">
                                {nfe.nfe_key || 'Sem chave'}
                              </span>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
                      <p>Nenhuma NFe encontrada com os filtros aplicados</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

              <Button
                variant="outline"
                onClick={() => setShowNfeDrawer(false)}
                className="w-full"
              >
                Fechar
              </Button>
            </>
            )}
          </div>
        </Card>
      )}
      </div>

      {/* Dialog para zoom do documento */}
      <Dialog open={showDocumentZoom} onOpenChange={setShowDocumentZoom}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
          {selectedNfe?.nfe_pdf && (
            <embed 
              src={selectedNfe.nfe_pdf} 
              type="application/pdf"
              className="w-full h-full"
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="backdrop-blur-sm bg-card/95">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Confirmar Transferência</AlertDialogTitle>
            <AlertDialogDescription className="text-base pt-2">
              Tem certeza que deseja concluir essa solicitação?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Sim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
