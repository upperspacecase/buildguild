import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await storage.getAllProjects();
    const projectsWithMembers = await Promise.all(
      projects.map(async (project) => {
        const members = await storage.getGuildMembers(project.id);
        return {
          ...project,
          team: members.map(m => ({ name: m.name, role: m.role })),
        };
      })
    );
    return NextResponse.json(projectsWithMembers);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
