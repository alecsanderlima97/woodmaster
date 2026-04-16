"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { projectService } from "../services/projectService";
import { customerService } from "@/modules/crm/services/customerService";
import { Customer } from "@/modules/crm/types/customer";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { Loader2, Hammer } from "lucide-react";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProjectModal({ isOpen, onClose, onSuccess }: AddProjectModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    customerId: "",
    status: "Medição" as const,
    progress: 0,
    budget: "",
    deadline: "",
    priority: "Normal" as const,
  });

  useEffect(() => {
    if (isOpen && user) {
      customerService.getAll(user.uid).then(setCustomers);
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const selectedCustomer = customers.find(c => c.id === formData.customerId);
    if (!selectedCustomer) {
      alert("Por favor, selecione um cliente.");
      return;
    }

    setLoading(true);
    try {
      await projectService.create({
        ...formData,
        customerName: selectedCustomer.name,
        userId: user.uid,
      });
      onSuccess();
      onClose();
      setFormData({
        name: "",
        customerId: "",
        status: "Medição",
        progress: 0,
        budget: "",
        deadline: "",
        priority: "Normal",
      });
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Projeto / Encomenda">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-wood-400">Título do Projeto</label>
            <Input 
              required
              placeholder="Ex: Cozinha Planejada - Ap 402"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-wood-400">Cliente Responsável</label>
              {customers.length === 0 && (
                <Link href="/dashboard/customers" className="text-[10px] text-brass-500 hover:underline font-bold uppercase tracking-widest">
                  + Cadastrar Cliente
                </Link>
              )}
            </div>
            <select 
              className="w-full bg-wood-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brass-500/20 focus:border-brass-500"
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              required
            >
              <option value="">Selecione um cliente...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">Valor Estimado</label>
              <Input 
                required
                placeholder="R$ 0,00"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">Prazo de Entrega</label>
              <Input 
                required
                placeholder="Ex: 15 Nov ou 20/11"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">Status Inicial</label>
              <select 
                className="w-full bg-wood-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brass-500/20 focus:border-brass-500"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="Medição">Medição</option>
                <option value="Projeto">Projeto (Design)</option>
                <option value="Produção">Produção (Oficina)</option>
                <option value="Montagem">Montagem (Local)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">Prioridade</label>
              <select 
                className="w-full bg-wood-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brass-500/20 focus:border-brass-500"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              >
                <option value="Baixa">Baixa</option>
                <option value="Normal">Normal</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">🚨 Urgente</option>
              </select>
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
                Criar Projeto <Hammer size={18} />
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
