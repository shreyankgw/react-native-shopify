// ProductGrid.tsx
import React, { useRef, useCallback, useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import ProductCard from "./ProductCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Checkbox from "expo-checkbox";

interface ProductGridProps {
  products: any[];
  filters: any[];
  sortBy: string;
  setSortBy: (v: string) => void;
  selectedFilters: any;
  setSelectedFilters: (v: any) => void;
  onEndReached: () => void;
  loadingMore?: boolean;
  hasNextPage?: boolean;
}

const { width } = Dimensions.get("window");

export default function ProductGrid({
  products,
  filters,
  sortBy,
  setSortBy,
  selectedFilters,
  setSelectedFilters,
  onEndReached,
  loadingMore = false,
  hasNextPage = false
}: ProductGridProps) {
  const [bottomsheetContent, setBottomSheetContent] = useState<string | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const sortOptions = [
    { title: "Best Selling", value: "BEST_SELLING" },
    { title: "Product Title A-Z", value: "TITLE_ASC" },
    { title: "Product Title Z-A", value: "TITLE_DESC" },
    { title: "Price - High to Low", value: "PRICE_DESC" },
    { title: "Price - Low to High", value: "PRICE_ASC" },
    { title: "Newest", value: "CREATED_DESC" },
    { title: "Oldest", value: "CREATED_ASC" },
  ];

  const toggleFilter = (filterId: string, valueId: string) => {
    setSelectedFilters((prev: any) => {
      const updatedFilters = { ...prev };
      if (!updatedFilters[filterId]) {
        updatedFilters[filterId] = [];
      }
      if (updatedFilters[filterId].includes(valueId)) {
        updatedFilters[filterId] = updatedFilters[filterId].filter((id: string) => id !== valueId);
      } else {
        updatedFilters[filterId].push(valueId);
      }
      return updatedFilters;
    });
  };

  const handleBottomSheet = useCallback((content: string) => {
    setBottomSheetContent(content);
    bottomSheetRef.current?.expand();
  }, []);

  const ProductData = ({ item }: any) => (
    <View style={{ width: width / 2 - 20 }}>
      <ProductCard product={item} />
    </View>
  );

  const backDrop = useCallback((props: any) => {
    return (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={"close"}
      />
    );
  }, []);

  return (
    <>
      <FlatList data={products}
        renderItem={ProductData}
        numColumns={2}
        keyExtractor={(product: any) => product.id}
        columnWrapperStyle={{ justifyContent: "space-between", gap: 8 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="mb-4 flex flex-row items-center justify-between gap-2">
            <TouchableOpacity onPress={() => handleBottomSheet("SortBy")} activeOpacity={0.7} className="flex flex-row items-center justify-center border border-gray-200 bg-white rounded-lg py-2 px-4 gap-3" style={{ width: width / 2 - 20 }}>
              <Ionicons name="filter-outline" size={24} color="black" />
              <Text className="text-sm font-mSemiBold">Sort By</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleBottomSheet("Filters")} activeOpacity={0.7} className="flex flex-row items-center justify-center border border-gray-200 bg-white rounded-lg py-2 px-4 gap-3" style={{ width: width / 2 - 20 }}>
              <Ionicons name="options-outline" size={24} color="black" />
              <Text className="text-sm font-mSemiBold">Filters</Text>
            </TouchableOpacity>
          </View>
        }
        onEndReached={() => {
          if (hasNextPage && !loadingMore) onEndReached();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-4 flex items-center justify-center">
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["50%", "70%"]}
        enablePanDownToClose={true}
        animateOnMount={true}
        backdropComponent={backDrop}
      >
        <BottomSheetScrollView
          className="flex-1 px-12 py-6"
          contentContainerStyle={{ alignItems: "flex-start" }}
          showsVerticalScrollIndicator={false}
        >
          {bottomsheetContent === "SortBy" && (
            <View className="items-start w-full">
              <Text className="text-2xl font-mBold mb-2">Sort By</Text>
              <View className="h-[1px] bg-gray-200 w-full mb-4"></View>
              {sortOptions.map(({ title, value }) => (
                <View key={title} className="flex flex-row items-start mb-3">
                  <Checkbox
                    value={sortBy === value}
                    onValueChange={() => setSortBy(value)}
                    color={sortBy === value ? "#046a38" : undefined}
                    accessibilityLabel={title}
                  />
                  <Text className="ml-3 text-base font-mSemiBold">{title}</Text>
                </View>
              ))}
            </View>
          )}
          {bottomsheetContent === "Filters" && (
            <View className="items-start w-full">
              <Text className="text-2xl font-mBold mb-2">Filters</Text>
              <View className="h-[1px] bg-gray-200 w-full mb-4"></View>
              {filters.filter((f: any) => f.id !== "filter.v.price").map(({ id, label, values }: any) => (
                <View key={id} className="mb-9">

                  <Text className="text-base font-mBold mb-3">{label}</Text>
                  {values.map(({ label: valueLabel, id: valueId, count }: any) => (
                    <View key={valueId} className="flex flex-row items-center mb-2">
                      <Checkbox
                        value={selectedFilters[id]?.includes(valueId) || false}
                        onValueChange={() => toggleFilter(id, valueId)}
                        color={selectedFilters[id]?.includes(valueId) ? "#046a38" : undefined}
                        accessibilityLabel={valueLabel}
                      />
                      <Text className="ml-3 text-base font-mSemiBold">{valueLabel}
                        {typeof count === "number" && (
                          <Text className="text-gray-500">{` (${count})`}</Text>
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
}
