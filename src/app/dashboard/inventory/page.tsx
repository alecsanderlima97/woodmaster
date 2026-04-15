"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { inventoryService } from "@/modules/erp/services/inventoryService";
import { InventoryItem } from "@/modules/erp/types/inventory";
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  ArrowUpDown,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AddInventoryItemModal } from "@/modules/erp/components/AddInventoryItemModal";

export default function InventoryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    if (!user) return;
    try {
      const data = await inventoryService.getAll(user.uid);
      setItems(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <AddInventoryItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchItems}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Estoque de Materiais</h1>
          <p className="text-wood-400">Gerencie suas chapas, ferragens e insumos de produção.</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          Cadastrar Item
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-wood-900/50 px-4 py-2 rounded-xl border border-wood-800">
          <Search className="text-wood-500" size={20} />
          <input 
            type="text" 
            placeholder="Buscar material pelo nome ou código..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full text-white placeholder:text-wood-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm">
            <Filter size={18} />
            Categorias
          </Button>
          <Button variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm">
            <ArrowUpDown size={18} />
            Ordenar
          </Button>
        </div>
      </div>

      {/* Table Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 glass rounded-2xl">
          <Loader2 className="animate-spin text-brass-500" size={48} />
          <p className="text-wood-500 animate-pulse">Sincronizando estoque...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="glass rounded-2xl border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-wood-900/50 text-wood-500 text-[10px] uppercase tracking-[2px] font-bold">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Qtd. Atual</th>
                  <th className="px-6 py-4">Preço Unit.</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wood-900">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-wood-800 rounded-lg flex items-center justify-center text-wood-400 group-hover:bg-brass-500/20 group-hover:text-brass-500 transition-colors">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{item.name}</p>
                          <p className="text-[10px] text-wood-600 uppercase tracking-tighter">ID: WM-{item.id?.slice(0, 4)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-wood-400">{item.category}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-sm font-bold ${item.stock <= item.minStock ? 'text-red-400' : 'text-white'}`}>
                        {item.stock} {item.unit}
                      </span>
                      <p className="text-[10px] text-wood-600">Mín: {item.minStock}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-wood-300 font-medium">{item.price}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {item.stock <= item.minStock ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] uppercase tracking-tighter font-bold border border-red-500/20">
                          <AlertTriangle size={12} />
                          Reposição
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] uppercase tracking-tighter font-bold border border-emerald-500/20">
                          Estável
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <button className="text-wood-600 hover:text-white transition-colors p-1">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-3xl border-dashed border-white/10">
          <div className="inline-flex p-6 bg-wood-900/50 rounded-full mb-6">
             <Package className="text-wood-700" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Estoque Vazio</h3>
          <p className="text-wood-500 mb-8">Nenhum material cadastrado ainda. Mantenha seu inventário organizado.</p>
          <Button variant="secondary" className="px-10" onClick={() => setIsModalOpen(true)}>Cadastrar Material</Button>
        </div>
      )}

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-wood-500 text-[10px] uppercase tracking-wider font-bold px-2">
        <p>Exibindo {filteredItems.length} materiais cadastrados.</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-wood-900 rounded-lg hover:bg-wood-800 disabled:opacity-30" disabled>Anterior</button>
          <button className="px-3 py-1 bg-wood-900 rounded-lg hover:bg-wood-800">Próxima</button>
        </div>
      </div>
    </div>
  );
}
