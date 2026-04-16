import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { Customer } from "../types/customer";

const COLLECTION_NAME = "customers";

export const customerService = {
  async getAll(userId: string): Promise<Customer[]> {
    if (userId === "guest-user-id") {
      return [
        {
          id: "c1",
          name: "Ricardo Santos",
          email: "ricardo@email.com",
          phone: "(11) 98877-6655",
          location: "São Paulo, SP",
          status: "Ativo",
          projects: 2,
          userId: "guest-user-id"
        },
        {
          id: "c2",
          name: "Mariana Lima",
          email: "mariana@email.com",
          phone: "(11) 97766-5544",
          location: "São Bernardo, SP",
          status: "Lead",
          projects: 1,
          userId: "guest-user-id"
        },
        {
          id: "c3",
          name: "André Oliveira",
          email: "andre@email.com",
          phone: "(11) 96655-4433",
          location: "Santo André, SP",
          status: "Aguardando",
          projects: 0,
          userId: "guest-user-id"
        }
      ] as Customer[];
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
    })) as Customer[];
  },

  async create(customer: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...customer,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async update(id: string, customer: Partial<Customer>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...customer,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};
