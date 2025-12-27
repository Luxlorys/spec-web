'use client';

import { FC } from 'react';

import { MessageCircle } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from 'shared/ui';

interface ICommentsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
}

export const CommentsSidebar: FC<ICommentsSidebarProps> = ({
  isOpen,
  onClose,
  sectionTitle,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="flex h-screen w-full flex-col overflow-hidden rounded-l-lg p-0 sm:max-w-[500px]"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border p-4 text-left">
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription className="text-left">
            {sectionTitle}
          </SheetDescription>
        </SheetHeader>

        {/* Content - Coming Soon */}
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <MessageCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            Comments coming soon
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The ability to add and view comments on specification sections will
            be available in a future update.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
