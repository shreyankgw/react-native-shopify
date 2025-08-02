import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useCart } from "@/context/cartContext";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import formatPrice from "@/utilities/formatPrice";
import { CheckoutCompletedEvent, useShopifyCheckoutSheet } from "@shopify/checkout-sheet-kit";
import { Image } from "expo-image";
import CartUpsells from "@/components/CartUpsells";


export default function CartPage(){
  const { cart, loading, removeFromCart, checkoutUrl, refreshCart, clearCart, updateLineQuantity } = useCart();

  const shopifyCheckout = useShopifyCheckoutSheet();

  useEffect(() => {
    const unsub = shopifyCheckout.addEventListener('completed', (event: CheckoutCompletedEvent) => {

      clearCart();
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

  // When user changes quantity:
const handleChangeQuantity = async (lineId: string, newQuantity: number) => {
  await updateLineQuantity(lineId, newQuantity);
  await refreshCart(); // This will fetch the latest cart data and re-render the cart
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
    const quantity = line.node.quantity;

    console.log(line.node.id);

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

          {/* Quantity selector buttons */}
          <View className="flex-row items-center mt-1 mb-2">
            <TouchableOpacity
              className={`w-8 h-8 rounded-full items-center justify-center ${quantity === 1 ? "bg-gray-100 opacity-50" : "bg-gray-200"}`}
              onPress={async () => {
                if (quantity > 1) await handleChangeQuantity(line.node.id, quantity - 1);;
              }}
              disabled={quantity === 1}
              accessibilityLabel={quantity === 1 ? "Cannot decrease quantity below 1" : "Decrease quantity"}
              accessibilityState={{ disabled: quantity === 1 }}
            >
              <Ionicons name="remove-outline" size={20} color={quantity === 1 ? "#bdbdbd" : "#24272a"} />
            </TouchableOpacity>
            <Text className="mx-4 font-mBold text-base">{quantity}</Text>
            {/* Increase quantity button */}
            <TouchableOpacity
              className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center"
              onPress={async () => await handleChangeQuantity(line.node.id, quantity + 1)}
              accessibilityLabel="Increase quantity"
            >
              <Ionicons name="add-outline" size={20} color="#24272a" />
            </TouchableOpacity>

          </View>

          <Text className={`${variant.compareAtPrice?.amount ? "text-red-700" : "text-gray-700"} font-mBold text-sm`}>
            {(formatPrice(variant.price?.amount ?? 0) ?? "$0.00")} {variant.compareAtPrice?.amount && <Text className="text-gray-400 line-through text-sm font-mSemiBold ml-2">{(formatPrice(variant.compareAtPrice?.amount ?? 0) ?? "$0.00")}</Text>}
          </Text>

        </View>
        <TouchableOpacity
          className="ml-3"
          onPress={() => handleRemove(line.node.id)}
          accessibilityLabel="Remove from cart"
        >
          <Ionicons name="trash-outline" size={20} color="#666666" />
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

        {/* Cart Upsells */}
        <CartUpsells />

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
