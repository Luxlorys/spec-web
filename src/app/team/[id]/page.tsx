'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, ArrowLeft, Shield, Trash2 } from 'lucide-react';

import { usersApi } from 'shared/api/users';
import { QueryKeys } from 'shared/constants';
import { formatDate } from 'shared/lib';
import { useAuthStore } from 'shared/store';
import { getFullName, UserRole } from 'shared/types';
import { Avatar, Badge, Button, Card, Label } from 'shared/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared/ui/select';

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'FOUNDER',
    label: 'Founder',
    description: 'Full access to all features and settings',
  },
  {
    value: 'ADMIN',
    label: 'Admin',
    description: 'Can manage team members and settings',
  },
  {
    value: 'PM',
    label: 'Project Manager',
    description: 'Can manage features and specifications',
  },
  {
    value: 'BA',
    label: 'Business Analyst',
    description: 'Can create and edit specifications',
  },
  {
    value: 'DEVELOPER',
    label: 'Developer',
    description: 'Can view and comment on specifications',
  },
  {
    value: 'DESIGNER',
    label: 'Designer',
    description: 'Can view and comment on specifications',
  },
];

const getPermissionWarningMessage = (
  isFounder: boolean,
  isCurrentUserAdmin: boolean,
): string => {
  if (isFounder) {
    return "The founder's role cannot be changed.";
  }
  if (!isCurrentUserAdmin) {
    return 'You need admin permissions to change member roles.';
  }

  return 'You cannot change your own role.';
};

const TeamMemberContent = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser, getCurrentOrganization } = useAuthStore();
  const currentOrg = getCurrentOrganization();
  const memberId = Number(params.id);

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: member, isLoading } = useQuery({
    queryKey: [QueryKeys.USERS, memberId],
    queryFn: () => usersApi.getById(memberId),
    enabled: !!memberId,
  });

  const memberName = member ? getFullName(member) : '';
  const memberRole = member?.role ?? null;
  const currentUserRole = currentUser?.role ?? null;

  const updateRoleMutation = useMutation({
    mutationFn: (role: UserRole) =>
      usersApi.updateRole(memberId, role, currentOrg?.id ?? 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS] });
      setSelectedRole(null);
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: () =>
      usersApi.remove(memberId, currentUser?.id ?? 0, currentOrg?.id ?? 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS] });
      router.push('/team');
    },
  });

  const handleSaveRole = () => {
    if (selectedRole && selectedRole !== memberRole) {
      updateRoleMutation.mutate(selectedRole);
    }
  };

  const handleDelete = () => {
    removeMemberMutation.mutate();
  };

  const isCurrentUserAdmin =
    currentUserRole === 'FOUNDER' || currentUserRole === 'ADMIN';
  const isFounder = memberRole === 'FOUNDER';
  const isSelf = member?.id === currentUser?.id;
  const canChangeRole = isCurrentUserAdmin && !isFounder;
  const canDelete = isCurrentUserAdmin && !isFounder && !isSelf;

  if (isLoading) {
    return (
      <main className="p-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-48 rounded bg-muted" />
          <Card className="mb-6 border p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-6 w-32 rounded bg-muted" />
                <div className="h-4 w-48 rounded bg-muted" />
              </div>
            </div>
          </Card>
        </div>
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
          Manage Team Member
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage permissions for this team member
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

      {/* Permissions Card */}
      <Card className="mb-6 border" padding="lg">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Permissions</h3>
        </div>

        {canChangeRole ? (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Role</Label>
              <Select
                value={selectedRole || memberRole || 'DEVELOPER'}
                onValueChange={value => setSelectedRole(value as UserRole)}
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions
                    .filter(r => r.value !== 'FOUNDER')
                    .map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex flex-col">
                          <span>{role.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="mt-2 text-sm text-muted-foreground">
                {
                  roleOptions.find(
                    r => r.value === (selectedRole || memberRole),
                  )?.description
                }
              </p>
            </div>

            {selectedRole && selectedRole !== memberRole && (
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveRole}
                  disabled={updateRoleMutation.isPending}
                >
                  {updateRoleMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => setSelectedRole(null)}>
                  Cancel
                </Button>
              </div>
            )}

            {updateRoleMutation.isError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {(updateRoleMutation.error as Error).message}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {getPermissionWarningMessage(isFounder, isCurrentUserAdmin)}
            </p>
          </div>
        )}
      </Card>

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
                  {(removeMemberMutation.error as Error).message}
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
