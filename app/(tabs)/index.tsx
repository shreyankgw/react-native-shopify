import { Text, View, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import MainMenu from '@/components/MainMenu';

import { storefrontQuery } from "@/lib/shopifyQueries";
import FadeIn from "@/components/FadeInAnimation";
import HeroSlider from "@/components/HeroSlider";
import FeaturedTab from "@/components/FeaturedTab";

interface Product{
  id: string;
  title: string;
  images: {edges: {node: {url: string}}[]};
}

const { width } = Dimensions.get('window');

export default function Index() {
    const [products, setProducts] = useState<Product[]>([]);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const translateX = useSharedValue(-width);

    const openDrawer = () => {
      translateX.value = withTiming(0, { duration: 500 });
      setDrawerOpen(true);
    }

    const closeDrawer = () => {
      translateX.value = withTiming(-width, { duration: 500});
      setDrawerOpen(false);
    }

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: translateX.value}],
        zIndex: 10
      }
    });

    useEffect(() => {
      const fetchProducts = async () => {
          try{
          const products = await storefrontQuery();
          setProducts(products);
          }catch(error){
            console.error(error);
          }
      };
      fetchProducts();
  }, []);

  return (
    <View className="bg-white h-full">
      <ScrollView>
      <View
          className="flex items-center justify-between flex-row flex-wrap w-full px-4 border-b-2 border-gray-200 bg-darkPrimary"
        >
          <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu-sharp" size={28} color="#ffffff" />
          </TouchableOpacity>         
          <Image source={require("@/assets/images/gw_logo.png")} resizeMode="contain" className="w-[180px] h-[70px]" />
          <TouchableOpacity onPress={() => router.push("/search")}>
          <Ionicons name="search-outline" size={28} color="#ffffff" />
          </TouchableOpacity> 
        </View>
       <Animated.ScrollView
           className="absolute top-0 right-0 bottom-0 bg-darkPrimary shadow-lg" style={[animatedStyle, {width}]}
       >
        <View className="flex flex-row items-center justify-between m-3 p-3">
        <Image source={require("@/assets/images/gw_logo.png")} resizeMode="contain" className="w-[180px] h-[40px]" />
        <TouchableOpacity
          className=""
          onPress={closeDrawer}
        >
          <Ionicons name="close-circle-sharp" size={32} color="#ffffff" />
        </TouchableOpacity>
        </View>
        
        <ScrollView className="flex-1 p-4">
           <MainMenu />
        </ScrollView>
       </Animated.ScrollView>
           
           <View className="flex flex-row items-center justify-center p-4 gap-2 my-2">
             <FeaturedTab title="Shop Deals" handlePress={() => router.push("/collections/deals")} iconName="pricetags" size={14} />
             <FeaturedTab title="Shop Best Sellers" handlePress={() => router.push("/collections/best-sellers")} iconName="flame-sharp" size={14} />
           </View>
         
          <HeroSlider />
          <FadeIn duration={500} delay={500}>
          {products && products.map((product) => (
          <View key={product.id}>
            <Text>{product.title}</Text>
            <Image source={{ uri: product.images.edges[0].node.url }} className="w-full h-[200px]" resizeMode="contain" />
          </View>          
          ))}
          </FadeIn>
      </ScrollView>
    </View>
  );
}
