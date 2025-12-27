'use client';

import { useState } from 'react';

import Link from 'next/link';

import { formatDate } from 'shared/lib';
import { mockUsers } from 'shared/lib/mock-data';
import { useAuthStore } from 'shared/store';
import { getFullName, UserRole } from 'shared/types';
import { Avatar, Badge, Button, Card, EmptyState, Input } from 'shared/ui';

const TeamContent = () => {
  const { user: currentUser, getCurrentOrganization } = useAuthStore();
  const currentOrg = getCurrentOrganization();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('DEVELOPER');

  // Mock team members - filter by current user's organization
  const teamMembers = mockUsers.filter(
    u => u.organization?.id === currentOrg?.id,
  );

  const handleInvite = () => {
    // Mock invite - would call API in real app
    // eslint-disable-next-line no-console
    console.log(`Invitation sent to ${inviteEmail} as ${inviteRole}`);
    setInviteEmail('');
    setShowInviteForm(false);
  };

  return (
    <main className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Team Members
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your organization&apos;s team members and permissions
          </p>
        </div>
        <Button onClick={() => setShowInviteForm(!showInviteForm)}>
          {showInviteForm ? 'Cancel' : 'Invite Member'}
        </Button>
      </div>

      {showInviteForm && (
        <Card className="mb-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Invite New Team Member
          </h3>
          <div className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              placeholder="colleague@example.com"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value as UserRole)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="DEVELOPER">Developer</option>
                <option value="DESIGNER">Designer</option>
                <option value="PM">Project Manager</option>
                <option value="BA">Business Analyst</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleInvite} disabled={!inviteEmail}>
                Send Invitation
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowInviteForm(false)}
              >
                Cancel
              </Button>
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-200">
              <strong>Note:</strong> Invitations expire after 7 days. The
              invitee will receive an email with a link to join your
              organization.
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {teamMembers.map(member => {
          const memberName = getFullName(member);
          const memberRole = member.role;

          return (
            <Card key={member.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={member.avatarUrl ?? undefined}
                    alt={memberName}
                    size="lg"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {memberName}
                      </h3>
                      {member.id === currentUser?.id && (
                        <Badge variant="blue" size="sm">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.email}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      Joined {formatDate(new Date(member.createdAt))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="purple" className="capitalize">
                    {memberRole?.toLowerCase()}
                  </Badge>

                  {member.id !== currentUser?.id && (
                    <Link href={`/team/${member.id}`}>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {teamMembers.length === 0 && (
        <EmptyState
          title="No team members"
          description="Invite your first team member to get started"
          action={
            <Button onClick={() => setShowInviteForm(true)}>
              Invite Member
            </Button>
          }
        />
      )}
    </main>
  );
};

export default function TeamPage() {
  return <TeamContent />;
}
