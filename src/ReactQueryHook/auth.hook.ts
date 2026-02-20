import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ApiError, currentUserPayload } from "../utils/types";
import { currentUser, logoutUser, sendOtp, verifyOtp, completeProfile, updateProfile } from "../services/AuthService";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const getErrorMessage = (error: AxiosError<ApiError>): string => {
    const data = error?.response?.data;
    if (data?.errors?.length) {
        return data.errors[0].message || "Something went wrong";
    }
    return (data as any)?.message || "Something went wrong";
};

export const useSendOtp = (onSuccess?: () => void, onError?: (msg: string) => void) => {
    return useMutation<any, AxiosError<ApiError>, string>(
        (email) => sendOtp(email),
        {
            onSuccess: () => onSuccess?.(),
            onError: (error) => onError?.(getErrorMessage(error)),
        }
    );
};

export const useVerifyOtp = (onSuccess?: (res: any) => void, onError?: (msg: string) => void) => {
    return useMutation<any, AxiosError<ApiError>, { email: string; code: string }>(
        ({ email, code }) => verifyOtp(email, code),
        {
            onSuccess: (res) => onSuccess?.(res),
            onError: (error) => onError?.(getErrorMessage(error)),
        }
    );
};

export const useCompleteProfile = (onSuccess?: (res: any) => void, onError?: (msg: string) => void) => {
    return useMutation<any, AxiosError<ApiError>, { registrationToken: string; fullName: string; phoneNumber: string }>(
        (data) => completeProfile(data),
        {
            onSuccess: (res) => onSuccess?.(res),
            onError: (error) => onError?.(getErrorMessage(error)),
        }
    );
};

export const useUserLogout = () => {
    const { showToast } = useToast();
    const { logout } = useAuth();
    return useMutation<any, AxiosError<ApiError>>(async () => logoutUser(), {
        onSuccess: async (data: any) => {
            logout();
            showToast(data.message || "Logout successful!", "success");
        },
        onError: (error: AxiosError<ApiError>) => {
            showToast(getErrorMessage(error), "error");
        },
    });
};

export const useFetchUserDetails = () => {
    const { showToast } = useToast();
    return useQuery(
        ["ProfileDetails"],
        () => currentUser(),
        {
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
            retry: (failureCount, error: any) => {
                if (error?.response?.status === 429) return failureCount < 2;
                return failureCount < 2;
            },
            retryDelay: (attemptIndex, error: any) => {
                if (error?.response?.status === 429) {
                    return Math.min(2000 * Math.pow(2, attemptIndex), 10000);
                }
                return 1000 * (attemptIndex + 1);
            },
            onError: (error: any) => {
                if (error?.response?.status === 429) {
                    showToast("Too many requests. Please try again in a moment.", "error");
                }
            },
        }
    );
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation<any, AxiosError<ApiError>, currentUserPayload>(
        (data) => updateProfile(data),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ["ProfileDetails"], exact: true });
            },
        }
    );
};
