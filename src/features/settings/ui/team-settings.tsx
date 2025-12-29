'use client';

import { useState } from 'react';

import { Copy, Loader2 } from 'lucide-react';

import { getFullName } from 'shared/api';
import { formatRole } from 'shared/api/auth';
import { useAuthStore } from 'shared/store';
import { Avatar, Button, Card } from 'shared/ui';

import { useGetOrganizationMembers, useRemoveMember } from '../api';

export const TeamSettings = () => {
  const { user } = useAuthStore();
  const { data: members, isLoading, error } = useGetOrganizationMembers();
  const removeMemberMutation = useRemoveMember();

  const [copied, setCopied] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<number | null>(null);

  // Note: Invite code functionality would need a separate API endpoint
  // For now, showing a placeholder
  const organizationInviteCode = 'Contact admin for invite code';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(organizationInviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveMember = async (memberId: number) => {
    await removeMemberMutation.mutateAsync(memberId);
    setMemberToRemove(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Team Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage team members and invites
          </p>
        </div>
        <Card
          className="border border-red-200 dark:border-red-900"
          padding="lg"
        >
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load team members. Please try again later.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">Team Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage team members and invites
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Invite code:</span>
          <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
            {organizationInviteCode}
          </code>
          <Button variant="ghost" size="sm" onClick={handleCopyCode}>
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : ''}
          </Button>
        </div>
      </div>

      <Card className="border" padding="lg">
        <div className="space-y-4">
          <h3 className="font-medium">Team Members ({members?.length ?? 0})</h3>

          {removeMemberMutation.isError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {(removeMemberMutation.error as Error).message ||
                'Failed to remove member'}
            </p>
          )}

          <div className="space-y-3">
            {members?.map(member => {
              const memberName = getFullName(member);
              const isCurrentUser = member.id === user?.id;
              const { isFounder } = member;
              const isBeingRemoved = memberToRemove === member.id;

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={member.avatarUrl ?? undefined}
                      alt={memberName}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {memberName}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (You)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      {formatRole(member.role)}
                    </span>

                    {!isFounder &&
                      !isCurrentUser &&
                      (isBeingRemoved ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={removeMemberMutation.isPending}
                          >
                            {removeMemberMutation.isPending
                              ? 'Removing...'
                              : 'Confirm'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMemberToRemove(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMemberToRemove(member.id)}
                        >
                          Remove
                        </Button>
                      ))}
                  </div>
                </div>
              );
            })}

            {(!members || members.length === 0) && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No team members found
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
