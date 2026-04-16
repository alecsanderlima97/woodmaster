"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Calendar, 
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { financeService } from "@/modules/erp/services/financeService";
import { Transaction } from "@/modules/erp/types/transaction";
import { AddTransactionModal } from "@/modules/erp/components/AddTransactionModal";
import { pdfGenerator } from "@/utils/pdfGenerator";

export default function FinancePage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("Todos");

  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const data = await financeService.getAll(user.uid);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const totalIncome = transactions
    .filter(t => t.type === 'Receita')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Despesa')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter(t => 
    filter === "Todos" || t.type === filter
  );

  const handleExportPDF = () => {
    const totals = {
      income: totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      expense: totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      balance: balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    };
    
    const formattedTransactions = transactions.map(t => ({
      date: new Date(t.date).toLocaleDateString('pt-BR'),
      description: t.description,
      category: t.category,
      type: t.type === 'Receita' ? 'income' : 'expense',
      value: t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    }));

    pdfGenerator.generateFinancialReport(formattedTransactions, totals);
  };

  return (
    <div className="space-y-8">
      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTransactions}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Fluxo de Caixa</h1>
          <p className="text-wood-400">Gestão financeira e controle de capital da oficina.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            className="hidden sm:flex border-wood-800 text-wood-400 text-sm hover:text-white"
            onClick={handleExportPDF}
          >
            <Download size={18} className="mr-2" />
            PDF
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            Lançar Movimento
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-[24px] border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Receitas</span>
          </div>
          <div>
            <p className="text-wood-500 text-[10px] uppercase font-bold tracking-[1px]">Entradas Totais</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div className="glass p-6 rounded-[24px] border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
              <TrendingDown size={24} />
            </div>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Despesas</span>
          </div>
          <div>
            <p className="text-wood-500 text-[10px] uppercase font-bold tracking-[1px]">Saídas Totais</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div className="glass p-6 rounded-[24px] border-brass-500/20 bg-brass-500/[0.02] space-y-4">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-brass-500/10 rounded-xl text-brass-500">
              <DollarSign size={24} />
            </div>
            <span className="text-[10px] font-bold text-brass-500 uppercase tracking-widest">Saldo Líquido</span>
          </div>
          <div>
            <p className="text-wood-500 text-[10px] uppercase font-bold tracking-[1px]">Em Conta (D+0)</p>
            <h3 className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-white' : 'text-red-500'}`}>
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass rounded-[32px] border-white/5 overflow-hidden">
        {/* Table Header / Filters */}
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2">
            {["Todos", "Receita", "Despesa"].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === t ? 'bg-brass-500 text-wood-950' : 'bg-wood-900 text-wood-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 bg-wood-900/50 px-4 py-2 rounded-xl border border-white/5">
            <Search className="text-wood-600" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar lançamento..." 
              className="bg-transparent border-none focus:outline-none text-xs text-white placeholder:text-wood-600 w-48"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-wood-500 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-[10px] font-black text-wood-500 uppercase tracking-widest">Descrição</th>
                <th className="px-6 py-4 text-[10px] font-black text-wood-500 uppercase tracking-widest">Categoria</th>
                <th className="px-6 py-4 text-[10px] font-black text-wood-500 uppercase tracking-widest">Valor</th>
                <th className="px-6 py-4 text-[10px] font-black text-wood-500 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin text-brass-500 mx-auto" size={32} />
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-xs text-wood-300 font-medium">
                      {new Date(t.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white uppercase tracking-tight">{t.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-wood-900 text-wood-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/5">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 font-black text-sm ${t.type === 'Receita' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {t.type === 'Receita' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-wood-600 hover:text-white transition-colors">
                         <Filter size={16} />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-wood-600 uppercase text-[10px] font-bold tracking-[2px]">Nenhuma transação encontrada</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
