import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ideas } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET /api/ideas/[id] - Get a specific idea
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idea = await db.query.ideas.findFirst({
      where: eq(ideas.id, params.id),
    });

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const parsedIdea = {
      ...idea,
      aiTechnologies: JSON.parse(idea.aiTechnologies || "[]"),
      blockchainTechnologies: JSON.parse(idea.blockchainTechnologies || "[]"),
      otherTechnologies: JSON.parse(idea.otherTechnologies || "[]"),
      monetizationModel: JSON.parse(idea.monetizationModel || "[]"),
      targetMarkets: JSON.parse(idea.targetMarkets || "[]"),
      regulations: JSON.parse(idea.regulations || "[]"),
      generatedPages: JSON.parse(idea.generatedPages || "[]"),
    };

    // Increment view count
    await db
      .update(ideas)
      .set({ viewCount: (idea.viewCount || 0) + 1 })
      .where(eq(ideas.id, params.id));

    return NextResponse.json(parsedIdea);
  } catch (error) {
    console.error("Error fetching idea:", error);
    return NextResponse.json(
      { error: "Failed to fetch idea" },
      { status: 500 }
    );
  }
}
