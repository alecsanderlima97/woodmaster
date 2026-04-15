"use client";

import { ReactNode } from "react";
import { 
  Hammer, 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  Search,
  Bell
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Hammer, label: "Projetos", href: "/dashboard/projects" },
  { icon: Package, label: "Estoque", href: "/dashboard/inventory" },
  { icon: Users, label: "Clientes", href: "/dashboard/customers" },
  { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-wood-950 text-wood-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-wood-900 bg-wood-950 flex flex-col p-6 space-y-8 z-20">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-brass-500 rounded-lg flex items-center justify-center">
            <Hammer className="text-wood-950" size={24} />
          </div>
          <span className="text-xl font-bold">Wood<span className="text-brass-500">Master</span></span>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                pathname === item.href 
                  ? "bg-brass-500 text-wood-950 font-bold" 
                  : "text-wood-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={20} className={pathname === item.href ? "text-wood-950" : "group-hover:text-brass-400"} />
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 text-wood-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut size={20} />
          Sair da Conta
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-wood-900 flex items-center justify-between px-8 bg-wood-950/50 backdrop-blur-md">
          <div className="flex items-center gap-4 bg-wood-900/50 px-4 py-2 rounded-xl w-96 border border-wood-800">
            <Search className="text-wood-500" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar projetos, clientes..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-wood-600"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-wood-400 hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-brass-500 rounded-full border-2 border-wood-950"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-wood-900">
              <div className="text-right">
                <p className="text-sm font-bold text-white">Alecsander Lima</p>
                <p className="text-xs text-wood-500 uppercase tracking-wider font-medium">Administrador</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070')] bg-cover border-2 border-brass-500/30"></div>
            </div>
          </div>
        </header>

        {/* Page Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
