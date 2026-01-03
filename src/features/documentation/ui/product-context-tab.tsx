'use client';

import { useState } from 'react';

import { Building2, ChevronDown, Target, Users } from 'lucide-react';

import { IDocumentationUserPersona } from 'shared/api';
import { Card } from 'shared/ui';

interface IPersonaCardProps {
  persona: IDocumentationUserPersona;
}

const PersonaCard = ({ persona }: IPersonaCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex gap-3">
          <div className="flex items-center justify-center self-start rounded-full bg-primary/10 p-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              {persona.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {persona.description}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-4 space-y-4 border-t pt-4">
            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Goals
              </h5>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {persona.goals.map(goal => (
                  <li key={goal}>{goal}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Pain Points
              </h5>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {persona.painPoints.map(pain => (
                  <li key={pain}>{pain}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface IProps {
  productContext: {
    vision: string;
    targetMarket: string;
    userPersonas: IDocumentationUserPersona[];
  };
}

export const ProductContextTab = ({ productContext }: IProps) => (
  <div className="space-y-6">
    <Card className="p-6">
      <div className="mb-3 flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Vision
        </h3>
      </div>
      <p className="text-gray-700 dark:text-gray-300">
        {productContext.vision}
      </p>
    </Card>

    <Card className="p-6">
      <div className="mb-3 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Target Market
        </h3>
      </div>
      <p className="text-gray-700 dark:text-gray-300">
        {productContext.targetMarket}
      </p>
    </Card>

    {productContext.userPersonas.length > 0 && (
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            User Personas
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {productContext.userPersonas.map(persona => (
            <PersonaCard key={persona.name} persona={persona} />
          ))}
        </div>
      </div>
    )}
  </div>
);
