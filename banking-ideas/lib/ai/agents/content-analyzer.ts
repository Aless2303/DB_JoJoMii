import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { ContentAnalysisSchema, ContentAnalysis, IdeaFormData } from "@/lib/schemas";

export async function analyzeContent(idea: IdeaFormData): Promise<ContentAnalysis> {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: ContentAnalysisSchema,
    prompt: `Analizează următoarea idee pentru banking și extrage informațiile cheie:

TITLU: ${idea.title}
DESCRIERE: ${idea.shortDescription}
CATEGORIA: ${idea.category}
PROBLEMA REZOLVATĂ: ${idea.problemSolved}
TEHNOLOGII AI: ${idea.aiTechnologies?.join(", ") || "N/A"}
TEHNOLOGII BLOCKCHAIN: ${idea.blockchainTechnologies?.join(", ") || "N/A"}
ALTE TEHNOLOGII: ${idea.otherTechnologies?.join(", ") || "N/A"}
PLATFORMĂ: ${idea.platform}
SEGMENT ȚINTĂ: ${idea.targetSegment}
VALOARE UNICĂ: ${idea.uniqueValue}

Generează:
1. Categorie principală (una din: AI, Blockchain, Payments, Security, UX, ESG, API)
2. 5-10 keywords relevante în română
3. Complexitatea soluției (simple/medium/complex)
4. Tonul comunicării (formal/innovative/technical/accessible)
5. Audiența țintă (descriere scurtă)
6. Propunerea de valoare principală (max 100 caractere)`,
  });

  return object;
}
