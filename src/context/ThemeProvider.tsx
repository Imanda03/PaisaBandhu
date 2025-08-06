import React, {
    createContext,
    JSX,
    PropsWithChildren,
    useEffect,
    useState,
} from 'react';
import { ActivityIndicator, useColorScheme } from 'react-native';
import { getItem, setItem } from '../assets/storage';
import LoadingScreen from '../components/LoadingScreen';

export type ThemeOptions = 'light' | 'dark';

export interface ThemeContextInterface {
    theme: ThemeOptions;
    setTheme: React.Dispatch<React.SetStateAction<ThemeOptions>>;
}

export const ThemeContext = createContext<ThemeContextInterface | undefined>(
    undefined,
);

const ThemeProvider: React.FC<PropsWithChildren> = ({
    children,
}): JSX.Element => {
    const [theme, setTheme] = useState<ThemeOptions>('dark');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch locally cached theme on mount
    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const localTheme = await getItem('theme');
                if (localTheme === 'dark' || localTheme === 'light') {
                    setTheme(localTheme);
                }
            } catch (error) {
                console.error('Error fetching theme:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTheme();
    }, []);

    // Persist theme changes to storage
    useEffect(() => {
        if (!isLoading) {
            setItem('theme', theme).catch(error =>
                console.error('Error saving theme:', error),
            );
        }
    }, [theme, isLoading]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
