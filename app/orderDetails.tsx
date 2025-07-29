// app/orderDetails.tsx (or wherever your routes are)
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useCart } from "@/context/cartContext";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function OrderDetailsPage() {
  const { orderDetails } = useCart();

  console.log(orderDetails.cart.price.shipping.amount && `$${orderDetails.cart.price.shipping.amount}`);

  if (!orderDetails) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-mBold text-gray-700 mb-4">No order details found.</Text>
        <TouchableOpacity
          className="bg-green-700 px-6 py-3 rounded-xl"
          onPress={() => router.replace("/")}
        >
          <Text className="text-white font-mBold text-base">Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 20 }}>
      <Text className="text-2xl font-mBold mb-4">Order Placed!</Text>
      <Text className="text-lg font-mSemiBold mb-2">Order ID: <Text className="font-mRegular">{orderDetails.id}</Text></Text>
      <Text className="mb-4 text-base">Thank you for your purchase!</Text>
      <Text className="font-mBold mb-2">Order Summary:</Text>
      {/* Address */}
      <Text className="font-mBold">Shipping To:</Text>
      <Text className="mb-2">{orderDetails.billingAddress?.name}, {orderDetails.billingAddress?.address1}, {orderDetails.billingAddress?.city}, {orderDetails.billingAddress?.zoneCode} {orderDetails.billingAddress?.postalCode}, {orderDetails.billingAddress?.countryCode}</Text>
      <Text className="mb-2">Phone: {orderDetails.billingAddress?.phone}</Text>
      <Text className="mb-4">Email: {orderDetails.email}</Text>

      {/* Cart items */}
      <Text className="font-mBold mb-2">Items:</Text>
      {orderDetails.cart?.lines?.map((line: any, idx: number) => (
        <View key={idx} className="mb-2 pl-2 flex flex-row items-center justify-center">
          <Image source={{ uri: line.image.sm }} alt={`Image of ${line.title}`} />
          <Text>{line.quantity} × {line.title || "Product"}</Text>
        </View>
      ))}

      {/* Prices */}
      <View className="mt-4">
        <Text className="font-mBold">Subtotal: <Text className="font-mRegular">{orderDetails.cart?.price?.subtotal?.amount ? `$ ${orderDetails.cart.price.subtotal.amount}` : ""}</Text></Text>
        <Text className="font-mBold">Shipping: <Text className="font-mRegular">{orderDetails.cart.price.shipping.amount && `$ ${orderDetails.cart.price.shipping.amount}`}</Text></Text>
        <Text className="font-mBold">Taxes: <Text className="font-mRegular">{orderDetails.cart?.price?.taxes?.amount ? `$ ${orderDetails.cart.price.taxes.amount}` : ""}</Text></Text>
        <Text className="font-mBold">Total: <Text className="font-mRegular">{orderDetails.cart?.price?.total?.amount ? `$ ${orderDetails.cart.price.total.amount}` : ""}</Text></Text>
      </View>

      <TouchableOpacity
        className="bg-green-700 px-6 py-3 rounded-xl mt-8"
        onPress={() => router.replace("/")}
      >
        <Text className="text-white font-mBold text-base">Return to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
