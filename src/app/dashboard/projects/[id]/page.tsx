"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { projectService } from "@/modules/erp/services/projectService";
import { Project } from "@/modules/erp/types/project";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  Hammer, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  Loader2,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectService.getById(id);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brass-500" size={48} />
        <p className="text-wood-400">Carregando detalhes do projeto...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-bold text-white">Projeto não encontrado</h2>
        <Link href="/dashboard/projects" className="text-brass-500 hover:underline mt-4 inline-block">
          Voltar para lista
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Navigation */}
      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-wood-500">
        <Link href="/dashboard/projects" className="hover:text-brass-500 transition-colors flex items-center gap-1">
          <ArrowLeft size={14} />
          Projetos
        </Link>
        <ChevronRight size={14} />
        <span className="text-wood-300">{project.name}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-brass-500 text-wood-950 rounded-[20px] flex items-center justify-center font-black text-2xl shadow-lg shadow-brass-500/20">
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-brass-500 text-[10px] font-black uppercase tracking-[3px]">
                ID: WM-{project.id?.slice(0, 6).toUpperCase()}
              </span>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{project.name}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-wood-300 flex items-center gap-2">
              <Clock size={14} className="text-brass-500" />
              {project.status}
            </span>
            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-wood-300 flex items-center gap-2">
              <Calendar size={14} className="text-brass-500" />
              Entrega: {project.deadline}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="border-wood-800 text-wood-400">
            <FileText size={18} />
            Contrato
          </Button>
          <Button className="bg-brass-500 text-wood-950 font-black px-8">
            Editar Projeto
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Progress & Specs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Card */}
          <div className="glass p-8 rounded-[32px] border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Status de Produção</h3>
              <span className="text-2xl font-black text-brass-500">{project.progress}%</span>
            </div>
            <div className="h-4 bg-wood-900 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                className="h-full bg-gradient-to-r from-brass-600 to-brass-400 rounded-full"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
               {["Medição", "Projeto", "Produção", "Montagem"].map((step, idx) => {
                 const isCompleted = idx < 2; // Mock logic
                 const isCurrent = idx === 2; // Mock logic
                 return (
                   <div key={step} className="text-center space-y-2">
                     <div className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                       isCompleted ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" :
                       isCurrent ? "bg-brass-500/20 border-brass-500/50 text-brass-500 animate-pulse" :
                       "bg-wood-900 border-white/5 text-wood-600"
                     }`}>
                       {isCompleted ? <CheckCircle2 size={20} /> : <Layers size={20} />}
                     </div>
                     <span className={`text-[10px] font-bold uppercase tracking-widest ${
                       isCompleted || isCurrent ? "text-wood-200" : "text-wood-600"
                     }`}>{step}</span>
                   </div>
                 );
               })}
            </div>
          </div>

          {/* Project Content / Photos Placeholder */}
          <div className="glass p-8 rounded-[32px] border-white/5 space-y-6">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Arquivos e Documentos</h3>
            <div className="grid sm:grid-cols-2 gap-4">
               {[
                 { name: "Levantamento_Medidas.pdf", size: "2.4 MB", icon: FileText },
                 { name: "Render_Cozinha_V01.jpg", size: "5.1 MB", icon: Layers },
                 { name: "Lista_Corte_Otimizada.csv", size: "45 KB", icon: Hammer },
               ].map((file) => (
                 <div key={file.name} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-brass-500/30 transition-all cursor-pointer">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-wood-900 rounded-xl flex items-center justify-center text-brass-500">
                       <file.icon size={20} />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-white group-hover:text-brass-500 transition-colors">{file.name}</p>
                       <p className="text-[10px] text-wood-600 uppercase font-bold">{file.size}</p>
                     </div>
                   </div>
                   <ExternalLink size={16} className="text-wood-700" />
                 </div>
               ))}
               <button className="p-4 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-wood-600 hover:text-brass-500 hover:border-brass-500/30 transition-all">
                 <Plus size={24} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Adicionar Arquivo</span>
               </button>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Financial */}
        <div className="space-y-8">
           {/* Customer Card */}
           <div className="glass p-8 rounded-[32px] border-white/5 space-y-6">
             <h3 className="text-lg font-bold text-white uppercase tracking-tight border-l-4 border-brass-500 pl-4">Cliente</h3>
             <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-wood-800 rounded-full flex items-center justify-center text-wood-500 border border-white/10">
                 <User size={28} />
               </div>
               <div>
                 <p className="text-lg font-bold text-white uppercase tracking-tight leading-none">{project.customerName}</p>
                 <p className="text-xs text-wood-500 mt-1 font-medium">Parceiro VIP WoodMaster</p>
               </div>
             </div>
             <Button variant="secondary" className="w-full justify-center gap-2 text-xs font-bold py-4">
                Ver Perfil Completo
                <ExternalLink size={14} />
             </Button>
           </div>

           {/* Financial Card */}
           <div className="glass p-8 rounded-[32px] border-brass-500/20 bg-brass-500/[0.02] space-y-6">
             <h3 className="text-lg font-bold text-white uppercase tracking-tight border-l-4 border-brass-500 pl-4">Financeiro</h3>
             <div className="space-y-4">
               <div>
                 <p className="text-[10px] text-wood-500 font-bold uppercase tracking-widest">Valor do Contrato</p>
                 <p className="text-3xl font-black text-brass-500">{project.budget}</p>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                 <div>
                   <p className="text-[10px] text-wood-500 font-bold uppercase tracking-widest">Status</p>
                   <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Pago (Integral)</span>
                 </div>
                 <div>
                   <p className="text-[10px] text-wood-500 font-bold uppercase tracking-widest">Pagamento</p>
                   <span className="text-xs font-bold text-white uppercase tracking-widest">PIX / À Vista</span>
                 </div>
               </div>
             </div>
             <Button className="w-full bg-white text-wood-950 font-black py-4 rounded-xl">
               Gerar Recibo
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
