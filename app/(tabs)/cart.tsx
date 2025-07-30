import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useCart } from "@/context/cartContext";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import formatPrice from "@/utilities/formatPrice";
import { CheckoutCompletedEvent, useShopifyCheckoutSheet } from "@shopify/checkout-sheet-kit";
import { Image } from "expo-image";


export default function CartPage() {
  const { cart, loading, removeFromCart, checkoutUrl, refreshCart, clearCart } = useCart();

  const shopifyCheckout = useShopifyCheckoutSheet();

  useEffect(() => {
    const unsub = shopifyCheckout.addEventListener('completed', (event: CheckoutCompletedEvent) => {
      clearCart();
      //after that send them to homepage since they have already gotten confirmation for their order.
      router.replace("/");
    });
    return () => {
      unsub?.remove();
    };

  }, [shopifyCheckout]);

  // deleting the line item
  const handleRemove = async (lineId: string) => {
    await removeFromCart(lineId);
    await refreshCart();
  };

  const cartLines = cart?.lines?.edges || [];
  const cartIsEmpty = !cart || cartLines.length === 0;

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg font-mBold">Loading cart...</Text>
      </View>
    );
  }

  if (cartIsEmpty) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Ionicons name="bag-outline" size={80} color="#e5e7eb" />
        <Text className="text-2xl font-mBold text-gray-600 mb-6 mt-2">Your cart is empty</Text>
        <TouchableOpacity
          className="bg-darkPrimary px-6 py-3 rounded-xl"
          onPress={() => router.replace("/")}
        >
          <Text className="text-white text-base font-mBold">Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Helper function to render a cart line
  const renderCartLine = (line: any) => {
    const variant = line.node.merchandise;

    return (
      <View
        key={line.node.id}
        className="flex-row items-center bg-white border border-gray-200 rounded-xl p-3 mb-4"
      >
        <View className="w-20 h-20 rounded-lg mr-4 bg-gray-100">
          <Image
            source={{ uri: variant.product?.featuredImage?.url || "https://cdn.shopify.com/s/files/1/0632/6331/0018/files/no-image.png" }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={350}
            accessibilityRole="image"
          />
        </View>

        <View className="flex-1">
          <Text className="text-base font-mSemiBold mb-1" numberOfLines={2}>
            {variant.product?.title || "Product"}
          </Text>
          <Text className="text-gray-500 text-xs mb-2">Qty: {line.node.quantity}</Text>
          <Text className={`${variant.compareAtPrice?.amount ? "text-red-700" : "text-gray-700"} font-mBold text-sm`}>
            {(formatPrice(variant.price?.amount ?? 0) ?? "$0.00")} {variant.compareAtPrice?.amount && <Text className="text-gray-400 line-through text-sm font-mSemiBold ml-2">{(formatPrice(variant.compareAtPrice?.amount ?? 0) ?? "$0.00")}</Text>}
          </Text>

        </View>
        <TouchableOpacity
          className="ml-3"
          onPress={() => handleRemove(line.node.id)}
          accessibilityLabel="Remove from cart"
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-mBold mb-6">Your Cart</Text>
        {cartLines.map(renderCartLine)}

        {/* Cart summary */}
        <View className="border-t border-gray-200 pt-4 mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-mBold text-gray-700">Subtotal</Text>
            <Text className="text-lg font-mBold text-gray-700">
              {cart.cost?.subtotalAmount?.amount ? formatPrice(cart.cost?.subtotalAmount?.amount ?? 0) : "$0.00"}
            </Text>
          </View>
          <Text className="text-sm text-gray-500 mb-2">
            Taxes, shipping and discounts calculated at checkout.
          </Text>

          <TouchableOpacity
            className="bg-green-700 py-3 rounded-xl items-center"
            onPress={() => {
              if (checkoutUrl) shopifyCheckout.present(checkoutUrl);
            }}
            disabled={!checkoutUrl}
          >
            <Text className="text-white text-base font-mBold">Checkout</Text>
          </TouchableOpacity>

          
          <TouchableOpacity
            className="bg-brandLight py-3 rounded-xl items-center mt-3"
            onPress={() => router.replace("/")}
            accessibilityLabel="Continue Shopping"
          >
            <Text className="text-brandText text-base font-mBold">Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
