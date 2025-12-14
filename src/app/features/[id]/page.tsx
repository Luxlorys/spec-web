import { FeatureDetailClient } from './feature-detail-client';

interface IProps {
  params: Promise<{ id: string }>;
}

export default async function FeatureDetailPage({ params }: IProps) {
  const { id } = await params;

  return (
    <main className="p-6">
      <FeatureDetailClient featureId={id} />
    </main>
  );
}
