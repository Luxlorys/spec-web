/**
 * Validation for comment content
 * @param content - The comment content to validate
 * @returns Error message if invalid, null if valid
 */
export const validateCommentContent = (content: string): string | null => {
  const trimmed = content.trim();

  if (trimmed.length === 0) {
    return 'Comment content is required';
  }

  if (trimmed.length > 1000) {
    return 'Comment must be less than 1000 characters';
  }

  return null;
};

/**
 * Comment validation rules for React Hook Form
 */
export const commentValidation = {
  content: {
    required: 'Comment content is required',
    minLength: {
      value: 1,
      message: 'Comment must be at least 1 character',
    },
    maxLength: {
      value: 1000,
      message: 'Comment must be less than 1000 characters',
    },
    validate: (value: string) => {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return 'Comment cannot be only whitespace';
      }
      return true;
    },
  },
};
