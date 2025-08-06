import React from 'react';
import { Dimensions, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Transactions from '../../screen/App/InnerScreen/Transactions';
import AddTransaction from '../../screen/App/InnerScreen/AddTransaction';
import { WeeklyChart } from '../../screen/App/InnerScreen/WeeklyChart';

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

            {/* <Stack.Screen
                name="AddTransaction"
                component={AddTransaction}
                options={{
                    animationTypeForReplace: 'pop',
                }}
            /> */}
            {/* <Stack.Screen
                name="AddCategory"
                component={categories}
                options={{
                    animationTypeForReplace: 'pop',
                }}
            />
            <Stack.Screen
                name="AddCategoryForm"
                component={AddCategories}
                options={{
                    animationTypeForReplace: 'pop',
                }}
            /> */}
            <Stack.Screen
                name="Transactions"
                component={Transactions}
                options={{
                    animationTypeForReplace: 'pop',
                }}
            />
            <Stack.Screen
                name="TransactionChart"
                component={WeeklyChart}
            />
        </Stack.Navigator>
    );
};

export default InnerScreen;
