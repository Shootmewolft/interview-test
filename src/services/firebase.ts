import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Family, FamilyInput, UpdateFamilyInput } from '@/models';
import { COLLECTION_NAME } from '@/consts';

export async function createFamilyFb(family: FamilyInput): Promise<string> {
  const { name, sons, description } = family;
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    name,
    sons,
    description: description ?? '',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateFamilyFb(
  id: string,
  data: UpdateFamilyInput
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
}

export async function deleteFamilyFb(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

export async function getFamilyFb(id: string): Promise<Family | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      createdAt: docSnap.data().createdAt?.toDate() ?? new Date(),
      ...docSnap.data(),
    } as Family;
  }

  return null;
}

export async function getAllFamiliesFb(): Promise<Family[]> {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate() ?? new Date(),
    ...doc.data(),
  })) as Family[];
}
