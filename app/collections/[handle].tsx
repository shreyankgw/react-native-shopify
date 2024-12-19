import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

import { fetchCollection } from "@/lib/shopifyQueries";
import ProductGrid from "@/components/ProductGrid";

interface CollectionResponse {
    products?: {
        filters?: any[];
        edges: {
            node: any;
        }[];
    };
}


export default function Collection(){
    const {handle} = useLocalSearchParams();
    const [collection, setCollection] = useState<any>();
    const [products, setProducts] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const [loading, setLoading] = useState<Boolean>(true);
    const [sortBy, setSortBy] = useState<string>("BEST_SELLING");
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});


    const getCollection = useCallback(async () => {
        setLoading(true);
        try{
            const collectionData: CollectionResponse = await fetchCollection(handle, 24, null, sortBy, selectedFilters);
            const products = collectionData.products?.edges.map((edge: any) => edge.node);
            const filters = collectionData.products?.filters?.map((filter: any) => ({id: filter.id, label: filter.label, type: filter.type, values: filter.values.map((value: any) => ({id: value.id, label: value.label, count: value.count}))}));
            setProducts(products);
            setFilters(filters);
            setCollection(collectionData);
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
        }
    }, [handle, sortBy, selectedFilters]);

    useEffect(()=> {
       getCollection();
    }, [getCollection]);

    if(loading){
        return(
          <SafeAreaView className="bg-white h-full">
           <ScrollView className="bg-white h-full"> 
           <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full">
               <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={24} color="black" /></TouchableOpacity>
               <Text className="text-xl font-mBold uppercase">Loading...</Text>
               <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.push("/(tabs)/cart")}><Ionicons name="bag-outline" size={24} color="black" /></TouchableOpacity>
           </View>
           </ScrollView> 
          </SafeAreaView>
        );
    }    

   return(
    <SafeAreaView className="bg-white h-full">
    <View className="bg-white h-full"> 
    <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full">
        <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={24} color="black" /></TouchableOpacity>
        <Text className="text-xl font-mBold uppercase">{collection ? collection.title : "Category" }</Text>
        <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.push("/(tabs)/cart")}><Ionicons name="bag-outline" size={24} color="black" /></TouchableOpacity>
    </View>
    <View>
        <View className="w-full mb-4">
           {products && products.length > 0 && <ProductGrid products={products} filters={filters} sortBy={sortBy} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />}
        </View>
    </View>
    </View>
    </SafeAreaView>
   );
}