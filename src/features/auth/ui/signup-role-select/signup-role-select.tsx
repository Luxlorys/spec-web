'use client';

import { FC } from 'react';

import { ArrowRight, Building2, Users } from 'lucide-react';

import { cn } from 'shared/lib';
import { Card } from 'shared/ui';

type SignupFlow = 'admin' | 'member';

interface IProps {
  onSelect: (flow: SignupFlow) => void;
}

export const SignupRoleSelect: FC<IProps> = ({ onSelect }) => {
  return (
    <div className="space-y-4">
      <button onClick={() => onSelect('admin')} className="w-full text-left">
        <Card
          className={cn(
            'border-2 transition-all hover:border-primary hover:shadow-md',
            'group cursor-pointer',
          )}
          padding="lg"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Create a Project
                </h3>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Start a new project and invite your team members. You'll be the
                project admin with full access.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  Full Admin Access
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  Invite Team Members
                </span>
              </div>
            </div>
          </div>
        </Card>
      </button>

      <button onClick={() => onSelect('member')} className="w-full text-left">
        <Card
          className={cn(
            'border-2 transition-all hover:border-primary hover:shadow-md',
            'group cursor-pointer',
          )}
          padding="lg"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Join a Project
                </h3>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Join an existing project using an invite code from your team
                admin.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                  Developer
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                  Designer
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                  PM
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                  BA
                </span>
              </div>
            </div>
          </div>
        </Card>
      </button>
    </div>
  );
};
