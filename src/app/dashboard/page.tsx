"use client";

import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Hammer,
  DollarSign
} from "lucide-react";

const stats = [
  { label: "Projetos Ativos", value: "12", icon: Hammer, color: "text-brass-500", bg: "bg-brass-500/10" },
  { label: "Em Produção", value: "08", icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Concluídos (Mês)", value: "24", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Faturamento", value: "R$ 45.200", icon: DollarSign, color: "text-brass-500", bg: "bg-brass-500/10" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard da Oficina</h1>
        <p className="text-wood-400">Bem-vindo de volta! Aqui está o resumo das suas operações.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="glass p-6 rounded-2xl border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <TrendingUp size={14} />
                +12%
              </span>
            </div>
            <div>
              <p className="text-wood-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Trabalhos em Fila</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-wood-900/40 rounded-xl hover:bg-wood-900/60 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-wood-800 rounded-lg flex items-center justify-center font-bold text-wood-500">
                    #{(500 + i).toString().padStart(4, '0')}
                  </div>
                  <div>
                    <p className="text-white font-semibold group-hover:text-brass-500 transition-colors">Cozinha Planejada - Ap 402</p>
                    <p className="text-xs text-wood-500 uppercase tracking-tighter">Cliente: Ricardo Oliveira</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-brass-500/10 text-brass-500 rounded-full text-xs font-bold">
                    Corte iniciado
                  </span>
                  <p className="text-xs text-wood-500 mt-1">Prazo: 12 Out</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alert */}
        <div className="glass p-6 rounded-2xl border-white/5 space-y-6">
          <h3 className="text-xl font-bold text-white">Alertas de Estoque</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3">
              <AlertCircle className="text-red-400 shrink-0" size={20} />
              <div>
                <p className="text-red-400 text-sm font-bold">Crítico: MDF Louro Freijó</p>
                <p className="text-xs text-red-500/80">Restam apenas 2 chapas.</p>
              </div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3">
              <AlertCircle className="text-yellow-400 shrink-0" size={20} />
              <div>
                <p className="text-yellow-400 text-sm font-bold">Aviso: Corrediças Invisíveis</p>
                <p className="text-xs text-yellow-500/80">Estoque abaixo do mínimo (12 pares).</p>
              </div>
            </div>
          </div>
          <button className="w-full py-3 bg-wood-900 text-wood-100 hover:bg-wood-800 rounded-xl transition-all text-sm font-bold">
            Ver Inventário Completo
          </button>
        </div>
      </div>
    </div>
  );
}
