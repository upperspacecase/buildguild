import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await storage.getProject(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    const members = await storage.getGuildMembers(project.id);
    return NextResponse.json({
      ...project,
      team: members.map(m => ({ name: m.name, role: m.role })),
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
