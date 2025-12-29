'use client';

import { useState } from 'react';

import { Settings } from 'lucide-react';

import {
  BillingSettings,
  ProfileSettings,
  ProjectSettings,
  SecuritySettings,
  SettingsNav,
  SettingsSection,
  TeamSettings,
} from 'features/settings';
import { useAuthStore } from 'shared/store';
import { TabsContent, TabsRoot } from 'shared/ui';

const sectionComponents: Record<SettingsSection, React.ReactNode> = {
  profile: <ProfileSettings />,
  project: <ProjectSettings />,
  team: <TeamSettings />,
  security: <SecuritySettings />,
  billing: <BillingSettings />,
};

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] =
    useState<SettingsSection>('profile');
  const userRole = user?.role ?? 'DEVELOPER';

  return (
    <main className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>

      <TabsRoot
        value={activeSection}
        onValueChange={value => setActiveSection(value as SettingsSection)}
        className="flex gap-8"
        orientation="vertical"
      >
        <aside className="w-56 shrink-0">
          <SettingsNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            userRole={userRole}
          />
        </aside>

        <div className="max-w-3xl flex-1">
          {Object.entries(sectionComponents).map(([key, component]) => (
            <TabsContent key={key} value={key} className="mt-0">
              {component}
            </TabsContent>
          ))}
        </div>
      </TabsRoot>
    </main>
  );
}
