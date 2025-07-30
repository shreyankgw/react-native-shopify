// ProductGrid.tsx
import React, { useRef, useCallback, useState, useMemo } from "react";
import { View, Text, Dimensions, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import ProductCard from "./ProductCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Checkbox from "expo-checkbox";
import { FlashList } from "@shopify/flash-list";

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

// Utility to chunk array into rows
function chunkProducts(arr: any[], size: number) {
  if (!Array.isArray(arr)) return [];
  const filtered = arr.filter((p) => p && p.id); // remove undefined/null/bad products
  let chunks = [];
  for (let i = 0; i < filtered.length; i += size) {
    chunks.push(filtered.slice(i, i + size));
  }
  return chunks;
}

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

  // Memoized chunked products
  const rows = useMemo(() => chunkProducts(products, 2), [products]);

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

const CARD_GAP = 4;
const CARD_WIDTH = (width - CARD_GAP * 3 - 32) / 2; // adjust as needed for padding/gaps

const ProductRow = ({ item: row, index: rowIndex }: { item: any[]; index: number }) => (
  <View key={`row-${rowIndex}`} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
    <View style={{ width: CARD_WIDTH, marginRight: CARD_GAP }}>
      {row[0] ? <ProductCard product={row[0]} className="w-full" /> : <View style={{ width: CARD_WIDTH }} />}
    </View>
    <View style={{ width: CARD_WIDTH }}>
      {row[1] ? <ProductCard product={row[1]} className="w-full" /> : <View style={{ width: CARD_WIDTH }} />}
    </View>
  </View>
);


  return (
    <>
      <FlashList 
        data={rows}
        renderItem={ProductRow}
        numColumns={1}
        keyExtractor={(_, idx) => `product-row-${idx}`}
        estimatedItemSize={CARD_WIDTH + CARD_GAP}
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
