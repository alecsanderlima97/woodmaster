"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { inventoryService } from "../services/inventoryService";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { Loader2, Box } from "lucide-react";

interface AddInventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddInventoryItemModal({ isOpen, onClose, onSuccess }: AddInventoryItemModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Chapas",
    stock: 0,
    minStock: 5,
    unit: "un",
    price: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await inventoryService.create({
        ...formData,
        userId: user.uid,
      });
      onSuccess();
      onClose();
      setFormData({
        name: "",
        category: "Chapas",
        stock: 0,
        minStock: 5,
        unit: "un",
        price: "",
      });
    } catch (error) {
      console.error("Error creating inventory item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cadastrar Novo Material">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-wood-400">Nome do Material / Insumo</label>
            <Input 
              required
              placeholder="Ex: MDF Louro Freijó 18mm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">Categoria</label>
              <select 
                className="w-full bg-wood-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brass-500/20 focus:border-brass-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Chapas">Chapas</option>
                <option value="Ferragens">Ferragens</option>
                <option value="Químicos">Químicos (Cola, Verniz)</option>
                <option value="Fitas de Borda">Fitas de Borda</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">Preço (Custo/Un)</label>
              <Input 
                required
                placeholder="R$ 0,00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">Estoque Atual</label>
              <Input 
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">Estoque Mín.</label>
              <Input 
                type="number"
                required
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">Unidade</label>
              <Input 
                required
                placeholder="un, par, m, chapa"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Button 
            type="button" 
            variant="secondary" 
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="flex-1 gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Salvar no Estoque <Box size={18} />
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
