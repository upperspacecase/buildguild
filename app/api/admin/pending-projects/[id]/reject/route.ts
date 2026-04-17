import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await storage.rejectPendingProject(id);
    return NextResponse.json({ message: "Project rejected" });
  } catch (error) {
    console.error("Error rejecting project:", error);
    return NextResponse.json({ error: "Failed to reject project" }, { status: 500 });
  }
}
