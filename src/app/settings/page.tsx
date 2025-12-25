'use client';

import { useState } from 'react';

import {
  Bell,
  Building2,
  ChevronRight,
  CreditCard,
  Link as LinkIcon,
  LogOut,
  Palette,
  Settings,
  Shield,
  User,
  Users,
} from 'lucide-react';

import { cn } from 'shared/lib';
import { useAuthStore } from 'shared/store';
import { UserRole } from 'shared/types';
import { Avatar, Button, Card, Input } from 'shared/ui';

type SettingsSection =
  | 'profile'
  | 'project'
  | 'team'
  | 'notifications'
  | 'security'
  | 'appearance'
  | 'billing'
  | 'integrations';

interface NavItem {
  id: SettingsSection;
  label: string;
  icon: typeof User;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'project', label: 'Project', icon: Building2, adminOnly: true },
  { id: 'team', label: 'Team', icon: Users, adminOnly: true },
  { id: 'billing', label: 'Billing', icon: CreditCard, adminOnly: true },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
];

const isAdminRole = (role: UserRole): boolean => {
  return role === 'founder' || role === 'admin';
};

const SettingsNav = ({
  activeSection,
  onSectionChange,
  userRole,
}: {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  userRole: UserRole;
}) => {
  const filteredItems = navItems.filter(
    item => !item.adminOnly || isAdminRole(userRole),
  );

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

const ProfileSettings = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Profile Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>

      <Card className="border" padding="lg">
        <div className="flex items-start gap-6">
          <Avatar alt={user?.name || 'User'} size="xl" />
          <div className="flex-1 space-y-4">
            <div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </Card>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              defaultValue={user?.name}
              placeholder="Your name"
            />
            <Input
              label="Email"
              type="email"
              defaultValue={user?.email}
              placeholder="your@email.com"
              disabled
              helperText="Contact support to change your email"
            />
          </div>
          <Input
            label="Role"
            defaultValue={user?.role}
            disabled
            helperText="Your role in the organization"
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

const ProjectSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Project Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your project configuration and details
        </p>
      </div>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <Input
            label="Project Name"
            defaultValue="TechStart Inc."
            placeholder="Your project name"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={3}
              placeholder="Describe your project..."
              defaultValue="Building the next generation of productivity tools"
            />
          </div>
          <Input
            label="Website"
            type="url"
            placeholder="https://yourproject.com"
          />
        </div>
      </Card>

      <Card className="border border-red-200 dark:border-red-900" padding="lg">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-red-600 dark:text-red-400">
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground">
              Irreversible actions for your project
            </p>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-red-200 p-4 dark:border-red-900">
            <div>
              <p className="font-medium">Delete Project</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete this project and all its data
              </p>
            </div>
            <Button variant="danger" size="sm">
              Delete Project
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

const TeamSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">Team Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage team members and invite codes
          </p>
        </div>
        <Button size="sm">Generate Invite Code</Button>
      </div>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Active Invite Codes</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  TECHSTART2024
                </code>
                <p className="mt-1 text-xs text-muted-foreground">
                  2/10 uses • Expires Dec 31, 2025
                </p>
              </div>
              <Button variant="ghost" size="sm">
                Revoke
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                  DEMO123
                </code>
                <p className="mt-1 text-xs text-muted-foreground">
                  5/20 uses • Expires Dec 31, 2025
                </p>
              </div>
              <Button variant="ghost" size="sm">
                Revoke
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Team Members (4)</h3>
          <div className="space-y-3">
            {[
              { name: 'John Doe', email: 'john@example.com', role: 'Founder' },
              {
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'Developer',
              },
              {
                name: 'Bob Wilson',
                email: 'bob@example.com',
                role: 'Designer',
              },
              { name: 'Alice Brown', email: 'alice@example.com', role: 'PM' },
            ].map(member => (
              <div
                key={member.email}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar alt={member.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {member.role}
                  </span>
                  {member.role !== 'Founder' && (
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Notification Settings</h2>
        <p className="text-sm text-muted-foreground">
          Choose what notifications you want to receive
        </p>
      </div>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Email Notifications</h3>
          {[
            {
              label: 'New feature requests',
              description: 'When a new feature is created',
              defaultChecked: true,
            },
            {
              label: 'Spec generated',
              description: 'When AI generates a spec for your feature',
              defaultChecked: true,
            },
            {
              label: 'Questions & answers',
              description: 'When someone asks or answers a question',
              defaultChecked: false,
            },
            {
              label: 'Status changes',
              description: 'When a feature status is updated',
              defaultChecked: true,
            },
          ].map(item => (
            <div key={item.label} className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">In-App Notifications</h3>
          {[
            {
              label: 'Desktop notifications',
              description: 'Show browser notifications',
              defaultChecked: false,
            },
            {
              label: 'Sound alerts',
              description: 'Play sound for new notifications',
              defaultChecked: false,
            },
          ].map(item => (
            <div key={item.label} className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const { clearAuth } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Security Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account security and sessions
        </p>
      </div>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Change Password</h3>
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
          />
          <Button>Update Password</Button>
        </div>
      </Card>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Active Sessions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Current Session</p>
                <p className="text-xs text-muted-foreground">
                  Chrome on macOS • Last active now
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Active
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border border-red-200 dark:border-red-900" padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-red-600 dark:text-red-400">
              Sign Out
            </h3>
            <p className="text-sm text-muted-foreground">
              Sign out from your account on this device
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={clearAuth}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

const AppearanceSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="text-sm text-muted-foreground">
          Customize the look and feel of the application
        </p>
      </div>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light' },
              { id: 'dark', label: 'Dark' },
              { id: 'system', label: 'System' },
            ].map(theme => (
              <button
                type="button"
                key={theme.id}
                className={cn(
                  'rounded-lg border-2 p-4 text-center transition-colors',
                  theme.id === 'system'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50',
                )}
              >
                <div className="text-sm font-medium">{theme.label}</div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Density</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'compact', label: 'Compact' },
              { id: 'default', label: 'Default' },
              { id: 'comfortable', label: 'Comfortable' },
            ].map(density => (
              <button
                type="button"
                key={density.id}
                className={cn(
                  'rounded-lg border-2 p-4 text-center transition-colors',
                  density.id === 'default'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50',
                )}
              >
                <div className="text-sm font-medium">{density.label}</div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
};

const BillingSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Billing & Plans</h2>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <Card className="border border-primary" padding="lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Pro Plan</h3>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Current
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              $29/month • Renews on Jan 15, 2025
            </p>
          </div>
          <Button variant="outline" size="sm">
            Change Plan
          </Button>
        </div>
      </Card>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Payment Method</h3>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-14 items-center justify-center rounded bg-muted">
                <span className="text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Update
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Billing History</h3>
          <div className="space-y-2">
            {[
              { date: 'Dec 15, 2024', amount: '$29.00', status: 'Paid' },
              { date: 'Nov 15, 2024', amount: '$29.00', status: 'Paid' },
              { date: 'Oct 15, 2024', amount: '$29.00', status: 'Paid' },
            ].map(invoice => (
              <div
                key={invoice.date}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{invoice.date}</p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.amount}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {invoice.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

const IntegrationsSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Integrations</h2>
        <p className="text-sm text-muted-foreground">
          Connect external tools and services
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            name: 'Slack',
            description: 'Get notifications in Slack channels',
            connected: true,
          },
          {
            name: 'GitHub',
            description: 'Link specs to GitHub issues',
            connected: false,
          },
          {
            name: 'Jira',
            description: 'Sync with Jira tickets',
            connected: false,
          },
          {
            name: 'Linear',
            description: 'Connect to Linear projects',
            connected: false,
          },
        ].map(integration => (
          <Card key={integration.name} className="border" padding="md">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{integration.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
              </div>
              <Button
                variant={integration.connected ? 'outline' : 'primary'}
                size="sm"
              >
                {integration.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SettingsContent = () => {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] =
    useState<SettingsSection>('profile');
  const userRole = user?.role || 'developer';

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;

      case 'project':
        return <ProjectSettings />;

      case 'team':
        return <TeamSettings />;

      case 'notifications':
        return <NotificationSettings />;

      case 'security':
        return <SecuritySettings />;

      case 'appearance':
        return <AppearanceSettings />;

      case 'billing':
        return <BillingSettings />;

      case 'integrations':
        return <IntegrationsSettings />;

      default:
        return <ProfileSettings />;
    }
  };

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

      <div className="flex gap-8">
        <aside className="w-56 shrink-0">
          <SettingsNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            userRole={userRole}
          />
        </aside>

        <div className="max-w-3xl flex-1">{renderSection()}</div>
      </div>
    </main>
  );
};

export default function SettingsPage() {
  return <SettingsContent />;
}
