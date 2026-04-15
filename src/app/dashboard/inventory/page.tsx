"use client";

import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  ArrowUpDown,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const inventoryItems = [
  { id: 1, name: "MDF Louro Freijó 18mm", category: "Chapas", stock: 2, minStock: 5, unit: "un", price: "R$ 320,00" },
  { id: 2, name: "MDF Branco Tx 15mm", category: "Chapas", stock: 15, minStock: 10, unit: "un", price: "R$ 180,00" },
  { id: 3, name: "Corrediça Invisível 450mm", category: "Ferragens", stock: 12, minStock: 20, unit: "par", price: "R$ 85,00" },
  { id: 4, name: "Dobradiça com Amortecedor", category: "Ferragens", stock: 120, minStock: 50, unit: "un", price: "R$ 12,50" },
  { id: 5, name: "Cola Contato 1kg", category: "Químicos", stock: 4, minStock: 3, unit: "un", price: "R$ 45,00" },
];

export default function InventoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Estoque de Materiais</h1>
          <p className="text-wood-400">Gerencie suas chapas, ferragens e insumos de produção.</p>
        </div>
        <Button className="flex items-center gap-2">
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
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Filter size={18} />
            Categorias
          </Button>
          <Button variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <ArrowUpDown size={18} />
            Ordenar
          </Button>
        </div>
      </div>

      {/* Table Area */}
      <div className="glass rounded-2xl border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-wood-900/50 text-wood-500 text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Qtd. Atual</th>
              <th className="px-6 py-4">Preço Unit.</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wood-900">
            {inventoryItems.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-wood-800 rounded-lg flex items-center justify-center text-wood-400 group-hover:bg-brass-500/20 group-hover:text-brass-500 transition-colors">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-[10px] text-wood-600 uppercase tracking-tighter">ID: WM-{item.id.toString().padStart(4, '0')}</p>
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
                      <AlertTriangle size={12} />
                      Reposição
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
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

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-wood-500 text-sm px-2">
        <p>Exibindo {inventoryItems.length} materiais cadastrados.</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-wood-900 rounded-lg hover:bg-wood-800 disabled:opacity-30" disabled>Anterior</button>
          <button className="px-3 py-1 bg-wood-900 rounded-lg hover:bg-wood-800">Próxima</button>
        </div>
      </div>
    </div>
  );
}
