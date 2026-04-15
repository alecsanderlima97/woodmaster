import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";
import { db } from "@/services/firebase";

export interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
  companyName?: string;
  cnpj?: string;
  phone?: string;
  address?: string;
  specialty?: string;
  updatedAt?: any;
}

const COLLECTION_NAME = "users";

export const userService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  },

  async updateProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        ...profile,
        updatedAt: new Date(),
      });
    } else {
      await setDoc(docRef, {
        uid,
        ...profile,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
};
