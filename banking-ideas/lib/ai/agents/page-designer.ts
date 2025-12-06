import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { PageStructureSchema, PageStructure, ContentAnalysis, IdeaFormData } from "@/lib/schemas";

export async function designPages(
  idea: IdeaFormData,
  analysis: ContentAnalysis
): Promise<PageStructure> {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: PageStructureSchema,
    prompt: `Proiectează structura paginilor Teletext pentru o idee de banking.

ANALIZA CONȚINUTULUI:
- Categorie: ${analysis.category}
- Keywords: ${analysis.keywords.join(", ")}
- Complexitate: ${analysis.complexity}
- Ton: ${analysis.tone}
- Audiență: ${analysis.targetAudience}
- Valoare: ${analysis.mainValueProposition}

DETALII IDEE:
- Titlu: ${idea.title}
- Platformă: ${idea.platform}
- Segment: ${idea.targetSegment}
- Nivel implementare: ${idea.implementationLevel}%
- GitHub: ${idea.githubLink}

Creează o structură de 3-5 pagini Teletext cu:
- Pagină 1: Overview (prezentare generală)
- Pagină 2: Details (detalii tehnice)
- Pagină 3: Tech (tehnologii folosite)
- Pagină 4: Business (model business) - opțional
- Pagină 5: Contact (link-uri, întrebări) - opțional

Pentru fiecare pagină, specifică:
- Numărul paginii (început de la 100)
- Titlul (max 30 caractere)
- Tipul paginii
- Secțiunile necesare (header, text, list, stats, navigation)`,
  });

  return object;
}
