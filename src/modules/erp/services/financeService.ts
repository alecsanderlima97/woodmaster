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
