import type { OnboardingStep } from '@/features/supplier/types';
import { ONBOARDING_STEPS } from '@/features/supplier/constants';

interface SupplierStepperProps {
  currentStep: OnboardingStep;
}

export function SupplierStepper({ currentStep }: SupplierStepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-1 mb-3">
        {ONBOARDING_STEPS.map((item, index) => {
          const complete = item.step < currentStep;
          const active = item.step === currentStep;
          return (
            <div key={item.step} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center w-full">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    complete || active
                      ? 'bg-[#EAB308] text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {complete ? '✓' : item.step}
                </div>
                <p
                  className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider truncate max-w-full ${
                    active ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {item.title}
                </p>
              </div>
              {index < ONBOARDING_STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 mb-5 rounded-full ${
                    item.step < currentStep ? 'bg-[#EAB308]' : 'bg-slate-200'
                  }`}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs font-medium text-slate-500 tracking-wide">
        Step {currentStep} of 5
      </p>
    </div>
  );
}
