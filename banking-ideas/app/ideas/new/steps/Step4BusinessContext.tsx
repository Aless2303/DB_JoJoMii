"use client";

import { useFormContext } from "react-hook-form";
import { TeletextSelect, TeletextCheckbox } from "@/components/teletext";
import { IdeaFormData, SEGMENT_LABELS, MONETIZATION_LABELS, MARKET_LABELS } from "@/lib/schemas";

const segmentOptions = Object.entries(SEGMENT_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function Step4BusinessContext() {
  const { register, formState: { errors } } = useFormContext<IdeaFormData>();

  return (
    <div className="space-y-6">
      <div className="tt-yellow mb-4">
        ▌█▌ Definește contextul de business al soluției
      </div>

      {/* Target Segment */}
      <TeletextSelect
        label="Segment țintă"
        options={segmentOptions}
        {...register("targetSegment")}
        error={errors.targetSegment?.message}
      />

      {/* Monetization Model */}
      <div>
        <div className="tt-cyan mb-3 font-bold">
          ▶ MODEL DE MONETIZARE
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(MONETIZATION_LABELS).map(([value, label]) => (
            <TeletextCheckbox
              key={value}
              label={label}
              value={value}
              {...register("monetizationModel")}
            />
          ))}
        </div>
        {errors.monetizationModel && (
          <p className="tt-red text-sm mt-2">⚠ {errors.monetizationModel.message}</p>
        )}
      </div>

      {/* Target Markets */}
      <div>
        <div className="tt-cyan mb-3 font-bold">
          ▶ PIEȚE ȚINTĂ
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {Object.entries(MARKET_LABELS).map(([value, label]) => (
            <TeletextCheckbox
              key={value}
              label={label}
              value={value}
              {...register("targetMarkets")}
            />
          ))}
        </div>
        {errors.targetMarkets && (
          <p className="tt-red text-sm mt-2">⚠ {errors.targetMarkets.message}</p>
        )}
      </div>

      <div className="mt-4 tt-cyan text-sm">
        ─────────────────────────────────────────────────────────
        <div className="tt-green mt-2">
          💡 TIP: Selectează cel puțin un model de monetizare și o piață țintă. Acestea pot fi ajustate ulterior.
        </div>
      </div>
    </div>
  );
}
