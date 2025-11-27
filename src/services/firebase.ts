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
import type {
  Family,
  FamilyInput,
  FamilyNode,
  UpdateFamilyInput,
} from '@/models';
import { COLLECTION_NAME } from '@/consts';

function serializeNode(node: FamilyNode): FamilyNode {
  const { createdAt, birthdate, sons, ...rest } = node as FamilyNode & {
    createdAt: { toDate?: () => Date } | Date;
    birthdate: { toDate?: () => Date } | Date;
  };

  return {
    ...rest,
    createdAt:
      typeof createdAt === 'object' && 'toDate' in createdAt && createdAt.toDate
        ? createdAt.toDate()
        : (createdAt as Date) ?? new Date(),
    birthdate:
      typeof birthdate === 'object' && 'toDate' in birthdate && birthdate.toDate
        ? birthdate.toDate()
        : (birthdate as Date) ?? new Date(),
    sons: sons?.map(serializeNode) ?? [],
  };
}

function serializeFamily(id: string, data: Record<string, unknown>): Family {
  const { createdAt, sons, ...rest } = data as {
    createdAt: { toDate?: () => Date } | Date;
    sons: FamilyNode[];
    [key: string]: unknown;
  };

  return {
    id,
    createdAt:
      typeof createdAt === 'object' && 'toDate' in createdAt && createdAt.toDate
        ? createdAt.toDate()
        : (createdAt as Date) ?? new Date(),
    sons: sons?.map(serializeNode) ?? [],
    ...rest,
  } as Family;
}

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
    return serializeFamily(docSnap.id, docSnap.data());
  }

  return null;
}

export async function getAllFamiliesFb(): Promise<Family[]> {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map((d) => serializeFamily(d.id, d.data()));
}
