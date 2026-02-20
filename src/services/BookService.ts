import { API_URL } from "../utils/helper";
import { BookInterfaceProps } from "../utils/types";
import apiClient from "./apiCLient";

export const createFinancialBook = async (book: BookInterfaceProps) => {
    try {
        const response = await apiClient.post(
            `${API_URL}/book`,
            book,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getFinancialBook = async () => {
    try {
        const response = await apiClient.get(`${API_URL}/book`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateFinancialBook = async (id: string, data: Partial<BookInterfaceProps>) => {
    try {
        const response = await apiClient.put(`${API_URL}/book/${id}`, data)
        return response.data
    } catch (error) {
        throw error;
    }
}

export const shareBook = async (bookId: string, email: string) => {
    try {
        const response = await apiClient.post(`${API_URL}/book/${bookId}/share`, {
            email: email.trim(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteFinancialBook = async (id: string, force: boolean = false) => {
    try {
        const response = await apiClient.delete(
            `${API_URL}/book/${id}`,
            {
                data: { force }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}