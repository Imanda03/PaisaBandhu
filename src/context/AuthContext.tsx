import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, useQueryClient } from 'react-query';
import { registerLogoutCallback } from '../services/authCallback';

const SESSION_KEYS = {
  JWT: 'sessionJwt',
  LOGIN_AT: 'loginTimestamp',
} as const;

const SESSION_MAX_DAYS = 30;

interface AuthContextType {
    authToken: string | null;
    userId: string | null;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

export const clearAuth = async (queryClient: QueryClient) => {
    try {
        await AsyncStorage.multiRemove([SESSION_KEYS.JWT, SESSION_KEYS.LOGIN_AT]);
        queryClient.clear();
    } catch (error) {
        console.error('Error clearing auth state:', error);
    }
};

const isSessionExpired = (loginTimestamp: number): boolean => {
    const now = Date.now();
    const diffDays = (now - loginTimestamp) / (1000 * 60 * 60 * 24);
    return diffDays >= SESSION_MAX_DAYS;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();



    const performLogout = useCallback(async () => {
        try {
            await clearAuth(queryClient);
            setAuthToken(null);
            setUserId(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }, [queryClient]);

    // Register logout callback for apiClient (401/400 handling)
    useEffect(() => {
        registerLogoutCallback(performLogout);
    }, [performLogout]);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem(SESSION_KEYS.JWT);
                const loginAt = await AsyncStorage.getItem(SESSION_KEYS.LOGIN_AT);

                if (token) {
                    if (loginAt) {
                        const ts = parseInt(loginAt, 10);
                        if (!isNaN(ts) && isSessionExpired(ts)) {
                            await performLogout();
                            return;
                        }
                    } else {
                        await AsyncStorage.setItem(SESSION_KEYS.LOGIN_AT, String(Date.now()));
                    }
                    setAuthToken(token);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                await performLogout();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [performLogout]);

    // Watch for token removal
    useEffect(() => {
        if (!authToken) {
            queryClient.clear();
        }
    }, [authToken, queryClient]);

    const logout = async () => {
        if (!authToken) {
            return;
        }
        await performLogout();
    };

    const login = async (token: string) => {
        try {
            await AsyncStorage.setItem(SESSION_KEYS.JWT, token);
            await AsyncStorage.setItem(SESSION_KEYS.LOGIN_AT, String(Date.now()));
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