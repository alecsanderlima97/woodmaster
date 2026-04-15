"use client";

import { useState, useMemo } from "react";
import { 
  Calculator, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Package, 
  Settings,
  DollarSign,
  FileText,
  Save,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";

export default function NewQuotePage() {
  const [step, setStep] = useState(1);
  const [items, setItems] = useState([
    { id: 1, name: "MDF Louro Freijó 18mm", type: "Chapa", qty: 2, price: 320 },
    { id: 2, name: "Dobradiça Amortecedor", type: "Ferragem", qty: 12, price: 12.5 },
  ]);

  const subtotal = useMemo(() => 
    items.reduce((acc, current) => acc + (current.qty * current.price), 0),
  [items]);

  const [labor, setLabor] = useState(1500);
  const total = subtotal + labor;

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", type: "Diversos", qty: 1, price: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Calculator className="text-brass-500" />
            Novo Orçamento
          </h1>
          <p className="text-wood-400">Gere propostas precisas baseadas no seu estoque e mão de obra.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-wood-800 text-wood-500">
            <Save size={18} />
            Salvar Rascunho
          </Button>
          <Button>
            <Printer size={18} />
            Gerar PDF
          </Button>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between glass p-2 rounded-2xl border-white/5">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${step === i ? "bg-brass-500 text-wood-950 font-bold" : "text-wood-500"}`}>
            <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${step === i ? "border-wood-950" : "border-wood-500"}`}>{i}</span>
            <span className="hidden sm:inline">
              {i === 1 ? "Informações" : i === 2 ? "Materiais" : "Resumo"}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass p-8 rounded-2xl border-white/5 space-y-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-brass-500 pl-4">Dados do Projeto</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Nome do Projeto" placeholder="Ex: Loft Vila Madalena" />
              <Input label="Cliente" placeholder="Pesquisar cliente..." />
              <div className="md:col-span-2">
                <Input label="Local da Montagem" placeholder="Endereço completo ou ambiente" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>
                Próximo Passo
                <ChevronRight size={18} />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="glass p-8 rounded-2xl border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white border-l-4 border-brass-500 pl-4">Lista de Materiais</h3>
                <Button variant="secondary" onClick={addItem} className="text-sm">
                  <Plus size={16} />
                  Adicionar Item
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-end bg-wood-900/30 p-4 rounded-xl border border-white/5">
                    <div className="col-span-12 md:col-span-5">
                      <Input 
                        label="Descrio do Material" 
                        value={item.name} 
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        placeholder="Nome do material"
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Input 
                        label="Qtd" 
                        type="number" 
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-5 md:col-span-3">
                      <Input 
                        label="Preço Unit. (R$)" 
                        type="number" 
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2 flex justify-end">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-3 text-wood-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(1)}>
                <ChevronLeft size={18} />
                Voltar
              </Button>
              <Button onClick={() => setStep(3)}>
                Gerar Resumo
                <ChevronRight size={18} />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2 space-y-6">
              <div className="glass p-8 rounded-2xl border-white/5 space-y-6">
                <h3 className="text-xl font-bold text-white border-l-4 border-brass-500 pl-4">Configuração Financeira</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-wood-900/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center">
                        <Settings size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white">Mão de Obra</p>
                        <p className="text-xs text-wood-500 italic">Custos operacionais e lucros</p>
                      </div>
                    </div>
                    <div className="w-32">
                      <Input 
                        type="number" 
                        value={labor} 
                        onChange={(e) => setLabor(parseFloat(e.target.value))}
                        className="text-right font-bold text-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-8 rounded-2xl border-white/5 space-y-6 bg-brass-500/5 border-brass-500/10">
                <h3 className="text-xl font-bold text-white">Resumo Final</h3>
                <div className="space-y-3 border-b border-wood-900 pb-4">
                  <div className="flex justify-between text-wood-400 text-sm">
                    <span>Materiais</span>
                    <span>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-wood-400 text-sm">
                    <span>Mão de Obra</span>
                    <span>R$ {labor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="flex justify-between text-white font-bold text-2xl">
                  <span>Total</span>
                  <span className="text-brass-500">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <Button className="w-full py-6 text-lg">
                  Confirmar Orçamento
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
