"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { financeService } from "../services/financeService";
import { FINANCE_CATEGORIES } from "../types/transaction";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { Loader2, DollarSign } from "lucide-react";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddTransactionModal({ isOpen, onClose, onSuccess }: AddTransactionModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "Receita" as "Receita" | "Despesa",
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await financeService.create({
        ...formData,
        amount: parseFloat(formData.amount.replace(",", ".")),
        userId: user.uid,
      });
      onSuccess();
      onClose();
      setFormData({
        type: "Receita",
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = FINANCE_CATEGORIES[formData.type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Transação">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex p-1 bg-wood-950 rounded-xl border border-white/5">
          <button
            type="button"
            className={`flex-1 py-3 text-xs font-bold uppercase transition-all rounded-lg ${
              formData.type === 'Receita' ? 'bg-emerald-500 text-wood-950' : 'text-wood-500'
            }`}
            onClick={() => setFormData({ ...formData, type: 'Receita', category: '' })}
          >
            Entrada (+)
          </button>
          <button
            type="button"
            className={`flex-1 py-3 text-xs font-bold uppercase transition-all rounded-lg ${
              formData.type === 'Despesa' ? 'bg-red-500 text-white' : 'text-wood-500'
            }`}
            onClick={() => setFormData({ ...formData, type: 'Despesa', category: '' })}
          >
            Saída (-)
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-wood-400">Descrição</label>
            <Input 
              required
              placeholder="Ex: Adiantamento Cozinha Marina"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">Valor (R$)</label>
              <Input 
                required
                type="text"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">Data</label>
              <Input 
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-wood-400">Categoria</label>
            <select 
              className="w-full bg-wood-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brass-500/20 focus:border-brass-500"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Selecione...</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
            className={`flex-1 gap-2 ${formData.type === 'Receita' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
                <>Lançar Valor <DollarSign size={18} /></>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
