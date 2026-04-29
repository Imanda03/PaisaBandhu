import { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { queryClient } from './App';
import { APP_CONFIG_QUERY_KEY } from './src/ReactQueryHook/app-config.hook';
import { APP_VERSION } from './src/constants/appVersion';
import { useTheme } from './src/utils/colors';
import { ToastProvider } from './src/context/ToastContext';
import { ModalProvider } from './src/context/ModalContext';
import { NetworkProvider, useNetwork } from './src/context/NetworkContext';
import OfflineBanner from './src/components/OfflineBanner';
import RootStack from './src/RouteNavigation';
import AppUpdateModal from './src/components/AppUpdateModal';

function ThemedRootContent() {
  const { theme } = useTheme();
  const { isConnected } = useNetwork();

  // Ensure app config is fresh after splash (invalidate + refetch so the update modal is not stuck on stale cache).
  useEffect(() => {
    void queryClient.invalidateQueries([APP_CONFIG_QUERY_KEY, APP_VERSION]);
    void queryClient.refetchQueries([APP_CONFIG_QUERY_KEY, APP_VERSION]);
  }, []);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme.TEXT === '#ffffff' ? 'light-content' : 'light-content'}
      />
      <ToastProvider>
        <ModalProvider>
          <RootStack />
          <AppUpdateModal />
          {isConnected === false && <OfflineBanner />}
        </ModalProvider>
      </ToastProvider>
    </>
  );
}

export function ThemedRoot() {
  return (
    <NetworkProvider>
      <ThemedRootContent />
    </NetworkProvider>
  );
}

export default ThemedRoot;
