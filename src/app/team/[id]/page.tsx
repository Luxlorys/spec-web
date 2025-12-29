'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { AlertTriangle, ArrowLeft, Loader2, Trash2 } from 'lucide-react';

import { useGetOrganizationMembers, useRemoveMember } from 'features/settings';
import { formatDate } from 'shared/lib';
import { useAuthStore } from 'shared/store';
import { getFullName } from 'shared/types';
import { Avatar, Badge, Button, Card } from 'shared/ui';

const TeamMemberContent = () => {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const memberId = Number(params.id);

  const { data: members, isLoading, error } = useGetOrganizationMembers();
  const removeMemberMutation = useRemoveMember();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Find the member from the list
  const member = members?.find(m => m.id === memberId);

  const memberName = member ? getFullName(member) : '';
  const memberRole = member?.role ?? null;
  const currentUserRole = currentUser?.role ?? null;

  const handleDelete = async () => {
    await removeMemberMutation.mutateAsync(memberId);
    router.push('/team');
  };

  const isCurrentUserFounder = currentUserRole === 'FOUNDER';
  const isFounder = member?.isFounder ?? false;
  const isSelf = member?.id === currentUser?.id;
  const canDelete = isCurrentUserFounder && !isFounder && !isSelf;

  if (isLoading) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <Card
          className="border border-red-200 dark:border-red-900"
          padding="lg"
        >
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load team member. Please try again later.
          </p>
        </Card>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="p-6">
        <Card className="border p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Member not found
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            The team member you&apos;re looking for doesn&apos;t exist or has
            been removed.
          </p>
          <Link href="/team">
            <Button variant="outline">Back to Team</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/team"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Team
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          Team Member Details
        </h1>
        <p className="text-sm text-muted-foreground">
          View details for this team member
        </p>
      </div>

      {/* Member Info Card */}
      <Card className="mb-6 border" padding="lg">
        <div className="flex items-start gap-4">
          <Avatar
            src={member.avatarUrl ?? undefined}
            alt={memberName}
            size="lg"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                {memberName}
              </h2>
              {isSelf && (
                <Badge variant="blue" size="sm">
                  You
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{member.email}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Joined {formatDate(new Date(member.createdAt))}
            </p>
          </div>
          <Badge variant="purple" className="capitalize">
            {memberRole?.toLowerCase()}
          </Badge>
        </div>
      </Card>

      {/* Info Card for non-deletable members */}
      {!canDelete && (
        <Card className="mb-6 border" padding="lg">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {isFounder && 'The founder cannot be removed from the team.'}
              {isSelf &&
                !isFounder &&
                'You cannot remove yourself from the team.'}
              {!isCurrentUserFounder &&
                !isFounder &&
                !isSelf &&
                'Only the founder can remove team members.'}
            </p>
          </div>
        </Card>
      )}

      {/* Danger Zone */}
      {canDelete && (
        <Card
          className="border border-red-200 dark:border-red-900/50"
          padding="lg"
        >
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
              Danger Zone
            </h3>
          </div>

          {showDeleteConfirm ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
              <p className="mb-4 text-sm text-red-800 dark:text-red-200">
                Are you sure you want to remove <strong>{memberName}</strong>{' '}
                from the team? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={removeMemberMutation.isPending}
                >
                  {removeMemberMutation.isPending
                    ? 'Removing...'
                    : 'Yes, Remove Member'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
              {removeMemberMutation.isError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {(removeMemberMutation.error as Error).message ||
                    'Failed to remove member'}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Remove from team</p>
                <p className="text-sm text-muted-foreground">
                  This member will lose access to the organization.
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Member
              </Button>
            </div>
          )}
        </Card>
      )}
    </main>
  );
};

export default function TeamMemberPage() {
  return <TeamMemberContent />;
}
