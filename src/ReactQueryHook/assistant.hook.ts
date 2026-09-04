import { useMutation, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import {
  AssistantChatMessage,
  AssistantChatResponse,
  sendAssistantMessage,
} from '../services/AssistantService';
import { ApiError } from '../utils/types';
import { useToast } from '../context/ToastContext';

export const useAssistantChat = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    AssistantChatResponse,
    AxiosError<ApiError>,
    AssistantChatMessage[]
  >(messages => sendAssistantMessage(messages), {
    onSuccess: async result => {
      if (result.actionsPerformed?.length) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['LatestTransactionList'] }),
          queryClient.invalidateQueries({ queryKey: ['ChartTransaction'] }),
          queryClient.invalidateQueries({ queryKey: ['TransactionOverview'] }),
          queryClient.invalidateQueries({ queryKey: ['BookTransactionList'] }),
          queryClient.invalidateQueries({ queryKey: ['Category'] }),
          queryClient.invalidateQueries({ queryKey: ['TransactionList'] }),
        ]);
      }
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        'Assistant is unavailable. Please try again.';
      showToast(message, 'error');
    },
  });
};
