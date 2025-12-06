"use client";

import { useFormContext, Controller } from "react-hook-form";
import { TeletextTextarea, TeletextInput, TeletextCheckbox, TeletextSlider } from "@/components/teletext";
import { IdeaFormData, IMPLEMENTATION_LABELS } from "@/lib/schemas";

export function Step6Differentiators() {
  const { register, control, watch, formState: { errors } } = useFormContext<IdeaFormData>();
  const usedAIResearch = watch("usedAIResearch");

  return (
    <div className="space-y-6">
      <div className="tt-yellow mb-4">
        ▌█▌ Ce face ideea ta unică?
      </div>

      {/* Unique Value */}
      <TeletextTextarea
        label="Ce face ideea unică"
        placeholder="Descrie elementele diferențiatoare și avantajele competitive ale soluției tale..."
        {...register("uniqueValue")}
        error={errors.uniqueValue?.message}
      />

      {/* Implementation Level */}
      <Controller
        name="implementationLevel"
        control={control}
        render={({ field }) => (
          <TeletextSlider
            label="Nivel actual de implementare"
            value={field.value}
            onChange={field.onChange}
            min={0}
            max={100}
            step={25}
            labels={IMPLEMENTATION_LABELS}
          />
        )}
      />

      {/* GitHub Link */}
      <div>
        <TeletextInput
          label="Link GitHub"
          placeholder="https://github.com/username/repo"
          {...register("githubLink")}
          error={errors.githubLink?.message}
        />
        <div className="mt-2 tt-red text-sm border border-teletext-red p-2">
          ⚠️ ATENȚIE: Este obligatoriu să existe cod pe GitHub!
          <div className="tt-yellow mt-1">
            Acceptăm: prototipuri, POC-uri, MVP-uri, mockups funcționale.
          </div>
        </div>
      </div>

      {/* Competitors */}
      <TeletextTextarea
        label="Soluții similare pe piață (opțional)"
        placeholder="Listează competitorii existenți și diferențele față de aceștia..."
        {...register("competitors")}
      />

      {/* AI Research */}
      <div className="space-y-2">
        <TeletextCheckbox
          label="Am folosit AI (ChatGPT, Claude, etc.) pentru research"
          {...register("usedAIResearch")}
        />
        
        {usedAIResearch && (
          <TeletextTextarea
            label="Ce tool AI ai folosit și ce întrebări ai adresat?"
            placeholder="Ex: Am folosit ChatGPT pentru a analiza piața și a identifica competitori..."
            {...register("aiResearchDetails")}
          />
        )}
      </div>

      <div className="mt-4 tt-cyan text-sm">
        ─────────────────────────────────────────────────────────
        <div className="tt-green mt-2">
          💡 TIP: Un link GitHub valid este obligatoriu. Transparența privind folosirea AI pentru research este apreciată.
        </div>
      </div>
    </div>
  );
}
