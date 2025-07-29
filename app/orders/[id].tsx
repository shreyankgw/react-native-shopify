import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/authContext";
import { fetchCustomerOrderDetail } from "@/lib/shopifyQueries";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import formatPrice from "@/utilities/formatPrice";
import { Image } from "expo-image";

// ---- Types -----
interface Address {
  name: string;
  address1: string;
  address2?: string | null;
  city: string;
  province: string;
  zip: string;
  country: string;
}

interface LineItem {
  id: string;
  title: string;
  quantity: number;
  image?: { url: string } | null;
  variantTitle?: string | null;
  price: { amount: string; currencyCode: string };
}

interface FulfillmentLineItem {
  quantity: number;
  lineItem: { id: string; title: string };
}

interface Fulfillment {
  status: string;
  trackingInformation?: { number: string; url?: string; company?: string | null; }[];
  fulfillmentLineItems: { edges: { node: FulfillmentLineItem }[] };
}

interface Order {
  id: string;
  name: string;
  number: number;
  processedAt: string;
  financialStatus?: string;
  totalPrice: { amount: string; currencyCode: string };
  subtotal: { amount: string; currencyCode: string };
  totalShipping: { amount: string; currencyCode: string };
  totalTax: { amount: string; currencyCode: string };
  shippingAddress?: Address | null;
  fulfillments?: { edges: { node: Fulfillment }[] };
  lineItems: { edges: { node: LineItem }[] };
}

// ---- UTILS -----
function formatDate(dateString: string) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function getFulfillmentStatus(order: Order): string {
  const total = order.lineItems.edges.reduce((sum, e) => sum + e.node.quantity, 0);
  let fulfilled = 0;
  order.fulfillments?.edges.forEach(edge => {
    edge.node.fulfillmentLineItems?.edges.forEach(itemEdge => {
      fulfilled += itemEdge.node.quantity;
    });
  });
  if (fulfilled === 0) return "Unfulfilled";
  if (fulfilled < total) return "Partially Fulfilled";
  return "Fulfilled";
}

// --- Badge Component ---
function StatusBadge({ status }: { status: string }) {
  let color = "#cbd5e1", text = "text-gray-700";
  if (status === "Fulfilled") color = "#86efac", text = "text-green-900";
  else if (status === "Partially Fulfilled") color = "#facc15", text = "text-yellow-800";
  else if (status === "Unfulfilled") color = "#fca5a5", text = "text-red-700";
  return (
    <View style={{ backgroundColor: color, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, alignSelf: "flex-start" }}>
      <Text className={`text-xs font-mBold ${text}`}>{status}</Text>
    </View>
  );
}

// --- Main Page ---

