'use client';

import { FC } from 'react';

import { ArrowLeft } from 'lucide-react';

import { Button, Card } from 'shared/ui';

import { useOnboardingWizard } from '../hooks';
import { ProductIdentityStep } from './product-identity-step';
import { ProductStageStep } from './product-stage-step';
import { QuickStartStep } from './quick-start-step';
import { StepIndicator } from './step-indicator';
import { TargetUsersStep } from './target-users-step';

export const OnboardingWizard: FC = () => {
  const {
    form,
    step,
    totalSteps,
    nextStep,
    prevStep,
    skipStep,
    skipAll,
    complete,
    isSubmitting,
  } = useOnboardingWizard();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ProductIdentityStep form={form} />;

      case 2:
        return <TargetUsersStep form={form} />;

      case 3:
        return <ProductStageStep form={form} />;

      case 4:
        return <QuickStartStep form={form} />;

      default:
        return null;
    }
  };

  const isLastStep = step === totalSteps;

  return (
    <Card padding="lg" className="w-full">
      <div className="mb-8">
        <StepIndicator current={step} total={totalSteps} />
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          if (isLastStep) {
            complete();
          } else {
            nextStep();
          }
        }}
      >
        {renderStep()}

        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
          <div>
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isLastStep && (
              <Button
                type="button"
                variant="ghost"
                onClick={skipStep}
                disabled={isSubmitting}
              >
                Skip for now
              </Button>
            )}
            <Button type="submit" isLoading={isSubmitting}>
              {isLastStep ? 'Start building' : 'Continue'}
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={skipAll}
          disabled={isSubmitting}
          className="text-sm text-gray-500 underline hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Skip setup entirely
        </button>
      </div>
    </Card>
  );
};
