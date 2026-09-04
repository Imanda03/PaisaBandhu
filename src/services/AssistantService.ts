import apiClient from './apiCLient';
import { API_URL } from '../utils/helper';

export type AssistantChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type AssistantChatResponse = {
  message: string;
  actionsPerformed: string[];
};

export const sendAssistantMessage = async (
  messages: AssistantChatMessage[],
): Promise<AssistantChatResponse> => {
  const { data } = await apiClient.post(`${API_URL}/assistant/chat`, {
    messages,
  });
  return data.data;
};
