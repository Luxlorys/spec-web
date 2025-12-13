'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AuthGuard } from 'shared/lib/auth-guard';
import { ChatInterface } from 'features/ai-conversation';
import { featureRequestsApi } from 'shared/api/feature-requests';
import { QueryKeys } from 'shared/constants';
import { Button } from 'shared/ui';

function ConversationContent({ featureId }: { featureId: string }) {
  const { data: feature, isLoading } = useQuery({
    queryKey: [QueryKeys.FEATURE_REQUEST_BY_ID, featureId],
    queryFn: () => featureRequestsApi.getById(featureId),
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!feature) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Feature not found</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <span>/</span>
          <Link
            href={`/features/${featureId}`}
            className="hover:text-foreground"
          >
            {feature.title}
          </Link>
          <span>/</span>
          <span className="text-foreground">Conversation</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {feature.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Defining requirements through AI conversation
            </p>
          </div>
          <Link href={`/features/${featureId}`}>
            <Button variant="outline" size="sm">
              View Feature
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface featureId={featureId} />
    </main>
  );
}

interface IProps {
  params: Promise<{ id: string }>;
}

export default function ConversationPage({ params }: IProps) {
  const { id } = use(params);
  return (
    <AuthGuard>
      <ConversationContent featureId={id} />
    </AuthGuard>
  );
}
