import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";
import { ApiError, currentUserPayload, LoginData, userDataProps } from "../utils/types";
import { API_URL } from "../utils/helper";
import apiClient from "./apiCLient";

export const registerUser = async (registerData: userDataProps) => {
    try {
        const response = await axios.post(
            `${API_URL}/auth/register`,
            registerData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log('Registration error:', error);
        throw error;
    }
};


export const loginUser = async (loginData: LoginData) => {
    const response = await axios.post(
        `${API_URL}/auth/login`,
        loginData,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    const cookies = response.headers['set-cookie'];
    if (cookies) {
        const sessionCookie = cookies.find(cookie =>
            cookie.startsWith('session='),
        );
        if (sessionCookie) {
            const cookieValue = decodeURIComponent(
                sessionCookie.split(';')[0].split('=')[1],
            );
            return {
                token: cookieValue,
                data: response.data,
            };
        }
    }

    return {
        token: null,
        data: response.data,
    };
};

export const logoutUser = async () => {
    try {
        const response = await apiClient.post(`${API_URL}/auth/signout`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error) {
        console.log('signout error:', error);
        throw error;
    }
}

export const currentUser = async () => {
    try {
        const response = await apiClient.get(`${API_URL}/auth/currentUser`,);

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
