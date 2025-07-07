// [handle].tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { fetchCollection } from "@/lib/shopifyQueries";
import ProductGrid from "@/components/ProductGrid";
import { buildShopifyFilters } from "@/utilities/formatFilters";

interface Product {
  id: string;
  // ... other product fields
}
interface CollectionResponse {
  title?: string;
  products?: {
    filters?: any[];
    edges: { node: Product }[];
    pageInfo: {
      endCursor: string | null;
      hasNextPage: boolean;
    };
  };
}

export default function Collection() {
  const { handle } = useLocalSearchParams();
  const handleStr = Array.isArray(handle) ? handle[0] : handle;
  const [collection, setCollection] = useState<CollectionResponse>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("BEST_SELLING");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);


  // Initial fetch
  const getCollection = useCallback(async () => {
    setLoading(true);

    try {
      // Transform selectedFilters to Shopify format!
    const shopifyFilters = buildShopifyFilters(selectedFilters, filters);

      const collectionData: CollectionResponse = await fetchCollection(
        handleStr,
        24,
        null,
        sortBy,
        shopifyFilters
      );
      setProducts(collectionData.products?.edges.map((edge: any) => edge.node) ?? []);
      setFilters(
        collectionData.products?.filters?.map((filter: any) => ({
          id: filter.id,
          label: filter.label,
          type: filter.type,
          values: filter.values.map((value: any) => ({
            id: value.id,
            label: value.label,
            count: value.count,
          })),
        })) ?? []
      );
      setCollection(collectionData);
      setEndCursor(collectionData.products?.pageInfo?.endCursor ?? null);
      setHasNextPage(collectionData.products?.pageInfo?.hasNextPage ?? false);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [handle, sortBy, selectedFilters]);

  // Fetch more products (pagination)
  const loadMoreProducts = async () => {
    if (!hasNextPage || loadingMore) return;
    setLoadingMore(true);
    try {
      const shopifyFilters = buildShopifyFilters(selectedFilters, filters);

      const collectionData: CollectionResponse = await fetchCollection(
        handleStr,
        24,
        endCursor,
        sortBy,
        shopifyFilters
      );
      const newProducts = collectionData.products?.edges.map((edge: any) => edge.node) ?? [];
      setProducts((prev) => [...prev, ...newProducts]);
      setEndCursor(collectionData.products?.pageInfo?.endCursor ?? null);
      setHasNextPage(collectionData.products?.pageInfo?.hasNextPage ?? false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    getCollection();
  }, [getCollection]);

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full">
        <ScrollView className="bg-white h-full">
          <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full">
            <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-mBold uppercase">Loading...</Text>
            <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.push("/(tabs)/cart")}>
              <Ionicons name="bag-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="bg-white flex-1">
        <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full">
          <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-mBold uppercase">
            {collection?.title || "Category"}
          </Text>
          <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.push("/(tabs)/cart")}>
            <Ionicons name="bag-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
    
          <View className="flex-1">
            {products && products.length > 0 && (
              <ProductGrid
                products={products}
                filters={filters}
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                onEndReached={loadMoreProducts}
                loadingMore={loadingMore}
                hasNextPage={hasNextPage}
              />
            )}
          </View>
        
      </View>
    </SafeAreaView>
  );
}
