import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
// Replaced Select with inline searchable dropdown showing recent selections
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ItemCusto {
  product: string;
  sku: string;
  price: number;
  price_ipi: number;
  price_icms: number;
  reference_nf: string;
  updated_time: string;
}

const PrecosCusto = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemCusto[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recentSelections, setRecentSelections] = useState<string[]>([]);
  const nfeScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedItem = items.find((item) => item.sku === selectedItemId);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    const container = dropdownRef.current;
    const nodes = container?.querySelectorAll('[data-focusable]');
    const len = nodes ? nodes.length : 0;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(Math.max(focusedIndex + 1, 0), Math.max(0, len - 1));
      setFocusedIndex(next);
      const el = nodes?.[next] as HTMLElement | undefined;
      el?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(focusedIndex - 1, 0);
      setFocusedIndex(prev);
      const el = nodes?.[prev] as HTMLElement | undefined;
      el?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (nodes && focusedIndex >= 0 && focusedIndex < len) {
        const target = nodes[focusedIndex] as HTMLElement;
        const sku = target.dataset.sku;
        if (sku) selectItem(sku);
      }
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("omie_products_cost_price")
          .select("product,sku,price,price_ipi,price_icms,reference_nf,updated_time")
          .order("product", { ascending: true });

        if (error) {
          console.error("Erro ao buscar itens:", error);
          toast.error("Erro ao carregar itens de custo");
          setItems([]);
        } else {
          setItems(data || []);
        }
      } catch (err) {
        console.error("Erro ao buscar itens:", err);
        toast.error("Erro ao carregar itens de custo");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();

    const saved = localStorage.getItem("precos-recent");
    if (saved) {
      try {
        setRecentSelections(JSON.parse(saved));
      } catch (e) {
        setRecentSelections([]);
      }
    }
  }, []);

  useEffect(() => {
    if (nfeScrollRef.current) {
      nfeScrollRef.current.scrollLeft = nfeScrollRef.current.scrollWidth;
    }
    // reset focusedIndex whenever the dropdown opens/closes or items change
    if (!open) setFocusedIndex(-1);
  }, [selectedItem?.reference_nf]);

  // focus input on mount so user can start typing immediately
  useEffect(() => {
    // try focus on mount
    inputRef.current?.focus();
  }, []);

  // ensure input is focused once loading finishes (in case it was disabled on mount)
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setFocusedIndex(-1);
      return;
    }

    let count = 0;
    if (query.trim() === "") {
      if (recentSelections.length === 0) {
        count = items.filter((it) => it.sku).slice(0, 5).length;
      } else {
        count = recentSelections.map((sku) => items.find((i) => i.sku === sku)).filter((it) => it !== undefined).length;
      }
    } else {
      count = items.filter((it) => it.sku && (it.product.toLowerCase().includes(query.toLowerCase()) || it.sku.toLowerCase().includes(query.toLowerCase()))).length;
    }

    setFocusedIndex(count > 0 ? 0 : -1);
  }, [open, query, items, recentSelections]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const selectItem = (sku: string) => {
    setSelectedItemId(sku);
    setOpen(false);
    setQuery("");
    setRecentSelections((prev) => {
      const next = [sku, ...prev.filter((p) => p !== sku)].slice(0, 5);
      try {
        localStorage.setItem("precos-recent", JSON.stringify(next));
      } catch (e) {
        // ignore storage errors
      }
      setFocusedIndex(-1);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg p-8 shadow-2xl border-2 backdrop-blur-sm bg-card/95">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/custos")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground">Preços de Custo</h1>
              <p className="text-muted-foreground text-sm">Selecione um item para ver os preços</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Item:</label>
            <div className="relative">
              <input
                className="w-full rounded-md border px-3 py-2 bg-transparent text-foreground placeholder:text-muted-foreground"
                placeholder={loading ? "Carregando..." : "Clique para selecionar ou digite para buscar"}
                value={query}
                ref={inputRef}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => {
                  setOpen(true);
                  setFocusedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                disabled={loading}
              />

              {open && !loading && (
                <div ref={dropdownRef} className="absolute z-50 mt-1 w-full rounded-md border bg-card shadow max-h-56 overflow-auto">
                  {(() => {
                    // compute visible items depending on query / recent selections
                    if (query.trim() === "") {
                      if (recentSelections.length === 0) {
                        const firstFive = items.filter((it) => it.sku).slice(0, 5);
                        return (
                          <div>
                            <div className="px-3 py-2 text-xs font-medium text-muted-foreground mt-2">Primeiros 5 itens</div>
                            {firstFive.map((item, idx) => (
                              <div
                                key={item.sku}
                                data-focusable
                                data-sku={item.sku}
                                data-index={idx}
                                onMouseDown={() => selectItem(item.sku)}
                                className={`px-3 py-2 hover:bg-muted cursor-pointer ${focusedIndex === idx ? 'bg-muted' : ''}`}
                              >
                                {item.product}
                              </div>
                            ))}
                          </div>
                        );
                      }

                      const recentItems = recentSelections
                        .map((sku) => items.find((i) => i.sku === sku))
                        .filter((it) => it !== undefined) as ItemCusto[];

                      return (
                        <div>
                          <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Últimos 5 selecionados</div>
                          {recentItems.map((item, idx) => (
                            <div
                              key={item.sku}
                              data-focusable
                              data-sku={item.sku}
                              data-index={idx}
                              onMouseDown={() => selectItem(item.sku)}
                              className={`px-3 py-2 hover:bg-muted cursor-pointer ${focusedIndex === idx ? 'bg-muted' : ''}`}
                            >
                              {item.product}
                            </div>
                          ))}
                        </div>
                      );
                    }

                    const filtered = items.filter((it) => it.sku && (it.product.toLowerCase().includes(query.toLowerCase()) || it.sku.toLowerCase().includes(query.toLowerCase())));
                    if (filtered.length === 0) {
                      return <div className="px-3 py-2 text-sm text-muted-foreground">Nenhum resultado</div>;
                    }

                    return (
                      <div>
                        {filtered.map((item, idx) => (
                          <div
                            key={item.sku}
                            data-focusable
                            data-sku={item.sku}
                            data-index={idx}
                            onMouseDown={() => selectItem(item.sku)}
                            className={`px-3 py-2 hover:bg-muted cursor-pointer ${focusedIndex === idx ? 'bg-muted' : ''}`}
                          >
                            {item.product}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {selectedItem && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-foreground">
                  <span className="font-bold">{selectedItem.product}</span>
                  <span className="text-muted-foreground ml-2">ID Omie: {selectedItem.sku}</span>
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-2 bg-muted/30 rounded text-xs text-muted-foreground text-center">
                  Última atualização: {selectedItem.updated_time ? new Date(selectedItem.updated_time).toLocaleString('pt-BR') : '—'}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Preço Registrado</p>
                    <p className="text-lg font-bold text-foreground truncate">
                      {formatCurrency(selectedItem.price ?? 0)}
                    </p>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Sem ICMS</p>
                    <p className="text-lg font-bold text-foreground truncate">
                      {formatCurrency(selectedItem.price_ipi ?? 0)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Com ICMS</p>
                    <p className="text-lg font-bold text-foreground truncate">
                      {formatCurrency(selectedItem.price_icms ?? 0)}
                    </p>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">NFe</p>
                    <div ref={nfeScrollRef} className="overflow-x-auto">
                      <p className="text-lg font-bold text-foreground whitespace-nowrap">
                        {selectedItem.reference_nf || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum item de custo encontrado
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PrecosCusto;
