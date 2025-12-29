'use client';

import { FC } from 'react';

import { SectionType } from 'shared/api/comments';
import {
  ScrollArea,
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
  sectionTitle: string;
  specificationId: number;
  sectionType: SectionType;
}

export const CommentsSidebar: FC<ICommentsSidebarProps> = ({
  isOpen,
  onClose,
  sectionTitle,
  specificationId,
  sectionType,
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

        {/* Comments List */}
        <ScrollArea className="flex-1 p-4">
          <CommentList
            specificationId={specificationId}
            sectionType={sectionType}
          />
        </ScrollArea>

        {/* Comment Form */}
        <div className="border-t border-border p-4">
          <CommentForm
            specificationId={specificationId}
            sectionType={sectionType}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
