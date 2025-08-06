import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuth } from '../context/AuthContext'
import AuthRoute from './StackRoute/AuthRoute'
import Tabs from './Tabs'
import InnerScreen from './StackRoute/InnerScreen'
import AddTransaction from '../screen/App/InnerScreen/AddTransaction'
import AddCategories from '../screen/App/InnerScreen/AddCategory'
import FriendList from '../screen/App/InnerScreen/FriendList'

const RootStack = () => {

    const Stack = createNativeStackNavigator()

    const { authToken } = useAuth();

    return (
        <Stack.Navigator>
            {authToken ?
                <>
                    <Stack.Screen
                        name="Tabs"
                        component={Tabs}
                        options={{ headerShown: false, }}
                    />
                    <Stack.Screen
                        name="InnerScreen"
                        component={InnerScreen}
                        options={{ headerShown: false, }}
                    />
                    <Stack.Group screenOptions={{ presentation: 'modal', animation: 'slide_from_bottom', headerShown: false }}>
                        <Stack.Screen name="AddTransaction" component={AddTransaction} />
                        <Stack.Screen name="AddCategories" component={AddCategories} />
                        <Stack.Screen name="Friends" component={FriendList} />
                    </Stack.Group>
                </>
                :
                <Stack.Screen name="Auths" component={AuthRoute} options={{ headerShown: false }} />
            }
        </Stack.Navigator>
    )
}

export default RootStack