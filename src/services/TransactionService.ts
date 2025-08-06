import { API_URL } from "../utils/helper";
import { transactionDataProps } from "../utils/types";
import apiClient from "./apiCLient";


export const createTransaction = async (data: transactionDataProps) => {
    try {
        const response = await apiClient.post(
            `${API_URL}/transaction/`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getBookTransaction = async (bookId: string) => {

    try {
        const res = await apiClient.get(`${API_URL}/caluculation/book/${bookId}`)
        console.log("res", res)
        const response = await apiClient.get(`${API_URL}/transaction/book/${bookId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTransaction = async (id: string) => {
    console.log("delete id", id)
    try {
        const response = await apiClient.delete(
            `${API_URL}/transaction/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getLatestTransaction = async () => {
    try {
        const response = await apiClient.get(
            `${API_URL}/transaction/latest`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBalanceTransaction = async () => {
    try {
        const response = await apiClient.get(
            `${API_URL}/transaction/totalBalance`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getWeeklyTransaction = async (bookId: string) => {
    try {
        const response = await apiClient.get(`${API_URL}/caluculation/book/${bookId}`)
        return response.data;
    } catch (error) {
        throw error;
    }
}