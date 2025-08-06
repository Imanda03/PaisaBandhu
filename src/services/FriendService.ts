import { API_URL } from "../utils/helper";
import { FriendFormData } from "../utils/types";
import apiClient from "./apiCLient";

export const createFriend = async (data: FriendFormData) => {
    try {
        const response = await apiClient.post(
            `${API_URL}/friend/create`,
            data,
        );
        return response.data;
    } catch (error) {
        console.log("eror", error)
        throw error;
    }
}

export const getFriends = async (bookId: string) => {
    try {
        const response = await apiClient.get(`${API_URL}/friend/${bookId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteFriend = async (id: string) => {
    try {
        const response = await apiClient.delete(
            `${API_URL}/friend/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};