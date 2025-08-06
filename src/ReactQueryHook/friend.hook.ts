import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ApiError, FriendFormData } from "../utils/types";
import { createFriend, deleteFriend, getFriends } from "../services/FriendService";
import { useToast } from "../context/ToastContext";


export const useFetchFriend = (bookId: string) => {
    return useQuery(
        ['FriendList'],
        () => getFriends(bookId),
        {
            enabled: !!bookId,
            // refetchOnWindowFocus: true,
            // refetchInterval: 1000,
            // staleTime: 5000,
            // cacheTime: 10000,
            onError: (error) => {
                console.error('Failed to fetch book transactions:', error);
            },
        }
    );
};


export const useCreateFriend = () => {
    const queryClient = useQueryClient();

    return useMutation<any, AxiosError<ApiError>, FriendFormData>(
        async (friend) => createFriend(friend),
        {
            onSuccess: async (response, variables: any) => {
                // Invalidate queries with the specific bookId
                await queryClient.invalidateQueries({
                    queryKey: ['FriendList'],
                });

            },
        }
    );
};

export const useDeleteFriend = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation<void, AxiosError<ApiError>, string>(
        async (friendId: string) => {
            return deleteFriend(friendId);
        },
        {
            onSuccess: async (_response, _friendId) => {

                await queryClient.invalidateQueries({
                    queryKey: ['FriendList'],
                });

            },
            onError: (error: AxiosError<ApiError>) => {
                if (error?.response?.data?.errors) {
                    if (error.response.data.errors?.length === 1) {
                        showToast(error.response.data.errors?.[0]?.message, 'error');
                    } else {
                        showToast('Please check the form for errors', 'error');
                    }
                } else {
                    const errorMessage =
                        error.response?.data?.message ||
                        'Friend created failed. Please try again.';
                    showToast(errorMessage, 'error');
                }
            },
        }
    );
};