import { IComment, ICreateCommentRequest, IUpdateCommentRequest } from 'shared/types';
import { delay, generateId } from 'shared/lib';
import { mockComments } from 'shared/lib/mock-data';

export const commentsApi = {
  /**
   * Get all comments for a specific section of a spec document
   * @param specDocumentId - The spec document ID
   * @param section - The section ID (e.g., 'overview', 'user-stories')
   * @returns Promise<IComment[]>
   */
  getCommentsBySection: async (
    specDocumentId: string,
    section: string,
  ): Promise<IComment[]> => {
    await delay(300); // Simulate network delay

    return mockComments
      .filter(c => c.specDocumentId === specDocumentId && c.section === section)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()); // Oldest first
  },

  /**
   * Get comment count by section for a spec document
   * Used for displaying badges on section headers
   * @param specDocumentId - The spec document ID
   * @returns Promise<Record<string, number>>
   */
  getCommentCountsBySpec: async (specDocumentId: string): Promise<Record<string, number>> => {
    await delay(200);

    const counts: Record<string, number> = {};

    mockComments
      .filter(c => c.specDocumentId === specDocumentId)
      .forEach(comment => {
        counts[comment.section] = (counts[comment.section] || 0) + 1;
      });

    return counts;
  },

  /**
   * Create a new comment or reply
   * @param specDocumentId - The spec document ID
   * @param data - Comment data (content, section, parentId)
   * @returns Promise<IComment>
   */
  createComment: async (
    specDocumentId: string,
    data: ICreateCommentRequest,
  ): Promise<IComment> => {
    await delay(400);

    // Get current user from localStorage (matching auth pattern)
    const authData = localStorage.getItem('auth-storage');
    const currentUserId = authData ? JSON.parse(authData).state.user?.id || 'user-1' : 'user-1';

    const newComment: IComment = {
      id: generateId(),
      specDocumentId,
      section: data.section,
      content: data.content.trim(),
      authorId: currentUserId,
      parentId: data.parentId,
      resolved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockComments.push(newComment);

    return newComment;
  },

  /**
   * Update an existing comment
   * @param commentId - The comment ID
   * @param data - Updated data (content)
   * @returns Promise<IComment>
   */
  updateComment: async (commentId: string, data: IUpdateCommentRequest): Promise<IComment> => {
    await delay(300);

    const index = mockComments.findIndex(c => c.id === commentId);
    if (index === -1) throw new Error('Comment not found');

    const updated: IComment = {
      ...mockComments[index],
      ...(data.content !== undefined && { content: data.content.trim() }),
      ...(data.resolved !== undefined && { resolved: data.resolved }),
      updatedAt: new Date(),
    };

    mockComments[index] = updated;

    return updated;
  },

  /**
   * Delete a comment
   * @param commentId - The comment ID
   * @returns Promise<void>
   */
  deleteComment: async (commentId: string): Promise<void> => {
    await delay(300);

    const index = mockComments.findIndex(c => c.id === commentId);
    if (index === -1) throw new Error('Comment not found');

    mockComments.splice(index, 1);
  },
};
