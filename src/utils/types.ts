export interface userDataProps {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

export interface ApiError {
    message: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}

export interface LoginData {
    email: string;
    password: string;
}

export type UserDataProps = {
    fullName: string;
    email: string;
    phoneNumber: string;
};

export type BookInterfaceProps = {
    id?: string;
    title: string;
    type: 'single' | 'group';
    isShared?: boolean;
    ownerName?: string | null;
    transactionCount?: number;
}

export interface CategoryFormData {
    id?: string;
    title: string;
    icon: string;
    type: 'income' | 'expense';
}

export type transactionDataProps = {
    title: string;
    categoryId?: string;
    date: Date;
    description: string;
    type?: 'income' | 'expense';
    price: string;
    bookId: string;
    friendId?: string
};

export interface FriendFormData {
    id?: string,
    name: string,
    email: string,
    bookId: string | number;
}

export type currentUserPayload = {
    fullName: string;
    email: string;
    phoneNumber: number;
};