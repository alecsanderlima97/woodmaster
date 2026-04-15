"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { customerService } from "../services/customerService";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { Loader2, UserPlus } from "lucide-react";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCustomerModal({ isOpen, onClose, onSuccess }: AddCustomerModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    status: "Lead" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await customerService.create({
        ...formData,
        userId: user.uid,
        projects: 0,
      });
      onSuccess();
      onClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        status: "Lead",
      });
    } catch (error) {
      console.error("Error creating customer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cadastrar Novo Cliente">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-wood-400">Nome Completo / Empresa</label>
            <Input 
              required
              placeholder="Ex: Ricardo Oliveira ou Construtora Alfa"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">E-mail</label>
              <Input 
                type="email"
                required
                placeholder="cliente@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-wood-400">WhatsApp / Telefone</label>
              <Input 
                required
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-wood-400">Cidade / Localização</label>
            <Input 
              required
              placeholder="Ex: São Paulo, SP"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-wood-400">Status Inicial</label>
            <select 
              className="w-full bg-wood-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brass-500/20 focus:border-brass-500"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="Lead">Lead (Prospecto)</option>
              <option value="Aguardando">Aguardando (Orçamento)</option>
              <option value="Ativo">Ativo (Cliente Real)</option>
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
            className="flex-1 gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Confirmar Cadastro <UserPlus size={18} />
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
