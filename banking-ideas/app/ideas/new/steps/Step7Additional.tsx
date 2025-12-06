"use client";

import { useFormContext } from "react-hook-form";
import { TeletextTextarea, TeletextInput, TeletextSelect } from "@/components/teletext";
import { IdeaFormData, BUDGET_LABELS } from "@/lib/schemas";

const budgetOptions = Object.entries(BUDGET_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function Step7Additional() {
  const { register } = useFormContext<IdeaFormData>();

  return (
    <div className="space-y-6">
      <div className="tt-yellow mb-4">
        ▌█▌ Detalii adiționale (opționale)
      </div>

      {/* Team */}
      <TeletextTextarea
        label="Echipa (opțional)"
        placeholder="Descrie membrii echipei și rolurile lor..."
        {...register("team")}
      />

      {/* Timeline */}
      <TeletextInput
        label="Timeline estimat pentru MVP (opțional)"
        placeholder="Ex: 3 luni"
        {...register("estimatedTimeline")}
      />

      {/* Budget */}
      <TeletextSelect
        label="Buget estimat (opțional)"
        options={budgetOptions}
        {...register("estimatedBudget")}
      />

      {/* Community Questions */}
      <TeletextTextarea
        label="Întrebări pentru comunitate (opțional)"
        placeholder="Ai întrebări pentru comunitate? Ce feedback ai dori să primești?"
        {...register("communityQuestions")}
      />

      <div className="mt-4 tt-cyan text-sm">
        ─────────────────────────────────────────────────────────
      </div>

      {/* Summary Preview */}
      <div className="mt-4 border-2 border-teletext-green p-3">
        <div className="tt-green font-bold mb-2">✓ APROAPE GATA!</div>
        <div className="tt-white text-sm">
          După ce trimiți ideea, sistemul nostru AI va genera automat:
          <ul className="mt-2 space-y-1 tt-cyan">
            <li>▶ Pagină Teletext personalizată</li>
            <li>▶ Rezumat și keywords</li>
            <li>▶ ASCII art tematic</li>
            <li>▶ Navigare între secțiuni</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 tt-yellow text-center teletext-glow">
        ═══════════════════════════════════════════════════════
        <div className="mt-2">
          ★ Apasă TRIMITE IDEEA pentru a finaliza ★
        </div>
        ═══════════════════════════════════════════════════════
      </div>
    </div>
  );
}
