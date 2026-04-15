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
import { InventoryItem } from "../types/inventory";

const COLLECTION_NAME = "inventory";

export const inventoryService = {
  async getAll(userId: string): Promise<InventoryItem[]> {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("userId", "==", userId),
      orderBy("name", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as InventoryItem[];
  },

  async create(item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async update(id: string, item: Partial<InventoryItem>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...item,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};
