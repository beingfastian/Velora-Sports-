import { collection, getDocs, doc, getDoc, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product } from "@/lib/types"

export async function getAllProducts(): Promise<Product[]> {
  const productsRef = collection(db, "products")
  const q = query(productsRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Product[]
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const productsRef = collection(db, "products")
  const q = query(
    productsRef,
    where("category", "==", category),
    orderBy("createdAt", "desc")
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Product[]
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, "products", id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    return null
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
    updatedAt: docSnap.data().updatedAt?.toDate(),
  } as Product
}