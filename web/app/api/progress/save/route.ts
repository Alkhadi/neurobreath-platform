/**
 * POST /api/progress/save — save page/tool progress to Firestore.
 *
 * This is the Firestore-backed progress endpoint for authenticated users.
 * The existing /api/progress (Prisma-based) route is NOT modified.
 */

import { NextRequest } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { verifyAuthToken } from "@/lib/buddy/auth";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

interface SaveProgressBody {
  pageId: string;
  progressData: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  const auth = await verifyAuthToken(req);
  if (!auth.uid) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as SaveProgressBody | null;
  if (!body?.pageId || !body?.progressData) {
    return Response.json({ error: "Missing pageId or progressData" }, { status: 400 });
  }

  const db = getAdminFirestore();
  if (!db) {
    return Response.json({ error: "Service not configured" }, { status: 503 });
  }

  try {
    const ref = db
      .collection(COLLECTIONS.USERS)
      .doc(auth.uid)
      .collection(COLLECTIONS.PROGRESS)
      .doc(body.pageId);

    await ref.set(
      {
        pageId: body.pageId,
        progressData: body.progressData,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return Response.json({ saved: true, pageId: body.pageId });
  } catch (err) {
    console.error("[api/progress/save] Failed:", err);
    return Response.json({ error: "Failed to save progress" }, { status: 500 });
  }
}
