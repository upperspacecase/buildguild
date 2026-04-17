import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { insertInterestSubmissionSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validation = insertInterestSubmissionSchema.safeParse({
      ...body,
      projectId: id,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: fromError(validation.error).toString() },
        { status: 400 }
      );
    }

    const submission = await storage.createInterestSubmission(validation.data);

    await storage.addGuildMember({
      projectId: id,
      name: validation.data.name,
      role: "Contributor",
    });

    return NextResponse.json(
      { message: "Interest submitted successfully", id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting interest:", error);
    return NextResponse.json({ error: "Failed to submit interest" }, { status: 500 });
  }
}
