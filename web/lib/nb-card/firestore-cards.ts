/**
 * Minimal Firestore persistence for NB-Card saved layouts.
 *
 * Collection: users/{uid}/nbcards/{cardId}
 *
 * Writes are gated on a signed-in (non-anonymous) Firebase user.
 */

import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { NbcardSavedCard, Profile } from "@/lib/utils";

/** Firestore document shape — aligned with NbcardSavedCard. */
export interface NbcardFirestoreDoc {
  title: string;
  category: string;
  snapshot: Profile;
  createdAt: number;   // epoch ms (client-set for deterministic reads)
  updatedAt: number;   // epoch ms
  serverTs?: ReturnType<typeof serverTimestamp>;
}

/**
 * Save (upsert) a single NB-Card to Firestore under the user's UID.
 */
export async function saveCardToFirestore(
  uid: string,
  card: NbcardSavedCard,
): Promise<void> {
  const firestore = getFirebaseDb();
  if (!firestore) return;
  const ref = doc(collection(firestore, "users", uid, "nbcards"), card.id);
  const data: NbcardFirestoreDoc = {
    title: card.title,
    category: card.category,
    snapshot: card.snapshot,
    createdAt: card.createdAt ?? card.updatedAt,
    updatedAt: card.updatedAt,
    serverTs: serverTimestamp(),
  };
  await setDoc(ref, data, { merge: true });
}

/**
 * Load all saved NB-Cards for a user from Firestore.
 * Returns them in the same NbcardSavedCard shape used locally.
 */
export async function loadCardsFromFirestore(
  uid: string,
): Promise<NbcardSavedCard[]> {
  const firestore = getFirebaseDb();
  if (!firestore) return [];
  const col = collection(firestore, "users", uid, "nbcards");
  const q = query(col, orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);

  const cards: NbcardSavedCard[] = [];
  snap.forEach((d) => {
    const data = d.data() as Partial<NbcardFirestoreDoc>;
    if (!data.snapshot || !data.title) return;
    cards.push({
      id: d.id,
      title: data.title,
      category: (data.category as NbcardSavedCard["category"]) ?? "PROFILE",
      snapshot: data.snapshot as Profile,
      updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : toEpoch(data.serverTs),
      createdAt: typeof data.createdAt === "number" ? data.createdAt : undefined,
    });
  });
  return cards;
}

/**
 * Delete a single saved NB-Card from Firestore.
 */
export async function deleteCardFromFirestore(
  uid: string,
  cardId: string,
): Promise<void> {
  const firestore = getFirebaseDb();
  if (!firestore) return;
  const ref = doc(collection(firestore, "users", uid, "nbcards"), cardId);
  await deleteDoc(ref);
}

/* Convert a possible Firestore Timestamp to epoch ms */
function toEpoch(ts: unknown): number {
  if (ts && typeof ts === "object" && "toMillis" in ts) {
    return (ts as Timestamp).toMillis();
  }
  return Date.now();
}
