import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, useQueryClient } from 'react-query';

interface AuthContextType {
    authToken: string | null;
    userId: string | null;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}
export const clearAuth = async (queryClient: QueryClient) => {
    try {
        await AsyncStorage.removeItem('sessionJwt');
        queryClient.clear();
    } catch (error) {
        console.error('Error clearing auth state:', error);
    }
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();



    // Check auth status on mount and token changes
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('sessionJwt');
                if (token) {
                    setAuthToken(token);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                await logout();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Watch for token removal
    useEffect(() => {
        if (!authToken) {
            queryClient.clear();
        }
    }, [authToken, queryClient]);

    const logout = async () => {
        if (!authToken) {
            console.log('No user is currently logged in.');
            return;
        }

        try {
            await clearAuth(queryClient);
            setAuthToken(null);
            setUserId(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const login = async (token: string) => {
        try {
            await AsyncStorage.setItem('sessionJwt', token);
            setAuthToken(token);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };
    const authContextValue = useMemo(() => ({
        authToken,
        userId,
        login,
        logout,
        isLoading,
    }), [authToken, userId, isLoading]);
    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};