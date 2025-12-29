'use client';

import {
  Building2,
  ChevronRight,
  CreditCard,
  Shield,
  User,
  Users,
} from 'lucide-react';

import { cn } from 'shared/lib';

export type SettingsSection =
  | 'profile'
  | 'project'
  | 'team'
  | 'security'
  | 'billing';

interface NavItem {
  id: SettingsSection;
  label: string;
  icon: typeof User;
  founderOnly?: boolean;
}

const navItems: NavItem[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'project', label: 'Project', icon: Building2, founderOnly: true },
  { id: 'team', label: 'Team', icon: Users, founderOnly: true },
  { id: 'billing', label: 'Billing', icon: CreditCard, founderOnly: true },
  { id: 'security', label: 'Security', icon: Shield },
];

interface SettingsNavProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  isFounder: boolean;
}

export const SettingsNav = ({
  activeSection,
  onSectionChange,
  isFounder,
}: SettingsNavProps) => {
  const filteredItems = navItems.filter(item => !item.founderOnly || isFounder);

  return (
    <nav className="space-y-1">
      {filteredItems.map(item => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            type="button"
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
            {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
          </button>
        );
      })}
    </nav>
  );
};
