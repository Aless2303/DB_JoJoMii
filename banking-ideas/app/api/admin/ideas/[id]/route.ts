import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ideas, votes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const VALID_STATUSES = ["new", "review", "approved", "build", "completed"];

// PUT update idea status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // Check if idea exists
    const existingIdea = await db.query.ideas.findFirst({
      where: eq(ideas.id, params.id),
    });

    if (!existingIdea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    // Update idea status
    await db.update(ideas).set({ 
      status, 
      updatedAt: new Date() 
    }).where(eq(ideas.id, params.id));

    return NextResponse.json({
      success: true,
      message: `Idea status updated to "${status}"`,
    });
  } catch (error) {
    console.error("Error updating idea status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE idea (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Check if idea exists
    const existingIdea = await db.query.ideas.findFirst({
      where: eq(ideas.id, params.id),
    });

    if (!existingIdea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    // First delete all votes for this idea (to avoid foreign key constraint)
    await db.delete(votes).where(eq(votes.ideaId, params.id));
    
    // Then delete the idea
    await db.delete(ideas).where(eq(ideas.id, params.id));

    return NextResponse.json({
      success: true,
      message: "Idea deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting idea:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
