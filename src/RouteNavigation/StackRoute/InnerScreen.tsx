import React from 'react';
import { Dimensions, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Transactions from '../../screen/App/InnerScreen/Transactions';
import { WeeklyChart } from '../../screen/App/InnerScreen/WeeklyChart';
import Categories from '../../screen/App/InnerScreen/Categories';
import Reports from '../../screen/App/InnerScreen/Reports';

const Stack = createNativeStackNavigator();
const { width: screenWidth } = Dimensions.get('window');

const InnerScreen = () => {
  const screenOptions: any = {
    headerShown: false,
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    animation: Platform.select({
      ios: 'default',
      android: 'slide_from_right',
    }),
    presentation: 'card',
    animationTypeForReplace: 'push',
    contentStyle: { backgroundColor: 'white' },
    // Smooth animations that work on both platforms
    animationDuration: 350,
    detachPreviousScreen: false,
    // Custom animation configurations
    // animation: 'slide_from_right',
    screenOptions: {
      gestureResponseDistance: screenWidth,
      transitionSpec: {
        open: {
          animation: 'timing',
          config: {
            duration: 350,
          },
        },
        close: {
          animation: 'timing',
          config: {
            duration: 300,
          },
        },
      },
      cardStyleInterpolator: ({ current, next, layouts }: any) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
              {
                scale: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          },
          overlayStyle: {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
          },
        };
      },
    },
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Transactions"
        component={Transactions}
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen name="TransactionChart" component={WeeklyChart} />
      <Stack.Screen
        name="Categories"
        component={Categories}
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
      <Stack.Screen
        name="Reports"
        component={Reports}
        options={{
          animationTypeForReplace: 'pop',
        }}
      />
    </Stack.Navigator>
  );
};

export default InnerScreen;
