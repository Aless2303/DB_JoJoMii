import { NextRequest, NextResponse } from "next/server";
import { db, generateId } from "@/lib/db";
import { ideas, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { runAIPipeline, parseMarkdownInput } from "@/lib/ai/orchestrator";
import { RawIdeaInput } from "@/lib/ai/schemas";

// GET /api/ideas - Get all ideas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const result = await db
      .select({
        id: ideas.id,
        title: ideas.title,
        shortDescription: ideas.shortDescription,
        category: ideas.category,
        problemSolved: ideas.problemSolved,
        technologies: ideas.aiTechnologies,
        solutionType: ideas.platform,
        targetSegment: ideas.targetSegment,
        monetizationModel: ideas.monetizationModel,
        marketSize: ideas.targetMarkets,
        regulations: ideas.regulations,
        complianceNotes: ideas.complianceNotes,
        uniqueValue: ideas.uniqueValue,
        implementationLevel: ideas.implementationLevel,
        projectStage: ideas.estimatedTimeline,
        githubLink: ideas.githubLink,
        competitors: ideas.competitors,
        team: ideas.team,
        demoLink: ideas.aiResearchDetails,
        needFromDB: ideas.communityQuestions,
        additionalNotes: ideas.estimatedBudget,
        // AI Generated fields
        generatedHtml: ideas.generatedHtml,
        generatedPages: ideas.generatedPages,
        aiScore: ideas.aiScore,
        aiAnalysis: ideas.aiAnalysis,
        aiRecommendation: ideas.aiRecommendation,
        status: ideas.status,
        likes: ideas.likes,
        dislikes: ideas.dislikes,
        userId: ideas.userId,
        createdAt: ideas.createdAt,
        userName: users.name,
      })
      .from(ideas)
      .leftJoin(users, eq(ideas.userId, users.id))
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
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to submit ideas" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.shortDescription || !body.category || !body.problemSolved) {
      return NextResponse.json(
        { error: "Missing required fields: title, shortDescription, category, problemSolved" },
        { status: 400 }
      );
    }

    const id = generateId();

    // Prepare raw input for AI pipeline
    const rawInput: RawIdeaInput = {
      ideaTitle: body.title,
      bigIdea: body.shortDescription,
      mainCategory: body.category,
      problemSolved: body.problemSolved,
      coreTechnologies: body.technologies ? body.technologies.split(",").map((t: string) => t.trim()) : [],
      solutionType: body.solutionType || "",
      techStackDetails: body.techStackDetails || "",
      targetSegment: body.targetSegment || "",
      monetizationModel: body.monetizationModel || "",
      estimatedMarketSize: body.marketSize || "",
      applicableRegulations: body.regulations ? body.regulations.split(",").map((r: string) => r.trim()) : [],
      complianceNotes: body.complianceNotes || "",
      uniqueValue: body.uniqueValue || "",
      implementationLevel: body.implementationLevel ? [body.implementationLevel] : [],
      projectStage: body.projectStage || "",
      githubLink: body.githubLink || "",
      marketResearch: body.competitors || "",
      teamComposition: body.team || "",
      demoVideo: body.demoLink || undefined,
      needsFromDB: body.needFromDB || "",
      additionalNotes: body.additionalNotes || "",
    };

    // Run AI Pipeline
    console.log("🚀 Running AI Pipeline for idea:", body.title);
    let aiResult = null;
    let aiScore = null;
    let aiRecommendation = null;
    let generatedHtml = null;
    let generatedPages = null;
    let aiAnalysis = null;

    try {
      aiResult = await runAIPipeline(rawInput, { debug: true });
      
      if (aiResult.success && aiResult.statistics && aiResult.visualOutput) {
        aiScore = aiResult.statistics.overallScore;
        aiRecommendation = aiResult.statistics.recommendation;
        generatedHtml = aiResult.visualOutput.htmlOutput;
        generatedPages = JSON.stringify(aiResult.visualOutput.pages);
        aiAnalysis = JSON.stringify({
          statistics: aiResult.statistics,
          aggregatedAnalysis: aiResult.aggregatedAnalysis,
        });
        console.log("✅ AI Pipeline completed successfully! Score:", aiScore);
      } else {
        console.warn("⚠️ AI Pipeline completed but with issues:", aiResult.error);
      }
    } catch (aiError) {
      console.error("❌ AI Pipeline error (non-blocking):", aiError);
      // Continue without AI data - idea will still be saved
    }

    // Create idea record
    await db.insert(ideas).values({
      id,
      userId: session.user.id,
      title: body.title,
      shortDescription: body.shortDescription,
      category: body.category,
      problemSolved: body.problemSolved,
      aiTechnologies: body.technologies || "",
      platform: body.solutionType || "",
      targetSegment: body.targetSegment || "",
      monetizationModel: body.monetizationModel || "",
      targetMarkets: body.marketSize || "",
      regulations: body.regulations || "",
      complianceNotes: body.complianceNotes || "",
      uniqueValue: body.uniqueValue || "",
      implementationLevel: body.implementationLevel || "0",
      estimatedTimeline: body.projectStage || "",
      githubLink: body.githubLink || "",
      competitors: body.competitors || "",
      usedAIResearch: false,
      team: body.team || "",
      aiResearchDetails: body.demoLink || "",
      communityQuestions: body.needFromDB || "",
      estimatedBudget: body.additionalNotes || "",
      // AI Generated fields
      generatedHtml: generatedHtml,
      generatedPages: generatedPages,
      aiScore: aiScore,
      aiAnalysis: aiAnalysis,
      aiRecommendation: aiRecommendation,
      status: "new",
      likes: 0,
      dislikes: 0,
    });

    return NextResponse.json({
      id,
      message: "Idea submitted successfully!",
      aiProcessed: aiResult?.success || false,
      aiScore: aiScore,
      aiRecommendation: aiRecommendation,
    });
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}
