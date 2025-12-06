"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { TeletextScreen, TeletextHeader, TeletextButton } from "@/components/teletext";
import { IdeaFormSchema, IdeaFormData } from "@/lib/schemas";

// Import form steps
import { Step1BasicInfo } from "./steps/Step1BasicInfo";
import { Step2Technologies } from "./steps/Step2Technologies";
import { Step3SolutionType } from "./steps/Step3SolutionType";
import { Step4BusinessContext } from "./steps/Step4BusinessContext";
import { Step5Regulations } from "./steps/Step5Regulations";
import { Step6Differentiators } from "./steps/Step6Differentiators";
import { Step7Additional } from "./steps/Step7Additional";

const STEPS = [
  { number: 1, title: "INFORMAȚII DE BAZĂ", component: Step1BasicInfo },
  { number: 2, title: "TEHNOLOGII", component: Step2Technologies },
  { number: 3, title: "TIP SOLUȚIE", component: Step3SolutionType },
  { number: 4, title: "CONTEXT BUSINESS", component: Step4BusinessContext },
  { number: 5, title: "REGLEMENTĂRI", component: Step5Regulations },
  { number: 6, title: "DIFERENȚIATORI", component: Step6Differentiators },
  { number: 7, title: "DETALII ADIȚIONALE", component: Step7Additional },
];

export default function NewIdeaPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const methods = useForm<IdeaFormData>({
    resolver: zodResolver(IdeaFormSchema),
    mode: "onChange",
    defaultValues: {
      aiTechnologies: [],
      blockchainTechnologies: [],
      otherTechnologies: [],
      monetizationModel: [],
      targetMarkets: [],
      regulations: [],
      implementationLevel: 0,
      usedAIResearch: false,
    },
  });

  const CurrentStepComponent = STEPS[currentStep].component;

  const handleNext = async () => {
    // Validate current step fields before moving
    const isValid = await methods.trigger();
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: IdeaFormData) => {
    setIsSubmitting(true);
    try {
      // Submit to API
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setIsGenerated(true);
        // Redirect to generated page
        window.location.href = `/ideas/${result.id}`;
      }
    } catch (error) {
      console.error("Error submitting idea:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TeletextScreen>
      <TeletextHeader
        title="ÎNREGISTRARE IDEE"
        pageNumber={200 + currentStep}
        subtitle={`PASUL ${currentStep + 1}/${STEPS.length}: ${STEPS[currentStep].title}`}
      />

      {/* Progress indicator */}
      <div className="mt-4 mb-6">
        <div className="flex justify-between mb-2">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              className={`flex-1 text-center text-xs ${
                index === currentStep
                  ? "tt-yellow teletext-glow"
                  : index < currentStep
                  ? "tt-green"
                  : "tt-cyan"
              }`}
            >
              {index < currentStep ? "█" : index === currentStep ? "▓" : "░"}
            </div>
          ))}
        </div>
        <div className="tt-cyan text-center text-sm">
          {"█".repeat(currentStep + 1)}{"░".repeat(STEPS.length - currentStep - 1)}
          {" "}{Math.round(((currentStep + 1) / STEPS.length) * 100)}%
        </div>
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="teletext-box p-4">
                  <CurrentStepComponent />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="mt-6 tt-cyan text-center">
            ═══════════════════════════════════════════════════════════════
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <TeletextButton
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={currentStep === 0 ? "opacity-50" : ""}
            >
              ◀ ÎNAPOI
            </TeletextButton>

            <div className="tt-yellow">
              {currentStep + 1} / {STEPS.length}
            </div>

            {currentStep < STEPS.length - 1 ? (
              <TeletextButton
                type="button"
                onClick={handleNext}
                variant="primary"
              >
                CONTINUĂ ▶
              </TeletextButton>
            ) : (
              <TeletextButton
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
              >
                ★ TRIMITE IDEEA
              </TeletextButton>
            )}
          </div>

          {/* Keyboard navigation hint */}
          <div className="mt-6 tt-green text-center text-sm">
            <div>▌ [←] Pasul anterior │ [→] Pasul următor │ [Enter] Continuă ▌</div>
          </div>
        </form>
      </FormProvider>
    </TeletextScreen>
  );
}
