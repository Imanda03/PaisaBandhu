import { useMutation, useQuery, useQueryClient } from "react-query";
import { useToast } from "../context/ToastContext";
import { AxiosError } from "axios";
import { ApiError, CategoryFormData } from "../utils/types";
import { createCategory, getCategory, deleteCategory } from "../services/CategoryService";


export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation<any, AxiosError<ApiError>, CategoryFormData>(
        async (category) => createCategory(category),
        {
            onSuccess: async (response, variables: any) => {
                showToast("Category created successfully", "success");
                await queryClient.invalidateQueries({
                    queryKey: ['Category'],
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
                        'Category created failed. Please try again.';
                    showToast(errorMessage, 'error');
                }
            },
        }
    );
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation<any, AxiosError<ApiError>, string>(
        async (id) => deleteCategory(id),
        {
            onSuccess: async () => {
                showToast('Category deleted successfully', 'success');
                await queryClient.invalidateQueries({ queryKey: ['Category'], exact: true });
            },
            onError: (error: AxiosError<ApiError>) => {
                const msg = error.response?.data?.message || 'Failed to delete category';
                showToast(msg, 'error');
            },
        }
    );
};

export const useFetchCategories = () => {
    return useQuery(
        ['Category'],
        () => getCategory(),
        {
            onError: (error) => {
                console.error('Failed to fetch category:', error);
            },
        }
    )
}
