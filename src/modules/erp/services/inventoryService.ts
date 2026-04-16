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
    if (userId === "guest-user-id") {
      return [
        {
          id: "i1",
          name: "MDF Branco Diamante 15mm",
          category: "Chapas",
          stock: 12,
          unit: "Chapa",
          minStock: 5,
          price: "280.00",
          userId: "guest-user-id"
        },
        {
          id: "i2",
          name: "Dobradiça Caneco 35mm",
          category: "Ferragens",
          stock: 150,
          unit: "Unidade",
          minStock: 50,
          price: "12.50",
          userId: "guest-user-id"
        },
        {
          id: "i3",
          name: "Cola Contato 400g",
          category: "Químicos",
          stock: 4,
          unit: "Lata",
          minStock: 3,
          price: "75.00",
          userId: "guest-user-id"
        },
        {
          id: "i4",
          name: "Puxador Perfil G Alumínio",
          category: "Acessórios",
          stock: 24,
          unit: "Metro",
          minStock: 12,
          price: "45.00",
          userId: "guest-user-id"
        }
      ] as InventoryItem[];
    }

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
