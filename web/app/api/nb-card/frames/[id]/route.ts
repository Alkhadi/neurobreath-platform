import { NextRequest, NextResponse } from "next/server";
import { getAuthedUserId } from "@/lib/auth/require-auth";
import { prisma } from "@/lib/db";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
}

async function getAdminEmail(req: NextRequest): Promise<string | null> {
  const auth = await getAuthedUserId(req);
  if (!auth.ok) return null;
  
  const user = await prisma.authUser.findUnique({
    where: { id: auth.userId },
    select: { email: true },
  });
  
  return user?.email || null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await getAdminEmail(req);
    if (!email || !isAdmin(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { name, category, imageUrl, sortOrder, isActive } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) {
      const validCategories = ["ADDRESS", "BANK", "BUSINESS"];
      if (!validCategories.includes(category.toUpperCase())) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
      updateData.category = category.toUpperCase();
    }
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    const frame = await prisma.nbCardFrame.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ frame });
  } catch (error) {
    console.error("Failed to update frame:", error);
    return NextResponse.json({ error: "Failed to update frame" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = await getAdminEmail(req);
    if (!email || !isAdmin(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;

    await prisma.nbCardFrame.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete frame:", error);
    return NextResponse.json({ error: "Failed to delete frame" }, { status: 500 });
  }
}
