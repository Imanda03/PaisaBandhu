import { API_URL } from '../utils/helper';
import { transactionDataProps } from '../utils/types';
import apiClient from './apiCLient';

export const createTransaction = async (data: transactionDataProps) => {
  try {
    const response = await apiClient.post(`${API_URL}/transaction/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTransaction = async (
  id: string,
  data: Partial<transactionDataProps>,
) => {
  try {
    const response = await apiClient.put(`${API_URL}/transaction/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookTransaction = async (bookId: string) => {
  try {
    const response = await apiClient.get(
      `${API_URL}/transaction/book/${bookId}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTransaction = async (id: string) => {
  console.log('delete id', id);
  try {
    const response = await apiClient.delete(`${API_URL}/transaction/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLatestTransaction = async () => {
  try {
    const response = await apiClient.get(`${API_URL}/transaction/latest`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBalanceTransaction = async (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }

    const url = `${API_URL}/transaction/totalBalance${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTransactionOverview = async () => {
  try {
    const response = await apiClient.get(`${API_URL}/transaction/overview`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWeeklyTransaction = async (bookId: string) => {
  try {
    const response = await apiClient.get(
      `${API_URL}/caluculation/book/${bookId}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
