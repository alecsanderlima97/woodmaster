import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Extender o tipo jsPDF para incluir autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export const pdfGenerator = {
  /**
   * Gera Ordem de Serviço (O.S.) para Marcenaria
   */
  generateProjectOS: (project: any, client: any) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const dateStr = format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR });

    // Header
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("WoodMaster", 20, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("SISTEMA DE GESTÃO PARA MARCENARIAS", 20, 28);
    
    doc.setFontSize(14);
    doc.text(`ORDEM DE SERVIÇO Nº ${project.id?.slice(0, 6).toUpperCase() || 'NOVO'}`, 130, 20);
    doc.setFontSize(8);
    doc.text(`Gerado em: ${dateStr}`, 130, 28);

    // Corpo
    doc.setTextColor(0, 0, 0);
    
    // Dados do Cliente
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DADOS DO CLIENTE", 20, 55);
    doc.line(20, 57, 190, 57);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${client?.name || 'Não informado'}`, 20, 65);
    doc.text(`Telefone: ${client?.phone || 'Não informado'}`, 20, 71);
    doc.text(`Endereço: ${client?.address || 'Não informado'}`, 20, 77);

    // Dados do Projeto
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DETALHES DO PROJETO / ENCOMENDA", 20, 95);
    doc.line(20, 97, 190, 97);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Projeto: ${project.name}`, 20, 105);
    doc.text(`Descrição: ${project.description || 'N/A'}`, 20, 111);
    doc.text(`Previsão de Entrega: ${project.deadline || 'A combinar'}`, 20, 117);

    // Tabela de Itens/Materiais (Se houver)
    if (project.items && project.items.length > 0) {
      doc.autoTable({
        startY: 125,
        head: [['Item/Material', 'Qtd', 'Observações']],
        body: project.items.map((i: any) => [i.name, i.quantity, i.notes || '']),
        theme: 'striped',
        headStyles: { fillColor: [181, 146, 89] }, // Cor Brass do sistema
      });
    }

    // Financeiro no rodapé ou após tabela
    const finalY = (doc as any).lastAutoTable?.finalY || 135;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMO FINANCEIRO", 20, finalY + 15);
    doc.line(20, finalY + 17, 100, finalY + 17);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Valor Total: R$ ${project.totalPrice || '0,00'}`, 20, finalY + 25);
    doc.text(`Entrada/Pago: R$ ${project.paid || '0,00'}`, 20, finalY + 31);
    doc.setTextColor(150, 0, 0);
    doc.text(`Saldo Devedor: R$ ${project.balance || '0,00'}`, 20, finalY + 37);

    // Assinaturas
    doc.setTextColor(0, 0, 0);
    doc.line(20, 260, 90, 260);
    doc.text("Assinatura do Cliente", 35, 265);
    
    doc.line(120, 260, 190, 260);
    doc.text("Responsável WoodMaster", 130, 265);

    doc.save(`OS_WoodMaster_${project.name}.pdf`);
  },

  /**
   * Gera Relatório Financeiro / Fluxo de Caixa
   */
  generateFinancialReport: (transactions: any[], totals: any) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const dateStr = format(new Date(), "dd/MM/yyyy", { locale: ptBR });

    // Style Header
    doc.setFillColor(181, 146, 89);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("RELATÓRIO FINANCEIRO", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Período de Referência: ${dateStr}`, 20, 35);
    
    // Sumário no Header
    doc.setFontSize(12);
    doc.text(`Entradas: R$ ${totals.income}`, 140, 20);
    doc.text(`Saídas: R$ ${totals.expense}`, 140, 27);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Saldo: R$ ${totals.balance}`, 140, 37);

    // Tabela de Transações
    doc.autoTable({
      startY: 55,
      head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
      body: transactions.map(t => [
        t.date,
        t.description,
        t.category,
        t.type === 'income' ? 'ENTRADA' : 'SAÍDA',
        `R$ ${t.value}`
      ]),
      columnStyles: {
        3: { fontStyle: 'bold' },
        4: { halign: 'right' }
      },
      didParseCell: (data: any) => {
        if (data.column.index === 3 && data.cell.text[0] === 'ENTRADA') {
          data.cell.styles.textColor = [0, 120, 0];
        } else if (data.column.index === 3 && data.cell.text[0] === 'SAÍDA') {
          data.cell.styles.textColor = [150, 0, 0];
        }
      },
      theme: 'grid',
      headStyles: { fillColor: [30, 30, 30] },
    });

    doc.save(`Relatorio_Financeiro_WoodMaster_${dateStr}.pdf`);
  }
};
