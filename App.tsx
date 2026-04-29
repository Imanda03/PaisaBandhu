import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { triggerLogout } from './src/services/authCallback';
import { AppContent } from './AppContent';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 2;
      },
      onError: async (error: any) => {
        if (error?.response?.status === 401) {
          await triggerLogout();
        }
      },
    },
    mutations: {
      onError: async (error: any) => {
        if (error?.response?.status === 401) {
          await triggerLogout();
        }
      },
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
