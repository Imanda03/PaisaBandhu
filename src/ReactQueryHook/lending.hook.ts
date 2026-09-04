import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AxiosError } from 'axios';
import { useToast } from '../context/ToastContext';
import { ApiError } from '../utils/types';
import {
  lendingService,
  Lending,
  LendingFilters,
  LendingType,
} from '../services/LendingService';

export const useLendings = (filters?: LendingFilters) =>
  useQuery(['lendings', filters], () => lendingService.getLendings(filters), {
    onError: (error: unknown) => {
      console.error('Failed to fetch lendings:', error);
    },
  });

export const useLending = (id?: string) =>
  useQuery(
    ['lendings', id],
    () => lendingService.getLending(id as string),
    {
      enabled: !!id,
      onError: (error: unknown) => {
        console.error('Failed to fetch lending:', error);
      },
    },
  );

export const useCreateLending = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  return useMutation<
    Lending | null,
    AxiosError<ApiError>,
    {
      type: LendingType;
      personName: string;
      personContact?: string;
      amount: number;
      description?: string;
      date: Date;
      dueDate?: Date;
    }
  >((data) => lendingService.createLending(data), {
    onSuccess: async () => {
      showToast('Lending record created', 'success');
      await queryClient.invalidateQueries(['lendings']);
    },
    onError: () => showToast('Failed to create lending record', 'error'),
  });
};

export const useUpdateLending = (id: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  return useMutation(
    (data: Parameters<typeof lendingService.updateLending>[1]) =>
      lendingService.updateLending(id, data),
    {
      onSuccess: async () => {
        showToast('Lending updated', 'success');
        await queryClient.invalidateQueries(['lendings']);
        await queryClient.invalidateQueries(['lendings', id]);
      },
      onError: () => showToast('Failed to update lending', 'error'),
    },
  );
};

export const useRecordPayment = (id: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  return useMutation(
    (data: { amount: number; note?: string; date?: Date }) =>
      lendingService.recordPayment(id, data),
    {
      onSuccess: async () => {
        showToast('Payment recorded', 'success');
        await queryClient.invalidateQueries(['lendings']);
        await queryClient.invalidateQueries(['lendings', id]);
      },
      onError: () => showToast('Failed to record payment', 'error'),
    },
  );
};

export const useSettleLending = (id: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  return useMutation(() => lendingService.settleLending(id), {
    onSuccess: async () => {
      showToast('Marked as settled', 'success');
      await queryClient.invalidateQueries(['lendings']);
      await queryClient.invalidateQueries(['lendings', id]);
    },
    onError: () => showToast('Failed to settle lending', 'error'),
  });
};

export const useDeleteLending = (id: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  return useMutation(() => lendingService.deleteLending(id), {
    onSuccess: async () => {
      showToast('Lending deleted', 'success');
      await queryClient.invalidateQueries(['lendings']);
    },
    onError: () => showToast('Failed to delete lending', 'error'),
  });
};

export const useUpdatePayment = (lendingId: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  return useMutation(
    ({
      paymentIndex,
      data,
    }: {
      paymentIndex: number;
      data: { amount?: number; note?: string; date?: Date };
    }) => lendingService.updatePayment(lendingId, paymentIndex, data),
    {
      onSuccess: async () => {
        showToast('Payment updated', 'success');
        await queryClient.invalidateQueries(['lendings']);
        await queryClient.invalidateQueries(['lendings', lendingId]);
      },
      onError: () => showToast('Failed to update payment', 'error'),
    },
  );
};

export const useDeletePayment = (lendingId: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  return useMutation(
    (paymentIndex: number) =>
      lendingService.deletePayment(lendingId, paymentIndex),
    {
      onSuccess: async () => {
        showToast('Payment removed', 'success');
        await queryClient.invalidateQueries(['lendings']);
        await queryClient.invalidateQueries(['lendings', lendingId]);
      },
      onError: () => showToast('Failed to delete payment', 'error'),
    },
  );
};
