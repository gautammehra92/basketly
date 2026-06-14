import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './context/AuthContext';

import Splash from './screens/Splash';
import Login from './screens/Login';
import Home from './screens/Home';
import CreateBasket from './screens/CreateBasket';
import BasketDetail from './screens/BasketDetail';
import RepeatConfirmation from './screens/RepeatConfirmation';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500); // Fake splash delay
    }, []);

    if (isLoading) {
        return <Splash />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ 
                headerStyle: { backgroundColor: '#ffffff' },
                headerTintColor: '#2ecc71', // soft green accent
                headerShadowVisible: false,
                contentStyle: { backgroundColor: '#ffffff' }
            }}>
                {!user ? (
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                ) : (
                    <>
                        <Stack.Screen name="Home" component={Home} options={{ title: 'Basketly' }} />
                        <Stack.Screen name="CreateBasket" component={CreateBasket} options={{ title: 'Build Your Basket' }} />
                        <Stack.Screen name="BasketDetail" component={BasketDetail} options={{ title: 'Home Basket' }} />
                        <Stack.Screen name="RepeatConfirmation" component={RepeatConfirmation} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
