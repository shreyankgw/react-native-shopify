import React, { createContext, useContext, useCallback, useEffect, useState, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { createCart, addLinesToCart, removeLinesFromCart, updateLinesFromCart, cartBuyerIdentityUpdate, fetchCart } from "@/lib/shopifyCart";

const CART_ID_KEY = 'shopify_cart_id';
const ACCESS_TOKEN_KEY = 'access_token';

type CartContextType = {
  cartId: string | null;
  cart: any;
  loading: boolean;
  totalQuantity: number;
  createCart: () => Promise<void>;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateBuyerIdentity: (buyerIdentity: any) => Promise<void>;
  checkoutUrl: string | null;
  refreshCart: () => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

// SecureStore helpers
const setCartId = async (id: string | null) => {
  if (id) await SecureStore.setItemAsync(CART_ID_KEY, id);
  else await SecureStore.deleteItemAsync(CART_ID_KEY);
};

const getCartId = async () => {
  return await SecureStore.getItemAsync(CART_ID_KEY);
};

const deleteCartId = async () => {
  await SecureStore.deleteItemAsync(CART_ID_KEY);
};

const getAccessToken = async () => {
  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartId, setCartIdState] = useState<string | null>(null);
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // Hydrate on mount
  useEffect(() => {
    (async () => {
      const storedCartId = await getCartId();
      if (storedCartId) {
        setCartIdState(storedCartId);
        await refreshCart(storedCartId);
      }
    })();
  }, []);

  // Create a new cart
  const handleCreateCart = useCallback(async () => {
    setLoading(true);
    try {
      const newCart = await createCart();
      await setCartId(newCart.id);
      setCartIdState(newCart.id);
      setCart(newCart);
      setCheckoutUrl(newCart.checkoutUrl);
    } catch (err) {
      console.error("Error creating cart:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current cart by id
  const refreshCart = useCallback(
    async (_cartId?: string | null) => {
      const id = _cartId ?? cartId;
      if (!id) return;
      setLoading(true);
      try {
        const freshCart = await fetchCart(id);
        setCart(freshCart);
        setCheckoutUrl(freshCart.checkoutUrl);
      } catch (err: any) {
        // If cart is not found, clear the cartId
        if (err.message && err.message.includes("not found")) {
          await setCartId(null);
          setCartIdState(null);
          setCart(null);
        }
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    },
    [cartId]
  );

  // Add item to cart
  const handleAddToCart = useCallback(
    async (variantId: string, quantity: number) => {
      setLoading(true);
      try {
        let id = cartId;
        let lines = [
          {
            quantity,
            merchandiseId: variantId,
          },
        ];
        let buyerIdentity: any = undefined;
        let customerLoggedIn = await getAccessToken();
        if (customerLoggedIn) {
          buyerIdentity = { customerAccessToken: customerLoggedIn };
        }
        if (!id) {
          // Create cart if doesn't exist
          const newCart = await createCart(lines, buyerIdentity);
          id = newCart.id;
          await setCartId(id);
          setCartIdState(id);
          setCart(newCart);
          setCheckoutUrl(newCart.checkoutUrl);
          await refreshCart(id);
        } else {
          //cart exists already, just update the cart
          const updatedCart = await addLinesToCart(id!, lines);
          setCart(updatedCart);
          setCheckoutUrl(updatedCart.checkoutUrl);
          await refreshCart(id);
        }
      } catch (err) {
        console.error("Error adding to cart:", err);
      } finally {
        setLoading(false);
      }
    },
    [cartId, refreshCart]
  );

  // Remove item from cart
  const handleRemoveFromCart = useCallback(
    async (lineId: string) => {
      if (!cartId) return;
      setLoading(true);
      try {
        const updatedCart = await removeLinesFromCart(cartId, lineId);
        setCart(updatedCart);
      } catch (err) {
        console.error("Error removing from cart:", err);
      } finally {
        setLoading(false);
      }
    },
    [cartId]
  );

  // Update buyer identity (email, customer id, etc)
  const handleUpdateBuyerIdentity = useCallback(
    async (buyerIdentity: any) => {
      if (!cartId) return;
      setLoading(true);
      try {
        const updatedCart = await cartBuyerIdentityUpdate(cartId, buyerIdentity);
        setCart(updatedCart);
      } catch (err) {
        console.error("Error updating buyer identity:", err);
      } finally {
        setLoading(false);
      }
    },
    [cartId]
  );

  // Clear cart if checkout is complete
  const clearCart = useCallback(async () => {
    await deleteCartId();
    setCartIdState(null);
    setCart(null);
    setCheckoutUrl(null);
  }, []);

  // Context value
  const totalQuantity = cart?.totalQuantity ?? 0;
  const value = {
    cartId,
    cart,
    loading,
    totalQuantity,
    createCart: handleCreateCart,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateBuyerIdentity: handleUpdateBuyerIdentity,
    checkoutUrl,
    refreshCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
