import { StatusBar, StyleSheet, View } from 'react-native';
import { useTheme } from './src/utils/colors';
import { ToastProvider } from './src/context/ToastContext';
import { ModalProvider } from './src/context/ModalContext';
import RootStack from './src/RouteNavigation';

export function ThemedRoot() {
  const { theme } = useTheme();

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
        </ModalProvider>
      </ToastProvider>
    </>
  );
}
