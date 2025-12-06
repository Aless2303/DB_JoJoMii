import { NextRequest, NextResponse } from "next/server";
import { db, generateId } from "@/lib/db";
import { votes, ideas } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const VoteSchema = z.object({
  ideaId: z.string(),
  rating: z.number().min(1).max(5),
  sessionId: z.string().optional(),
});

// POST /api/vote - Submit a vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = VoteSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid vote data" },
        { status: 400 }
      );
    }

    const { ideaId, rating, sessionId } = validationResult.data;

    // Check if idea exists
    const idea = await db.query.ideas.findFirst({
      where: eq(ideas.id, ideaId),
    });

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    // Create vote
    const voteId = generateId();
    await db.insert(votes).values({
      id: voteId,
      ideaId,
      rating,
      sessionId: sessionId || `anon-${Date.now()}`,
    });

    // Update idea average rating
    const allVotes = await db.select().from(votes).where(eq(votes.ideaId, ideaId));
    const totalRating = allVotes.reduce((sum, v) => sum + v.rating, 0);
    const averageRating = totalRating / allVotes.length;

    await db
      .update(ideas)
      .set({
        averageRating,
        totalVotes: allVotes.length,
        updatedAt: new Date(),
      })
      .where(eq(ideas.id, ideaId));

    return NextResponse.json({
      success: true,
      averageRating,
      totalVotes: allVotes.length,
    });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 }
    );
  }
}
