"use client";

import { useState, useEffect, useCallback } from 'react';
import { isPlatVisible } from '../data/plats-prepares';

export type CartItem = {
    id: string; // ex: semaine-1-mardi ou menu-reveillon-noel
    semaineId: string;
    jour: string;
    nomPlat: string;
    prixUnitairePlat: number;
    quantitePlat: number;
    soupes: Record<string, number>;
    prixUnitaireSoupe: number;
    prixTotalLigne: number;
    itemType?: 'plat_prepare' | 'menu_fete';
    badge?: string;
    coursesSummary?: string[];
    coursesDescription?: string;
};

export function useCart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Fonction de vérification 48h (pour les plats préparés uniquement)
    const isVisible = (dayName: string, weekId: string) => {
        // Les Menus de Fêtes sont toujours valides et ne dépendent pas des semaines classiques
        if (weekId.startsWith('menu') || weekId.startsWith('fetes') || weekId === 'menus-fetes') {
            return true;
        }

        return isPlatVisible(dayName, weekId);
    };

    const loadCart = useCallback(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('traiteurCart');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved) as CartItem[];
                    // Vérifier la validité des plats (48h) sans purger les menus de fêtes
                    const validItems = parsed.filter(item => {
                        if (item.itemType === 'menu_fete' || item.semaineId.startsWith('menu') || item.semaineId.startsWith('fetes')) {
                            return true;
                        }
                        return isVisible(item.jour, item.semaineId);
                    });

                    if (validItems.length !== parsed.length) {
                        localStorage.setItem('traiteurCart', JSON.stringify(validItems));
                        // Emettre un événement custom pour notifier qu'un nettoyage a eu lieu
                        window.dispatchEvent(new CustomEvent('cart-cleaned'));
                    }
                    setCartItems(validItems);
                } catch {
                    setCartItems([]);
                }
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadCart();
        }, 0);

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
            clearTimeout(timer);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cart-updated', handleLocalSync);
        };
    }, [loadCart]);

    const saveCart = (items: CartItem[]) => {
        localStorage.setItem('traiteurCart', JSON.stringify(items));
        setCartItems(items);
        window.dispatchEvent(new Event('cart-updated'));
    };

    const addMultipleToCart = (newItems: CartItem[]) => {
        if (!newItems || newItems.length === 0) return;
        const currentCart = [...cartItems];

        for (const item of newItems) {
            const existingIndex = currentCart.findIndex(i => i.id === item.id);
            if (existingIndex >= 0) {
                const existing = currentCart[existingIndex];
                const newQty = existing.quantitePlat + item.quantitePlat;
                const totalSoupes = Object.values(existing.soupes || {}).reduce((a, b) => a + b, 0);
                const soupesTotalCost = totalSoupes * (existing.prixUnitaireSoupe || 0);
                const newTotal = (existing.prixUnitairePlat * newQty) + soupesTotalCost;

                currentCart[existingIndex] = {
                    ...existing,
                    quantitePlat: newQty,
                    prixTotalLigne: newTotal
                };
            } else {
                currentCart.push(item);
            }
        }

        saveCart(currentCart);
    };

    const addToCart = (item: CartItem) => {
        addMultipleToCart([item]);
    };

    const updateQuantity = (id: string, delta: number) => {
        const targetItem = cartItems.find(i => i.id === id);
        if (!targetItem) return;

        // Si la quantité passe à 0 ou moins, retirer directement l'article du panier
        if (targetItem.quantitePlat + delta <= 0) {
            removeFromCart(id);
            return;
        }

        const newCart = cartItems.map(item => {
            if (item.id === id) {
                const newQty = item.quantitePlat + delta;
                const totalSoupes = Object.values(item.soupes || {}).reduce((a, b) => a + b, 0);
                const soupesTotalCost = totalSoupes * (item.prixUnitaireSoupe || 0);
                const newTotal = (item.prixUnitairePlat * newQty) + soupesTotalCost;
                return {
                    ...item,
                    quantitePlat: newQty,
                    prixTotalLigne: newTotal
                };
            }
            return item;
        });
        saveCart(newCart);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cart-bump'));
        }
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
        addMultipleToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        totalItems,
        cleanCart: loadCart, // Peut être forcé
    };
}
