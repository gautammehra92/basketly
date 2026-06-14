import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BasketContext } from '../context/BasketContext';

export default function RepeatConfirmation({ navigation }) {
    const { basket, repeatBasket } = useContext(BasketContext);
    const [status, setStatus] = useState('processing'); // processing, success, error

    useEffect(() => {
        const processOrder = async () => {
            if (!basket) {
                setStatus('error');
                return;
            }
            const res = await repeatBasket();
            if (res && res.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        };

        // Simulate network delay for the "magic moment" feel
        setTimeout(() => {
            processOrder();
        }, 1500);
    }, []);

    if (status === 'processing') {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2ecc71" />
                <Text style={styles.processingText}>Preparing your basket...</Text>
            </View>
        );
    }

    if (status === 'error') {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.title}>Something went wrong</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.primaryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={styles.successIcon}>✓</Text>
                </View>
                
                <Text style={styles.title}>Your basket is ready to reorder</Text>
                
                <View style={styles.detailsBox}>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Items count: </Text>
                        {basket?.items?.length || 0} items
                    </Text>
                    <Text style={styles.detailText}>
                        <Text style={styles.detailLabel}>Estimated preparation: </Text>
                        Instant
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.primaryButtonText}>Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => alert('Future Feature: Store Selection')}>
                    <Text style={styles.secondaryButtonText}>Choose store</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    processingText: {
        marginTop: 20,
        fontSize: 18,
        color: '#666666',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    successIcon: {
        fontSize: 50,
        color: '#2ecc71',
        fontWeight: 'bold',
    },
    errorIcon: {
        fontSize: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 40,
    },
    detailsBox: {
        backgroundColor: '#f9fcfb',
        padding: 24,
        borderRadius: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: '#e8f5e9',
    },
    detailText: {
        fontSize: 16,
        color: '#555555',
        marginBottom: 12,
    },
    detailLabel: {
        fontWeight: '600',
        color: '#333333',
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
    },
    primaryButton: {
        backgroundColor: '#2ecc71',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#888888',
        fontSize: 16,
        fontWeight: '600',
    }
});
