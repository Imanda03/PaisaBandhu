import { StatusBar, StyleSheet, View } from 'react-native';
import { useTheme } from './src/utils/colors';
import { ToastProvider } from './src/context/ToastContext';
import { ModalProvider } from './src/context/ModalContext';
import { NetworkProvider, useNetwork } from './src/context/NetworkContext';
import OfflineBanner from './src/components/OfflineBanner';
import RootStack from './src/RouteNavigation';

function ThemedRootContent() {
  const { theme } = useTheme();
  const { isConnected } = useNetwork();

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
