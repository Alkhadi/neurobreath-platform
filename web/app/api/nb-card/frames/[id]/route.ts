import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || [];
  return adminEmails.includes(email.toLowerCase());
}

function getEmailFromRequest(req: NextRequest): string | undefined {
  return req.headers.get("x-admin-email") || undefined;
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const email = getEmailFromRequest(req);
    if (!isAdmin(email)) {
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
