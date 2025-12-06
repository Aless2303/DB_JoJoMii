import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { TechnologiesAnalysisSchema, TechnologiesAnalysis, ValidatedIdea } from "../schemas";

export async function analyzeTechnologies(data: ValidatedIdea): Promise<TechnologiesAnalysis> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: TechnologiesAnalysisSchema,
    prompt: `Tu ești un TECH LEAD și ARHITECT SOFTWARE cu 15 ani experiență în sisteme bancare critice.

Analizează stack-ul tehnologic al acestei idei și ADAUGĂ VALOARE prin expertiza ta.

=== INPUT DE LA DEVELOPER ===
Tehnologii menționate: ${data.coreTechnologies?.join(", ") || "nespecificat"}
Tip soluție: ${data.solutionType || "nespecificat"}
Detalii tech stack: ${data.techStackDetails || "nespecificat"}
Descriere proiect: ${data.bigIdea}
Nivel implementare: ${data.implementationLevel || "nespecificat"}

=== CE TREBUIE SĂ FACI ===

1. **primaryTech**: Lista de tehnologii CHEIE (5-8 items)
   - Include ce a menționat developerul
   - ADAUGĂ tehnologii complementare pe care ar trebui să le folosească
   - Exemplu: dacă zice "PostgreSQL", adaugă și "Redis for caching", "PgBouncer for connection pooling"

2. **techCategory**: Clasifică arhitectural
   - "Cloud-Native Microservices", "High-Performance Computing", "Real-Time Data Processing", etc.

3. **innovationLevel**: Evaluează ONEST nivelul de inovație
   - "Breakthrough" - tehnologie nouă, neexistentă pe piață
   - "Cutting-Edge" - folosește cele mai noi tehnologii disponibile
   - "Modern" - best practices actuale, dar nu revoluționar
   - "Traditional" - tehnologii dovedite, focus pe stabilitate
   - Justifică-ți alegerea în techSummary

4. **techSummary**: AICI ADAUGI VALOARE REALĂ! (100-200 cuvinte)
   - Explică DE CE acest stack e potrivit pentru banking
   - Menționează AVANTAJE tehnice specifice (latency, throughput, security)
   - Compară cu alternative și explică DE CE e mai bun
   - Adaugă RECOMANDĂRI tehnice bazate pe experiența ta
   - Menționează potențiale RISCURI tehnice și cum să le mitigeze
   - Exemplu: "The choice of C with libmicrohttpd is strategic - it eliminates JVM overhead and garbage collection pauses that plague Java services. For a banking API handling 100K+ req/s, this means consistent sub-ms latency vs Java's 10-50ms p99. Recommend adding: rate limiting via token bucket, circuit breakers for downstream services, and OpenTelemetry for observability."

5. **techBadges**: 4-6 badge-uri IMPRESIONANTE pentru UI
   - Nu doar numele tehnologiilor, ci și ce fac
   - "Sub-ms Latency", "10x Memory Efficient", "Bank-Grade Encryption", "Cloud-Native Ready"

IMPORTANT: Fii un CONSULTANT TEHNIC, nu un papagal. Adaugă expertiza ta!`,
  });

  return object;
}
