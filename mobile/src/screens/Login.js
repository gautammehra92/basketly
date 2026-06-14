import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const { login, register } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
        } catch (e) {
            // If login fails, try to register for the sake of the MVP
            try {
                await register(email, password);
            } catch (err) {
                setError('Authentication failed. Please try again.');
            }
        }
        setIsLoading(false);
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>Welcome to Basketly</Text>
                
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TextInput 
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#a0a0a0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
                
                <TextInput 
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#a0a0a0"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity 
                    style={styles.primaryButton} 
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Login / Sign Up</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} disabled={isLoading}>
                    <Text style={styles.secondaryButtonText}>Continue with Google</Text>
                </TouchableOpacity>

            </View>

            <Text style={styles.footerText}>Save and repeat your home groceries in one tap</Text>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'space-between',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 40,
        textAlign: 'center',
    },
    input: {
        height: 56,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#eeeeee',
    },
    primaryButton: {
        height: 56,
        backgroundColor: '#2ecc71',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButton: {
        height: 56,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    secondaryButtonText: {
        color: '#555555',
        fontSize: 16,
        fontWeight: '600',
    },
    footerText: {
        textAlign: 'center',
        color: '#999999',
        fontSize: 14,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    errorText: {
        color: '#e74c3c',
        marginBottom: 16,
        textAlign: 'center',
    }
});
