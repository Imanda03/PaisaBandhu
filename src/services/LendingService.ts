import apiClient from './apiCLient';

export type LendingType = 'lent' | 'borrowed';
export type LendingStatus = 'pending' | 'partially_paid' | 'settled';

export interface LendingPayment {
  amount: number;
  date: Date | string;
  note?: string;
}

export interface Lending {
  id: string;
  userId: string;
  type: LendingType;
  personName: string;
  personContact?: string;
  amount: number;
  description?: string;
  date: Date | string;
  dueDate?: Date | string;
  status: LendingStatus;
  payments: LendingPayment[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LendingFilters {
  status?: LendingStatus;
  type?: LendingType;
}

function mapLending(raw: Record<string, unknown>): Lending {
  const r = raw as unknown as Lending;
  return {
    ...r,
    date: new Date(raw.date as string),
    dueDate: raw.dueDate ? new Date(raw.dueDate as string) : undefined,
    createdAt: new Date(raw.createdAt as string),
    updatedAt: new Date(raw.updatedAt as string),
    payments: ((raw.payments as LendingPayment[]) || []).map(p => ({
      ...p,
      date: new Date(p.date),
    })),
  };
}

class LendingService {
  async getLendings(filters?: LendingFilters): Promise<Lending[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    const qs = params.toString();
    const response = await apiClient.get(
      `/lending${qs ? `?${qs}` : ''}`,
    );
    if (response.data.success) {
      return (response.data.data.lendings as Record<string, unknown>[]).map(
        mapLending,
      );
    }
    return [];
  }

  async getLending(id: string): Promise<Lending | null> {
    const response = await apiClient.get(`/lending/${id}`);
    if (response.data.success) {
      return mapLending(response.data.data.lending);
    }
    return null;
  }

  async createLending(data: {
    type: LendingType;
    personName: string;
    personContact?: string;
    amount: number;
    description?: string;
    date: Date;
    dueDate?: Date;
  }): Promise<Lending | null> {
    const response = await apiClient.post('/lending', {
      ...data,
      date: data.date.toISOString(),
      dueDate: data.dueDate?.toISOString(),
    });
    if (response.data.success) {
      return mapLending(response.data.data.lending);
    }
    return null;
  }

  async updateLending(
    id: string,
    data: Partial<{
      type: LendingType;
      personName: string;
      personContact: string;
      amount: number;
      description: string;
      date: Date;
      dueDate: Date | null;
    }>,
  ): Promise<Lending | null> {
    const payload: Record<string, unknown> = { ...data };
    if (data.date) payload.date = data.date.toISOString();
    if (data.dueDate) payload.dueDate = data.dueDate.toISOString();
    const response = await apiClient.patch(`/lending/${id}`, payload);
    if (response.data.success) {
      return mapLending(response.data.data.lending);
    }
    return null;
  }

  async deleteLending(id: string): Promise<boolean> {
    const response = await apiClient.delete(`/lending/${id}`);
    return response.data.success === true;
  }

  async recordPayment(
    id: string,
    data: { amount: number; note?: string; date?: Date },
  ): Promise<Lending | null> {
    const response = await apiClient.post(`/lending/${id}/payment`, {
      ...data,
      date: data.date?.toISOString(),
    });
    if (response.data.success) {
      return mapLending(response.data.data.lending);
    }
    return null;
  }

  async settleLending(id: string): Promise<Lending | null> {
    const response = await apiClient.patch(`/lending/${id}/settle`);
    if (response.data.success) {
      return mapLending(response.data.data.lending);
    }
    return null;
  }

  async updatePayment(
    lendingId: string,
    paymentIndex: number,
    data: { amount?: number; note?: string; date?: Date },
  ): Promise<Lending | null> {
    const response = await apiClient.patch(
      `/lending/${lendingId}/payments/${paymentIndex}`,
      {
        ...data,
        date: data.date?.toISOString(),
      },
    );
    if (response.data.success) {
      return mapLending(response.data.data.lending);
    }
    return null;
  }

  async deletePayment(
    lendingId: string,
    paymentIndex: number,
  ): Promise<Lending | null> {
    const response = await apiClient.delete(
      `/lending/${lendingId}/payments/${paymentIndex}`,
    );
    if (response.data.success) {
      return mapLending(response.data.data.lending);
    }
    return null;
  }
}

export const lendingService = new LendingService();
