import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { ValidatedIdeaSchema, ValidatedIdea, RawIdeaInput } from "../schemas";

export async function validateAndNormalizeInput(rawInput: RawIdeaInput): Promise<ValidatedIdea> {
  const { object } = await generateObject({
    model: anthropic("claude-3-haiku-20240307"),
    schema: ValidatedIdeaSchema,
    prompt: `Tu ești un DATA ANALYST care pregătește date pentru analiză AI.

Validează, normalizează și ÎMBOGĂȚEȘTE aceste date brute de la un developer.

=== DATE BRUTE PRIMITE ===
${JSON.stringify(rawInput, null, 2)}

=== CE TREBUIE SĂ FACI ===

1. **PĂSTREAZĂ** toate datele valoroase furnizate de developer

2. **COMPLETEAZĂ** câmpurile lipsă cu valori INTELIGENTE:
   - NU pune "N/A" sau "Not specified"
   - DEDUCE din context ce ar putea fi
   - Exemplu: dacă e un API framework, targetSegment probabil e "Internal - Bank Employees" sau "B2B - Other Financial Institutions"

3. **NORMALIZEAZĂ** valorile:
   - coreTechnologies: extrage din techStackDetails dacă nu sunt explicit menționate
   - applicableRegulations: adaugă regulamente standard pentru banking (GDPR, PSD2) dacă lipsesc
   - implementationLevel: deduce din projectStage ce componente sunt gata

4. **ÎMBUNĂTĂȚEȘTE** descrierile scurte:
   - Dacă bigIdea e prea scurt, expandează-l bazat pe context
   - Dacă problemSolved e vag, fă-l mai specific pentru banking

5. **VALIDEAZĂ** format:
   - coreTechnologies, applicableRegulations, implementationLevel = arrays
   - githubLink, demoVideo = strings or null
   - toate celelalte = strings (non-empty)

IMPORTANT: Scopul este să ai DATE COMPLETE și UTILE pentru agenții următori. Nu lăsa câmpuri goale!`,
  });

  return object;
}
