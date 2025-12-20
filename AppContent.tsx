import { useEffect, useState } from 'react';
import { useAuth } from './src/context/AuthContext';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { focusManager } from 'react-query';
import LoadingScreen from './src/components/LoadingScreen';
import ThemeProvider from './src/context/ThemeProvider';
import { NavigationContainer } from '@react-navigation/native';
import { ThemedRoot } from './ThemedRoot';
import { getItem } from './src/assets/storage';

const onAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
};

export function AppContent() {
  const [splashFinished, setSplashFinished] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        await getItem('theme');
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setThemeLoaded(true);
      }
    };
    loadTheme();
  }, []);

  if (!splashFinished || !themeLoaded) {
    return <LoadingScreen onFinish={() => setSplashFinished(true)} />;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <ThemedRoot />
      </NavigationContainer>
    </ThemeProvider>
  );
}
