import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { useFocusEffect } from "expo-router"; // or from "@react-navigation/native"
import { getRecentlyViewedProducts } from "@/lib/storage"; // Your MMKV helper
import { recentlyViewedProducts } from "@/lib/shopifyQueries"; // Your GraphQL query function
import ProductCard from "@/components/ProductCard";

const { width } = Dimensions.get('window');

// Helper to create Shopify query string
const buildRecentlyViewedQuery = (ids: string[]) =>
  ids.map(id => `(id:${id})`).join(" OR ");

export default function RecentlyViewedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch and sync recently viewed on tab focus
  const fetchAndSetProducts = useCallback(async () => {
    setLoading(true);
    const ids = getRecentlyViewedProducts(); // e.g. ["7928273567938", ...]
    if (!ids || !ids.length) {
      setProducts([]);
      setLoading(false);
      return;
    }
    try {
      const queryStr = buildRecentlyViewedQuery(ids);
      const productsData = await recentlyViewedProducts(queryStr);
      // Keep order matching the IDs
      const edges = productsData?.edges || [];
      const nodes = edges.map((edge: any) => edge.node);
      // Match order to ids
      const sorted = ids.map((id: any) => nodes.find((p: any) => p.id.endsWith(id))).filter(Boolean);
      setProducts(sorted);
    } catch (error) {
      setProducts([]);
      // Optionally set an error state/message here
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAndSetProducts();
    }, [fetchAndSetProducts])
  );

  if (loading) {
    return (
      <View className="px-4 my-6">
        <ActivityIndicator size="small" color="#2563eb" />
      </View>
    );
  }

  if (!products.length) {
    return null; // Do not render anything if no products
  }

  return (
    <View>
      <Text className="text-xl font-mBold mb-4">Recently Viewed</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {products.map((product: any, i: number) => (
          <View key={product.id} className="flex-shrink-0" style={{ width: width / 2 - 40 }}>
            <ProductCard product={product} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
