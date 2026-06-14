import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { BasketContext } from '../context/BasketContext';
import { AuthContext } from '../context/AuthContext';
import { addItemToBasket } from '../api';

export default function CreateBasket({ navigation }) {
    const { createNewBasket, addItem } = useContext(BasketContext);
    
    const [basketName, setBasketName] = useState('Home Basket');
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState('kg');
    const [items, setItems] = useState([]);

    const handleAddItem = () => {
        if (!productName) return;
        const newItem = {
            id: Date.now().toString(),
            product_name: productName,
            quantity: parseFloat(quantity) || 1,
            unit: unit
        };
        setItems([...items, newItem]);
        setProductName('');
    };

    const handleRemoveItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const { user } = useContext(AuthContext);

    const handleSave = async () => {
        if (items.length === 0) {
            if (Platform.OS === 'web') {
                window.alert("Empty Basket: Please add at least one item.");
            } else {
                Alert.alert("Empty Basket", "Please add at least one item.");
            }
            return;
        }
        try {
            const newBasket = await createNewBasket(basketName);
            if (newBasket) {
                // Now add all items to the backend sequentially
                for (let item of items) {
                    await addItemToBasket(user.id, newBasket.id, { 
                        product_name: item.product_name, 
                        quantity: item.quantity, 
                        unit: item.unit 
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
        navigation.goBack();
    };

    const applyPreset = async (presetItems, title) => {
        setItems(presetItems.map(item => ({...item, id: Math.random().toString()})));
        
        try {
            const newBasket = await createNewBasket(title);
            if (newBasket) {
                for (let item of presetItems) {
                    await addItemToBasket(user.id, newBasket.id, { 
                        product_name: item.product_name, 
                        quantity: item.quantity, 
                        unit: item.unit 
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
        navigation.goBack();
    };

    const presets = [
        { title: 'Indian Starter', items: [{product_name: 'Atta', quantity: 10, unit: 'kg'}, {product_name: 'Basmati Rice', quantity: 5, unit: 'kg'}, {product_name: 'Toor Dal', quantity: 1, unit: 'kg'}] },
        { title: 'Weekly Basics', items: [{product_name: 'Milk', quantity: 2, unit: 'L'}, {product_name: 'Eggs', quantity: 12, unit: 'pcs'}, {product_name: 'Bread', quantity: 1, unit: 'pcs'}] },
    ];

    const renderItem = ({ item }) => (
        <View style={styles.itemRow}>
            <Text style={styles.itemName}>{item.product_name}</Text>
            <View style={styles.quantityControl}>
                <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.deleteBtn}>
                <Text style={styles.deleteText}>🗑</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            <View style={styles.inputSection}>
                <View style={styles.addForm}>
                    <TextInput 
                        style={[styles.input, {flex: 1}]}
                        placeholder="Add item (e.g., Atta, Rice)"
                        value={productName}
                        onChangeText={setProductName}
                    />
                    <TouchableOpacity style={styles.addBtn} onPress={handleAddItem}>
                        <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.quickToggles}>
                    <TouchableOpacity onPress={() => {setQuantity('1'); setUnit('kg');}} style={styles.toggleBtn}><Text style={styles.toggleText}>1 kg</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => {setQuantity('5'); setUnit('kg');}} style={styles.toggleBtn}><Text style={styles.toggleText}>5 kg</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => {setQuantity('1'); setUnit('pcs');}} style={styles.toggleBtn}><Text style={styles.toggleText}>1 pcs</Text></TouchableOpacity>
                </View>
            </View>

            {items.length === 0 ? (
                <View style={styles.presetsSection}>
                    <Text style={styles.presetsTitle}>Quick Start Baskets</Text>
                    {presets.map((preset, index) => (
                        <TouchableOpacity key={index} style={styles.presetCard} onPress={() => applyPreset(preset.items, preset.title)}>
                            <Text style={styles.presetCardTitle}>{preset.title}</Text>
                            <Text style={styles.presetCardDesc}>{preset.items.map(i => i.product_name).join(', ')}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <FlatList 
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>💾 Save Basket</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    inputSection: {
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    addForm: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: 50,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#eeeeee',
    },
    addBtn: {
        backgroundColor: '#2ecc71',
        height: 50,
        paddingHorizontal: 20,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    quickToggles: {
        flexDirection: 'row',
        marginTop: 12,
    },
    toggleBtn: {
        backgroundColor: '#f0fdf4',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
    },
    toggleText: {
        color: '#2ecc71',
        fontSize: 14,
        fontWeight: '600',
    },
    listContainer: {
        padding: 24,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    itemName: {
        flex: 1,
        fontSize: 18,
        color: '#333333',
        fontWeight: '500',
    },
    quantityControl: {
        backgroundColor: '#f9f9f9',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 12,
    },
    itemQuantity: {
        fontSize: 16,
        color: '#555555',
    },
    deleteBtn: {
        padding: 8,
    },
    deleteText: {
        fontSize: 20,
    },
    presetsSection: {
        padding: 24,
    },
    presetsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555555',
        marginBottom: 16,
    },
    presetCard: {
        backgroundColor: '#f9fcfb',
        borderWidth: 1,
        borderColor: '#e8f5e9',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    presetCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2ecc71',
        marginBottom: 4,
    },
    presetCardDesc: {
        fontSize: 14,
        color: '#888888',
    },
    footer: {
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    saveBtn: {
        backgroundColor: '#2ecc71',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
