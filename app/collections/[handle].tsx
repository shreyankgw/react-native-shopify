import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

import { fetchCollection } from "@/lib/shopifyQueries";


export default function Collection(){
    const {handle} = useLocalSearchParams();
    const [collection, setCollection] = useState<any>();
    const [products, setProducts] = useState<any>();

    useEffect(()=> {
       const getCollection = async (handle: any) => {
          try{
           const collectionVal = await fetchCollection(handle);
           const products = collectionVal.products.edges.map((edge: any) => edge.node); 
           setProducts(products);
           setCollection(collection);
          }catch(error){
            console.error(error);
          }
       }
       getCollection(handle);

    }, [handle]);

   return(
    <ScrollView className="bg-white h-full"> 
    <View className="flex flex-row items-center justify-between p-4 border-b-2 border-gray-200 w-full">
        <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={24} color="black" /></TouchableOpacity>
        <Text className="text-xl font-mBold uppercase">{collection ? collection.title : "Category" }</Text>
        <TouchableOpacity className="text-3xl font-mBold" onPress={() => router.push("/(tabs)/cart")}><Ionicons name="bag-outline" size={24} color="black" /></TouchableOpacity>
    </View>
    <View>
        <View className="w-full">
            {products && products.length > 0 ? products.map((product: any) => <View className="flex my-2" key={product.id}><Text>{product.title}</Text></View>) : <Text>No products found</Text>}
        </View>
    </View>
    </ScrollView>
   );
}