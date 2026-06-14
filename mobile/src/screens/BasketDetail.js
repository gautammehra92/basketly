import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { BasketContext } from '../context/BasketContext';

export default function BasketDetail({ navigation }) {
    const { basket } = useContext(BasketContext);

    if (!basket) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No basket found.</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product_name}</Text>
                <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
            </View>
            <View style={styles.itemActions}>
                <TouchableOpacity style={styles.iconBtn}>
                    <Text style={styles.iconText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                    <Text style={styles.iconText}>🗑</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{basket.name}</Text>
            </View>

            <FlatList
                data={basket.items || []}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id || index.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.emptyListText}>Your basket is empty.</Text>}
            />

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('RepeatConfirmation')}
                >
                    <Text style={styles.primaryButtonText}>🔁 Repeat Basket</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>✏️ Edit Basket</Text>
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
    },
    header: {
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
    },
    listContainer: {
        padding: 24,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 15,
        color: '#888888',
    },
    itemActions: {
        flexDirection: 'row',
    },
    iconBtn: {
        padding: 8,
        marginLeft: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    iconText: {
        fontSize: 18,
    },
    emptyListText: {
        fontSize: 16,
        color: '#a0a0a0',
        textAlign: 'center',
        marginTop: 40,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
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
        backgroundColor: '#ffffff',
        height: 60,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#555555',
        fontSize: 18,
        fontWeight: '600',
    }
});
