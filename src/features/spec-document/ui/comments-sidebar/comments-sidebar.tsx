'use client';

import { FC } from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from 'shared/ui';

import { CommentForm } from '../comment-form';
import { CommentList } from '../comment-list';

interface ICommentsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  specDocumentId: string;
  section: string;
  sectionTitle: string;
}

export const CommentsSidebar: FC<ICommentsSidebarProps> = ({
  isOpen,
  onClose,
  specDocumentId,
  section,
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

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <CommentList specDocumentId={specDocumentId} section={section} />
        </div>

        {/* Footer - Comment Form */}
        <div className="border-t border-border p-4">
          <CommentForm specDocumentId={specDocumentId} section={section} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
