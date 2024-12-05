import React from "react";
import { FlatList, View, Text, Dimensions, TouchableOpacity } from "react-native";
import ProductCard from "./ProductCard";
import Ionicons from "@expo/vector-icons/Ionicons";


const { width } = Dimensions.get('window');
export default function ProductGrid({products}: {products: any}) {
    const ProductData = ({item}: any) => <ProductCard product={item} />
    return (
        <FlatList data={products} 
                  renderItem={ProductData} 
                  numColumns={2} 
                  keyExtractor={(product: any) => product.id} 
                  columnWrapperStyle={{justifyContent: "space-between"}} 
                  contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, paddingBottom: 100 }}
                  showsVerticalScrollIndicator={false} 
                  ListHeaderComponent={
                  <View className="mb-4 flex flex-row items-center justify-between gap-2">
                     <TouchableOpacity onPress={() => {}} activeOpacity={0.7} className="flex flex-row items-center justify-center border border-gray-200 bg-white rounded-lg py-2 px-4 gap-3" style={{ width: width / 2 - 20 }}>
                        <Ionicons name="filter-outline" size={24} color="black" />
                        <Text className="text-sm font-mSemiBold">Sort By</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={() => {}} activeOpacity={0.7} className="flex flex-row items-center justify-center border border-gray-200 bg-white rounded-lg py-2 px-4 gap-3" style={{ width: width / 2 - 20 }}>
                        <Ionicons name="options-outline" size={24} color="black" />
                        <Text className="text-sm font-mSemiBold">Filters</Text>
                     </TouchableOpacity>   
                  </View>
                  }
        />
    );
}