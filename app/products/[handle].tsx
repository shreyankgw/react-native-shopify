import React, { useState, useEffect, useRef } from "react";
import { View, Text, Dimensions, Image, Button, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { configureReanimatedLogger } from "react-native-reanimated";
import { fetchProduct } from "@/lib/shopifyQueries";
import formatPrice from "@/utilities/formatPrice";
import { calculatePercentageOff } from "@/utilities/percentOff";
import GwtButton from "@/components/GwtButton";
import FractionalStarRating from "@/components/FractionalStarRating";
import JudgeMeReviewWidget from "@/components/JudgemeReviewComponent";

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
    specifications?: {value: string};
    features?: {references: {nodes: {field: {value: string}}[]}};
    warranty?: { reference: { field: { reference: { image: { url: string } } } } };
    faq?: { references: { nodes: { fields: { key: string; value: string }[] }[] } };
    whatsIncluded?: {value: string};
    rating?: {
      value: string; // JSON string with the rating value
    };
    rating_count?: {
      value: string; // e.g. "13"
    };
}


const width = Dimensions.get("window").width;


export default function Product(){
    const [product, setProduct] = useState<Product | null>(null);
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const { handle } = useLocalSearchParams();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const getProduct = async () => {
            try{
                const productVal = await fetchProduct(handle);
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

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  }

  const parseWhatsIncluded = () => {
    try{
        return product?.whatsIncluded?.value ? JSON.parse(product.whatsIncluded.value) : [];
    }catch{
        console.error("Failed to parse the whats included field");
        return [];
    }
  }

  const parseFeatures = () => {
    try {
      if (!product?.features?.references?.nodes || !Array.isArray(product.features.references.nodes)) {
        console.warn("Features data missing or invalid.");
        return [];
      }
  
      return product.features.references.nodes.map((node: any, index: number) => {
        try {
          // Extract and parse `field.value` if present
          const fieldValue = node?.field?.value;
  
          if (!fieldValue || typeof fieldValue !== "string") {
            console.warn(`Missing or invalid field.value at index ${index}`, node);
            return `Feature ${index + 1} (Invalid Format)`;
          }
  
          // Parse the JSON structure in `field.value`
          const parsedNode = JSON.parse(fieldValue);
  
          // Extract the text from the parsed JSON structure
          const textValue = parsedNode?.children?.find(
            (child: any) => child.type === "paragraph"
          )?.children?.find((child: any) => child.type === "text")?.value;
  
          if (textValue) {
            return textValue;
          } else {
            console.warn(`Missing feature text at index ${index}`, parsedNode);
            return `Feature ${index + 1} (Missing Text)`;
          }
        } catch (error) {
          console.error(`Error parsing feature at index ${index}:`, error);
          return `Feature ${index + 1} (Parsing Error)`;
        }
      });
    } catch (error) {
      console.error("Failed to parse features:", error);
      return [];
    }
  };

  // rating stars logic

  // --- Parse rating values ---
  let ratingValue = 0;
  let ratingCount = 0;
  try {
    if (product?.rating?.value) {
      const parsed = JSON.parse(product.rating.value);
      ratingValue = parseFloat(parsed.value) || 0;
    }
    if (product?.rating_count?.value) {
      ratingCount = parseInt(product.rating_count.value) || 0;
    }
  } catch (e) {
    ratingValue = 0;
    ratingCount = 0;
  }

  const gid = product && product.id;
  const rawProductId = gid && gid.split('/').pop(); 

   return(
    <SafeAreaView className="bg-white flex-1">
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
                renderItem={({ item }) => <View className="px-4"><Image source={{ uri: item }} className="w-full h-full rounded-lg mb-2" resizeMode="contain" /></View>}
            />
            {product && product.images.edges.length > 1 && renderDots()}
         </View>
         <View className="p-4">
            {product && product.variants && <Text className="text-sm font-mLight text-left">SKU:{" "}{product.variants.edges.map((edge: any) => edge.node.sku)}</Text>}
            <Text className="text-2xl font-mBold mt-2">{product && product.title}</Text>
            <View className="flex flex-row items-center mb-2 mt-2">
                <FractionalStarRating
                    rating={ratingValue}
                    ratingCount={ratingCount}
                    size={20}
                />
                <TouchableOpacity onPress={() => console.log('Open write a review modal')}><Text className="font-mRegular text-sm underline inline-flex">{" "}Write a review</Text></TouchableOpacity>
            </View>
            <View className="flex flex-row items-baseline gap-2 mt-2">
              <Text className={`text-2xl font-mSemiBold mt-2 text-left ${product && product.compareAtPriceRange && product.compareAtPriceRange.minVariantPrice.amount != 0.0 ? "text-red-600" : ""}`}>{product && formatPrice(product.priceRange.minVariantPrice.amount)}</Text>
               {product && product.compareAtPriceRange && product.compareAtPriceRange.minVariantPrice.amount != 0.0 && <Text className="text-lg font-mSemiBold line-through mt-2 text-gray-400 text-left">{formatPrice(product.compareAtPriceRange.minVariantPrice.amount)}</Text>}
            </View>
            <View className="my-4">
               {[
                 {title: "Product Description", content: product &&  product.description && <Text className="text-base font-mRegular mt-2">{product.description}</Text>},
                 {title: "Product Features", content: product && product.features && ( <View className="flex flex-col">{parseFeatures().map((feature: string, index: number) => (
                    <Text key={`feature-item-${index}`} className="text-base font-mRegular mt-2">
                     <Text className="text-darkPrimary">✓</Text> {feature}
                    </Text>
                  ))}</View>)},
                 {title: "Warranty Information", content: product?.warranty?.reference.field.reference.image.url && (
                    <Image source={{ uri: product.warranty.reference.field.reference.image.url }} className="w-40 h-40" resizeMode="contain" />
                  )},
                  {title: "Product Specifications", content: product?.specifications?.value},
                  {title: "Whats Included", content: parseWhatsIncluded().map((item: string, index: number) => (
                    <View key={index} className="w-full text-darkPrimary">
                      <Text key={index} className="text-base font-mRegular mt-2"><Text className="text-darkPrimary">✓</Text> {item}</Text>
                    </View>
                  ))},
               ].map(section => section.content && (
                 <TouchableOpacity key={section.title} onPress={() => toggleAccordion(section.title)} className="my-4 px-2">
                    <View className="flex flex-row items-center justify-between py-2 border-b border-gray-200 w-full">
                     <Text className="text-lg font-mSemiBold">{section.title}</Text>
                     <Ionicons name={activeAccordion === section.title ? "remove-outline" : "add-outline"} size={24} color="black" className="flex" />
                    </View>               
                  {activeAccordion === section.title && (
                    <Text className="text-base font-mLight mt-2 px-4">{section.content}</Text>
                  )}
                 </TouchableOpacity>
               ))}
            </View>
         </View>

        
          {product && (
            <JudgeMeReviewWidget
                productHandle={handle}
                publicToken="1ZUNI9zdWisvMlQ-FTzTUZ6qEGQ"
                shopDomain="greenworks-tools-dev.myshopify.com"
            />
          )}      
         

    </ScrollView>
            <View className="p-4 border-t border-gray-200 flex flex-row items-center justify-between">
              <GwtButton title="Add To Cart" handlePress={() => {console.log("Add To Cart Clicked")}}  containerStyles="flex-1" />  
             <TouchableOpacity onPress={() => {console.log("Buy Now Clicked")}} activeOpacity={0.7} className="bg-brandLight rounded-xl flex justify-center items-center min-h-[44px] flex-1 ml-4"><Text className="font-mBold text-lg">Buy Now</Text></TouchableOpacity>
            </View> 
    </SafeAreaView>
   );
}