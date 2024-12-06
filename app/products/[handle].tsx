import React, { useState, useEffect, useRef } from "react";
import { View, Text, Dimensions, Image, Button, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { configureReanimatedLogger } from "react-native-reanimated";

import { fetchProduct } from "@/lib/shopifyQueries";
import formatPrice from "@/utilities/formatPrice";
import { calculatePercentageOff } from "@/utilities/percentOff";
import GwtButton from "@/components/GwtButton";

configureReanimatedLogger({
    strict: false
})


interface Product {
    id: string;
    title: string;
    description: string;
    images: {edges: {node: {url: string}}[]};
    edges: {node: {url: string}}[];
    node: {url: string};
    url: string;
    priceRange: {minVariantPrice: {amount: number}};
    compareAtPriceRange: {minVariantPrice: {amount: number}};
    variants: {edges: {node: {sku: string, id: string}}[]};
}


const width = Dimensions.get("window").width;


export default function Product(){
    const [product, setProduct] = useState<Product | null>(null);
    const { handle } = useLocalSearchParams();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const getProduct = async () => {
            try{
                const productVal = await fetchProduct(handle);
                console.log(productVal);
                setProduct(productVal);
            }catch(error){
                console.error(error);
            }
        }
        getProduct();
    }, []);

    const renderDots = () => {
       if(product && product.images.edges.length > 1) {
        return (
            <View className="flex-row justify-center mt-2">
           { product.images.edges.map((_, i) => (
                <View
                    key={i}
                    className={`w-2 h-2 mx-1 rounded-full ${
                        index === i ? "bg-black" : "bg-gray-300"
                    }`}
                />
            )) }
            </View>
       )
    }
  }

   return(
    <ScrollView className="bg-white flex-1">
        <View className="relative">
        <TouchableOpacity className="text-3xl font-mBold absolute top-4 left-4 z-10" onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={24} color="black" /></TouchableOpacity>
        {product && product.compareAtPriceRange && product.compareAtPriceRange.minVariantPrice.amount != 0.0 && <View className="absolute top-4 right-4 z-10 bg-darkPrimary rounded-lg px-2 py-1"><Text className="text-xs font-mBold text-white">{calculatePercentageOff(product.priceRange.minVariantPrice.amount, product.compareAtPriceRange.minVariantPrice.amount)}</Text></View>}
            <Carousel
                loop
                width={width}
                height={width * 1.10}
                data={product && product.images.edges.map((edge: any) => edge.node.url) || []}
                scrollAnimationDuration={1000}
                style={{
                    marginHorizontal: 0
                }}
                onProgressChange={(progress, absoluteProgress) => setIndex(Math.round(absoluteProgress))}
                renderItem={({ item }) => <View className="px-4 bg-gray-100"><Image source={{ uri: item }} className="w-full h-full rounded-lg mb-2" resizeMode="contain" /></View>}
            />
            {product && product.images.edges.length > 1 && renderDots()}
         </View>
         <View className="p-4">
            {product && product.variants && <Text className="text-xs font-mLight text-left">SKU:{" "}{product.variants.edges.map((edge: any) => edge.node.sku)}</Text>}
            <Text className="text-2xl font-mBold mt-2">{product && product.title}</Text>
            <View className="flex flex-row items-baseline gap-2 mt-2">
              <Text className={`text-lg font-mSemiBold mt-2 text-left ${product && product.compareAtPriceRange && product.compareAtPriceRange.minVariantPrice.amount != 0.0 ? "text-red-600" : ""}`}>{product && formatPrice(product.priceRange.minVariantPrice.amount)}</Text>
               {product && product.compareAtPriceRange && product.compareAtPriceRange.minVariantPrice.amount != 0.0 && <Text className="text-lg font-mSemiBold line-through mt-2 text-gray-400 text-left">{formatPrice(product.compareAtPriceRange.minVariantPrice.amount)}</Text>}
            </View>
            <View className="my-4">
              <GwtButton title="Add To Cart" handlePress={() => {console.log("Add To Cart Clicked")}} />    
            </View> 
         </View>
    </ScrollView>
   );
}