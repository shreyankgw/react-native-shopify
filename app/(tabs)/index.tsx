import { Text, View, ScrollView, Image, TouchableOpacity, Dimensions, TextInput, Keyboard } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { storage } from "@/lib/storage";

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
  const [bottomBanners, setBottomBanners] = useState([]);

  const onboarding = storage.getBoolean("onboarding");


  const handleSearch = () => {
    Keyboard.dismiss();
    router.push('/search')
  }

  useEffect(() => {
    const getHomepageSections = async () => {
      try {
        const homepageSectionsVal = await homepageSections();
        setSections(homepageSectionsVal);
        setAnnounement(homepageSectionsVal.find((section: any) => section.key === "announcement_text")?.value);
        setBestSellers(homepageSectionsVal.find((section: any) => section.key === "best_seller_collection")?.reference.products.edges.map((edge: any) => edge.node));
        setShopbyvoltage(homepageSectionsVal.find((section: any) => section.key === "shop_by_voltage_collections")?.references.edges.map((edge: any) => edge.node));
        setShopbyCategory(homepageSectionsVal.find((section: any) => section.key === "shop_by_category_collections")?.references.edges.map((edge: any) => edge.node));
        setBottomBanners(homepageSectionsVal.find((section: any) => section.key === "banner_collections")?.references.edges.map((edge: any) => edge.node));
      } catch (error) {
        console.error(error);
      }
    }
    getHomepageSections();
  }, []);

  return (
    <View className="bg-white h-full">
      <ScrollView>     

        {sections.map((section: any) => {
          if (section.key === "show_announcement" && section.value === "true") {
            return (
              <FadeIn duration={300} delay={100} key={section.key}>
                <View className="p-4 bg-gray-200">
                  <Text className="text-sm font-mBold">{announcement}</Text>
                </View>
              </FadeIn>
            )
          }
        })}

        {/* Implement the search input bar that will go to the search page on click */}
        <View className="bg-brandText">
          <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-300 px-4 m-4 py-2">
            <Ionicons name="search-outline" size={20} color="#6b7280" className="mr-2" />
            <TextInput
              className="flex-1 text-base text-gray-700"
              placeholder="Search products..."
              placeholderTextColor="#9ca3af"
              accessibilityLabel="Search"
              onFocus={() => router.push('/search')}
            />
            <TouchableOpacity onPress={handleSearch} className="pl-2">
              <Ionicons name="arrow-forward-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-row items-center justify-center p-4 gap-2 bg-brandText">
          <FeaturedTab title="Shop Deals" handlePress={() => router.push("/collections/deals")} iconName="pricetags" size={14} />
          <FeaturedTab title="Shop Best Sellers" handlePress={() => router.push("/collections/best-sellers")} iconName="flame-sharp" size={14} />
        </View>



        <HeroSlider />

        {sections.map((section: any, index: number) => {
          if (section.key === "shop_by_category_tiles" && section.value === "true") {
            return (
              <FadeIn duration={1000} delay={800} key={`section-${index}`}>
                  <View className="px-4">
                    <View className="flex flex-row items-center justify-between flex-1 mb-4">
                      <Text className="text-xl font-mBold text-left">Shop by Category</Text>
                    </View>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ justifyContent: "space-between", gap: 8 }}>
                      {shopbyCategory.map((collection: any, index: number) => (
                        <View key={`collection-${index}`} className="flex-shrink-0" style={{ width: width / 3 - 20 }}>
                          {collection && <TouchableOpacity className="flex flex-col items-center justify-center gap-3" onPress={() => router.push(`/collections/${collection.handle}`)} accessible={true} accessibilityLabel={collection.title}>
                            <View className="relative items-center justify-center">
                              {collection.categoryImage && <View className="bg-gray-100 rounded-full absolute" style={{ zIndex: -1, width: "90%", aspectRatio: 1 }}></View>}
                              {collection.categoryImage && <Image source={{ uri: collection.categoryImage.reference.image.url }} className="w-full aspect-square" resizeMode="contain" />}
                            </View>
                            <Text className="text-sm font-mBold text-center">{collection.title}</Text>
                          </TouchableOpacity>}
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </FadeIn>
            )
          }
        })}

        {sections.map((section: any, index: number) => {
          if (section.key === "shop_by_voltage_tiles" && section.value === "true") {
            return (
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
          }
        })}

        {sections.map((section: any, index: number) => {
          if (section.key === "best_sellers_product_carousel" && section.value === "true") {
            return (
              <FadeIn duration={600} delay={400} key={`section-${index}`}>
                  <View className="px-4">
                    <View className="flex flex-row items-center justify-between flex-1 mb-4">
                      <Text className="text-lg font-mBold text-left">Best Sellers</Text>
                      <TouchableOpacity onPress={() => router.push("/collections/featured-products")}><Text className="text-sm font-mBold underline text-gray-500">View All</Text></TouchableOpacity>
                    </View>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ justifyContent: "space-between", gap: 8 }}>
                      {bestSellers.map((product: any, index: number) => (
                        <View key={`product-${index}`} className="flex-shrink-0" style={{ width: width / 2 - 40 }}>
                          {product && <ProductCard product={product} />}
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </FadeIn>
            )
          }
        })}

        {sections.map((section: any, index: number) => {
          if (section.key === "banners_at_bottom" && section.value === "true") {
            return ( 
            <FadeIn duration={1200} delay={1000} key={`section-${index}`}>
              <View className="p-4">
                <View className="flex flex-row items-center justify-between flex-1 mb-4">
                  <Text className="text-xl font-mBold text-left">Explore More</Text>
                </View>
                {bottomBanners && bottomBanners.map((banner: any, index: number) => (

                  <TouchableOpacity onPress={() => router.push(`/collections/${banner.handle}`)} key={`banner-${index}`} className="mb-4" accessible={true} accessibilityLabel={banner.title} accessibilityRole="image">
                    {banner && <Image source={{ uri: banner.banner.reference.image.url }} className="w-full aspect-square" resizeMode="contain" />}
                  </TouchableOpacity>
                ))}
              </View>
            </FadeIn>
            )
          }
        })}

      </ScrollView>
    </View>
  );
}
