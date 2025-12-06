"use client";

import { useFormContext } from "react-hook-form";
import { TeletextCheckbox, TeletextTextarea } from "@/components/teletext";
import { IdeaFormData, REGULATION_LABELS } from "@/lib/schemas";

export function Step5Regulations() {
  const { register } = useFormContext<IdeaFormData>();

  return (
    <div className="space-y-6">
      <div className="tt-yellow mb-4">
        ▌█▌ Reglementări și conformitate
      </div>

      {/* Regulations */}
      <div>
        <div className="tt-cyan mb-3 font-bold">
          ▶ REGLEMENTĂRI RELEVANTE
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(REGULATION_LABELS).map(([value, label]) => (
            <TeletextCheckbox
              key={value}
              label={label}
              value={value}
              {...register("regulations")}
            />
          ))}
        </div>
      </div>

      {/* Compliance Notes */}
      <TeletextTextarea
        label="Note privind conformitatea (opțional)"
        placeholder="Adaugă detalii despre cum soluția respectă reglementările selectate..."
        {...register("complianceNotes")}
      />

      <div className="mt-4 tt-cyan text-sm">
        ─────────────────────────────────────────────────────────
        <div className="tt-green mt-2">
          💡 TIP: Conformitatea cu reglementările este esențială în banking. Selectează toate reglementările care se aplică soluției tale.
        </div>
      </div>

      {/* Info box */}
      <div className="mt-4 border-2 border-teletext-yellow p-3">
        <div className="tt-yellow font-bold mb-2">⚠ IMPORTANT</div>
        <div className="tt-white text-sm">
          Băncile și instituțiile financiare trebuie să respecte reglementări stricte. 
          Asigură-te că soluția ta este conformă cu:
          <ul className="mt-2 space-y-1">
            <li>• PSD2/PSD3 pentru servicii de plată</li>
            <li>• GDPR pentru protecția datelor</li>
            <li>• AML/KYC pentru prevenirea spălării banilor</li>
            <li>• DORA pentru reziliență operațională digitală</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