export default function OrderDetail() {
  const { isLoggedIn, getValidAccessToken } = useAuth();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id as string | undefined;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const token = await getValidAccessToken();
        if (!token) throw new Error("Not authenticated");
        const detail = await fetchCustomerOrderDetail(token, id!);
        setOrder(detail as Order);
      } catch (err: any) {
        setLoadError(err?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn && id) loadOrder();
  }, [isLoggedIn, id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-gray-600">Loading order details...</Text>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-600">{loadError}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 px-4 py-2 bg-darkPrimary rounded-lg">
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Order not found.</Text>
      </SafeAreaView>
    );
  }

  // --- Fulfillment Status & Payment Status ---
  const fulfillmentStatus = getFulfillmentStatus(order);
  const paymentStatus = order.financialStatus?.replace(/_/g, " ") ?? "Unknown";

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* --- Header --- */}
      <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={26} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-mBold">Order #{order.number}</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        {/* --- Summary Card --- */}
        <View className="mb-6 bg-gray-50 p-4 rounded-2xl shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between">
            <View style={{ flex: 1 }}>
              <View className="flex-row items-center flex-wrap">
                <Text className="font-mBold text-lg mb-1">{order.name}</Text>
                {order.financialStatus && order.financialStatus !== "PAID" && (
                  <View className="ml-2 bg-amber-100 px-2 py-0.5 rounded">
                    <Text className="text-xs text-amber-800 font-mMedium">
                      {order.financialStatus.replace(/_/g, " ")}
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-gray-600 text-base">
                Placed: {formatDate(order.processedAt)}
              </Text>
            </View>
            <StatusBadge status={fulfillmentStatus} />
          </View>
          <View className="flex-row items-center mt-3 gap-4">
            <MaterialIcons name="payments" size={20} color="#24272a" />
            <Text className="text-base text-brandText font-mBold">{formatPrice(order.totalPrice?.amount)}</Text>
          </View>
        </View>

        {/* --- Shipping Address --- */}
        <View className="mb-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <Text className="font-mBold text-base mb-1">Shipping Address</Text>
          {order.shippingAddress ? (
            <Text className="text-gray-700 text-base">
              {order.shippingAddress.name}
              {"\n"}
              {order.shippingAddress.address1}
              {order.shippingAddress.address2 ? `, ${order.shippingAddress.address2}` : ""}
              {"\n"}
              {order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.zip}
              {"\n"}
              {order.shippingAddress.country}
            </Text>
          ) : (
            <Text className="text-gray-400">No shipping address</Text>
          )}
        </View>

        {/* --- Items List --- */}
        <View className="mb-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <Text className="font-mBold text-base mb-2">Order Items</Text>
          {order.lineItems.edges.map(({ node }, idx) => (
            <View key={node.id || idx} className="flex-row items-center mb-3">
              {node.image?.url ? (
                <Image source={{ uri: node.image.url }} style={{ width: 56, height: 56, borderRadius: 8, marginRight: 14, borderColor: "#e5e7eb", borderWidth: 1 }} />
              ) : (
                <View style={{ width: 56, height: 56, borderRadius: 8, marginRight: 14, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="image-outline" size={28} color="#cbd5e1" />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text className="text-base font-mBold">{node.title}</Text>
                {node.variantTitle ? <Text className="text-xs text-gray-500">{node.variantTitle}</Text> : null}
                <Text className="text-sm text-gray-700">
                  Qty: {node.quantity}  •  {formatPrice(node.price?.amount)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* --- Fulfillment --- */}
        <View className="mb-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <Text className="font-mBold text-base mb-2">Tracking Information</Text>
          {order.fulfillments?.edges.length ? order.fulfillments.edges.map((edge, i) => (
            <View key={i} className="mb-3">
              {edge.node.trackingInformation?.map?.((track, ti) => (
                track.url ? (
                  <TouchableOpacity
                    key={ti}
                    onPress={() => Linking.openURL(track.url!)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-xs text-blue-700 underline">
                      {track.number} {track.url ? "| Track Shipment" : ""}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text key={ti} className="text-xs text-blue-700">
                    {track.number}
                  </Text>
                )
              ))}
              {/* Fulfilled items */}
              {edge.node.fulfillmentLineItems?.edges?.length > 0 && (
                <View className="mt-1 ml-2">
                  {edge.node.fulfillmentLineItems.edges.map((liEdge, idx) => (
                    <Text key={idx} className="text-xs text-gray-600">
                      • {liEdge.node.lineItem.title} x{liEdge.node.quantity}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )) : (
            <Text className="text-gray-500">Not fulfilled yet.</Text>
          )}
        </View>

        {/* --- Order Summary --- */}
        <View className="bg-gray-50 rounded-2xl border border-gray-100 p-4 mb-2">
          <Text className="font-mBold text-base mb-2">Order Summary</Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-700">Subtotal</Text>
            <Text className="font-mMedium">{formatPrice(order.subtotal?.amount)}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-700">Shipping</Text>
            <Text className="font-mMedium">{formatPrice(order.totalShipping?.amount)}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-700">Tax</Text>
            <Text className="font-mMedium">{formatPrice(order.totalTax?.amount)}</Text>
          </View>
          <View className="flex-row justify-between mt-2 border-t border-gray-200 pt-2">
            <Text className="font-mBold text-base">Total</Text>
            <Text className="font-mBold text-base">{formatPrice(order.totalPrice?.amount)}</Text>
          </View>
        </View>

        <View className="mt-8 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <Text className="font-mBold text-lg mb-2">Need Help?</Text>
          <Text className="mb-4 text-base text-gray-700">
            If you have any questions about your order, please contact us:
          </Text>
          <View className="flex-row gap-3 mb-2">
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/support")}
              className="flex-1 py-2 bg-darkPrimary rounded-lg flex-row justify-center items-center"
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
              <Text className="text-white font-mBold text-base ml-2">Chat with Support</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => Linking.openURL("tel:18889096757")}
              className="flex-1 py-2 bg-emerald-600 rounded-lg flex-row justify-center items-center"
              activeOpacity={0.85}
            >
              <Ionicons name="call-outline" size={20} color="#fff" />
              <Text className="text-white font-mBold text-base ml-2">Call Customer Care</Text>
            </TouchableOpacity>
          </View>
          <Text className="mt-3 text-center text-gray-500 text-xs">
            To contact GREENWORKS Customer Care, call our help line:
            {"\n"}<Text className="font-mBold">1-888-90-WORKS (888.909.6757)</Text>
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView >
  );
}
