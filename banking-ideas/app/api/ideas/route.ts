import { NextRequest, NextResponse } from "next/server";
import { db, generateId, getNextPageNumber } from "@/lib/db";
import { ideas } from "@/lib/db/schema";
import { IdeaFormSchema } from "@/lib/schemas";
import { runAIPipeline } from "@/lib/ai/orchestrator";
import { eq, desc } from "drizzle-orm";

// GET /api/ideas - Get all ideas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const category = searchParams.get("category");

    let query = db.select().from(ideas);
    
    if (category) {
      query = query.where(eq(ideas.category, category)) as typeof query;
    }

    const result = await query
      .orderBy(desc(ideas.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      ideas: result,
      pagination: { limit, offset },
    });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}

// POST /api/ideas - Create a new idea
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = IdeaFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const id = generateId();
    const pageNumber = await getNextPageNumber();

    // Create initial idea record
    await db.insert(ideas).values({
      id,
      title: data.title,
      shortDescription: data.shortDescription,
      category: data.category,
      problemSolved: data.problemSolved,
      aiTechnologies: JSON.stringify(data.aiTechnologies || []),
      blockchainTechnologies: JSON.stringify(data.blockchainTechnologies || []),
      otherTechnologies: JSON.stringify(data.otherTechnologies || []),
      platform: data.platform,
      targetSegment: data.targetSegment,
      monetizationModel: JSON.stringify(data.monetizationModel),
      targetMarkets: JSON.stringify(data.targetMarkets),
      regulations: JSON.stringify(data.regulations || []),
      complianceNotes: data.complianceNotes,
      uniqueValue: data.uniqueValue,
      implementationLevel: data.implementationLevel,
      githubLink: data.githubLink,
      competitors: data.competitors,
      usedAIResearch: data.usedAIResearch,
      aiResearchDetails: data.aiResearchDetails,
      team: data.team,
      estimatedTimeline: data.estimatedTimeline,
      estimatedBudget: data.estimatedBudget,
      communityQuestions: data.communityQuestions,
      pageNumber,
      status: "processing",
    });

    // Run AI pipeline in background
    runAIPipeline(data)
      .then(async (result) => {
        // Update idea with generated pages
        await db
          .update(ideas)
          .set({
            generatedPages: JSON.stringify(result.pages),
            status: "published",
            updatedAt: new Date(),
          })
          .where(eq(ideas.id, id));
        console.log(`✅ AI pipeline completed for idea ${id}`);
      })
      .catch(async (error) => {
        console.error(`❌ AI pipeline failed for idea ${id}:`, error);
        await db
          .update(ideas)
          .set({
            status: "draft",
            updatedAt: new Date(),
          })
          .where(eq(ideas.id, id));
      });

    return NextResponse.json({
      id,
      pageNumber,
      status: "processing",
      message: "Ideea a fost creată. Paginile Teletext se generează...",
    });
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}
