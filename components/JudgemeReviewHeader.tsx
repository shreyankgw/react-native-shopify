import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import FractionalStarRating from "./FractionalStarRating";
import JudgeMeWriteReviewModal from "./JudgemeReviewModal";

interface Breakdown {
  stars: number;
  count: number;
}

interface JudgemeReviewsHeaderProps {
  average: number;
  total: number;
  breakdown: Breakdown[];
  productId: number;
}

const ACCENT_COLOR = "#82bc00"; // Matches your green style

export default function JudgemeReviewsHeader({
  average,
  total,
  breakdown,
  productId,
}: JudgemeReviewsHeaderProps) {
const [modalVisible, setModalVisible] = useState(false);

  // Calculate bar width as percent for breakdown
  const maxCount = Math.max(...breakdown.map((b) => b.count), 1);

  return (
    <View className="mb-6">
      {/* Heading */}
      <Text className="text-2xl font-bold text-center mb-2">
        Customer Reviews
      </Text>

      {/* FractionalStarRating */}
      <View className="flex-row items-center justify-center mb-1">
        <FractionalStarRating
          rating={average}
          ratingCount={total}
          size={28}
          style={{ marginRight: 8 }}
          textStyle={{ color: "#333", fontWeight: "700" }}
          showValue={true}
          showCount={false} // We'll show review count below, as in screenshot
        />
        <Text className="text-lg font-bold text-gray-700 ml-2">( {average.toFixed(2)} out of 5 )</Text>
      </View>

      {/* Based on X reviews + checkmark */}
      <View className="flex-row items-center justify-center mb-4">
        <Text className="text-base text-gray-600">
          Based on {total} review{total !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Histogram */}
      <View className="mb-4">
        {breakdown.map((item) => {
          const percent = maxCount === 0 ? 0 : item.count / maxCount;
          return (
            <View key={item.stars} className="flex-row items-center mb-1">
              {/* Star row */}
              <View className="flex-row w-24">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Text
                    key={i}
                    style={{
                      color: i < item.stars ? ACCENT_COLOR : "#D1D5DB",
                      fontSize: 16,
                      marginRight: 2,
                    }}
                  >
                    ★
                  </Text>
                ))}
              </View>
              {/* Bar */}
              <View className="flex-1 h-3 bg-gray-200 mx-2 rounded overflow-hidden">
                <View
                  style={{
                    width: `${percent * 100}%`,
                    backgroundColor: ACCENT_COLOR,
                    height: "100%",
                    borderRadius: 999,
                  }}
                />
              </View>
              {/* Count */}
              <Text className="text-gray-700 font-semibold w-7 text-right ml-2">
                {item.count}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Write a review button */}
      <Pressable
        onPress={() => setModalVisible(true)}
        className="mt-3 rounded-lg"
        style={{
          backgroundColor: ACCENT_COLOR,
          paddingVertical: 14,
          alignItems: "center",
          marginHorizontal: 0,
        }}
      >
        <Text className="text-white font-bold text-lg">Write a review</Text>
      </Pressable>
      <JudgeMeWriteReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        productId={productId}
      />
    </View>
  );
}
