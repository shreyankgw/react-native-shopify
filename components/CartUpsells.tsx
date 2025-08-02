// CartUpsells.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { cartUpsell } from "@/lib/shopifyCart"; // Update this import as per your structure
import ProductCard from "./ProductCard";
import { useCart } from "@/context/cartContext";
import { Ionicons } from "@expo/vector-icons";

export default function CartUpsells() {
  const { cart } = useCart();
  const cartId = cart?.id;
  const [upsellProducts, setUpsellProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cartId) {
      setUpsellProducts([]);
      return;
    }

    setLoading(true);
    cartUpsell(cartId)
      .then((products) => setUpsellProducts(products ?? []))
      .catch((e) => {
        setUpsellProducts([]);
        
      })
      .finally(() => setLoading(false));
  }, [cartId, cart?.lines?.edges.length]);

  // Nothing to show if no upsells
  if (!upsellProducts || upsellProducts.length === 0) return null;

  return (
    <View className="my-8">
     <View className="flex-row items-center mb-4">
        <Text className="text-lg font-mBold">Customers also baught</Text>
        <Ionicons name="sparkles-outline" size={16} color="#24272a" className="ml-2" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {upsellProducts.map((product) =>
          product?.id ? (
            <View key={product.id} style={{ width: 220, marginRight: 16 }}>
              <ProductCard product={product} />
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}
