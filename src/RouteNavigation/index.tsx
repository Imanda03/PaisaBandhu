import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthRoute from './StackRoute/AuthRoute';
import Tabs from './Tabs';
import InnerScreen from './StackRoute/InnerScreen';
import AddTransaction from '../screen/App/InnerScreen/AddTransaction';
import AddCategories from '../screen/App/InnerScreen/AddCategory';
import FriendList from '../screen/App/InnerScreen/FriendList';
import AchievementsScreen from '../screen/App/AchievementsScreen';
import ReferralScreen from '../screen/App/ReferralScreen';
import SavingsGoalsScreen from '../screen/App/SavingsGoalsScreen';
import PermissionsScreen from '../screen/App/PermissionsScreen';
import PrivacyPolicyScreen from '../screen/App/PrivacyPolicyScreen';
import AddLendingScreen from '../screen/Lending/AddLendingScreen';
import LendingDetailScreen from '../screen/Lending/LendingDetailScreen';
import AuthHeader from '../components/core/AuthHeader';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../utils/colors';

function PermissionsScreenWrapper() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: theme.BACKGROUND }}>
      <View style={{ paddingTop: insets.top, backgroundColor: theme.BACKGROUND }}>
        <AuthHeader title="App permissions" />
      </View>
      <PermissionsScreen onComplete={() => navigation.goBack()} />
    </View>
  );
}

const cardScreenOptions = {
  presentation: 'card' as const,
  animation: 'slide_from_right' as const,
  headerShown: false,
};

const modalScreenOptions = {
  presentation: 'modal' as const,
  animation: 'slide_from_bottom' as const,
  headerShown: false,
};

const RootStack = () => {
  const Stack = createNativeStackNavigator();
  const { authToken } = useAuth();

  return (
    <Stack.Navigator screenOptions={cardScreenOptions}>
      {authToken ? (
        <>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="InnerScreen" component={InnerScreen} options={{ headerShown: false }} />
          <Stack.Group screenOptions={modalScreenOptions}>
            <Stack.Screen name="AddTransaction" component={AddTransaction} />
            <Stack.Screen name="AddCategories" component={AddCategories} />
            <Stack.Screen name="Friends" component={FriendList} />
            <Stack.Screen name="AddLending" component={AddLendingScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={cardScreenOptions}>
            <Stack.Screen name="Achievements" component={AchievementsScreen} />
            <Stack.Screen name="Referral" component={ReferralScreen} />
            <Stack.Screen name="SavingsGoals" component={SavingsGoalsScreen} />
            <Stack.Screen name="LendingDetail" component={LendingDetailScreen} />
            <Stack.Screen
              name="Permissions"
              component={PermissionsScreenWrapper}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="privacy-policies"
              component={PrivacyPolicyScreen}
              options={{ headerShown: false }}
            />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="Auths" component={AuthRoute} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default RootStack;
