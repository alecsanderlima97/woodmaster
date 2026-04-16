import { 
  collection, 
  getDocs, 
  query, 
  where,
  getDoc,
  doc
} from "firebase/firestore";
import { db } from "@/services/firebase";

const COLLECTION_NAME = "customers";

export const customerService = {
  async getById(userId: string, customerId: string) {
    // Mock para teste/guest
    if (userId === "guest-user-id") {
       return { name: "Cliente Teste", phone: "(11) 99999-9999", address: "Rua das Madeiras, 123" };
    }
    
    try {
      const docRef = doc(db, COLLECTION_NAME, customerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching customer:", error);
      return null;
    }
  }
};
