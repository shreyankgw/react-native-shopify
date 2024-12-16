import { Text, View, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import MainMenu from '@/components/MainMenu';

import { homepageSections } from "@/lib/shopifyQueries";
import FadeIn from "@/components/FadeInAnimation";
import HeroSlider from "@/components/HeroSlider";
import FeaturedTab from "@/components/FeaturedTab";
import ProductCard from "@/components/ProductCard";

const { width } = Dimensions.get('window');

export default function Index() {
    const [sections, setSections] = useState([]);
    const [announcement, setAnnounement] = useState("");
    const [bestSellers, setBestSellers] = useState([]);
    const [shopbyvoltage, setShopbyvoltage] = useState([]);
    const [shopbyCategory, setShopbyCategory] = useState([]);
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
        const getHomepageSections = async () => {
           try{
            const homepageSectionsVal = await homepageSections();
            console.log(homepageSectionsVal);
            setSections(homepageSectionsVal);
            setAnnounement(homepageSectionsVal.find((section: any) => section.key === "announcement_text")?.value);
            setBestSellers(homepageSectionsVal.find((section: any) => section.key === "best_seller_collection")?.reference.products.edges.map((edge: any) => edge.node));
            setShopbyvoltage(homepageSectionsVal.find((section: any) => section.key === "shop_by_voltage_collections")?.references.edges.map((edge: any) => edge.node));
            setShopbyCategory(homepageSectionsVal.find((section: any) => section.key === "shop_by_category_collections")?.references.edges.map((edge: any) => edge.node));
           }catch(error){
             console.error(error);
           }
        }
        getHomepageSections();
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

       {sections.map((section: any) => {
             if (section.key === "show_announcement" && section.value === "true") {
                return(
                  <FadeIn duration={300} delay={100} key={section.key}>
                    <View className="p-4 bg-brandText">
                      <Text className="text-sm font-mBold text-white">{announcement}</Text>
                    </View>            
                  </FadeIn>
                )
             }
           })}
           
           <View className="flex flex-row items-center justify-center p-4 gap-2 my-2">
             <FeaturedTab title="Shop Deals" handlePress={() => router.push("/collections/deals")} iconName="pricetags" size={14} />
             <FeaturedTab title="Shop Best Sellers" handlePress={() => router.push("/collections/best-sellers")} iconName="flame-sharp" size={14} />
           </View>
         
          <HeroSlider />

          {
            sections.map((section: any, index: number) => {
              if(section.key === "best_sellers_product_carousel" && section.value === "true"){
                return(
                  <FadeIn duration={600} delay={400} key={`section-${index}`}>
                    <View className="px-4">
                        <View className="flex flex-row items-center justify-between flex-1 mb-4">
                          <Text className="text-lg font-mBold text-left">Best Sellers</Text>
                          <TouchableOpacity onPress={() => router.push("/collections/featured-products")}><Text className="text-sm font-mBold underline text-gray-500">View All</Text></TouchableOpacity>
                        </View>
                      
                      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ justifyContent: "space-between" , gap: 8 }}>     
                       {bestSellers.map((product: any, index: number) => (
                        <View key={`product-${index}`} className="flex-shrink-0" style={{ width: width / 2 - 40 }}>       
                           {product && <ProductCard product={product} />}
                        </View>
                      ))}
                      </ScrollView>
                    </View>
                  </FadeIn>
              )
              }else if(section.key === "shop_by_voltage_tiles" && section.value === "true"){
                 return(
                   <FadeIn duration={800} delay={500} key={`section-${index}`}>
                     <View className="p-4">
                       <View className="flex flex-row items-center justify-between flex-1 mb-4">
                         <Text className="text-xl font-mBold text-left">Shop by Voltage</Text>
                       </View>
                       
                       <View className="flex-row flex-wrap">
                       {shopbyvoltage.map((tile: any, index: number) => (
                        <View key={`tile-${index}`} className="flex flex-row items-center justify-center" style={{ width: width / 2 - 20 }}>
                          <View className="flex-1 h-full items-stretch">
                           {tile && <TouchableOpacity onPress={() => router.push(`/collections/${tile.handle}`)}><Image source={{ uri: tile.categoryImage.reference.image.url }} className="w-full aspect-square" resizeMode="contain" /></TouchableOpacity>}
                          </View>
                        </View>
                      ))}
                       </View>
                       
                     </View>
                   </FadeIn>
                 )
              }else if(section.key === "shop_by_category_tiles" && section.value === "true"){
                  return(
                    <FadeIn duration={1000} delay={800} key={`section-${index}`}>
                      <View className="px-4">
                        <View className="flex flex-row items-center justify-between flex-1 mb-4">
                          <Text className="text-xl font-mBold text-left">Shop by Category</Text>
                        </View>

                      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ justifyContent: "space-between" , gap: 8 }}>     
                       {shopbyCategory.map((collection: any, index: number) => (
                        <View key={`collection-${index}`} className="flex-shrink-0" style={{ width: width / 3 - 20 }}>       
                           {collection && <TouchableOpacity className="flex flex-col items-center justify-center gap-3">
                               {collection.categoryImage && <Image source={{ uri: collection.categoryImage.reference.image.url }} className="w-full aspect-square bg-gray-50 rounded-full" resizeMode="cover" />}
                               <Text className="text-sm font-mBold text-center">{collection.title}</Text>
                            </TouchableOpacity>}
                        </View>
                      ))}
                      </ScrollView>
                      </View>
                    </FadeIn>
                  )
              }
            })
          }
  
      </ScrollView>
    </View>
  );
}
