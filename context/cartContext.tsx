import React, { createContext, useContext, useCallback, useEffect, useState, ReactNode } from "react";
import { storage } from "@/lib/storage";
import { createCart, addLinesToCart, removeLinesFromCart, updateLinesFromCart, cartBuyerIdentityUpdate, fetchCart } from "@/lib/shopifyCart";

const CART_ID_KEY = 'shopify_cart_id';

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
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // Utility: persist and hydrate cart id
  const persistCartId = useCallback((id: string | null) => {
    if (id) storage.set(CART_ID_KEY, id);
    else storage.delete(CART_ID_KEY);
    setCartId(id);
  }, []);

  // Hydrate on mount
  useEffect(() => {
    const storedCartId = storage.getString(CART_ID_KEY);
    if (storedCartId) {
      setCartId(storedCartId);
      refreshCart(storedCartId);
    }
  }, []);

  // Core logic functions

  // Create a new cart
  const handleCreateCart = useCallback(async () => {
    setLoading(true);
    try {
      const newCart = await createCart();
      persistCartId(newCart.id);
      setCart(newCart);
      setCheckoutUrl(newCart.checkoutUrl);
    } catch (err) {
      console.error("Error creating cart:", err);
    } finally {
      setLoading(false);
    }
  }, [persistCartId]);

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
          persistCartId(null);
          setCart(null);
        }
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    },
    [cartId, persistCartId]
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
       let customerLoggedIn = storage.getString("access_token");
       if(customerLoggedIn){
        buyerIdentity =  { customerAccessToken: customerLoggedIn };
       }
        if (!id) {
          // Create cart if doesn't exist
          const newCart = await createCart(lines, buyerIdentity);
          id = newCart.id;
          persistCartId(id);
          setCart(newCart);
          await refreshCart()
        }else{
          //cart exists already, just update the cart
         const updatedCart = await addLinesToCart(id!, lines);
         setCart(updatedCart);
         await refreshCart()
        }
       
      } catch (err) {
        console.error("Error adding to cart:", err);
      } finally {
        setLoading(false);
      }
    },
    [cartId, persistCartId]
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};