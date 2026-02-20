import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ApiError, BookInterfaceProps } from "../utils/types";
import { createFinancialBook, deleteFinancialBook, getFinancialBook, shareBook, updateFinancialBook } from "../services/BookService";
import { useToast } from "../context/ToastContext";

export const useCreateFinancialBook = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast()
    return useMutation<any, AxiosError<ApiError>, BookInterfaceProps>(
        async (book) => createFinancialBook(book),
        {
            onSuccess: async (response, variables: any) => {
                showToast("Book created successfully", "success");
                await queryClient.invalidateQueries({
                    queryKey: ['BookTransactionList'],
                    exact: true
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
                        'Book created failed. Please try again.';
                    showToast(errorMessage, 'error');
                }
            },
        }
    );
};


export const useFetchFinancialBook = () => {
    const { showToast } = useToast();
    return useQuery(
        ['BookTransactionList'],
        () => getFinancialBook(),
        {
            retry: (failureCount, error: any) => {
                if (error?.response?.status === 429) return failureCount < 2;
                return failureCount < 2;
            },
            retryDelay: (attemptIndex, error: any) =>
                error?.response?.status === 429
                    ? Math.min(2000 * Math.pow(2, attemptIndex), 10000)
                    : 1000 * (attemptIndex + 1),
            onError: (error: any) => {
                console.error('Failed to fetch financial book:', error);
                if (error?.response?.status === 429) {
                    showToast('Too many requests. Please try again in a moment.', 'error');
                }
            },
        }
    );
};

export const useUpdateFinancialBook = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast()

    return useMutation<any, AxiosError<ApiError>, BookInterfaceProps>(
        async (book) => {
            const { id, ...data } = book;
            if (id) {
                return updateFinancialBook(id, data);
            }
        },
        {
            onSuccess: async (data) => {
                await queryClient.invalidateQueries({ queryKey: ["BookTransactionList",], exact: true, });
                queryClient.refetchQueries(['BookTransactionBalance', data.bookId]);
                showToast("Book updated successfully", "success");
            },
            onError: (error: any) => {
                showToast("Failed to update book", "error");
            },
        }
    );
}


export const useShareBook = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    return useMutation<any, AxiosError<ApiError>, { bookId: string; email: string }>(
        async ({ bookId, email }) => shareBook(bookId, email),
        {
            onSuccess: () => {
                showToast('Book shared successfully', 'success');
                queryClient.invalidateQueries({ queryKey: ['BookTransactionList'] });
            },
            onError: (error: any) => {
                const msg = error?.response?.data?.message || 'Failed to share book';
                showToast(msg, 'error');
            },
        }
    );
};

export const useDeleteFinancialBook = (title: string) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation<void, AxiosError<ApiError>, { id: string; force?: boolean }>(
        async ({ id, force = false }) => {
            if (!id) {
                throw new Error('Book ID is required');
            }
            return deleteFinancialBook(id, force);
        },
        {
            onSuccess: async (_response,) => {
                showToast(`${title} book deleted successfully`, 'success');
                await queryClient.invalidateQueries({
                    queryKey: ['BookTransactionList'],
                });
            },
            onError: (error: AxiosError<ApiError>) => {
                console.error('Delete book error:', error);
                if (error?.response?.data?.errors) {
                    if (error.response.data.errors?.length === 1) {
                        showToast(error.response.data.errors?.[0]?.message, 'error');
                    } else {
                        showToast('Please check the form for errors', 'error');
                    }
                } else {
                    const errorMessage =
                        error.response?.data?.message ||
                        'Failed to delete book. Please try again.';
                    showToast(errorMessage, 'error');
                }
            },
        }
    );
};