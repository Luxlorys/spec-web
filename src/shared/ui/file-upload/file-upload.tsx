import { useCallback, useRef, useState } from 'react';

import { AlertCircle, File, Upload, X } from 'lucide-react';

import { cn } from 'shared/lib';

interface FileUploadProps {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  onFilesChange: (files: File[]) => void;
  files: File[];
  className?: string;
  disabled?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export const FileUpload = ({
  label,
  error,
  helperText,
  accept = '.txt,.md,.pdf,.docx,.doc',
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  onFilesChange,
  files,
  className,
  disabled = false,
}: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (
    filesToValidate: File[],
  ): { valid: File[]; error: string } => {
    const valid: File[] = [];
    let error = '';

    const allowedTypes = accept
      .split(',')
      .map(type => type.trim().toLowerCase());

    filesToValidate.some(file => {
      // Check file size
      if (file.size > maxSize) {
        error = `File "${file.name}" is too large. Maximum size is ${formatFileSize(maxSize)}.`;

        return true; // Stop iteration
      }

      // Check file type
      const extension = file.name.split('.').pop();
      const fileExtension = `.${extension?.toLowerCase()}`;
      const isValidType = allowedTypes.some(
        type =>
          type === fileExtension ||
          (type.startsWith('.') && fileExtension === type) ||
          file.type.startsWith(type.replace('*', '')),
      );

      if (!isValidType) {
        error = `File "${file.name}" is not a supported format. Allowed formats: ${accept}`;

        return true; // Stop iteration
      }

      valid.push(file);

      return false; // Continue iteration
    });

    return { valid, error };
  };

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles || disabled) {
        return;
      }

      const fileArray = Array.from(newFiles);
      const { valid, error } = validateFiles(fileArray);

      if (error) {
        setValidationError(error);

        return;
      }

      setValidationError('');

      if (multiple) {
        onFilesChange([...files, ...valid]);
      } else {
        onFilesChange(valid.slice(0, 1));
      }
    },
    [files, multiple, onFilesChange, disabled, maxSize, accept],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setDragOver(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);

    onFilesChange(newFiles);
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const displayError = error || validationError;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div
        className={cn(
          'relative rounded-lg border-2 border-dashed transition-colors',
          'bg-gray-50 dark:bg-gray-800',
          dragOver && !disabled
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 dark:border-gray-600',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:border-primary hover:bg-primary/5',
          displayError && 'border-red-500 bg-red-50 dark:bg-red-900/20',
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={e => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="p-6 text-center">
          <Upload
            className={cn(
              'mx-auto mb-2 h-8 w-8',
              displayError ? 'text-red-500' : 'text-gray-400',
            )}
          />
          <p
            className={cn(
              'mb-1 text-sm font-medium',
              displayError
                ? 'text-red-700 dark:text-red-400'
                : 'text-gray-700 dark:text-gray-300',
            )}
          >
            {dragOver
              ? 'Drop files here'
              : 'Drop files here or click to browse'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {accept} • Max {formatFileSize(maxSize)} {multiple ? '(each)' : ''}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map(file => (
            <div
              key={file.name}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
            >
              <File className="h-4 w-4 flex-shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
              {!disabled && (
                <button
                  type="button"
                  aria-label={`Remove file ${file.name}`}
                  onClick={e => {
                    e.stopPropagation();
                    const fileIndex = files.indexOf(file);

                    removeFile(fileIndex);
                  }}
                  className="rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <div className="mt-2 flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">
            {displayError}
          </p>
        </div>
      )}

      {/* Helper Text */}
      {helperText && !displayError && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};
