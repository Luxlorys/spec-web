'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowLeft,
  Shield,
  Sparkles,
  Trash2,
} from 'lucide-react';

import { usersApi } from 'shared/api/users';
import { QueryKeys } from 'shared/constants';
import { formatDate } from 'shared/lib';
import { useAuthStore } from 'shared/store';
import { UserRole } from 'shared/types';
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
    value: 'founder',
    label: 'Founder',
    description: 'Full access to all features and settings',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Can manage team members and settings',
  },
  {
    value: 'pm',
    label: 'Project Manager',
    description: 'Can manage features and specifications',
  },
  {
    value: 'ba',
    label: 'Business Analyst',
    description: 'Can create and edit specifications',
  },
  {
    value: 'developer',
    label: 'Developer',
    description: 'Can view and comment on specifications',
  },
  {
    value: 'designer',
    label: 'Designer',
    description: 'Can view and comment on specifications',
  },
];

function TeamMemberContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const memberId = params.id as string;

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: member, isLoading } = useQuery({
    queryKey: [QueryKeys.USERS, memberId],
    queryFn: () => usersApi.getById(memberId),
    enabled: !!memberId,
  });

  const updateRoleMutation = useMutation({
    mutationFn: (role: UserRole) => usersApi.updateRole(memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS] });
      setSelectedRole(null);
    },
  });

  const updateCanCreateFeaturesMutation = useMutation({
    mutationFn: (canCreateFeatures: boolean) =>
      usersApi.updateCanCreateFeatures(memberId, canCreateFeatures),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: () => usersApi.remove(memberId, currentUser?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS] });
      router.push('/team');
    },
  });

  const handleSaveRole = () => {
    if (selectedRole && selectedRole !== member?.role) {
      updateRoleMutation.mutate(selectedRole);
    }
  };

  const handleDelete = () => {
    removeMemberMutation.mutate();
  };

  const isCurrentUserAdmin =
    currentUser?.role === 'founder' || currentUser?.role === 'admin';
  const isFounder = member?.role === 'founder';
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
            The team member you're looking for doesn't exist or has been
            removed.
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
          <Avatar src={member.avatarUrl} alt={member.name} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                {member.name}
              </h2>
              {isSelf && (
                <Badge variant="blue" size="sm">
                  You
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{member.email}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Joined {formatDate(member.createdAt)}
            </p>
          </div>
          <Badge variant="purple" className="capitalize">
            {member.role}
          </Badge>
        </div>
      </Card>

      {/* Permissions Card */}
      <Card className="mb-6 border" padding="lg">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Permissions</h3>
        </div>

        {!canChangeRole ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {isFounder
                ? "The founder's role cannot be changed."
                : !isCurrentUserAdmin
                  ? 'You need admin permissions to change member roles.'
                  : 'You cannot change your own role.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Role</Label>
              <Select
                value={selectedRole || member.role}
                onValueChange={value => setSelectedRole(value as UserRole)}
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions
                    .filter(r => r.value !== 'founder')
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
                    r => r.value === (selectedRole || member.role),
                  )?.description
                }
              </p>
            </div>

            {selectedRole && selectedRole !== member.role && (
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

            {/* Allow Feature Requests Toggle */}
            <div className="border-t pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Allow feature requests
                  </p>
                  <p className="text-xs text-muted-foreground">
                    When enabled, this member can create new feature requests
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={member.canCreateFeatures}
                    onChange={e => {
                      updateCanCreateFeaturesMutation.mutate(e.target.checked);
                    }}
                    disabled={updateCanCreateFeaturesMutation.isPending}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-4 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" />
                </label>
              </div>
              {updateCanCreateFeaturesMutation.isError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {(updateCanCreateFeaturesMutation.error as Error).message}
                </p>
              )}
            </div>
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

          {!showDeleteConfirm ? (
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
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
              <p className="mb-4 text-sm text-red-800 dark:text-red-200">
                Are you sure you want to remove <strong>{member.name}</strong>{' '}
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
          )}
        </Card>
      )}
    </main>
  );
}

export default function TeamMemberPage() {
  return <TeamMemberContent />;
}
