import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, generateId } from "@/lib/db";
import { comments, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const CommentSchema = z.object({
  ideaId: z.string(),
  content: z.string().min(3).max(500),
});

// GET /api/comments?ideaId=xxx - Get comments for an idea (anyone can view)
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

    // Get comments with user info
    const ideaComments = await db
      .select({
        id: comments.id,
        ideaId: comments.ideaId,
        userId: comments.userId,
        content: comments.content,
        createdAt: comments.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
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

// POST /api/comments - Add a comment (authenticated users only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only authenticated users can comment
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to comment" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const validationResult = CommentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid comment data. Content must be 3-500 characters." },
        { status: 400 }
      );
    }

    const { ideaId, content } = validationResult.data;

    const commentId = generateId();
    await db.insert(comments).values({
      id: commentId,
      ideaId,
      userId: session.user.id,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newComment = await db.query.comments.findFirst({
      where: eq(comments.id, commentId),
    });

    return NextResponse.json({
      ...newComment,
      userName: session.user.name,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

