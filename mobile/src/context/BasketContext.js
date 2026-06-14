import React, { createContext, useState, useEffect, useContext } from 'react';
import { getBasket, createBasket, addItemToBasket, repeatBasket as apiRepeatBasket } from '../api';
import { AuthContext } from './AuthContext';

export const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [basket, setBasket] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchBasket();
        } else {
            setBasket(null);
        }
    }, [user]);

    const fetchBasket = async () => {
        setLoading(true);
        try {
            const data = await getBasket(user.id);
            setBasket(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const createNewBasket = async (name) => {
        try {
            const data = await createBasket(user.id, name);
            setBasket(data);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const addItem = async (item) => {
        if (!basket) return;
        try {
            await addItemToBasket(user.id, basket.id, item);
            await fetchBasket(); // Refresh basket items
        } catch (error) {
            console.error(error);
        }
    };

    const repeatBasket = async () => {
        if (!basket) return null;
        try {
            const res = await apiRepeatBasket(user.id, basket.id);
            return res;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    return (
        <BasketContext.Provider value={{ basket, loading, createNewBasket, addItem, repeatBasket, fetchBasket }}>
            {children}
        </BasketContext.Provider>
    );
};
