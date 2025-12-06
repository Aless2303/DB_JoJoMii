import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, generateId } from "@/lib/db";
import { votes, ideas } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const VoteSchema = z.object({
  ideaId: z.string(),
  voteType: z.enum(["like", "dislike"]),
});

// POST /api/vote - Submit a vote (authenticated users only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only authenticated users can vote
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to vote" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const validationResult = VoteSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid vote data. Must include ideaId and voteType (like/dislike)" },
        { status: 400 }
      );
    }

    const { ideaId, voteType } = validationResult.data;

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

    // Check if user already voted on this idea
    const existingVote = await db.query.votes.findFirst({
      where: and(
        eq(votes.ideaId, ideaId),
        eq(votes.userId, session.user.id)
      ),
    });

    if (existingVote) {
      // If same vote type, remove the vote (toggle off)
      if (existingVote.voteType === voteType) {
        await db.delete(votes).where(eq(votes.id, existingVote.id));
        
        // Update idea counts
        const newLikes = voteType === "like" ? (idea.likes || 0) - 1 : (idea.likes || 0);
        const newDislikes = voteType === "dislike" ? (idea.dislikes || 0) - 1 : (idea.dislikes || 0);
        
        await db.update(ideas).set({
          likes: Math.max(0, newLikes),
          dislikes: Math.max(0, newDislikes),
          updatedAt: new Date(),
        }).where(eq(ideas.id, ideaId));

        return NextResponse.json({
          success: true,
          message: "Vote removed",
          likes: Math.max(0, newLikes),
          dislikes: Math.max(0, newDislikes),
          userVote: null,
        });
      } else {
        // Change vote type
        await db.update(votes).set({
          voteType,
          createdAt: new Date(),
        }).where(eq(votes.id, existingVote.id));

        // Update idea counts (swap votes)
        const newLikes = voteType === "like" ? (idea.likes || 0) + 1 : (idea.likes || 0) - 1;
        const newDislikes = voteType === "dislike" ? (idea.dislikes || 0) + 1 : (idea.dislikes || 0) - 1;
        
        await db.update(ideas).set({
          likes: Math.max(0, newLikes),
          dislikes: Math.max(0, newDislikes),
          updatedAt: new Date(),
        }).where(eq(ideas.id, ideaId));

        return NextResponse.json({
          success: true,
          message: `Vote changed to ${voteType}`,
          likes: Math.max(0, newLikes),
          dislikes: Math.max(0, newDislikes),
          userVote: voteType,
        });
      }
    }

    // Create new vote
    const voteId = generateId();
    await db.insert(votes).values({
      id: voteId,
      ideaId,
      userId: session.user.id,
      voteType,
      createdAt: new Date(),
    });

    // Update idea counts
    const newLikes = voteType === "like" ? (idea.likes || 0) + 1 : (idea.likes || 0);
    const newDislikes = voteType === "dislike" ? (idea.dislikes || 0) + 1 : (idea.dislikes || 0);
    
    await db.update(ideas).set({
      likes: newLikes,
      dislikes: newDislikes,
      updatedAt: new Date(),
    }).where(eq(ideas.id, ideaId));

    return NextResponse.json({
      success: true,
      message: `${voteType === "like" ? "Liked" : "Disliked"} successfully`,
      likes: newLikes,
      dislikes: newDislikes,
      userVote: voteType,
    });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 }
    );
  }
}

// GET /api/vote?ideaId=xxx - Get user's vote for an idea
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get("ideaId");

    if (!ideaId) {
      return NextResponse.json(
        { error: "ideaId is required" },
        { status: 400 }
      );
    }

    if (!session || !session.user) {
      return NextResponse.json({ userVote: null });
    }

    const vote = await db.query.votes.findFirst({
      where: and(
        eq(votes.ideaId, ideaId),
        eq(votes.userId, session.user.id)
      ),
    });

    return NextResponse.json({
      userVote: vote?.voteType || null,
    });
  } catch (error) {
    console.error("Error getting vote:", error);
    return NextResponse.json(
      { error: "Failed to get vote" },
      { status: 500 }
    );
  }
}

