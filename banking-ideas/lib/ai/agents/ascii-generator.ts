import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { ASCIIElementsSchema, ASCIIElements, ContentAnalysis } from "@/lib/schemas";

export async function generateASCIIArt(analysis: ContentAnalysis): Promise<ASCIIElements> {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: ASCIIElementsSchema,
    prompt: `Generează elemente ASCII art pentru o pagină Teletext de banking.

CONTEXT:
- Categorie: ${analysis.category}
- Keywords: ${analysis.keywords.join(", ")}
- Ton: ${analysis.tone}

Generează folosind DOAR caracterele Teletext: █ ▌ ▐ ░ ▒ ▓ ─ │ ┌ ┐ └ ┘ ═ ║ ╔ ╗ ╚ ╝ ▶ ◀ ★ ☆ ●

1. Un logo simplu ASCII (max 5 linii, max 40 caractere pe linie)
2. Iconuri pentru: tech, money, security, user, chart (max 10 caractere fiecare)
3. Borduri: top, bottom, separator (exact 40 caractere)
4. 2-3 progress bars simple (20 caractere fiecare)

Exemple de stil:
Logo: 
  ╔═══════════════════╗
  ║   BANK//IDEAS    ║
  ╚═══════════════════╝

Icon tech: ▓▓▒░
Icon money: $$$
Border: ════════════════════════════════════════

Fii creativ dar păstrează stilul retro Teletext!`,
  });

  return object;
}
