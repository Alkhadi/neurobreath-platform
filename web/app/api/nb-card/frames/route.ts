import { NextRequest, NextResponse } from "next/server";
import { getAuthedUserId } from "@/lib/auth/require-auth";
import { getBuiltinFrames, isSafeFrameSrc, type NbCardFrame } from "@/lib/nbcard-frames";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
}

async function getAdminEmail(req: NextRequest): Promise<string | null> {
  const auth = await getAuthedUserId(req);
  if (!auth.ok) return null;
  
  // Get user email from database
  try {
    const { prisma } = await import("@/lib/db");
    const user = await prisma.authUser.findUnique({
      where: { id: auth.userId },
      select: { email: true },
    });

    return user?.email || null;
  } catch {
    return null;
  }
  
}

export async function GET(req: NextRequest) {
  const builtins = getBuiltinFrames();

  try {
    const { searchParams } = new URL(req.url);
    const categoryParam = (searchParams.get("category") ?? "").trim().toLowerCase();

    const builtinFiltered =
      categoryParam === "backgrounds"
        ? builtins.filter((f) => f.category === "backgrounds")
        : categoryParam === "overlays"
          ? builtins.filter((f) => f.category === "overlays")
          : builtins;

    const wantsDbFrames = categoryParam !== "backgrounds" && categoryParam !== "overlays";

    let dbFrames: NbCardFrame[] = [];
    if (wantsDbFrames) {
      try {
        const { prisma } = await import("@/lib/db");
        const dbRows = await prisma.nbCardFrame.findMany({
          where: {
            isActive: true,
            ...(categoryParam === "address" || categoryParam === "bank" || categoryParam === "business"
              ? { category: categoryParam.toUpperCase() }
              : {}),
          },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
          take: 50,
        });

        dbFrames = dbRows
          .map((row) => {
            const src = row.imageUrl;
            if (!isSafeFrameSrc(src)) return null;
            if (!src.startsWith("/nb-card/frames/")) return null;
            return {
              id: `db:${row.id}`,
              name: row.name,
              category: row.category.toLowerCase(),
              src,
            } satisfies NbCardFrame;
          })
          .filter((f): f is NbCardFrame => Boolean(f));
      } catch {
        dbFrames = [];
      }
    }

    const merged = [...builtinFiltered, ...dbFrames];
    const seen = new Set<string>();
    const frames = merged.filter((f) => {
      if (seen.has(f.src)) return false;
      seen.add(f.src);
      return true;
    });

    return Response.json({ frames }, { status: 200 });
  } catch {
    return Response.json({ frames: builtins }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const email = await getAdminEmail(req);
    if (!email || !isAdmin(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, category, imageUrl, sortOrder = 0 } = body;

    if (!name || !category || !imageUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validCategories = ["ADDRESS", "BANK", "BUSINESS"];
    if (!validCategories.includes(category.toUpperCase())) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Enforce max 50 active frames
    const { prisma } = await import("@/lib/db");
    const activeCount = await prisma.nbCardFrame.count({ where: { isActive: true } });
    if (activeCount >= 50) {
      return NextResponse.json({ error: "Maximum 50 active frames reached" }, { status: 400 });
    }

    const frame = await prisma.nbCardFrame.create({
      data: {
        name,
        category: category.toUpperCase(),
        imageUrl,
        sortOrder,
        isActive: true,
      },
    });

    return NextResponse.json({ frame });
  } catch (error) {
    console.error("Failed to create frame:", error);
    return NextResponse.json({ error: "Failed to create frame" }, { status: 500 });
  }
}
