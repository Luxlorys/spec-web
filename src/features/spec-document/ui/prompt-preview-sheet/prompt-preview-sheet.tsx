'use client';

import { FC, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from 'shared/ui/sheet';
import { Button } from 'shared/ui';
import { copyToClipboard } from 'shared/lib';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  promptText: string;
}

export const PromptPreviewSheet: FC<IProps> = ({ isOpen, onClose, promptText }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const handleCopy = async () => {
    const success = await copyToClipboard(promptText);

    if (success) {
      setIsCopied(true);
      setCopyError(null);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } else {
      setCopyError('Failed to copy. Please try selecting the text manually.');
    }
  };

  const characterCount = promptText.length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Generated AI Prompt</SheetTitle>
          <SheetDescription>
            Ready to paste into Cursor, Claude, or Copilot
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Character count indicator */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{characterCount.toLocaleString()} characters</span>
            {characterCount > 10000 && (
              <span className="text-yellow-600">Large prompt - consider breaking into sections</span>
            )}
          </div>

          {/* Prompt text area */}
          <textarea
            readOnly
            value={promptText}
            className="min-h-[500px] w-full resize-y rounded-md border border-input bg-muted px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={(e) => {
              // Auto-select all text on click
              (e.target as HTMLTextAreaElement).select();
            }}
          />

          {/* Error message */}
          {copyError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
              {copyError}
            </div>
          )}
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleCopy} disabled={isCopied}>
            {isCopied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
