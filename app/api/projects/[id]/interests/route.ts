import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const submissions = await storage.getInterestSubmissions(id);
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching interest submissions:", error);
    return NextResponse.json({ error: "Failed to fetch interest submissions" }, { status: 500 });
  }
}
