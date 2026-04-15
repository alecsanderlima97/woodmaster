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
