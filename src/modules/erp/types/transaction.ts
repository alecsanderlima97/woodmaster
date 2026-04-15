export interface Transaction {
  id?: string;
  type: 'Receita' | 'Despesa';
  description: string;
  amount: number;
  category: string;
  date: string;
  projectId?: string;
  projectName?: string;
  userId: string;
  createdAt: any;
}

export const FINANCE_CATEGORIES = {
  Receita: ["Venda de Móveis", "Serviço de Montagem", "Manutenção", "Outros"],
  Despesa: ["Madeira/MDF", "Ferragens", "Ferramentas", "Aluguel", "Energia", "Mão de Obra", "Impostos", "Marketing", "Outros"]
};
