import { useMutation, useQuery, useQueryClient } from "react-query";
import { useToast } from "../context/ToastContext";
import { useModal } from "../context/ModalContext";
import { AxiosError } from "axios";
import { ApiError, transactionDataProps } from "../utils/types";
import { createTransaction, updateTransaction, deleteTransaction, getBalanceTransaction, getBookTransaction, getLatestTransaction, getWeeklyTransaction, getTransactionOverview } from "../services/TransactionService";

export const useCreateTransaction = (setError: any) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { showModal } = useModal();

    return useMutation<any, AxiosError<ApiError>, transactionDataProps>(
        async (transaction) => createTransaction(transaction),
        {
            onSuccess: async (response, variables: any) => {
                showToast("Transaction created successfully", "success");
                
                // Show challenge warnings if any
                if (response?.challengeWarnings && response.challengeWarnings.length > 0) {
                    const warnings = response.challengeWarnings;
                    const errorWarnings = warnings.filter((w: any) => w.severity === 'error');
                    const warningWarnings = warnings.filter((w: any) => w.severity === 'warning');
                    
                    // Show error warnings first
                    if (errorWarnings.length > 0) {
                        const messages = errorWarnings.map((w: any) => `• ${w.message}`).join('\n\n');
                        showModal({
                            title: '⚠️ Challenge Alert',
                            message: `This transaction affects your challenges:\n\n${messages}`,
                            type: 'error',
                        });
                    } else if (warningWarnings.length > 0) {
                        const messages = warningWarnings.map((w: any) => `• ${w.message}`).join('\n\n');
                        showModal({
                            title: 'Challenge Warning',
                            message: `This transaction affects your challenges:\n\n${messages}`,
                            type: 'warning',
                        });
                    }
                }
                
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ['TransactionList'] }),
                    queryClient.invalidateQueries({ queryKey: ['BookTransactionList'] }),
                    queryClient.invalidateQueries({ queryKey: ['LatestTransactionList'] }),
                    queryClient.invalidateQueries({ queryKey: ['ChartTransaction'] }),
                    queryClient.invalidateQueries({ queryKey: ['TransactionOverview'] }),
                    queryClient.invalidateQueries({ queryKey: ['WeeklyTransactionList'] }),
                    // Invalidate challenge queries to refresh progress
                    queryClient.invalidateQueries({ queryKey: ['Challenges'] }),
                    queryClient.invalidateQueries({ queryKey: ['ChallengeProgress'] }),
                    queryClient.invalidateQueries({ queryKey: ['ChallengeLeaderboard'] })
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

export const useUpdateTransaction = (setError: any) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { showModal } = useModal();

  return useMutation<any, AxiosError<ApiError>, { id: string; data: Partial<transactionDataProps> }>(
    async ({ id, data }) => updateTransaction(id, data),
    {
      onSuccess: async (response, variables) => {
        showToast('Transaction updated successfully', 'success');
        if (response?.challengeWarnings && response.challengeWarnings.length > 0) {
          const warnings = response.challengeWarnings;
          const errorWarnings = warnings.filter((w: any) => w.severity === 'error');
          const warningWarnings = warnings.filter((w: any) => w.severity === 'warning');
          if (errorWarnings.length > 0) {
            const messages = errorWarnings.map((w: any) => `• ${w.message}`).join('\n\n');
            showModal({ title: '⚠️ Challenge Alert', message: `This transaction affects your challenges:\n\n${messages}`, type: 'error' });
          } else if (warningWarnings.length > 0) {
            const messages = warningWarnings.map((w: any) => `• ${w.message}`).join('\n\n');
            showModal({ title: 'Challenge Warning', message: `This transaction affects your challenges:\n\n${messages}`, type: 'warning' });
          }
        }
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['TransactionList'] }),
          queryClient.invalidateQueries({ queryKey: ['BookTransactionList'] }),
          queryClient.invalidateQueries({ queryKey: ['LatestTransactionList'] }),
          queryClient.invalidateQueries({ queryKey: ['ChartTransaction'] }),
          queryClient.invalidateQueries({ queryKey: ['TransactionOverview'] }),
          queryClient.invalidateQueries({ queryKey: ['WeeklyTransactionList'] }),
          queryClient.invalidateQueries({ queryKey: ['Challenges'] }),
          queryClient.invalidateQueries({ queryKey: ['ChallengeProgress'] }),
          queryClient.invalidateQueries({ queryKey: ['ChallengeLeaderboard'] }),
        ]);
      },
      onError: (error: any) => {
        if (error?.response?.data?.errors) {
          const backendErrors = error.response.data.errors;
          backendErrors.forEach(({ field, message }: any) => {
            field && setError(field as any, { type: 'manual', message });
          });
          showToast('Please check the form for errors', 'error');
        } else {
          showToast(error.response?.data?.message || 'Failed to update transaction', 'error');
        }
      },
    }
  );
};

export const useFetchTransaction = (bookId: string) => {
    return useQuery(
        ['TransactionList', bookId],
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

export const useFetchChartTransaction = (params?: {
    startDate?: string;
    endDate?: string;
}) => {
    return useQuery(
        ['ChartTransaction', params?.startDate, params?.endDate],
        () => getBalanceTransaction(params),
        {
            onError: (error) => {
                console.error('Failed to fetch chart details:', error);
            },
        }
    )
}

export const useFetchTransactionOverview = () => {
    return useQuery(
        ['TransactionOverview'],
        () => getTransactionOverview(),
        {
            onError: (error) => {
                console.error('Failed to fetch transaction overview:', error);
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
                    queryClient.invalidateQueries({ queryKey: ['TransactionList'] }),
                    queryClient.invalidateQueries({ queryKey: ['BookTransactionList'] }),
                    queryClient.invalidateQueries({ queryKey: ['LatestTransactionList'] }),
                    queryClient.invalidateQueries({ queryKey: ['ChartTransaction'] }),
                    queryClient.invalidateQueries({ queryKey: ['TransactionOverview'] }),
                    queryClient.invalidateQueries({ queryKey: ['WeeklyTransactionList'] })
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
        ['WeeklyTransactionList', bookId],
        () => getWeeklyTransaction(bookId),
        {
            onError: (error) => {
                console.error('Failed to fetch weekly transaction:', error);
            },
        }
    )
}
