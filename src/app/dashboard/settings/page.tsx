"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { userService, UserProfile } from "@/modules/auth/services/userService";
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Save,
  Loader2,
  CheckCircle2,
  Hammer
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    displayName: "",
    companyName: "",
    cnpj: "",
    phone: "",
    address: "",
    specialty: "Marcenaria Sob Medida"
  });

  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile(user.uid);
        if (data) {
          setProfile(data);
        } else {
          setProfile(prev => ({ ...prev, displayName: user.displayName || "", email: user.email || "" }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
      await userService.updateProfile(user.uid, profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-brass-500" size={48} />
        <p className="text-wood-400">Preparando painel de controle...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight uppercase px-1 border-l-4 border-brass-500 ml-[-4px]">
          Configurações do Sistema
        </h1>
        <p className="text-wood-400 mt-1">Gerencie sua identidade e os dados comerciais da sua oficina.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar Tabs (UX improvement) */}
          <div className="space-y-2">
            <button type="button" className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 text-brass-500 rounded-xl border border-brass-500/20 font-bold text-sm">
              <User size={18} />
              Perfil e Empresa
            </button>
            <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-wood-500 hover:bg-white/5 rounded-xl transition-all font-bold text-sm">
              <Shield size={18} />
              Segurança
            </button>
            <button type="button" className="w-full flex items-center gap-3 px-4 py-3 text-wood-500 hover:bg-white/5 rounded-xl transition-all font-bold text-sm">
              <Building2 size={18} />
              Assinatura SaaS
            </button>
          </div>

          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass p-8 rounded-[32px] border-white/5 space-y-8">
              {/* Profile Header */}
              <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                <div className="w-20 h-20 bg-gradient-to-br from-brass-400 to-brass-600 rounded-[24px] flex items-center justify-center text-wood-950 shadow-xl shadow-brass-500/20">
                  <Hammer size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">
                    {profile.companyName || "Sua Marcenaria"}
                  </h3>
                  <p className="text-wood-500 text-xs font-bold uppercase tracking-widest">
                    ID da Oficina: WM-{user?.uid.slice(0, 6).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-brass-500 text-[10px] font-black uppercase tracking-[3px]">Informações do Mestre</h4>
                <div className="grid sm:grid-cols-2 gap-6">
                  <Input 
                    label="Nome Completo" 
                    value={profile.displayName} 
                    onChange={e => setProfile({...profile, displayName: e.target.value})}
                    placeholder="Seu nome"
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-wood-500 uppercase tracking-widest pl-1">E-mail de Acesso</label>
                    <div className="flex items-center gap-3 px-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-wood-600 cursor-not-allowed">
                       <Mail size={18} />
                       <span className="text-sm font-medium">{user?.email}</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-brass-500 text-[10px] font-black uppercase tracking-[3px] pt-4">Dados da Oficina</h4>
                <div className="grid sm:grid-cols-2 gap-6">
                   <div className="sm:col-span-2">
                    <Input 
                      label="Nome da Empresa / Marcenaria" 
                      value={profile.companyName} 
                      onChange={e => setProfile({...profile, companyName: e.target.value})}
                      placeholder="Ex: Marcenaria Design Premium"
                    />
                  </div>
                  <Input 
                    label="CNPJ / CPF" 
                    value={profile.cnpj} 
                    onChange={e => setProfile({...profile, cnpj: e.target.value})}
                    placeholder="00.000.000/0000-00"
                  />
                  <Input 
                    label="Telefone Comercial" 
                    value={profile.phone} 
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    placeholder="(00) 00000-0000"
                  />
                   <div className="sm:col-span-2">
                    <Input 
                      label="Endereço da Oficina" 
                      value={profile.address} 
                      onChange={e => setProfile({...profile, address: e.target.value})}
                      placeholder="Rua, Número, Bairro, Cidade"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <AnimatePresence>
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-emerald-400 text-sm font-bold"
                    >
                      <CheckCircle2 size={18} />
                      Configurações Salvas!
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex-1" />
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="px-8 h-14 bg-brass-500 text-wood-950 font-black uppercase tracking-[2px] rounded-2xl shadow-xl shadow-brass-500/10 hover:bg-brass-400 active:scale-95 transition-all flex items-center gap-3"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Salvar Alterações
                      <Save size={18} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
