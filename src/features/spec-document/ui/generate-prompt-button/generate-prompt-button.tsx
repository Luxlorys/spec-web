'use client';

import { FC, useState } from 'react';
import { FileCode } from 'lucide-react';
import { Button } from 'shared/ui';
import { ISpecDocument, IComment } from 'shared/types';
import { generateAIPrompt } from '../../lib';
import { PromptPreviewSheet } from '../prompt-preview-sheet';
import { useGetCommentsBySpec } from 'shared/hooks';

interface IProps {
  spec: ISpecDocument;
  featureTitle?: string;
}

export const GeneratePromptButton: FC<IProps> = ({ spec, featureTitle }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // Fetch all comments for the spec (we'll filter resolved ones)
  const { data: allComments = [], isLoading: isLoadingComments } = useGetCommentsBySpec(spec.id);

  const handleGeneratePrompt = () => {
    // Filter for resolved comments only
    const resolvedComments: IComment[] = allComments.filter(comment => comment.resolved);

    // Generate the prompt
    const prompt = generateAIPrompt({
      spec,
      featureTitle,
      resolvedComments,
      includeMetadata: true,
    });

    setGeneratedPrompt(prompt);
    setIsPreviewOpen(true);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleGeneratePrompt}
        disabled={isLoadingComments}
      >
        <FileCode className="mr-2 h-4 w-4" />
        {isLoadingComments ? 'Loading...' : 'Generate Prompt'}
      </Button>

      <PromptPreviewSheet
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        promptText={generatedPrompt}
      />
    </>
  );
};
