import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const approvedProject = await storage.approvePendingProject(id);
    if (!approvedProject) {
      return NextResponse.json(
        { error: "Pending project not found or already processed" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Project approved and published",
      project: approvedProject,
    });
  } catch (error) {
    console.error("Error approving project:", error);
    return NextResponse.json({ error: "Failed to approve project" }, { status: 500 });
  }
}
