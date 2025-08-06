import { useEffect, useState } from "react";
import { useAuth } from "./src/context/AuthContext";
import { AppState, AppStateStatus, Platform } from "react-native";
import { focusManager } from "react-query";
import LoadingScreen from "./src/components/LoadingScreen";
import ThemeProvider from "./src/context/ThemeProvider";
import { NavigationContainer } from "@react-navigation/native";
import { ThemedRoot } from "./ThemedRoot";

const onAppStateChange = (status: AppStateStatus) => {
    if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
    }
};

export function AppContent() {
    const [splashFinished, setSplashFinished] = useState(false);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', onAppStateChange);
        return () => subscription.remove();
    }, []);

    if (!splashFinished) {
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
