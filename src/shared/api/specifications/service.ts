import { api } from 'shared/lib';

import {
  ICreateAnswerRequest,
  ICreateAnswerResponse,
  ICreateQuestionRequest,
  ICreateQuestionResponse,
  IDeleteAnswerResponse,
  IDeleteQuestionResponse,
  IEditAnswerRequest,
  IEditAnswerResponse,
  IEditQuestionRequest,
  IEditQuestionResponse,
  IGetSpecificationResponse,
  IOpenQuestion,
  IQuestionAnswer,
  IResolveQuestionRequest,
  IResolveQuestionResponse,
  ISpecificationWithQuestions,
} from './types';

export const specificationsApi = {
  /**
   * Get latest specification with open questions
   * GET /specifications/:featureId
   */
  getByFeatureId: async (
    featureId: number,
  ): Promise<ISpecificationWithQuestions | null> => {
    try {
      const { data } = await api.get<IGetSpecificationResponse>(
        `/specifications/${featureId}`,
      );

      return data.specification;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Create a new question
   * POST /specifications/:specificationId/questions
   */
  createQuestion: async (
    specificationId: number,
    requestData: ICreateQuestionRequest,
  ): Promise<IOpenQuestion> => {
    const { data } = await api.post<ICreateQuestionResponse>(
      `/specifications/${specificationId}/questions`,
      requestData,
    );

    return data.question;
  },

  /**
   * Edit question and/or answers
   * PUT /specifications/:specificationId/questions/:questionId
   */
  editQuestion: async (
    specificationId: number,
    questionId: number,
    requestData: IEditQuestionRequest,
  ): Promise<IOpenQuestion> => {
    const { data } = await api.post<IEditQuestionResponse>(
      `/specifications/${specificationId}/questions/${questionId}`,
      requestData,
    );

    return data.question;
  },

  /**
   * Resolve question with accepted answer
   * POST /specifications/:specificationId/questions/:questionId/resolve
   */
  resolveQuestion: async (
    specificationId: number,
    questionId: number,
    requestData: IResolveQuestionRequest,
  ): Promise<IOpenQuestion> => {
    const { data } = await api.post<IResolveQuestionResponse>(
      `/specifications/${specificationId}/questions/${questionId}/resolve`,
      requestData,
    );

    return data.question;
  },

  /**
   * Delete a question
   * DELETE /specifications/:specificationId/questions/:questionId
   */
  deleteQuestion: async (
    specificationId: number,
    questionId: number,
  ): Promise<boolean> => {
    const { data } = await api.delete<IDeleteQuestionResponse>(
      `/specifications/${specificationId}/questions/${questionId}`,
    );

    return data.success;
  },

  /**
   * Create a new answer
   * POST /specifications/:specificationId/questions/:questionId/answers
   */
  createAnswer: async (
    specificationId: number,
    questionId: number,
    requestData: ICreateAnswerRequest,
  ): Promise<IQuestionAnswer> => {
    const { data } = await api.post<ICreateAnswerResponse>(
      `/specifications/${specificationId}/questions/${questionId}/answers`,
      requestData,
    );

    return data.answer;
  },

  /**
   * Edit an answer
   * POST /specifications/:specificationId/questions/:questionId/answers/:answerId
   */
  editAnswer: async (params: {
    specificationId: number;
    questionId: number;
    answerId: number;
    data: IEditAnswerRequest;
  }): Promise<IQuestionAnswer> => {
    const { specificationId, questionId, answerId, data: requestData } = params;
    const { data } = await api.post<IEditAnswerResponse>(
      `/specifications/${specificationId}/questions/${questionId}/answers/${answerId}`,
      requestData,
    );

    return data.answer;
  },

  /**
   * Delete an answer
   * DELETE /specifications/:specificationId/questions/:questionId/answers/:answerId
   */
  deleteAnswer: async (
    specificationId: number,
    questionId: number,
    answerId: number,
  ): Promise<boolean> => {
    const { data } = await api.delete<IDeleteAnswerResponse>(
      `/specifications/${specificationId}/questions/${questionId}/answers/${answerId}`,
    );

    return data.success;
  },
};
