import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { BasketProvider } from './src/context/BasketContext';
import AppNavigator from './src/AppNavigator';

export default function App() {
    return (
        <AuthProvider>
            <BasketProvider>
                <AppNavigator />
            </BasketProvider>
        </AuthProvider>
    );
}
