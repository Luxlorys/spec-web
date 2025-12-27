'use client';

import { useState } from 'react';

import { Copy } from 'lucide-react';

import { Avatar, Button, Card, Input } from 'shared/ui';

export const TeamSettings = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const organizationInviteCode = 'SPECFLOW2025';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(organizationInviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    // Placeholder for invite functionality
    setInviteEmail('');
  };

  const teamMembers = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Founder',
      status: 'accepted' as const,
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Developer',
      status: 'accepted' as const,
    },
    {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'Designer',
      status: 'accepted' as const,
    },
    {
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'PM',
      status: 'accepted' as const,
    },
    {
      name: 'New Member',
      email: 'newmember@example.com',
      role: 'Developer',
      status: 'invited' as const,
    },
  ];

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
          <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
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
          <h3 className="font-medium">Team Members ({teamMembers.length})</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleInvite} disabled={!inviteEmail}>
              Invite
            </Button>
          </div>
          <div className="space-y-3">
            {teamMembers.map(member => (
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
                  {member.status === 'invited' ? (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Invited
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                      {member.role}
                    </span>
                  )}
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
