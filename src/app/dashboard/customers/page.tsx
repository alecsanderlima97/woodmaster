"use client";

import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const customers = [
  { 
    id: 1, 
    name: "Ricardo Oliveira", 
    email: "ricardo@email.com", 
    phone: "(11) 98765-4321", 
    location: "São Paulo, SP",
    projects: 2,
    status: "Ativo",
    lastOrder: "12 Set 2023"
  },
  { 
    id: 2, 
    name: "Marina Souza", 
    email: "marina.s@gmail.com", 
    phone: "(11) 99988-7766", 
    location: "Campinas, SP",
    projects: 1,
    status: "Aguardando",
    lastOrder: "05 Out 2023"
  },
  { 
    id: 3, 
    name: "Construtora Alfa", 
    email: "contato@alfa.com.br", 
    phone: "(11) 3344-5566", 
    location: "Barueri, SP",
    projects: 5,
    status: "Lead",
    lastOrder: "N/A"
  },
];

export default function CustomersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestão de Clientes</h1>
          <p className="text-wood-400">Acompanhe seus leads, parcerias e histórico comercial.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={20} />
          Novo Cliente
        </Button>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border-white/5">
          <p className="text-wood-400 text-sm">Total de Clientes</p>
          <p className="text-2xl font-bold text-white">124</p>
        </div>
        <div className="glass p-6 rounded-2xl border-white/5">
          <p className="text-wood-400 text-sm">Leads do Mês</p>
          <p className="text-2xl font-bold text-brass-500">+12</p>
        </div>
        <div className="glass p-6 rounded-2xl border-white/5">
          <p className="text-wood-400 text-sm">Taxa de Conversão</p>
          <p className="text-2xl font-bold text-emerald-400">22%</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-wood-900/50 px-4 py-3 rounded-xl border border-wood-800">
        <Search className="text-wood-500" size={20} />
        <input 
          type="text" 
          placeholder="Pesquisar por nome, e-mail ou cidade..." 
          className="bg-transparent border-none focus:outline-none text-sm w-full text-white placeholder:text-wood-600"
        />
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="glass p-6 rounded-2xl border-white/5 space-y-6 hover:border-brass-500/30 transition-all group overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brass-500/5 rounded-full blur-3xl group-hover:bg-brass-500/10 transition-all"></div>

            <div className="flex items-start justify-between relative z-10">
              <div className="w-14 h-14 bg-wood-800 rounded-2xl flex items-center justify-center text-wood-400 font-bold text-xl group-hover:bg-brass-500 group-hover:text-wood-950 transition-all">
                {customer.name.charAt(0)}
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                customer.status === "Ativo" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                customer.status === "Aguardando" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                "bg-blue-500/10 text-blue-500 border-blue-500/20"
              }`}>
                {customer.status}
              </span>
            </div>

            <div className="space-y-1 relative z-10">
              <h3 className="text-xl font-bold text-white group-hover:text-brass-500 transition-colors uppercase tracking-tight">{customer.name}</h3>
              <div className="flex items-center gap-2 text-wood-500 text-sm">
                <MapPin size={14} />
                {customer.location}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-wood-900 relative z-10">
              <div className="flex items-center gap-3 text-sm text-wood-300">
                <Mail size={16} className="text-wood-600" />
                {customer.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-wood-300">
                <Phone size={16} className="text-wood-600" />
                {customer.phone}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 relative z-10">
              <div className="text-xs text-wood-500">
                <p className="uppercase tracking-tighter">Projetos</p>
                <p className="text-sm font-bold text-wood-200">{customer.projects}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-wood-900 hover:bg-wood-800 rounded-lg text-wood-400 hover:text-white transition-all">
                  <MessageSquare size={18} />
                </button>
                <button className="p-2 bg-brass-500 hover:bg-brass-400 rounded-lg text-wood-950 transition-all">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
