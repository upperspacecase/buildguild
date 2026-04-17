import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertPendingProjectSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = insertPendingProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: fromError(validation.error).toString() },
        { status: 400 }
      );
    }

    const pendingProject = await storage.createPendingProject(validation.data);
    return NextResponse.json(
      { message: "Project submitted for approval", id: pendingProject.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting project:", error);
    return NextResponse.json({ error: "Failed to submit project" }, { status: 500 });
  }
}
