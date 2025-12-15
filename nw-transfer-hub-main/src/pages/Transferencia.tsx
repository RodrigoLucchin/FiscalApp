import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  previsao: string;
  valor_total: number;
  vendedor: string;
  parcelas: number;
}

const locations = [
  "NW ES",
  "NW MG",
  "NW PA",
  "NW RJ",
  "NW RS",
  "NW SC",
  "NW SE",
  "NW SP",
];

const samplePedidos: Pedido[] = [
  { id: "1", numero: "1001", cliente: "ACME Ltda", previsao: "2025-12-20", valor_total: 1250.5, vendedor: "João", parcelas: 3 },
  { id: "2", numero: "1002", cliente: "XPTO S.A.", previsao: "2025-12-22", valor_total: 3400, vendedor: "Maria", parcelas: 1 },
  { id: "3", numero: "1003", cliente: "DroneShop", previsao: "2025-12-25", valor_total: 780.75, vendedor: "Carlos", parcelas: 2 },
];

const Transferencia = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [query, setQuery] = useState("");
  const [selectedPedidoId, setSelectedPedidoId] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [history, setHistory] = useState<Array<{ pedido: Pedido; date: string; location: string }>>([]);
  const [loading, setLoading] = useState(false);

  const selectedPedido = pedidos.find((p) => p.id === selectedPedidoId);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      try {
        // tentativa de buscar tabela específica no Supabase
        const { data, error } = await supabase.from("omie_orders_faturar").select("id, numero, cliente, previsao, valor_total, vendedor, parcelas");
        if (error) {
          console.warn("Tabela omie_orders_faturar não disponível, usando dados de exemplo", error);
          setPedidos(samplePedidos);
        } else {
          if (!data || data.length === 0) setPedidos(samplePedidos);
          else setPedidos(data as Pedido[]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro ao buscar pedidos, usando dados de exemplo");
        setPedidos(samplePedidos);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const filtered = pedidos.filter((p) => p.numero.includes(query) || p.cliente.toLowerCase().includes(query.toLowerCase()));

  const handleConfirm = () => {
    if (!selectedPedido || !selectedLocation) return;
    const ok = window.confirm("Tem certeza que deseja concluir a transferência deste pedido?");
    if (!ok) return;

    // remover pedido
    setPedidos((prev) => prev.filter((p) => p.id !== selectedPedido.id));
    setHistory((h) => [{ pedido: selectedPedido, date: new Date().toISOString(), location: selectedLocation }, ...h]);
    setSelectedPedidoId("");
    setSelectedLocation("");
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-6">
      <Card className="w-full max-w-3xl p-6 shadow-2xl border-2 bg-card/95">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Sistema de Transferência</h1>
          <p className="text-sm text-muted-foreground">Selecione pedidos a faturar e transfira para uma filial</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-foreground">Pedidos a Faturar</label>
              <div className="flex gap-2">
                <select
                  className="flex-1 rounded-md border px-3 py-2 bg-transparent text-foreground"
                  value={selectedPedidoId}
                  onChange={(e) => setSelectedPedidoId(e.target.value)}
                >
                  <option value="">-- Selecione um pedido --</option>
                  {filtered.map((p) => (
                    <option key={p.id} value={p.id}>{p.numero} — {p.cliente}</option>
                  ))}
                </select>
                <Input placeholder="Digitar número" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>

              {selectedPedido ? (
                <div className="space-y-2 p-3 bg-muted/50 rounded">
                  <div className="flex justify-between"><span className="font-medium">Cliente:</span><span>{selectedPedido.cliente}</span></div>
                  <div className="flex justify-between"><span className="font-medium">Previsão:</span><span>{selectedPedido.previsao}</span></div>
                  <div className="flex justify-between"><span className="font-medium">Valor total:</span><span>{selectedPedido.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
                  <div className="flex justify-between"><span className="font-medium">Vendedor:</span><span>{selectedPedido.vendedor}</span></div>
                  <div className="flex justify-between"><span className="font-medium">Parcelas:</span><span>{selectedPedido.parcelas}</span></div>
                </div>
              ) : (
                <div className="p-3 bg-muted/20 rounded text-sm text-muted-foreground">Nenhum pedido selecionado</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Filial destino</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a filial" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button disabled={!selectedPedido || !selectedLocation} className="w-full mt-4" onClick={handleConfirm}>
                Concluir transferência
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <aside className="w-80 ml-4">
        <Card className="p-4">
          <h3 className="font-bold">Histórico</h3>
          <div className="space-y-2 mt-3">
            {history.length === 0 ? (
              <div className="text-sm text-muted-foreground">Nenhuma transferência realizada</div>
            ) : (
              history.map((h, idx) => (
                <div key={idx} className="p-3 bg-muted/50 rounded">
                  <div className="text-sm font-medium">Pedido {h.pedido.numero}</div>
                  <div className="text-xs text-muted-foreground">Cliente: {h.pedido.cliente}</div>
                  <div className="text-xs text-muted-foreground">Filial: {h.location}</div>
                  <div className="text-xs text-muted-foreground">Data: {new Date(h.date).toLocaleString('pt-BR')}</div>
                </div>
              ))
            )}
          </div>
        </Card>
      </aside>
    </div>
  );
};

export default Transferencia;
