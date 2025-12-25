export const delay = (ms: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export const generateId = (): string => {
  const randomNumber = Math.random();
  const randomPart = randomNumber.toString(36).substring(2, 9);

  return `${Date.now()}-${randomPart}`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'just now';
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(date);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
};

/**
 * Copy text to clipboard with fallback for older browsers
 * @param text Text to copy
 * @returns Promise<boolean> Success status
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);

      return true;
    }

    // Fallback for older browsers
    const textarea = document.createElement('textarea');

    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand('copy');

    document.body.removeChild(textarea);

    return success;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to copy to clipboard:', error);

    return false;
  }
};
