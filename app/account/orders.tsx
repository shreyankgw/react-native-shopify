import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/authContext";
import { fetchCustomerOrders } from "@/lib/shopifyQueries";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import formatDate from "@/utilities/formatDate"; // your custom date function

interface Order {
  id: string;
  name: string;
  number: number;
  processedAt: string;
  financialStatus: string;
  totalPrice: {
     amount: string; 
     currencyCode: string;
  };
  lineItems: {
    edges: { 
      node: { 
         title: string; 
         quantity: number; 
         image?: { url: string }; 
         variantTitle?: string } 
   }[];
  };
  fulfillments: {
      edges: {
         node: {
            id: string;
            status: string;
            trackingInformation?: {
               number: number;
               url: string;
            }
            fulfillmentLineItems: {
               edges: {
                  node: {
                   lineItem: {
                     id: string;
                   }
                   quantity: number;
                  }
               }
            }
         }
      }[];
   };
}

export default function Orders() {
  const { isLoggedIn, getValidAccessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);


function getOrderFulfillmentStatus(order: any) {
  const lineItems = order.lineItems?.edges?.map(e => e.node) || [];
  const fulfillments = order.fulfillments?.edges?.map(e => e.node) || [];

  // Map lineItem.id => fulfilledQuantity
  const fulfilledQuantities = {};

  fulfillments.forEach((fulfillment: any) => {
    fulfillment.fulfillmentLineItems?.edges?.forEach((edge: any) => {
      const liId = edge.node.lineItem?.id;
      if (!liId) return;
      fulfilledQuantities[liId] = (fulfilledQuantities[liId] || 0) + edge.node.quantity;
    });
  });

  let anyFulfilled = false;
  let allFulfilled = true;

  for (const item of lineItems) {
    const fulfilled = fulfilledQuantities[item.id] || 0;
    if (fulfilled > 0) anyFulfilled = true;
    if (fulfilled < item.quantity) allFulfilled = false;
  }

  if (allFulfilled && lineItems.length > 0) return "FULFILLED";
  if (anyFulfilled) return "PARTIALLY_FULFILLED";
  return "UNFULFILLED";
}


  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const token = await getValidAccessToken();
        if (!token) throw new Error("Not authenticated");
       
        const fetchedOrders = await fetchCustomerOrders(token);
       
        setOrders(fetchedOrders);
      } catch (err: any) {
        setLoadError(err?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) loadOrders();

  }, [isLoggedIn]);

  const renderOrder = ({ item }: { item: Order }) => 
  {
   
   return (
    <TouchableOpacity
      className="mb-4 p-4 rounded-xl border border-gray-200 bg-gray-50"
      onPress={() => router.push(`/orders/${encodeURIComponent(item.id)}`)}
    >
      <View className="flex-row justify-between items-center mb-1">
        <Text className="font-mBold text-lg">{`Order #${item.number}`}</Text>
        <Text className="text-xs text-gray-500">{formatDate(item.processedAt)}</Text>
      </View>
      <Text className="text-sm text-gray-700 mb-2">
        {`Fulfillment Status: ${getOrderFulfillmentStatus(item)} ${"  "}`}
      </Text>
      <Text className="text-base font-mBold">
        {`Total: ${item.totalPrice.amount} ${item.totalPrice.currencyCode}`}
      </Text>
      <View className="flex-row mt-2 flex-wrap gap-2">
        {item.lineItems.edges.map(({ node }, idx) => (
          <View key={idx} className="mr-2">
            <Text className="text-xs">{`${node.title} x${node.quantity}`}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
   );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-mBold uppercase">Order History</Text>
        <View style={{ width: 32 }} />
      </View>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-4 text-gray-600">Loading orders...</Text>
        </View>
      ) : loadError ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-600">{loadError}</Text>
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-500">No orders found.</Text>
        </View>
      ) : (
        <FlashList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id}
          estimatedItemSize={120}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
}
