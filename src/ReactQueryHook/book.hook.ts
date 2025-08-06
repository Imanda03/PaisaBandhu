import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ApiError, BookInterfaceProps } from "../utils/types";
import { createFinancialBook, deleteFinancialBook, getFinancialBook, updateFinancialBook } from "../services/BookService";
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
    return useQuery(
        ['BookTransactionList'],
        () => getFinancialBook(),
        {
            onError: (error) => {
                console.error('Failed to fetch financial book:', error);
            },
        }
    )
}

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


export const useDeleteFinancialBook = (title: string) => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation<void, AxiosError<ApiError>, any>(
        async (id) => {
            console.log("first", id)
            return deleteFinancialBook(id);
        },
        {
            onSuccess: async (_response,) => {
                showToast(`${title} book deleted successfully`, 'success');
                await queryClient.invalidateQueries({
                    queryKey: ['BookTransactionList'],
                });
            },
        }
    );
};