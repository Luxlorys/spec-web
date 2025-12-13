export interface IComment {
  id: string;
  specDocumentId: string;
  section: string;
  content: string;
  authorId: string;
  parentId?: string;
  aiResponse?: string;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCommentRequest {
  section: string;
  content: string;
  parentId?: string;
}

export interface IUpdateCommentRequest {
  content?: string;
  resolved?: boolean;
}
