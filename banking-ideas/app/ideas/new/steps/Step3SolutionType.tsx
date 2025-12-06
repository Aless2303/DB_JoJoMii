"use client";

import { useFormContext } from "react-hook-form";
import { TeletextRadio } from "@/components/teletext";
import { IdeaFormData, PLATFORM_LABELS } from "@/lib/schemas";

export function Step3SolutionType() {
  const { register, formState: { errors } } = useFormContext<IdeaFormData>();

  return (
    <div className="space-y-4">
      <div className="tt-yellow mb-4">
        ▌█▌ Ce tip de soluție propui?
      </div>

      <div className="tt-cyan mb-3 font-bold">
        ▶ PLATFORMĂ
      </div>

      <div className="space-y-3">
        {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
          <TeletextRadio
            key={value}
            label={label}
            value={value}
            {...register("platform")}
          />
        ))}
      </div>

      {errors.platform && (
        <p className="tt-red text-sm mt-2">⚠ {errors.platform.message}</p>
      )}

      <div className="mt-6 tt-cyan text-sm">
        ─────────────────────────────────────────────────────────
        <div className="tt-green mt-2">
          💡 TIP: Alege platforma principală pe care se va baza soluția ta. Poți adăuga detalii suplimentare mai târziu.
        </div>
      </div>

      {/* Visual representation */}
      <div className="mt-4 tt-cyan">
        <pre className="text-xs">
{`
  ┌─────────────────────────────────────────┐
  │    ╔═══════════════════════════════╗    │
  │    ║     TIP SOLUȚIE SELECTAT     ║    │
  │    ╚═══════════════════════════════╝    │
  │                                         │
  │    [WEB]  [MOBILE]  [API]  [BOT]       │
  │                                         │
  └─────────────────────────────────────────┘
`}
        </pre>
      </div>
    </div>
  );
}
