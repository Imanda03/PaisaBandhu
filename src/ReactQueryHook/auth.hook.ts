import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ApiError, currentUserPayload, LoginData, userDataProps } from "../utils/types";
import { currentUser, loginUser, logoutUser, registerUser, updateProfile } from "../services/AuthService";
import { useToast } from "../context/ToastContext";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

export const useUserRegister = (setError: any) => {
    const { showToast } = useToast();
    const navigation: any = useNavigation()
    return useMutation<any, AxiosError<ApiError>, userDataProps>(
        async (registerData) => registerUser(registerData),
        {
            onSuccess: (response, variables) => {
                showToast(response.message, 'success');
                navigation.replace('SignIn');
            },
            onError: (error: AxiosError<ApiError>) => {
                if (error?.response?.data?.errors) {
                    if (error.response.data.errors?.length === 1) {
                        showToast(error.response.data.errors?.[0]?.message, 'error');
                    } else {
                        showToast('Please check the form for errors', 'error');
                    }
                    const backendErrors = error.response.data.errors;

                    backendErrors.forEach(({ field, message }: any) => {
                        console.log(`Setting error for field ${field}:`, message);
                        field &&
                            setError(field as keyof userDataProps, {
                                type: 'manual',
                                message,
                            });
                    });
                } else {
                    const errorMessage =
                        error.response?.data?.message ||
                        'Registration failed. Please try again.';
                    showToast(errorMessage, 'error');
                }
            },
        }
    );
};

export const useUserLogin = (setError: any) => {
    const { showToast } = useToast();
    const { login } = useAuth();

    return useMutation<any, AxiosError<ApiError>, LoginData>(
        async (data) => loginUser(data),
        {
            onSuccess: async ({ token, data }) => {
                if (token) {
                    await login(token);
                }
                showToast(data.message || 'Login successful!', 'success');
            },
            onError: (error: AxiosError<ApiError>) => {
                if (error?.response?.data?.errors) {
                    const backendErrors = error.response.data.errors;

                    if (backendErrors.length === 1) {
                        showToast(backendErrors[0].message, 'error');
                    } else {
                        showToast('Please check your credentials', 'error');
                    }

                    backendErrors.forEach(({ field, message }: any) => {
                        field &&
                            setError(field as keyof userDataProps, {
                                type: 'manual',
                                message,
                            });
                    });
                } else {
                    const errorMessage =
                        error.response?.data?.message ||
                        'Login failed. Please try again.';
                    showToast(errorMessage, 'error');
                }
            },
        }
    );
};

export const useUserLogout = () => {
    const { showToast } = useToast();
    const { logout } = useAuth()
    return useMutation<any, AxiosError<ApiError>>(async () => logoutUser(),
        {
            onSuccess: async (data: any) => {
                logout();
                showToast(data.message || 'Login successful!', 'success');
            },
            onError: (error: AxiosError<ApiError>) => {
                if (error?.response?.data?.errors) {
                    const backendErrors = error.response.data.errors;

                    if (backendErrors.length === 1) {
                        showToast(backendErrors[0].message, 'error');
                    } else {
                        showToast('Something Went Wrong', 'error');
                    }

                } else {
                    const errorMessage =
                        error.response?.data?.message ||
                        'Logout failed. Please try again.';
                    showToast(errorMessage, 'error');
                }
            },
        })
}

export const useFetchUserDetails = () => {
    return useQuery(
        ['ProfileDetails'],
        () => currentUser(),
        {
            staleTime: 0,
            cacheTime: 0,
            onError: (error) => {
                console.error('Failed to Current User:', error);
            },
        }
    )
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<any, AxiosError<ApiError>, currentUserPayload>(
        async (data) => {
            return updateProfile(data)
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ["ProfileDetails"], exact: true, });
            }
        }
    )
}