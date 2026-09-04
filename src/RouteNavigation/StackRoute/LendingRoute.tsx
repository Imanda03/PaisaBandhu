import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LendingDashboardScreen from '../../screen/Lending/LendingDashboardScreen';
import { useTheme } from '../../utils/colors';

const Stack = createNativeStackNavigator();

const LendingRoute: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.HEADER_GRADIENT[0] },
        statusBarStyle: 'light',
      }}
    >
      <Stack.Screen name="LendingDashboard" component={LendingDashboardScreen} />
    </Stack.Navigator>
  );
};

export default LendingRoute;
