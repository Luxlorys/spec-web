'use client';

import { FC, useState } from 'react';

import { Plus, X } from 'lucide-react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { cn } from 'shared/lib';
import { Button, Input, Textarea } from 'shared/ui';

import { OnboardingFormData } from '../lib';

interface IProps {
  form: UseFormReturn<OnboardingFormData>;
}

export const QuickStartStep: FC<IProps> = ({ form }) => {
  const [showPersonas, setShowPersonas] = useState(false);
  const [showTechStack, setShowTechStack] = useState(false);

  // Local state for the persona being drafted
  const [draftPersonaName, setDraftPersonaName] = useState('');
  const [draftPersonaDescription, setDraftPersonaDescription] = useState('');

  const {
    register,
    formState: { errors },
    control,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'userPersonas',
  });

  const addPersona = () => {
    if (draftPersonaName.trim()) {
      append({
        name: draftPersonaName.trim(),
        description: draftPersonaDescription.trim(),
      });
      setDraftPersonaName('');
      setDraftPersonaDescription('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          You&apos;re all set!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Want to add more details? Better context = better AI suggestions.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setShowPersonas(!showPersonas);
                setShowTechStack(false);
              }}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Add user personas
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Define specific user types with descriptions
                </p>
              </div>
              <Plus
                className={cn(
                  'h-5 w-5 text-gray-400 transition-transform duration-300',
                  showPersonas && 'rotate-45',
                )}
              />
            </button>

            {/* Smooth expand/collapse container */}
            <div
              className={cn(
                'grid transition-all duration-300 ease-in-out',
                showPersonas
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                  {/* Persona chips */}
                  {fields.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800 animate-in fade-in-0 dark:bg-purple-900/30 dark:text-purple-300"
                        >
                          <span className="max-w-[150px] truncate">
                            {form.getValues(`userPersonas.${index}.name`) ||
                              'Untitled'}
                          </span>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            aria-label="Remove persona"
                            className="ml-1 rounded-full p-0.5 hover:bg-purple-200 dark:hover:bg-purple-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input form for new persona */}
                  <div className="space-y-3">
                    <Input
                      label="Persona name"
                      placeholder="e.g., Technical Founder"
                      value={draftPersonaName}
                      onChange={e => setDraftPersonaName(e.target.value)}
                    />
                    <Textarea
                      label="Description"
                      placeholder="Goals, pain points, and characteristics"
                      rows={2}
                      value={draftPersonaDescription}
                      onChange={e => setDraftPersonaDescription(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPersona}
                      disabled={!draftPersonaName.trim()}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add persona
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setShowTechStack(!showTechStack);
                setShowPersonas(false);
              }}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Specify tech stack
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  List your technologies for technical suggestions
                </p>
              </div>
              <Plus
                className={cn(
                  'h-5 w-5 text-gray-400 transition-transform duration-300',
                  showTechStack && 'rotate-45',
                )}
              />
            </button>

            {/* Smooth expand/collapse container */}
            <div
              className={cn(
                'grid transition-all duration-300 ease-in-out',
                showTechStack
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                  <Textarea
                    placeholder="e.g., Next.js, TypeScript, PostgreSQL, AWS"
                    rows={3}
                    error={errors.techStack?.message}
                    {...register('techStack')}
                  />
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
