"use client";

import { useFormContext } from "react-hook-form";
import { TeletextCheckbox } from "@/components/teletext";
import { IdeaFormData, AI_TECH_LABELS, BLOCKCHAIN_TECH_LABELS, OTHER_TECH_LABELS } from "@/lib/schemas";

export function Step2Technologies() {
  const { register } = useFormContext<IdeaFormData>();

  return (
    <div className="space-y-6">
      <div className="tt-yellow mb-4">
        ▌█▌ Selectează tehnologiile folosite în soluția ta
      </div>

      {/* AI Technologies */}
      <div>
        <div className="tt-cyan mb-3 font-bold">
          ▶ TEHNOLOGII AI
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(AI_TECH_LABELS).map(([value, label]) => (
            <TeletextCheckbox
              key={value}
              label={label}
              value={value}
              {...register("aiTechnologies")}
            />
          ))}
        </div>
      </div>

      {/* Blockchain Technologies */}
      <div>
        <div className="tt-cyan mb-3 font-bold">
          ▶ BLOCKCHAIN & DLT
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(BLOCKCHAIN_TECH_LABELS).map(([value, label]) => (
            <TeletextCheckbox
              key={value}
              label={label}
              value={value}
              {...register("blockchainTechnologies")}
            />
          ))}
        </div>
      </div>

      {/* Other Technologies */}
      <div>
        <div className="tt-cyan mb-3 font-bold">
          ▶ ALTE TEHNOLOGII
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(OTHER_TECH_LABELS).map(([value, label]) => (
            <TeletextCheckbox
              key={value}
              label={label}
              value={value}
              {...register("otherTechnologies")}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 tt-cyan text-sm">
        ─────────────────────────────────────────────────────────
        <div className="tt-green mt-2">
          💡 TIP: Poți selecta mai multe tehnologii. Lasă necompletate categoriile care nu se aplică.
        </div>
      </div>
    </div>
  );
}
