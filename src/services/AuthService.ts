import axios from "axios";
import { ApiError, currentUserPayload } from "../utils/types";
import { API_URL } from "../utils/helper";
import apiClient from "./apiCLient";

export const sendOtp = async (email: string) => {
    const response = await axios.post(
        `${API_URL}/auth/send-otp`,
        { email: email.trim().toLowerCase() },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    );
    return response.data;
};

export const verifyOtp = async (email: string, code: string) => {
    const response = await axios.post(
        `${API_URL}/auth/verify-otp`,
        { email: email.trim().toLowerCase(), code: code.replace(/\s/g, '') },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    );
    return response.data;
};

export const completeProfile = async (data: {
    registrationToken: string;
    fullName: string;
    phoneNumber: string;
}) => {
    const response = await axios.post(
        `${API_URL}/auth/complete-profile`,
        data,
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    );
    return response.data;
};

export const logoutUser = async () => {
    try {
        const response = await apiClient.post('/auth/signout', {}, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.log('signout error:', error);
        throw error;
    }
};

export const currentUser = async () => {
    try {
        const response = await apiClient.get('/auth/currentUser');

        return response.data;
    } catch (error) {
        console.log('Current User error:', error);
        throw error;
    }
};

export const updateProfile = async (data: currentUserPayload) => {
    try {
        const response = await axios.put(`${API_URL}/auth/`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
