"use client";

import { useFormContext } from "react-hook-form";
import { TeletextInput, TeletextTextarea, TeletextSelect } from "@/components/teletext";
import { IdeaFormData, CATEGORY_LABELS } from "@/lib/schemas";

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function Step1BasicInfo() {
  const { register, formState: { errors } } = useFormContext<IdeaFormData>();

  return (
    <div className="space-y-4">
      <div className="tt-yellow mb-4">
        ▌█▌ Descrie ideea ta inovatoare pentru banking
      </div>
      
      <TeletextInput
        label="Titlu idee"
        placeholder="Ex: AI Credit Scoring pentru IMM-uri"
        {...register("title")}
        error={errors.title?.message}
      />

      <TeletextTextarea
        label="Descriere scurtă (max 280 caractere)"
        placeholder="Descrie pe scurt ideea ta..."
        maxLength={280}
        {...register("shortDescription")}
        error={errors.shortDescription?.message}
      />

      <TeletextSelect
        label="Categoria principală"
        options={categoryOptions}
        {...register("category")}
        error={errors.category?.message}
      />

      <TeletextTextarea
        label="Problema pe care o rezolvă"
        placeholder="Descrie în detaliu problema identificată și modul în care ideea ta o rezolvă..."
        {...register("problemSolved")}
        error={errors.problemSolved?.message}
      />

      <div className="mt-4 tt-cyan text-sm">
        ─────────────────────────────────────────────────────────
        <div className="tt-green mt-2">
          💡 TIP: Un titlu clar și o descriere concisă vor ajuta comunitatea să înțeleagă rapid valoarea ideii tale.
        </div>
      </div>
    </div>
  );
}
