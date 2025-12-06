import { NextRequest, NextResponse } from "next/server";
import { db, generateId } from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const CommentSchema = z.object({
  ideaId: z.string(),
  username: z.string().min(2).max(30),
  content: z.string().min(3).max(500),
});

// GET /api/comments?ideaId=xxx - Get comments for an idea
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ideaId = searchParams.get("ideaId");

    if (!ideaId) {
      return NextResponse.json(
        { error: "ideaId is required" },
        { status: 400 }
      );
    }

    const ideaComments = await db
      .select()
      .from(comments)
      .where(eq(comments.ideaId, ideaId))
      .orderBy(comments.createdAt);

    return NextResponse.json(ideaComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/comments - Add a comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = CommentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid comment data" },
        { status: 400 }
      );
    }

    const { ideaId, username, content } = validationResult.data;

    const commentId = generateId();
    await db.insert(comments).values({
      id: commentId,
      ideaId,
      username,
      content,
    });

    const newComment = await db.query.comments.findFirst({
      where: eq(comments.id, commentId),
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
