import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

import formatPrice from "@/utilities/formatPrice";
import { calculatePercentageOff } from "@/utilities/percentOff";

export default function ProductCard({ product }: { product: any }) {
  return (
    <TouchableOpacity
      className="bg-white border border-gray-200 rounded-lg p-4 items-start mb-4 gap-2 flex-1"
      onPress={() => router.push(`/products/${product.handle}`)}
      activeOpacity={0.8}
    >
      {product.compareAtPriceRange &&
        product.compareAtPriceRange.minVariantPrice.amount != "0.0" && (
          <Text className="text-xs font-mBold text-left bg-darkPrimary text-white rounded-lg px-2 py-1">
            {calculatePercentageOff(
              product.priceRange.minVariantPrice.amount,
              product.compareAtPriceRange.minVariantPrice.amount
            )}
          </Text>
        )}
      <Image
        source={{ uri: product.featuredImage.url }}
        className="w-full h-[200px] rounded-lg mb-2"
        resizeMode="contain"
      />
      <View className="flex flex-col items-start justify-between flex-1">
        {product.variants && (
          <Text className="text-xs font-mLight text-left">
            SKU: {product.variants.edges.map((edge: any) => edge.node.sku)}
          </Text>
        )}
        <Text className="text-base font-mSemiBold text-left">
          {product.title}
        </Text>
        <View className="flex flex-row items-baseline gap-2 mt-2">
          <Text className="text-sm font-mBold text-left">
            {formatPrice(product.priceRange.minVariantPrice.amount)}
          </Text>
          {product.compareAtPriceRange &&
            product.compareAtPriceRange.minVariantPrice.amount != "0.0" && (
              <Text className="text-sm font-mBold line-through text-gray-400 text-left">
                {formatPrice(
                  product.compareAtPriceRange.minVariantPrice.amount
                )}
              </Text>
            )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
