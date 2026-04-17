import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pending = await storage.getPendingProjects();
    return NextResponse.json(pending);
  } catch (error) {
    console.error("Error fetching pending projects:", error);
    return NextResponse.json({ error: "Failed to fetch pending projects" }, { status: 500 });
  }
}
