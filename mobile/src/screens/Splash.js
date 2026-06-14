import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Splash() {
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Basketly</Text>
            <Text style={styles.subtitle}>Your grocery memory</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0fdf4', // very light green
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#2ecc71', // soft green
    },
    subtitle: {
        fontSize: 18,
        color: '#7f8c8d',
        marginTop: 10,
    }
});
