import { API_URL } from "../utils/helper";
import { CategoryFormData } from "../utils/types";
import apiClient from "./apiCLient";


export const createCategory = async (book: CategoryFormData) => {
    try {
        const response = await apiClient.post(
            `${API_URL}/category`,
            book,
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCategory = async () => {
    try {
        const response = await apiClient.get(`${API_URL}/category`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const response = await apiClient.delete(`${API_URL}/category/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};