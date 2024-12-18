import React, {useRef, useCallback, useState} from "react";
import { FlatList, View, Text, Dimensions, TouchableOpacity } from "react-native";
import ProductCard from "./ProductCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";



const { width } = Dimensions.get('window');
export default function ProductGrid({products}: {products: any}) {
   const [bottomsheetContent, setBottomSheetContent] = useState<string | null>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleBottomSheet = useCallback((content: string) => {
      setBottomSheetContent(content);
      bottomSheetRef.current?.expand();
    }, []);

    const ProductData = ({item}: any) => <View className="flex-1"><ProductCard product={item} /></View>
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
                     <TouchableOpacity onPress={() =>handleBottomSheet("SortBy")} activeOpacity={0.7} className="flex flex-row items-center justify-center border border-gray-200 bg-white rounded-lg py-2 px-4 gap-3" style={{ width: width / 2 - 20 }}>
                        <Ionicons name="filter-outline" size={24} color="black" />
                        <Text className="text-sm font-mSemiBold">Sort By</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={() => handleBottomSheet("Filters")} activeOpacity={0.7} className="flex flex-row items-center justify-center border border-gray-200 bg-white rounded-lg py-2 px-4 gap-3" style={{ width: width / 2 - 20 }}>
                        <Ionicons name="options-outline" size={24} color="black" />
                        <Text className="text-sm font-mSemiBold">Filters</Text>
                     </TouchableOpacity>   
                  </View>
                  }
                  onEndReached={() => {console.log("End Reached")}}
                  onEndReachedThreshold={0.5}
        />
        <BottomSheet 
             ref={bottomSheetRef}
             index={-1}
             snapPoints={["25%", "50%"]}
             enablePanDownToClose={true}
             animateOnMount={true}
             backdropComponent={({ animatedIndex }) => animatedIndex.value > 0 ? (
               <View 
                   className="absolute inset-0 bg-black opacity-50 transition-opacity" 
                   style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
               />
           ) : null}
         >
           <BottomSheetView className="flex-1 items-center justify-center bg-gray-200">
              {bottomsheetContent === "SortBy" && <Text>Sort By</Text>}
              {bottomsheetContent === "Filters" && <Text>Filters</Text>}
           </BottomSheetView>
         </BottomSheet>
      </>
        
    );
}