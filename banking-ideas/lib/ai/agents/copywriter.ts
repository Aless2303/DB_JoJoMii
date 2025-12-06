import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { TeletextCopySchema, TeletextCopy, PageStructure, IdeaFormData, ContentAnalysis } from "@/lib/schemas";

export async function writeTeletextCopy(
  idea: IdeaFormData,
  analysis: ContentAnalysis,
  structure: PageStructure
): Promise<TeletextCopy> {
  const pagesDescription = structure.pages.map(p => 
    `Pagina ${p.pageNumber} (${p.type}): ${p.title} - Secțiuni: ${p.sections.map(s => s.type).join(", ")}`
  ).join("\n");

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: TeletextCopySchema,
    prompt: `Scrie conținutul text pentru paginile Teletext în stilul anilor '80-'90.

IDEE:
- Titlu: ${idea.title}
- Descriere: ${idea.shortDescription}
- Problema: ${idea.problemSolved}
- Valoare unică: ${idea.uniqueValue}
- GitHub: ${idea.githubLink}
- Implementare: ${idea.implementationLevel}%

ANALIZĂ:
- Valoare: ${analysis.mainValueProposition}
- Keywords: ${analysis.keywords.join(", ")}

STRUCTURA PAGINILOR:
${pagesDescription}

REGULI TELETEXT:
1. MAXIM 40 caractere per linie (obligatoriu!)
2. Folosește abrevieri: "pt." nu "pentru", "nr." nu "număr"
3. Text concis, direct, fără cuvinte inutile
4. Fiecare linie are o culoare (white/yellow/cyan/green/magenta/red/blue)
5. Stiluri: normal, double_height (pentru titluri), flash (pentru atenționări)

STRUCTURA FIECĂREI PAGINI:
- 2-3 linii header (yellow/cyan, double_height)
- 10-15 linii conținut (white/green)
- 2-3 linii navigare footer (cyan)

Scrie conținut pentru TOATE paginile din structură!`,
  });

  return object;
}
