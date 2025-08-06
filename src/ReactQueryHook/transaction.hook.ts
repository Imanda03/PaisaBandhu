import { useMutation, useQuery, useQueryClient } from "react-query";
import { useToast } from "../context/ToastContext";
import { AxiosError } from "axios";
import { ApiError, transactionDataProps } from "../utils/types";
import { createTransaction, deleteTransaction, getBalanceTransaction, getBookTransaction, getLatestTransaction, getWeeklyTransaction } from "../services/TransactionService";

export const useCreateTransaction = (setError: any) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation<any, AxiosError<ApiError>, transactionDataProps>(
        async (transaction) => createTransaction(transaction),
        {
            onSuccess: async (response, variables: any) => {
                showToast("Transaction created successfully", "success");
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ['TransactionList'], exact: true }),
                    queryClient.invalidateQueries({ queryKey: ['BookTransactionList'], exact: true }),
                    queryClient.invalidateQueries({ queryKey: ['LatestTransactionList'], exact: true }),
                    queryClient.invalidateQueries({ queryKey: ['ChartTransaction'], exact: true })
                ]);

            },
            onError: (error: any) => {
                if (error?.response?.data?.errors) {
                    const backendErrors = error.response.data.errors;
                    backendErrors.forEach(({ field, message }: any) => {
                        field &&
                            setError(field as keyof FormData, {
                                type: 'manual',
                                message,
                            });
                    });
                    showToast('Please check the form for errors', 'error');
                } else {
                    showToast(
                        error.response?.data?.message || 'Failed to create category',
                        'error',
                    );
                }
            },
        }
    );
};

export const useFetchTransaction = (bookId: string) => {
    return useQuery(
        ['TransactionList'],
        () => getBookTransaction(bookId),
        {
            onError: (error) => {
                console.error('Failed to fetch transaction:', error);
            },
        }
    )
}

export const useFetchLatestTransaction = () => {
    return useQuery(
        ['LatestTransactionList'],
        () => getLatestTransaction(),
        {
            onError: (error) => {
                console.error('Failed to fetch latest transaction:', error);
            },
        }
    )
}

export const useFetchChartTransaction = () => {
    return useQuery(
        ['ChartTransaction'],
        () => getBalanceTransaction(),
        {
            onError: (error) => {
                console.error('Failed to fetch chart details:', error);
            },
        }
    )
}



export const useDeleteTransactionBook = (title: string) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation<void, AxiosError<ApiError>, any>(
        async (id) => {
            return deleteTransaction(id);
        },
        {
            onSuccess: async (_response,) => {
                showToast(`${title} deleted successfully`, 'success');
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ['TransactionList'], exact: true }),
                    queryClient.invalidateQueries({ queryKey: ['BookTransactionList'], exact: true }),
                    queryClient.invalidateQueries({ queryKey: ['LatestTransactionList'], exact: true }),
                    queryClient.invalidateQueries({ queryKey: ['ChartTransaction'], exact: true })
                ])
            },
            onError: (error) => {
                if (error?.response?.data?.errors) {
                    if (error.response.data.errors?.length === 1) {
                        showToast(error.response.data.errors?.[0]?.message, 'error');
                    } else {
                        showToast('Please check the form for errors', 'error');
                    }
                } else {
                    const errorMessage =
                        error.response?.data?.message ||
                        'Category created failed. Please try again.';
                    showToast(errorMessage, 'error');
                }
            },
        }
    );
};


export const useFetchWeeklyTransaction = (bookId: string) => {
    return useQuery(
        ['LatestTransactionList'],
        () => getWeeklyTransaction(bookId),
        {
            onError: (error) => {
                console.error('Failed to fetch latest transaction:', error);
            },
        }
    )
}
