import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { DifferentiatorsAnalysisSchema, DifferentiatorsAnalysis, ValidatedIdea } from "../schemas";

export async function analyzeDifferentiators(data: ValidatedIdea): Promise<DifferentiatorsAnalysis> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: DifferentiatorsAnalysisSchema,
    prompt: `Tu ești un PRODUCT STRATEGIST și COMPETITIVE ANALYST de la un fond de venture capital de top.

Analizează ce face această idee UNICĂ și DE CE va câștiga în piață.

=== INPUT DE LA DEVELOPER ===
Titlu: ${data.ideaTitle}
Descriere: ${data.bigIdea}
Valoare unică declarată: ${data.uniqueValue || "nespecificat"}
Nivel implementare: ${data.implementationLevel?.join(", ") || "nespecificat"}
Stadiu proiect: ${data.projectStage || "nespecificat"}
GitHub: ${data.githubLink || "N/A"}
Market research: ${data.marketResearch || "nespecificat"}
Tehnologii: ${data.coreTechnologies?.join(", ") || "N/A"}

=== CE TREBUIE SĂ FACI ===

1. **uniqueSellingPoint**: RESCRIE propunerea de valoare ca un PITCH de 30 secunde (80-120 cuvinte)
   - NU copia ce a zis developerul
   - Folosește formula: "Pentru [target], care [problemă], oferim [soluție] care [beneficiu diferențiator]"
   - Adaugă COMPARAȚII concrete cu alternativele
   - Include NUMERE și METRICI
   - Fă-l MEMORABIL și PERCUTANT
   - Exemplu: "For enterprise banks drowning in legacy Java infrastructure, our C-based engine isn't just faster—it's a paradigm shift. While Spring Boot services struggle at 50ms p99 latency, we deliver consistent sub-millisecond response times. That's not 2x better, it's 50x. In high-frequency trading and real-time fraud detection, this isn't optimization—it's the difference between catching fraud and explaining to customers why you didn't."

2. **competitiveAdvantage**: Identifică MOAT-ul - avantajul competitiv SUSTENABIL (80-100 cuvinte)
   - Ce îi oprește pe alții să copieze?
   - Menționează: tehnologie proprietară, first-mover advantage, network effects, switching costs
   - Fii ONEST despre vulnerabilități
   - Exemplu: "The competitive moat is technical depth—C-based banking systems require rare expertise (< 5% of fintech developers). First-mover advantage in this niche means 18-24 months head start. However, vulnerability exists if major players (IBM, Oracle) pivot resources here."

3. **readinessLevel**: Evaluează maturitatea ONEST
   - "Production-Ready" - poate fi deployat mâine
   - "Beta" - funcțional dar necesită polish
   - "Working Prototype" - demonstrabil dar incomplet
   - "Proof of Concept" - validează ideea dar mult de lucru
   - "Concept" - doar idee, fără cod

4. **implementationBadges**: 4-6 badge-uri care arată CE E GATA (nu ce nu e)
   - "REST API Complete", "PostgreSQL Integrated", "Docker Ready", "CI/CD Configured"
   - Fii SPECIFIC la ce funcționează

5. **githubAvailable**: true dacă există link GitHub valid

IMPORTANT: Fii un STORYTELLER care vinde, dar și un CRITIC care identifică lipsuri!`,
  });

  return object;
}
