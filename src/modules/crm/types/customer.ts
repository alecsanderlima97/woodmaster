export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'Ativo' | 'Aguardando' | 'Lead';
  projects: number;
  lastOrder?: string;
  userId: string; // Para multi-tenancy básico
  createdAt: any;
  updatedAt: any;
}
