export interface Project {
  id?: string;
  name: string;
  customerId: string;
  customerName: string; // Facilitar exibição na lista
  status: 'Medição' | 'Projeto' | 'Produção' | 'Montagem' | 'Concluído';
  progress: number;
  budget: string;
  deadline: string;
  priority: 'Baixa' | 'Normal' | 'Alta' | 'Urgente';
  userId: string;
  createdAt: any;
  updatedAt: any;
}
