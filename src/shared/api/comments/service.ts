import { api } from 'shared/lib';

import {
  IComment,
  ICommentResponse,
  ICommentsBySection,
  ICreateCommentRequest,
  IDeleteCommentResponse,
  IEditCommentRequest,
  IGetCommentsResponse,
} from './types';

export const commentsApi = {
  /**
   * Get all comments for a specification grouped by section
   * GET /api/comments/:specificationId
   */
  getBySpecificationId: async (
    specificationId: number,
  ): Promise<ICommentsBySection> => {
    const { data } = await api.get<IGetCommentsResponse>(
      `/comments/${specificationId}`,
    );

    return data.comments;
  },

  /**
   * Create a new comment on a specification section
   * POST /api/comments/:specificationId
   */
  create: async (
    specificationId: number,
    requestData: ICreateCommentRequest,
  ): Promise<IComment> => {
    const { data } = await api.post<ICommentResponse>(
      `/comments/${specificationId}`,
      requestData,
    );

    return data.comment;
  },

  /**
   * Edit an existing comment
   * POST /api/comments/:specificationId/:commentId
   */
  edit: async (
    specificationId: number,
    commentId: number,
    requestData: IEditCommentRequest,
  ): Promise<IComment> => {
    const { data } = await api.post<ICommentResponse>(
      `/comments/${specificationId}/${commentId}`,
      requestData,
    );

    return data.comment;
  },

  /**
   * Delete a comment
   * DELETE /api/comments/:specificationId/:commentId
   */
  delete: async (
    specificationId: number,
    commentId: number,
  ): Promise<boolean> => {
    const { data } = await api.delete<IDeleteCommentResponse>(
      `/comments/${specificationId}/${commentId}`,
    );

    return data.success;
  },
};
