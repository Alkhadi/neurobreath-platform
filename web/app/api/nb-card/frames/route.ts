import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
}

function getEmailFromRequest(req: NextRequest): string | undefined {
  // In a real app, extract from NextAuth session or JWT
  // For now, require admin to pass email via header for testing
  return req.headers.get("x-admin-email") || undefined;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const frames = await prisma.nbCardFrame.findMany({
      where: {
        isActive: true,
        ...(category ? { category: category.toUpperCase() } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 50,
    });

    return NextResponse.json({ frames });
  } catch (error) {
    console.error("Failed to fetch frames:", error);
    return NextResponse.json({ error: "Failed to fetch frames" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const email = getEmailFromRequest(req);
    if (!isAdmin(email)) {
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
