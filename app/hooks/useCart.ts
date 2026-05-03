"use client";

import { useState, useEffect, useCallback } from 'react';

export type CartItem = {
    id: string; // ex: semaine-1-mardi
    semaineId: string;
    jour: string;
    nomPlat: string;
    prixUnitairePlat: number;
    quantitePlat: number;
    soupes: Record<string, number>;
    prixUnitaireSoupe: number;
    prixTotalLigne: number;
};

export function useCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Fonction de vérification 48h (identique à celle de page.tsx)
    const isVisible = (dayName: string, weekId: string) => {
        const today = new Date();
        const pickupDates: Record<string, Record<string, Date>> = {
            "semaine-1": { "mardi": new Date(2026, 4, 5), "jeudi": new Date(2026, 4, 7), "samedi": new Date(2026, 4, 9) },
            "semaine-2": { "mardi": new Date(2026, 4, 12), "jeudi": new Date(2026, 4, 14), "samedi": new Date(2026, 4, 16) },
            "semaine-3": { "mardi": new Date(2026, 4, 19), "jeudi": new Date(2026, 4, 21), "samedi": new Date(2026, 4, 23) },
            "semaine-4": { "mardi": new Date(2026, 4, 26), "jeudi": new Date(2026, 4, 28), "samedi": new Date(2026, 4, 30) },
        };

        let targetDay = "";
        const d = dayName.toLowerCase();
        if (d === 'lundi' || d === 'mardi') targetDay = 'mardi';
        else if (d === 'mercredi' || d === 'jeudi') targetDay = 'jeudi';
        else targetDay = 'samedi';

        const pickupDate = pickupDates[weekId]?.[targetDay];
        if (!pickupDate) return false;

        const diffTime = pickupDate.getTime() - today.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays >= 2;
    };

    const loadCart = useCallback(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('traiteurCart');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved) as CartItem[];
                    // Vérifier la validité des plats (48h)
                    const validItems = parsed.filter(item => isVisible(item.jour, item.semaineId));
                    if (validItems.length !== parsed.length) {
                        localStorage.setItem('traiteurCart', JSON.stringify(validItems));
                        // Emettre un événement custom pour notifier qu'un nettoyage a eu lieu
                        window.dispatchEvent(new CustomEvent('cart-cleaned'));
                    }
                    setCartItems(validItems);
                } catch (e) {
                    console.error("Erreur parsing cart", e);
                    setCartItems([]);
                }
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        loadCart();
        // Listener pour synchroniser le panier entre les onglets
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'traiteurCart') {
                loadCart();
            }
        };
        const handleLocalSync = () => {
            loadCart();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('cart-updated', handleLocalSync);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cart-updated', handleLocalSync);
        };
    }, [loadCart]);

    const saveCart = (items: CartItem[]) => {
        localStorage.setItem('traiteurCart', JSON.stringify(items));
        setCartItems(items);
        window.dispatchEvent(new Event('cart-updated'));
    };

    const addToCart = (item: CartItem) => {
        const existingIndex = cartItems.findIndex(i => i.id === item.id);
        const newCart = [...cartItems];

        if (existingIndex >= 0) {
            // Mettre à jour la ligne existante
            newCart[existingIndex] = item;
        } else {
            newCart.push(item);
        }
        saveCart(newCart);
    };

    const removeFromCart = (id: string) => {
        const newCart = cartItems.filter(i => i.id !== id);
        saveCart(newCart);
    };

    const clearCart = () => {
        localStorage.removeItem('traiteurCart');
        setCartItems([]);
        window.dispatchEvent(new Event('cart-updated'));
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + item.prixTotalLigne, 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantitePlat, 0);

    return {
        cartItems,
        isLoaded,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        totalItems,
        cleanCart: loadCart, // Peut être forcé
    };
}
