import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { BasketContext } from '../context/BasketContext';
import { AuthContext } from '../context/AuthContext';

export default function Home({ navigation }) {
    const { basket, loading, fetchBasket } = useContext(BasketContext);
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchBasket();
        });
        return unsubscribe;
    }, [navigation]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2ecc71" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Basketly</Text>
                <TouchableOpacity onPress={logout} style={styles.profileIcon}>
                    <Text style={styles.profileInitials}>ME</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {!basket ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>Create your first grocery basket</Text>
                        <TouchableOpacity 
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate('CreateBasket')}
                        >
                            <Text style={styles.primaryButtonText}>➕ Build Basket</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.basketContainer}>
                        <Text style={styles.sectionTitle}>Your Home Basket</Text>
                        
                        <TouchableOpacity 
                            style={styles.basketCard}
                            onPress={() => navigation.navigate('BasketDetail')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cardTitle}>{basket.name}</Text>
                            <View style={styles.itemsPreview}>
                                {basket.items && basket.items.slice(0, 5).map((item, index) => (
                                    <Text key={index} style={styles.itemText}>
                                        • {item.product_name} ({item.quantity}{item.unit})
                                    </Text>
                                ))}
                                {basket.items && basket.items.length > 5 && (
                                    <Text style={styles.moreText}>+ {basket.items.length - 5} more items</Text>
                                )}
                                {basket.items && basket.items.length === 0 && (
                                    <Text style={styles.emptyText}>No items yet</Text>
                                )}
                            </View>
                        </TouchableOpacity>

                        <View style={styles.actionsContainer}>
                            <TouchableOpacity 
                                style={[styles.primaryButton, styles.repeatButton]}
                                onPress={() => navigation.navigate('RepeatConfirmation')}
                            >
                                <Text style={styles.primaryButtonText}>🔁 Repeat Basket</Text>
                            </TouchableOpacity>

                            <View style={styles.secondaryActions}>
                                <TouchableOpacity 
                                    style={styles.secondaryActionBtn}
                                    onPress={() => navigation.navigate('BasketDetail')}
                                >
                                    <Text style={styles.secondaryActionText}>✏️ Edit Basket</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.secondaryActionBtn}
                                    onPress={() => navigation.navigate('CreateBasket')}
                                >
                                    <Text style={styles.secondaryActionText}>➕ New Basket</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2ecc71',
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitials: {
        color: '#2ecc71',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 30,
        textAlign: 'center',
    },
    primaryButton: {
        backgroundColor: '#2ecc71',
        borderRadius: 16,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        shadowColor: '#2ecc71',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    basketContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555555',
        marginBottom: 16,
    },
    basketCard: {
        backgroundColor: '#f9fcfb',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#e8f5e9',
        marginBottom: 32,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 16,
    },
    itemsPreview: {
        marginTop: 8,
    },
    itemText: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 8,
    },
    moreText: {
        fontSize: 14,
        color: '#a0a0a0',
        marginTop: 8,
        fontStyle: 'italic',
    },
    emptyText: {
        fontSize: 16,
        color: '#a0a0a0',
        fontStyle: 'italic',
    },
    actionsContainer: {
        marginTop: 'auto',
        marginBottom: 40,
    },
    repeatButton: {
        marginBottom: 24,
    },
    secondaryActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    secondaryActionBtn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
    },
    secondaryActionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#555555',
    }
});
