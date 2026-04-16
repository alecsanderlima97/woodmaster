import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { Transaction } from "../types/transaction";

const COLLECTION_NAME = "transactions";

export const financeService = {
  async getAll(userId: string): Promise<Transaction[]> {
    if (userId === "guest-user-id") {
      return [
        {
          id: "t1",
          description: "Entrada - Cozinha Planejada Ricardo",
          amount: 5500.00,
          type: "Receita",
          category: "Projeto",
          date: new Date().toISOString(),
          userId: "guest-user-id"
        },
        {
          id: "t2",
          description: "Compra de MDF Cru 15mm",
          amount: 1200.00,
          type: "Despesa",
          category: "Material",
          date: new Date().toISOString(),
          userId: "guest-user-id"
        },
        {
          id: "t3",
          description: "Venda Mesa Angelim - Adiantamento",
          amount: 3000.00,
          type: "Receita",
          category: "Venda",
          date: new Date().toISOString(),
          userId: "guest-user-id"
        },
        {
          id: "t4",
          description: "Pagamento Energia Elétrica",
          amount: 450.00,
          type: "Despesa",
          category: "Custos Fixos",
          date: new Date().toISOString(),
          userId: "guest-user-id"
        }
      ] as Transaction[];
    }

    const q = query(
      collection(db, COLLECTION_NAME), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[];
  },

  async create(transaction: Omit<Transaction, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...transaction,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
};
