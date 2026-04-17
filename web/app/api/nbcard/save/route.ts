/**
 * POST /api/nbcard/save — save an NB Card with server-side limit enforcement.
 *
 * Uses a Firestore transaction to atomically check and increment nbCardUsed
 * against the user's nbCardLimit before writing the card.
 */

import { NextRequest } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { verifyAuthToken } from "@/lib/buddy/auth";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

interface SaveCardBody {
  cardId?: string;
  title: string;
  data: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  const auth = await verifyAuthToken(req);
  if (!auth.uid) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as SaveCardBody | null;
  if (!body?.title || !body?.data) {
    return Response.json({ error: "Missing title or data" }, { status: 400 });
  }

  const db = getAdminFirestore();
  if (!db) {
    return Response.json({ error: "Service not configured" }, { status: 503 });
  }

  const userRef = db.collection(COLLECTIONS.USERS).doc(auth.uid);
  const cardsRef = userRef.collection(COLLECTIONS.SAVED_CARDS);

  // If updating an existing card, no need to check limit
  if (body.cardId) {
    await cardsRef.doc(body.cardId).set(
      {
        title: body.title.slice(0, 200),
        data: body.data,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return Response.json({ cardId: body.cardId, saved: true });
  }

  // New card — enforce limit via transaction
  try {
    const result = await db.runTransaction(async (tx) => {
      const userDoc = await tx.get(userRef);
      const userData = userDoc.data() ?? {};
      const limit = (userData.nbCardLimit as number) ?? 2;
      const used = (userData.nbCardUsed as number) ?? 0;

      if (used >= limit) {
        return { error: "card_limit_reached", limit };
      }

      const newCardRef = cardsRef.doc();
      tx.set(newCardRef, {
        title: body.title.slice(0, 200),
        data: body.data,
        updatedAt: FieldValue.serverTimestamp(),
      });
      tx.update(userRef, {
        nbCardUsed: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return { cardId: newCardRef.id };
    });

    if ("error" in result) {
      return Response.json(
        { error: result.error, limit: result.limit },
        { status: 403 },
      );
    }

    return Response.json({ cardId: result.cardId, saved: true });
  } catch (err) {
    console.error("[api/nbcard/save] Transaction failed:", err);
    return Response.json({ error: "Failed to save card" }, { status: 500 });
  }
}
