import { useCallback, useRef, useState } from 'react';

import { env } from 'env';

import {
  IConversationWithProgress,
  IStreamCompleteResult,
  IStreamMetadata,
} from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { queryClient } from 'shared/lib';
import { useAuthStore } from 'shared/store';

interface IStreamingState {
  isStreaming: boolean;
  streamedText: string;
  pendingUserMessage: string | null;
  error: string | null;
  metadata: IStreamMetadata | null;
  finalResult: IStreamCompleteResult | null;
}

const initialState: IStreamingState = {
  isStreaming: false,
  streamedText: '',
  pendingUserMessage: null,
  error: null,
  metadata: null,
  finalResult: null,
};

type SSEHandler = {
  onTextDelta: (text: string) => void;
  onMetadata: (metadata: IStreamMetadata) => void;
  onComplete: (result: IStreamCompleteResult) => void;
  onError: (message: string) => void;
};

const processSSELine = (
  line: string,
  eventRef: { current: string },
  handlers: SSEHandler,
) => {
  if (line.startsWith('event: ')) {
    eventRef.current = line.slice(7);
  } else if (line.startsWith('data: ')) {
    const dataStr = line.slice(6);

    if (eventRef.current && dataStr) {
      try {
        const data = JSON.parse(dataStr);

        switch (eventRef.current) {
          case 'text_delta':
            handlers.onTextDelta(data.text);
            break;

          case 'metadata':
            handlers.onMetadata({
              phase: data.phase,
              isCompleted: data.isCompleted,
              assistantMessageId: data.assistantMessageId,
              userMessageId: data.userMessageId,
              specification: data.specification,
            });
            break;

          case 'message_complete':
            handlers.onComplete(data);
            break;

          case 'error':
            handlers.onError(data.message);
            break;

          default:
            break;
        }
      } catch {
        // Failed to parse SSE data - continue processing
      }

      eventRef.current = '';
    }
  }
};

const readStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  handlers: SSEHandler,
) => {
  const decoder = new TextDecoder();
  let buffer = '';
  const eventRef = { current: '' };

  const processChunk = async (): Promise<void> => {
    const { done, value } = await reader.read();

    if (done) {
      return;
    }

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');

    buffer = lines.pop() || '';

    lines.forEach(line => {
      processSSELine(line, eventRef, handlers);
    });

    return processChunk();
  };

  await processChunk();
};

export const useStreamingMessage = (featureId: number) => {
  const [state, setState] = useState<IStreamingState>(initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateConversationCache = useCallback(
    (result: IStreamCompleteResult) => {
      queryClient.setQueryData<IConversationWithProgress | null>(
        [QueryKeys.CONVERSATION_BY_FEATURE, featureId],
        old => {
          if (!old) {
            return old;
          }

          return {
            ...old,
            messages: [
              ...old.messages,
              result.userMessage,
              result.assistantMessage,
            ],
            isCompleted: result.conversation.isCompleted,
            currentPhase: result.conversation.currentPhase,
          };
        },
      );

      // Still invalidate other related queries
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUEST_BY_ID, featureId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SPECIFICATION_BY_FEATURE, featureId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.FEATURE_REQUESTS],
      });
    },
    [featureId],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setState({
        isStreaming: true,
        streamedText: '',
        pendingUserMessage: content,
        error: null,
        metadata: null,
        finalResult: null,
      });

      try {
        const { accessToken } = useAuthStore.getState();

        const response = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/features/${featureId}/conversation/messages/stream`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
            body: JSON.stringify({ content }),
            signal: abortControllerRef.current.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const reader = response.body?.getReader();

        if (!reader) {
          throw new Error('No response body');
        }

        await readStream(reader, {
          onTextDelta: text => {
            setState(prev => ({
              ...prev,
              streamedText: prev.streamedText + text,
            }));
          },
          onMetadata: metadata => {
            setState(prev => ({
              ...prev,
              metadata,
            }));
            if (metadata.isCompleted) {
              queryClient.invalidateQueries({
                queryKey: [QueryKeys.FEATURE_REQUEST_BY_ID, featureId],
              });
              queryClient.invalidateQueries({
                queryKey: [QueryKeys.SPECIFICATION_BY_FEATURE, featureId],
              });
            }
          },
          onComplete: result => {
            updateConversationCache(result);

            setState(prev => ({
              ...prev,
              isStreaming: false,
              streamedText: '',
              pendingUserMessage: null,
              finalResult: result,
            }));
          },
          onError: message => {
            setState(prev => ({
              ...prev,
              isStreaming: false,
              error: message,
            }));
          },
        });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          setState(prev => ({ ...prev, isStreaming: false }));

          return;
        }

        setState(prev => ({
          ...prev,
          isStreaming: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    },
    [featureId, updateConversationCache],
  );

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setState(prev => ({ ...prev, isStreaming: false }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    sendMessage,
    cancel,
    reset,
  };
};
