import { Text, View, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

import { sampleProductQuery } from "@/lib/shopifyQueries";
import FadeIn from "@/components/FadeInAnimation";
import MainMenu from "@/components/MainMenu";

interface Product{
  id: string;
  title: string;
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
               const data = await sampleProductQuery();
               setProducts(data.model.products);
          }catch(error){
            console.error(error);
          }
      };
      fetchProducts();
  }, []);

  return (
    <SafeAreaView className="bg-white h-full">
       <View
          className="flex items-center justify-between flex-row flex-wrap w-full px-4 border-b-2 border-gray-200"
        >
          <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu-sharp" size={28} color="#82bc00" />
          </TouchableOpacity>         
          <Image source={require("@/assets/images/gw_green.png")} resizeMode="contain" className="w-[180px] h-[70px] flex-1 border-l-2 border-r-2" />
          <TouchableOpacity>
          <Ionicons name="chatbox-outline" size={28} color="#82bc00" />
          </TouchableOpacity> 
        </View>
       <Animated.ScrollView
           className="absolute top-0 right-0 bottom-0 bg-white shadow-lg" style={[animatedStyle, {width}]}
       >
        <TouchableOpacity
          className="p-3 self-end m-3"
          onPress={closeDrawer}
        >
          <Ionicons name="close-circle-sharp" size={40} color="#046a38" />
        </TouchableOpacity>
        <ScrollView className="flex-1 p-4">
           <Text className="text-xl font-mBold mb-4">Menu</Text>
           <MainMenu />
        </ScrollView>
       </Animated.ScrollView>

      <ScrollView>
          <FadeIn duration={500} delay={300}>
          {products && products.map((product) => (
          <View key={product.id}>
            <Text>{product.title}</Text>
          </View>          
          ))}
          </FadeIn>
      </ScrollView>
    </SafeAreaView>
  );
}
